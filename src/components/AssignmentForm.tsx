import React, { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import type { AssignmentRequestDTO, AssignmentResponseDTO } from "../types/Assignments";
import "./style/AssignmentForm.css";

interface Props {
  /** If editing, the existing assignment */
  initial?: AssignmentResponseDTO;
  /** The lecture this assignment belongs to */
  lectureId: number;
  /** Called with the full payload (including createdBy) */
  onSubmit: (data: AssignmentRequestDTO) => Promise<any>;
  onCancel: () => void;
}

export default function AssignmentForm({ initial, lectureId, onSubmit, onCancel }: Props) {
  const { userId } = useAuth();

  const [form, setForm] = useState<AssignmentRequestDTO>(
    initial
      ? {
          assignmentTitle: initial.assignmentTitle,
          description: initial.description,
          dueDate: initial.dueDate,
          maxScore: initial.maxScore,
          lectureId: initial.lectureId,
          createdBy: initial.createdBy,
        }
      : {
          assignmentTitle: "",
          description: "",
          dueDate: new Date().toISOString(),
          maxScore: 100,
          lectureId,
          createdBy: userId!,
        }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "maxScore" ? +value : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // ensure createdBy is set from the current user
    const payload: AssignmentRequestDTO = {
      ...form,
      dueDate:` ${form.dueDate}T23:59:00Z`,
      createdBy: form.createdBy || userId!,
    };
    await onSubmit(payload);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="assignment-form">
      <input
        name="assignmentTitle"
        value={form.assignmentTitle}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <label>
        Due Date:
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Max Score:
        <input
          type="number"
          name="maxScore"
          min={0}
          value={form.maxScore}
          onChange={handleChange}
          required
        />
      </label>
      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
