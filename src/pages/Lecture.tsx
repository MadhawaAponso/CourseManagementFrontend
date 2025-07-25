// src/pages/LecturePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/axios";
import { useAuth } from "../hooks/useAuth";
import AssignmentForm from "../components/AssignmentForm";
import type { LectureResponseDTO } from "../types/Lecture";
import type { AssignmentResponseDTO } from "../types/Assignments";
import "./style/LecturePage.css";

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const { isInstructor } = useAuth();

  const [lecture, setLecture] = useState<LectureResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assignment form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AssignmentResponseDTO | null>(null);

  useEffect(() => {
    if (!lectureId) return;
    api
      .get<LectureResponseDTO>(`/lectures/${lectureId}`)
      .then(res => setLecture(res.data))
      .catch(err => {
        console.error(err);
        setError("Could not load lecture details.");
      })
      .finally(() => setLoading(false));
  }, [lectureId]);

  const refresh = () => {
    if (!lectureId) return;
    api.get<LectureResponseDTO>(`/lectures/${lectureId}`)
      .then(res => setLecture(res.data))
      .catch(console.error);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/assignments/${id}`);
    refresh();
  };

  if (loading) return <div className="lecture-loading">Loading...</div>;
  if (error) return <div className="lecture-error">{error}</div>;
  if (!lecture) return <div className="lecture-error">Lecture not found.</div>;

  return (
    <div className="lecture-page">
      {/* Header */}
      <div className="lecture-header-card">
        <h2>{lecture.lectureTitle}</h2>
        <p><strong>Course:</strong> {lecture.courseCode} – {lecture.courseName}</p>
        <p>
          <strong>Week:</strong> {lecture.weekNumber} |{" "}
          <strong>When:</strong> {new Date(lecture.scheduledDate).toLocaleString()}
        </p>
        {lecture.onlineLectureLink && (
          <p>
            <a href={lecture.onlineLectureLink} target="_blank" rel="noreferrer">
              Join Online Lecture
            </a>
          </p>
        )}
        <p>{lecture.description}</p>
      </div>

      {/* Assignments */}
      <section className="assignments-section">
        <h3>Assignments</h3>

        {isInstructor && !showForm && (
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            + Add Assignment
          </button>
        )}

        {showForm && (
          <AssignmentForm
            initial={editing ?? undefined}
            lectureId={Number(lectureId)}
            onCancel={() => setShowForm(false)}
            onSubmit={async data => {
              if (editing) {
                await api.put(`/assignments/${editing.id}`, data);
              } else {
                await api.post(`/assignments`, data);
              }
              setShowForm(false);
              setEditing(null);
              refresh();
            }}
          />
        )}

        {lecture.assignments?.length ? (
          <ul className="assignment-list">
            {lecture.assignments
              .slice()
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((assn: AssignmentResponseDTO) => (
                <li key={assn.id} className="assignment-item">
                  <Link to={`/lectures/${lectureId}/assignments/${assn.id}`}>
                    <h4>{assn.assignmentTitle}</h4>
                    <p>Due: {new Date(assn.dueDate).toLocaleString()}</p>
                  </Link>

                  {isInstructor && (
                    <div className="instructor-controls">
                      <button onClick={() => {
                        setEditing(assn);
                        setShowForm(true);
                      }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(assn.id)}>
                        Delete
                      </button>
                    </div>
                  )}
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
