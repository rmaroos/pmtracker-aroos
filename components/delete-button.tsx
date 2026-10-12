"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  title: string;
  itemType: "task" | "project";
  action: (formData: FormData) => Promise<void>;
  redirectTo?: string;
  extraInfo?: string;
  variant?: "icon" | "button" | "danger-button" | "danger-outline" | "project-link";
  className?: string;
}

export function DeleteButton({
  id,
  title,
  itemType,
  action,
  redirectTo,
  extraInfo,
  variant = "icon",
  className = "",
}: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting]);

  const trigger = (() => {
    switch (variant) {
      case "icon":
        return (
          <button
            type="button"
            className={`icon-button danger ${className}`}
            aria-label={`Delete ${itemType}`}
            title={`Delete ${itemType}`}
            onClick={() => setIsOpen(true)}
          >
            <Trash2 size={14} />
          </button>
        );
      case "project-link":
        return (
          <button
            type="button"
            className={`project-delete-btn ${className}`}
            aria-label={`Delete ${title}`}
            onClick={() => setIsOpen(true)}
          >
            <Trash2 size={13} /> Delete
          </button>
        );
      case "danger-outline":
        return (
          <button
            type="button"
            className={`button danger small ${className}`}
            onClick={() => setIsOpen(true)}
          >
            <Trash2 size={14} /> Delete {itemType}
          </button>
        );
      case "danger-button":
        return (
          <button
            type="button"
            className={`button danger-solid ${className}`}
            onClick={() => setIsOpen(true)}
          >
            <Trash2 size={14} /> Delete {itemType}
          </button>
        );
      case "button":
      default:
        return (
          <button
            type="button"
            className={`button danger ${className}`}
            onClick={() => setIsOpen(true)}
          >
            <Trash2 size={14} /> Delete
          </button>
        );
    }
  })();

  const modal =
    isOpen && mounted ? (
      <div
        className="modal-backdrop"
        onClick={() => {
          if (!isSubmitting) setIsOpen(false);
        }}
      >
        <div
          className="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-dialog-title-${id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-icon">
              <AlertTriangle size={20} />
            </div>
            <div className="modal-title-group">
              <h3 id={`delete-dialog-title-${id}`} className="modal-title">
                Delete {itemType === "task" ? "Task" : "Project"}?
              </h3>
              <p className="modal-subtitle">
                This will remove the {itemType} from your active workspace.
              </p>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              aria-label="Close dialog"
              disabled={isSubmitting}
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="modal-body">
            <p>
              Are you sure you want to delete <strong>&ldquo;{title}&rdquo;</strong>?
            </p>
            {extraInfo ? (
              <div className="modal-alert">
                <AlertTriangle size={15} />
                <span>{extraInfo}</span>
              </div>
            ) : null}
            <small className="modal-warning">This action cannot be undone.</small>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="button secondary"
              disabled={isSubmitting}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <form
              action={action}
              onSubmit={() => {
                setIsSubmitting(true);
              }}
            >
              <input type="hidden" name="id" value={id} />
              {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
              <button
                type="submit"
                className="button danger-solid"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : `Delete ${itemType}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      {trigger}
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
