import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/axios";
import { useAuth } from "../hooks/useAuth";
import {
  fetchMySubmission,
  submitAssignment,
  getAllSubmissions,
  gradeSubmission,
} from "../services/submissionService";
import {
  updateAssignment,
  deleteAssignment,
} from "../services/assignmentService";
import type {
  AssignmentResponseDTO,
  AssignmentRequestDTO,
} from "../types/Assignments";
import type {
  AssignmentSubmissionResponseDTO,
} from "../types/AssignmentSubmission";
import type { GradeSubmissionRequestDTO } from "../types/GradeSubmission";
import "./style/AssignmentPage.css";

export default function AssignmentDetailPage() {
  const { lectureId, assignmentId } = useParams<{ lectureId: string; assignmentId: string }>();
  const navigate = useNavigate();
  const { roles, userId } = useAuth();
  const isInstructor = roles.includes("instructor");

  // Core data
  const [assignment, setAssignment] = useState<AssignmentResponseDTO | null>(null);
  const [mySubmission, setMySubmission] = useState<AssignmentSubmissionResponseDTO | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<AssignmentSubmissionResponseDTO[]>([]);

  // Instructor edit mode
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AssignmentRequestDTO>({
    assignmentTitle: "",
    description: "",
    dueDate: new Date().toISOString().slice(0, 10),
    maxScore: 100,
    lectureId: Number(lectureId),
    createdBy: userId!,
  });

  // Student submission text
  const [text, setText] = useState("");

  // Loading & errors
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch assignment and submissions
  useEffect(() => {
    if (!assignmentId) return;
    Promise.all([
      api.get<AssignmentResponseDTO>(`/assignments/${assignmentId}`),
      isInstructor
        ? getAllSubmissions(+assignmentId)
        : fetchMySubmission(+assignmentId),
    ])
      .then(([aRes, sRes]) => {
        setAssignment(aRes.data);
        if (isInstructor) {
          setAllSubmissions(sRes as AssignmentSubmissionResponseDTO[]);
          setForm({
            assignmentTitle: aRes.data.assignmentTitle,
            description: aRes.data.description,
            dueDate: aRes.data.dueDate.slice(0, 10),
            maxScore: aRes.data.maxScore,
            lectureId: aRes.data.lectureId,
            createdBy: userId!,
          });
        } else {
          const sub = sRes as AssignmentSubmissionResponseDTO | null;
          setMySubmission(sub);
          setText(sub?.submissionText ?? "");
        }
      })
      .catch(() => setError("Could not load assignment or submissions."))
      .finally(() => setLoading(false));
  }, [assignmentId, isInstructor, userId]);

  // Student submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentId) return;
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const dto = { assignmentId: +assignmentId, submissionText: text.trim() };
      const saved = await submitAssignment(dto);
      setMySubmission(saved);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Instructor update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentId) return;
    try {
      const updated = await updateAssignment(+assignmentId, form);
      setAssignment(updated);
      setEditing(false);
    } catch {
      setError("Update failed.");
    }
  };

  // Instructor delete
  const handleDelete = async () => {
    if (!assignmentId) return;
    if (!confirm("Delete this assignment?")) return;
    try {
      await deleteAssignment(+assignmentId);
      navigate(`/lectures/${lectureId}`);
    } catch {
      setError("Delete failed.");
    }
  };

  // Instructor grade
  const handleGrade = async (submissionId: number, score: number, feedback: string) => {
    try {
      const dto: GradeSubmissionRequestDTO = { score, feedback, gradedBy: userId! };
      const graded = await gradeSubmission(submissionId, dto);
      setAllSubmissions(prev => prev.map(s => (s.id === submissionId ? graded : s)));
    } catch {
      setError("Grading failed.");
    }
  };

  if (loading) return <div className="assignment-loading">Loading…</div>;
  if (error) return <div className="assignment-error">{error}</div>;
  if (!assignment) return <div className="assignment-error">Assignment not found.</div>;

  return (
    <div className="assignment-detail-page">
      {/* Header or edit form */}
      {isInstructor && editing ? (
        <form className="assignment-form" onSubmit={handleUpdate}>
          <input
            name="assignmentTitle"
            value={form.assignmentTitle}
            onChange={e => setForm(f => ({ ...f, assignmentTitle: e.target.value }))}
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              required
            />
          </label>
          <label>
            Max Score:
            <input
              type="number"
              name="maxScore"
              value={form.maxScore}
              onChange={e => setForm(f => ({ ...f, maxScore: +e.target.value }))}
              required
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h2>{assignment.assignmentTitle}</h2>
          <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleString()}</p>
          <p><strong>Max Score:</strong> {assignment.maxScore}</p>
          <p>{assignment.description}</p>
          {isInstructor && (
            <div className="instructor-actions">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </>
      )}

      <hr />

      {/* Student submission */}
      {!isInstructor && (
        <section className="submission-section">
          {mySubmission ? (
            <div className="existing-submission">
              <p>{mySubmission.submissionText}</p>
              <p><em>Submitted at {new Date(mySubmission.submittedAt).toLocaleString()}{mySubmission.isLate && ' (Late)'}</em></p>
              {mySubmission.score != null ? (
                <>
                  <p><strong>Score:</strong> {mySubmission.score}</p>
                  {mySubmission.feedback && <p><strong>Feedback:</strong> {mySubmission.feedback}</p>}
                </>
              ) : (
                <p className="not-graded">Not graded yet.</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="submission-form">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={6}
                required
              />
              {submitError && <p className="form-error">{submitError}</p>}
              <button type="submit" disabled={submitLoading || !text.trim()}>
                {submitLoading ? 'Submitting…' : 'Submit Assignment'}
              </button>
            </form>
          )}
        </section>
      )}

      {/* Instructor grading */}
      {isInstructor && (
        <section className="submissions-list">
          <h3>All Submissions</h3>
          {allSubmissions.length === 0 && <p>No submissions yet.</p>}
          {allSubmissions.map(s => (
            <div key={s.id} className="submission-item">
              <p><strong>{s.studentName}</strong> at {new Date(s.submittedAt).toLocaleString()}</p>
              <p>{s.submissionText}</p>
              <p>Status: <em>{s.status}</em> {s.score != null && `(Score: ${s.score})`}</p>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const formEl = e.currentTarget;
                  const score = +(formEl.elements.namedItem("score") as HTMLInputElement).value;
                  const feedback = (formEl.elements.namedItem("feedback") as HTMLTextAreaElement).value;
                  handleGrade(s.id, score, feedback);
                }}
                className="grade-form"
              >
                <input
                  type="number"
                  name="score"
                  defaultValue={s.score ?? ''}
                  placeholder="Score"
                  required
                />
                <textarea
                  name="feedback"
                  defaultValue={s.feedback ?? ''}
                  placeholder="Feedback (optional)"
                />
                <button type="submit">Grade</button>
              </form>
            </div>
          ))}
        </section>
      )}

      <Link to={`/lectures/${lectureId}`} className="back-link">
        ← Back to Lecture
      </Link>
    </div>
  );
}
