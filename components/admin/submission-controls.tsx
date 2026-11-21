"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUSES, STATUS_LABELS, type Status, type SubmissionTable } from "@/lib/admin-shared";
import { buttonClass, inputClass, statusStyles } from "@/components/admin/ui";
import { deleteSubmission, saveSubmissionNotes, setSubmissionStatus } from "@/app/admin/actions";

/** Status dropdown, private notes and delete for one enrollment or enquiry */
export default function SubmissionControls({
  table,
  id,
  status,
  notes,
}: {
  table: SubmissionTable;
  id: string;
  status: Status;
  notes: string | null;
}) {
  const [current, setCurrent] = useState(status);
  const [note, setNote] = useState(notes ?? "");
  const [savedNote, setSavedNote] = useState(notes ?? "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const changeStatus = (next: Status) => {
    setCurrent(next);
    setError("");
    startTransition(async () => {
      const result = await setSubmissionStatus(table, id, next);
      if (!result.ok) {
        setCurrent(status);
        setError(result.error);
      }
    });
  };

  const saveNote = () => {
    if (note.trim() === savedNote.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await saveSubmissionNotes(table, id, note);
      if (result.ok) setSavedNote(note);
      else setError(result.error);
    });
  };

  const remove = () => {
    if (!window.confirm("Delete this entry? This can’t be undone.")) return;
    startTransition(async () => {
      const result = await deleteSubmission(table, id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <div className="mt-4 border-t border-charcoal-100 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Status"
          value={current}
          disabled={pending}
          onChange={(e) => changeStatus(e.target.value as Status)}
          className={cn("cursor-pointer rounded-full border-0 py-1.5 pl-3 pr-8 text-sm font-semibold", statusStyles[current])}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        {pending && <Loader2 className="h-4 w-4 animate-spin text-charcoal-400" />}
        <button type="button" onClick={remove} disabled={pending} className={cn(buttonClass.danger, "ml-auto h-9")}>
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={saveNote}
        rows={2}
        maxLength={2000}
        placeholder="Private notes — only admins see these (saved when you click outside the box)"
        className={cn(inputClass, "mt-3 resize-y")}
      />
      {note.trim() !== savedNote.trim() && !pending && <p className="mt-1 text-xs text-amber-700">Not saved yet</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
