// src/components/LectureForm.tsx
import { useState, type FormEvent } from "react";
import type { LectureRequestDTO, LectureResponseDTO } from "../types/Lecture";

interface Props {
  initial?: LectureResponseDTO;
  courseId: number;
  onSubmit: (data: LectureRequestDTO) => Promise<any>;
  onCancel: () => void;
}

export default function LectureForm({ initial, courseId, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<LectureRequestDTO>(
    initial
      ? {
          lectureTitle: initial.lectureTitle,
          description: initial.description,
          scheduledDate: initial.scheduledDate.slice(0, 10),
          weekNumber: initial.weekNumber,
          onlineLectureLink: initial.onlineLectureLink,
          courseId: initial.courseId,
        }
      : {
          lectureTitle: "",
          description: "",
          scheduledDate: new Date().toISOString().slice(0, 10),
          weekNumber: 1,
          onlineLectureLink: "",
          courseId,
        }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "weekNumber" ? +value : value,
    }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="lecture-form">
      <input
        name="lectureTitle"
        value={form.lectureTitle}
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
        Date:
        <input
          name="scheduledDate"
          type="date"
          value={form.scheduledDate}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Week #:
        <input
          name="weekNumber"
          type="number"
          min={1}
          value={form.weekNumber}
          onChange={handleChange}
          required
        />
      </label>
      <input
        name="onlineLectureLink"
        value={form.onlineLectureLink}
        onChange={handleChange}
        placeholder="Online link (optional)"
      />
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
