// src/pages/LecturePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/axios";
import "./style/LecturePage.css";
import type { LectureResponseDTO } from "../types/Lecture";
import type { CourseNoteResponseDTO } from "../types/CourseNote";
import type { AssignmentResponseDTO } from "../types/Assignments";

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState<LectureResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lectureId) return;
    api
      .get<LectureResponseDTO>(`/lectures/${lectureId}`)
      .then(res => setLecture(res.data))
      .catch(err => {
        console.error("Failed to load lecture:", err);
        setError("Could not load lecture details.");
      })
      .finally(() => setLoading(false));
  }, [lectureId]);

  if (loading) return <div className="lecture-loading">Loading...</div>;
  if (error) return <div className="lecture-error">{error}</div>;
  if (!lecture) return <div className="lecture-error">Lecture not found.</div>;

  return (
    <div className="lecture-page">
      {/* Lecture Header */}
      <div className="lecture-header-card">
        <h2>{lecture.lectureTitle}</h2>
        <p>
          <strong>Course:</strong> {lecture.courseCode} – {lecture.courseName}
        </p>
        <p>
          <strong>Week:</strong> {lecture.weekNumber} |{" "}
          <strong>When:</strong>{" "}
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

      {/* Notes Section */}
      <section className="notes-section">
        <h3>Lecture Notes</h3>
        {lecture.notes && lecture.notes.length > 0 ? (
          <ul>
            {lecture.notes
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.uploadedAt).getTime() -
                  new Date(b.uploadedAt).getTime()
              )
              .map((note: CourseNoteResponseDTO) => (
                <li key={note.id} className="note-item">
                  <a
                    href={note.filePath}
                    target="_blank"
                    rel="noreferrer"
                    download
                  >
                    {note.noteTitle} ({note.fileType.toUpperCase()})
                  </a>
                  <p>
                    Uploaded by {note.uploadedBy} on{" "}
                    {new Date(note.uploadedAt).toLocaleString()}
                  </p>
                </li>
              ))}
          </ul>
        ) : (
          <p className="empty-state">No notes uploaded.</p>
        )}
      </section>

      {/* Assignments Section */}
      <section className="assignments-section">
        <h3>Assignments</h3>
        {lecture.assignments && lecture.assignments.length > 0 ? (
          <ul>
            {lecture.assignments
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.dueDate).getTime() -
                  new Date(b.dueDate).getTime()
              )
              .map((assn: AssignmentResponseDTO) => (
                <li key={assn.id} className="assignment-item">
                  <Link
                    to={`/lectures/${lectureId}/assignments/${assn.id}`}
                    className="assignment-link"
                  >
                    <h4>{assn.assignmentTitle}</h4>
                    <p>{assn.description}</p>
                    <p>
                      Due: {new Date(assn.dueDate).toLocaleString()} | Max Score:{" "}
                      {assn.maxScore}
                    </p>
                    <p>
                      Created by {assn.createdBy} on{" "}
                      {new Date(assn.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <p className="empty-state">No assignments yet.</p>
        )}
      </section>
    </div>
);
}
