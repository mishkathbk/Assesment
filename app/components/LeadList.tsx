import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import LeadRow from "./LeadRow";
import { Lead } from "@/app/types/lead";
import { SKELETON_ROW_COUNT } from "@/app/lib/constants";

type LeadListProps = {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  editingId?: number;
  onRetry: () => void;
  onClearSearch: () => void;
  onEdit: (lead: Lead) => void;
  onSaveTitle: (lead: Lead, job: string) => Promise<boolean>;
  onDelete: (lead: Lead) => void;
};

function SkeletonRow() {
  return (
    <li className="flex items-center gap-3 px-5 py-4">
      <span className="h-10 w-10 animate-pulse rounded-full bg-line" />
      <div className="flex-1 space-y-2">
        <span className="block h-3 w-1/3 animate-pulse rounded bg-line" />
        <span className="block h-3 w-1/2 animate-pulse rounded bg-line/70" />
      </div>
    </li>
  );
}

function Message({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="px-5 py-16 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{text}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function LeadList({
  leads,
  loading,
  error,
  searchTerm,
  editingId,
  onRetry,
  onClearSearch,
  onEdit,
  onSaveTitle,
  onDelete,
}: LeadListProps) {
  if (loading) {
    return (
      <ul className="divide-y divide-line" aria-busy="true">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <Message title="Couldn't load leads" text={error}>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </Message>
    );
  }

  if (leads.length === 0) {
    return searchTerm ? (
      <Message title={`No leads match "${searchTerm}"`} text="Try a different name, email or job title.">
        <Button variant="secondary" size="sm" onClick={onClearSearch}>
          Clear search
        </Button>
      </Message>
    ) : (
      <Message
        title="No leads yet"
        text={`Use "Add lead" to create your first lead, or refresh to load the list again.`}
      />
    );
  }

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      className="divide-y divide-line"
    >
      <AnimatePresence>
        {leads.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            isEditing={lead.id === editingId}
            onEdit={onEdit}
            onSaveTitle={onSaveTitle}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
