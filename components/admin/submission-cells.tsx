"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Dots from "@/components/ui/dots";
import { STATUSES, STATUS_LABELS, type Status, type SubmissionTable } from "@/lib/admin-shared";
import { inputClass, statusStyles } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm";
import { deleteSubmission, saveSubmissionNotes, setSubmissionStatus } from "@/app/admin/actions";

// Small controls for one enrollment or enquiry, used in table rows and cards.
// Results show as snackbars at the bottom of the screen.

type Props = { table: SubmissionTable; id: string };

export function StatusCell({ table, id, status }: Props & { status: Status }) {
  const [current, setCurrent] = useState(status);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const change = (next: Status) => {
    setCurrent(next);
    startTransition(async () => {
      const result = await setSubmissionStatus(table, id, next);
      if (!result.ok) {
        setCurrent(status);
        toast.error(result.error);
      } else {
        toast.success(`Marked as ${STATUS_LABELS[next]}.`);
      }
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <select
        aria-label="Status"
        value={current}
        disabled={pending}
        onChange={(e) => change(e.target.value as Status)}
        className={cn(
          "cursor-pointer rounded-full border-0 py-1 pl-3 pr-7 text-xs font-semibold transition-opacity",
          statusStyles[current],
          pending && "opacity-70"
        )}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {pending && <Dots size="sm" label="Saving" className="text-charcoal-400" />}
    </div>
  );
}

export function NotesCell({ table, id, notes, rows = 1, className }: Props & { notes: string | null; rows?: number; className?: string }) {
  const [note, setNote] = useState(notes ?? "");
  const [saved, setSaved] = useState(notes ?? "");
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const unsaved = note.trim() !== saved.trim();

  const save = () => {
    if (!unsaved) return;
    startTransition(async () => {
      const result = await saveSubmissionNotes(table, id, note);
      if (!result.ok) return toast.error(result.error);
      setSaved(note);
      toast.success("Note saved.");
    });
  };

  return (
    <div className={className}>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={save}
        rows={rows}
        maxLength={2000}
        aria-label="Private notes"
        placeholder="Add a note…"
        className={cn(inputClass, "resize-y px-2.5 py-1.5 text-xs", unsaved && !pending && "border-amber-300")}
      />
      {pending && <Dots size="sm" label="Saving" className="mt-1 text-charcoal-400" />}
    </div>
  );
}

export function DeleteCell({ table, id, label }: Props & { label?: string }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const confirm = useConfirm();

  const remove = async () => {
    const ok = await confirm({ title: "Delete this entry?", message: "It will be removed for good. This can’t be undone." });
    if (!ok) return;
    startTransition(async () => {
      const result = await deleteSubmission(table, id);
      if (!result.ok) toast.error(result.error);
      else toast.success("Entry deleted.");
    });
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={pending}
      aria-label="Delete"
      title="Delete"
      className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? <Dots label="Deleting" /> : <Trash2 className="h-4 w-4" />}
      {label}
    </button>
  );
}
