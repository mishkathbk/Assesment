"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HttpStatusCode } from "axios";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "react-toastify";
import { createLead, deleteLead, getLeads, patchLead, updateLead } from "@/app/api/Api";
import { fullName } from "@/app/lib/leads";
import { Lead, LeadFormValues } from "@/app/types/lead";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import LeadForm from "./LeadForm";
import LeadList from "./LeadList";
import Modal from "./Modal";
import Pagination from "./Pagination";

const letter = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function LeadDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const [pages, setPages] = useState<Record<number, Lead[]>>({});
  const [totalPages, setTotalPages] = useState(1);
  const [apiTotal, setApiTotal] = useState(0);
  const [addedLeads, setAddedLeads] = useState<Lead[]>([]);
  const [removedCount, setRemovedCount] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const latestRequest = useRef(0);
  const nextTempId = useRef(-1);

  const fetchPage = useCallback((pageNumber: number) => {
    const requestId = ++latestRequest.current;

    return getLeads(pageNumber)
      .then((response) => {
        if (requestId !== latestRequest.current) return true;
        setPages((prev) => ({ ...prev, [pageNumber]: response.data }));
        setTotalPages(Math.max(response.total_pages, 1));
        setApiTotal(response.total);
        setError(null);
        return true;
      })
      .catch((err: Error) => {
        if (requestId === latestRequest.current) setError(err.message);
        return false;
      });
  }, []);

  useEffect(() => {
    if (!pages[page]) fetchPage(page);
  }, [page, pages, fetchPage]);

  const leads = useMemo(() => {
    const pageLeads = pages[page] ?? [];
    return page === 1 ? [...addedLeads, ...pageLeads] : pageLeads;
  }, [pages, page, addedLeads]);

  const totalLeads = apiTotal + addedLeads.length - removedCount;
  const loading = !pages[page] && !error;
  const initialLoading = loading && Object.keys(pages).length === 0;

  const updateLocalLead = (id: number, changes: Partial<Lead>) => {
    const apply = (list: Lead[]) => list.map((lead) => (lead.id === id ? { ...lead, ...changes } : lead));
    setAddedLeads(apply);
    setPages((prev) => (prev[page] ? { ...prev, [page]: apply(prev[page]) } : prev));
  };

  const goToPage = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) return;
    if (pages[nextPage]) latestRequest.current++;
    router.push(`?page=${nextPage}`, { scroll: false });
    setSearch("");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    listRef.current?.scrollTo({ top: 0 });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const success = await fetchPage(page);
    setRefreshing(false);

    if (success) {
      setPages((prev) => ({ [page]: prev[page] }));
      setAddedLeads([]);
      setRemovedCount(0);
      toast.success("Lead list refreshed");
    } else {
      toast.error("Could not refresh leads");
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchPage(page);
  };

  const handleSubmit = async (values: LeadFormValues) => {
    try {
      if (editingLead) {
        await updateLead(editingLead.id, values);
        updateLocalLead(editingLead.id, values);
        toast.success(`${fullName(values)} was updated`);
        closeForm();
        return true;
      }

      const { data, status } = await createLead(values);
      if (status !== HttpStatusCode.Created) throw new Error("Lead could not be created");

      const newId = Number(data.id);
      const isTaken =
        addedLeads.some((lead) => lead.id === newId) ||
        Object.values(pages).some((list) => list.some((lead) => lead.id === newId));
      const newLead: Lead = { id: !newId || isTaken ? nextTempId.current-- : newId, ...values };

      setAddedLeads((prev) => [newLead, ...prev]);
      goToPage(1);
      toast.success(`${fullName(newLead)} was added to your leads`);
      closeForm();
      return true;
    } catch (err) {
      toast.error((err as Error).message);
      return false;
    }
  };

  const handleJobUpdate = async (lead: Lead, job: string) => {
    try {
      await patchLead(lead.id, { job });
      updateLocalLead(lead.id, { job });
      toast.success(`Job title updated for ${fullName(lead)}`);
      return true;
    } catch (err) {
      toast.error((err as Error).message);
      return false;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const status = await deleteLead(deleteTarget.id);
      if (status !== HttpStatusCode.NoContent) throw new Error("Lead could not be deleted");

      const { id } = deleteTarget;
      if (addedLeads.some((lead) => lead.id === id)) {
        setAddedLeads((prev) => prev.filter((lead) => lead.id !== id));
      } else {
        setPages((prev) => ({ ...prev, [page]: (prev[page] ?? []).filter((lead) => lead.id !== id) }));
        setRemovedCount((count) => count + 1);
      }
      toast.success(`${fullName(deleteTarget)} was removed`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const openAddForm = () => {
    setEditingLead(null);
    setFormOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingLead(null);
  };

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return leads;

    return leads.filter((lead) =>
      [fullName(lead), lead.email, lead.job ?? ""].some((value) => value.toLowerCase().includes(term))
    );
  }, [leads, search]);

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-4 pt-3 pb-6 sm:px-6 md:flex md:min-h-0 md:flex-1 md:flex-col">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              aria-label="Leads"
              className="text-2xl font-bold tracking-tight sm:text-[28px]"
            >
              {"Leads".split("").map((char, i) => (
                <motion.span key={i} variants={letter} aria-hidden="true" className="inline-block">
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="mt-1 text-sm text-muted tabular-nums"
            >
              {initialLoading ? (
                "Loading leads..."
              ) : (
                <>
                  {totalLeads} {totalLeads === 1 ? "lead" : "leads"}
                  {addedLeads.length > 0 && ` · ${addedLeads.length} added`}
                </>
              )}
            </motion.p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleRefresh}
              loading={refreshing}
              disabled={loading}
              className="group hover:shadow-sm motion-safe:hover:-translate-y-px"
            >
              {!refreshing && (
                <RefreshCw size={16} className="transition-transform duration-500 motion-safe:group-hover:rotate-180" />
              )}
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button onClick={openAddForm} disabled={initialLoading} className="group hover:shadow-md motion-safe:hover:-translate-y-px">
              <Plus size={16} className="transition-transform duration-300 motion-safe:group-hover:rotate-90" />
              Add lead
            </Button>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-line bg-surface md:flex md:min-h-0 md:flex-col">
          <div className="flex flex-col gap-3 border-b border-line px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between md:px-5">
            <h2 className="font-bold">
              All leads
              {search && !loading && (
                <span className="ml-2 text-sm font-medium text-muted tabular-nums">
                  {filteredLeads.length} found
                </span>
              )}
            </h2>
            <label className="relative block sm:w-64">
              <span className="sr-only">Search leads on this page</span>
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                placeholder="Search this page"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-line bg-surface pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </label>
          </div>

          <div className="hidden grid-cols-12 gap-4 border-b border-line bg-paper/60 px-5 py-2 text-xs font-semibold text-muted md:grid">
            <span className="col-span-6">Name</span>
            <span className="col-span-4">Job title</span>
          </div>

          <div ref={listRef} className="md:min-h-0 md:overflow-y-auto">
            <LeadList
              leads={filteredLeads}
              loading={loading}
              error={error}
              searchTerm={search.trim()}
              editingId={editingLead?.id}
              onRetry={handleRetry}
              onClearSearch={() => setSearch("")}
              onEdit={handleEdit}
              onSaveTitle={handleJobUpdate}
              onDelete={setDeleteTarget}
            />
          </div>

          {!error && (
            <Pagination page={page} totalPages={totalPages} disabled={loading} onChange={goToPage} />
          )}
        </section>
      </main>

      <Modal
        open={formOpen}
        title={editingLead ? "Edit lead" : "Add a lead"}
        description={
          editingLead
            ? `Changing details for ${fullName(editingLead)}`
            : "Fill in the details below to add a new lead."
        }
        onClose={closeForm}
      >
        <LeadForm
          key={editingLead?.id ?? "new"}
          lead={editingLead}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this lead?"
        message={
          deleteTarget
            ? `${fullName(deleteTarget)} will be removed from your leads. This can't be undone.`
            : ""
        }
        confirmLabel="Delete lead"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
