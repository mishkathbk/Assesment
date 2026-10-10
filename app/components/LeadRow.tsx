"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { motion } from "framer-motion";
import Avatar from "./Avatar";
import Button from "./Button";
import { Check, Pencil, SquarePen, Trash2, X } from "lucide-react";
import { Lead } from "@/app/types/lead";
import { fullName } from "@/app/lib/leads";
import { leadSchema } from "@/app/lib/validation";

type LeadRowProps = {
  lead: Lead;
  isEditing: boolean;
  onEdit: (lead: Lead) => void;
  onSaveTitle: (lead: Lead, job: string) => Promise<boolean>;
  onDelete: (lead: Lead) => void;
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function LeadRow({ lead, isEditing, onEdit, onSaveTitle, onDelete }: LeadRowProps) {
  const name = fullName(lead);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(lead.job ?? "");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const startTitleEdit = () => {
    setTitle(lead.job ?? "");
    setError(undefined);
    setEditingTitle(true);
  };

  const cancelTitleEdit = () => {
    if (saving) return;
    setEditingTitle(false);
    setError(undefined);
  };

  const handleTitleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const value = title.trim();
    const result = leadSchema.shape.job.min(1, "Job title is required").safeParse(value);
    const message = result.success ? undefined : result.error.issues[0].message;
    setError(message);
    if (message) return;

    if (value === lead.job) {
      setEditingTitle(false);
      return;
    }

    setSaving(true);
    const success = await onSaveTitle(lead, value);
    setSaving(false);
    if (success) setEditingTitle(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") cancelTitleEdit();
  };

  return (
    <motion.li
      layout
      variants={rowVariants}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
      className={`group/row flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors duration-150 md:grid md:grid-cols-12 md:gap-4 md:px-5 ${
        isEditing ? "bg-brand-soft/70" : "hover:bg-paper/70"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 md:col-span-6">
        <span className="transition-transform duration-200 motion-safe:group-hover/row:scale-105">
          <Avatar name={name} src={lead.avatar} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-[13px] text-muted">{lead.email}</p>
        </div>
      </div>

      <div className="order-last w-full min-w-0 pl-13 md:order-none md:col-span-4 md:w-auto md:pl-0">
        {editingTitle ? (
          <form onSubmit={handleTitleSubmit} noValidate className="relative">
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={title}
                disabled={saving}
                aria-label={`Job title for ${name}`}
                aria-invalid={!!error}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(undefined);
                }}
                onKeyDown={handleKeyDown}
                className={`h-8 min-w-0 flex-1 rounded-md border bg-surface px-2 text-sm outline-none focus:ring-2 ${
                  error ? "border-danger focus:ring-danger/20" : "border-brand focus:ring-brand/15"
                }`}
              />
              <Button type="submit" size="icon" loading={saving} aria-label="Save job title">
                {!saving && <Check size={16} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelTitleEdit}
                disabled={saving}
                aria-label="Cancel"
              >
                <X size={16} />
              </Button>
            </div>
            {error && (
              <p className="absolute top-full left-0 mt-0.5 w-full truncate text-xs leading-4 font-medium text-danger">
                {error}
              </p>
            )}
          </form>
        ) : (
          <button
            onClick={startTitleEdit}
            title="Change job title"
            className="group inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 -ml-2 text-left text-sm hover:bg-paper"
          >
            <span className={`truncate ${lead.job ? "" : "text-muted"}`}>
              {lead.job || "Add job title"}
            </span>
            <Pencil
              size={13}
              className="shrink-0 text-muted transition duration-200 md:opacity-40 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 motion-safe:group-hover:-rotate-12"
            />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 md:col-span-2 md:justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(lead)}
          className="group hover:border-brand/40 hover:text-brand hover:shadow-sm motion-safe:hover:-translate-y-px"
        >
          <SquarePen size={14} className="transition-transform duration-200 motion-safe:group-hover:-rotate-12" />
          Edit
        </Button>
        <Button
          variant="danger-ghost"
          size="icon"
          onClick={() => onDelete(lead)}
          aria-label={`Delete ${name}`}
          title="Delete"
          className="group"
        >
          <Trash2 size={16} className="motion-safe:group-hover:animate-wiggle" />
        </Button>
      </div>
    </motion.li>
  );
}
