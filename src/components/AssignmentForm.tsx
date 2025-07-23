import { useState,type FormEvent } from "react";
import type {
  AssignmentResponseDTO,
  AssignmentRequestDTO,
} from "../types/Assignments";

interface Props {
  initial?: AssignmentResponseDTO;
  lectureId: number;
  onSubmit: (data: AssignmentRequestDTO) => Promise<any>;
  onCancel: () => void;
}

export default function AssignmentForm({ initial, lectureId, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.assignmentTitle ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(
    initial?.dueDate.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
  );
  const [maxScore, setMaxScore] = useState(initial?.maxScore ?? 100);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: AssignmentRequestDTO = {
      lectureId,
      assignmentTitle: title,
      description,
      dueDate,
      maxScore,
      createdBy,
    };
    await onSubmit(payload);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="assignment-form">
      {/* similar inputs for title, description, date, score */}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
      <input type="number" value={maxScore} onChange={e => setMaxScore(+e.target.value)} min={0} required />
      <div className="actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">{saving ? "Saving…" : initial ? "Update" : "Create"}</button>
      </div>
    </form>
  );
}
