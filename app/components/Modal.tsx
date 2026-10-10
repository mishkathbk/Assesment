"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, title, description, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    document.addEventListener("keydown", handleKey);
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.removeEventListener("keydown", handleKey);
      body.style.overflow = "";
      body.style.paddingRight = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-4">
      <div className="animate-fade-in absolute inset-0 bg-ink/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="animate-slide-down relative w-full max-w-md rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink"
        >
          <X size={16} />
        </button>
        <h2 id="modal-title" className="pr-8 text-lg font-bold">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
