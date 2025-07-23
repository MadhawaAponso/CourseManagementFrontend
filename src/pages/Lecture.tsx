// src/pages/LecturePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getLectureById,
  updateLecture,
  deleteLecture,
  createLecture,            // if you ever do a “new lecture” flow
} from "../services/lectureService";
import { useAuth } from "../hooks/useAuth";
import LectureForm from "../components/LectureForm"; // the form we built earlier
import type {
  LectureResponseDTO,
  LectureRequestDTO,
} from "../types/Lecture";
import "./style/LecturePage.css";

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const { isInstructor } = useAuth();

  const [lecture, setLecture] = useState<LectureResponseDTO | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lectureId) return;
    getLectureById(+lectureId)
      .then(setLecture)
      .catch(() => setError("Could not load lecture."));
  }, [lectureId]);

  const handleDelete = async () => {
    if (!lectureId || !lecture) return;
    if (!window.confirm("Delete this lecture?")) return;
    await deleteLecture(+lectureId);
    navigate(`/courses/${lecture.courseId}`);
  };

  const handleUpdate = async (data: LectureRequestDTO) => {
    if (!lectureId) return;
    const updated = await updateLecture(+lectureId, data);
    setLecture(updated);
    setEditing(false);
  };

  // Read‑only view while not editing:
  if (error) return <div className="lecture-error">{error}</div>;
  if (!lecture) return <div className="lecture-loading">Loading…</div>;

  return (
    <div className="lecture-page">
      {isInstructor && !editing && (
        <div className="lecture-admin">
          <button onClick={() => setEditing(true)}>✏️ Edit</button>
          <button onClick={handleDelete}>🗑️ Delete</button>
        </div>
      )}

      {editing ? (
        <LectureForm
          initial={lecture}
          courseId={lecture.courseId}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="lecture-header-card">
            <h2>{lecture.lectureTitle}</h2>
            <p>
              <strong>Week:</strong> {lecture.weekNumber} &nbsp;
              <strong>Date:</strong>{" "}
              {new Date(lecture.scheduledDate).toLocaleString()}
            </p>
            {lecture.onlineLectureLink && (
              <p>
                <a
                  href={lecture.onlineLectureLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join Online Lecture
                </a>
              </p>
            )}
            <p>{lecture.description}</p>
          </div>

          {/* … your notes & assignments sections here … */}
        </>
      )}
    </div>
  );
}
