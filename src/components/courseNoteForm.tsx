import { useState, type FormEvent } from "react";
import type {
  CourseNoteResponseDTO,
  CourseNoteRequestDTO,
} from "../types/CourseNote";

interface Props {
  initial?: CourseNoteResponseDTO;
  lectureId: number;
  onSubmit: (data: CourseNoteRequestDTO) => Promise<any>;
  onCancel: () => void;
}

export default function CourseNoteForm({ initial, lectureId, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.noteTitle ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || (!initial && !file)) return;

    setSaving(true);
    const payload: CourseNoteRequestDTO = {
      lectureId,
      noteTitle: title,
      file: file!,          // assume FormData in service
    };
    await onSubmit(payload);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note Title"
        required
      />
      {!initial && (
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          required
        />
      )}
      <div className="actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">{saving ? "Saving…" : initial ? "Update" : "Upload"}</button>
      </div>
    </form>
  );
}
