import { useState, type FormEvent } from "react";
import type { LectureRequestDTO, LectureResponseDTO } from "../types/Lecture";
import "./LectureForm.css"

interface Props {
  initialData?: LectureResponseDTO;
  courseId: number;
  onSubmit: (data: LectureRequestDTO) => Promise<any>;
  onCancel: () => void;
}

export default function LectureForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<LectureRequestDTO>(() => ({
    lectureTitle: initialData?.lectureTitle ?? "",
    description: initialData?.description ?? "",
    scheduledDate:
      initialData?.scheduledDate.slice(0, 10) ??
      new Date().toISOString().slice(0, 10),
    weekNumber: initialData?.weekNumber ?? 1,
    onlineLectureLink: initialData?.onlineLectureLink ?? "",
    // courseId: initialData?.courseId ?? courseId,
  }));
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "weekNumber" ? +value : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="lecture-form">
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
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
