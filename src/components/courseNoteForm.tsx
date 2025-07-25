// src/components/CourseNoteForm.tsx
import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  uploadFileBase64,
  createNote,
  updateNote,
} from "../services/courseNoteService";
import type {
  CourseNoteResponseDTO,
  CourseNoteRequestDTO,
} from "../types/CourseNote";
import "./style/courseNoteForm.css";

interface Props {
  initial?: CourseNoteResponseDTO;
  lectureId: number;
  onDone: () => void;      // called after success
  onCancel: () => void;
}

export default function CourseNoteForm({
  initial,
  lectureId,
  onDone,
  onCancel,
}: Props) {
  const { userId } = useAuth();

  // 🚨 guard so userId is definitely a number below
  if (userId === null) {
    return <div className="error">You must be logged in to upload notes.</div>;
  }

  const [title, setTitle] = useState(initial?.noteTitle ?? "");
  const [file,  setFile]  = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || (!initial && !file)) return;

    setSaving(true);
    try {
      // 1️⃣ upload raw file
      let filePath = initial?.filePath || "";
      let fileType = initial?.fileType || "";
      if (file) {
        filePath = await uploadFileBase64(file);
        fileType = file.type.split("/")[1];
      }

      // 2️⃣ now userId is a number (never null)
      const dto: CourseNoteRequestDTO = {
        lectureId,
        noteTitle: title,
        filePath,
        fileType,
        uploadedBy: userId, 
      };

      // 3️⃣ call service
      if (initial) await updateNote(initial.id, dto);
      else           await createNote(dto);

      onDone();
    } catch (err: any) {
      console.error("Upload/Create failed:", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
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
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Update" : "Upload"}
        </button>
      </div>
    </form>
  );
}
