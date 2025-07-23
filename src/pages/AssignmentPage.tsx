// src/pages/AssignmentDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/axios";
import {
  fetchMySubmission,
  submitAssignment,
} from "../services/submissionService";
import type { AssignmentResponseDTO } from "../types/Assignments";
import type {
  AssignmentSubmissionResponseDTO,
  AssignmentSubmissionRequestDTO,
} from "../types/AssignmentSubmission";
import "./style/AssignmentPage.css";

export default function AssignmentDetailPage() {
  const { lectureId, assignmentId } = useParams<{
    lectureId: string;
    assignmentId: string;
  }>();
  const [assignment, setAssignment] = useState<AssignmentResponseDTO | null>(
    null
  );
  const [submission, setSubmission] =
    useState<AssignmentSubmissionResponseDTO | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) return;
    Promise.all([
      api.get<AssignmentResponseDTO>(`/assignments/${assignmentId}`),
      fetchMySubmission(+assignmentId),
    ])
      .then(([aRes, s]) => {
        setAssignment(aRes.data);
        setSubmission(s);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load assignment or submission.");
      })
      .finally(() => setLoading(false));
  }, [assignmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const dto: AssignmentSubmissionRequestDTO = {
        assignmentId: +assignmentId!,
        submissionText: text.trim(),
      };
      const saved = await submitAssignment(dto);
      setSubmission(saved);
    } catch (e: any) {
      console.error(e);
      setSubmitError(
        e.response?.data?.message || "Submission failed, try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="assignment-loading">Loading…</div>;
  if (error) return <div className="assignment-error">{error}</div>;
  if (!assignment)
    return <div className="assignment-error">Assignment not found.</div>;

  return (
    <div className="assignment-detail-page">
      <div className="assignment-header-card">
        <h2>{assignment.assignmentTitle}</h2>
        
        <p>
          <strong>Due:</strong> {new Date(assignment.dueDate).toLocaleString()}
        </p>
        <p>
          <strong>Max Score:</strong> {assignment.maxScore}
        </p>
        <p>
          <strong>Lecture:</strong> {assignment.lectureTitle}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(assignment.createdAt).toLocaleDateString()}
        </p>
      </div>

      <section className="submission-section">
        <p>
          <strong>Question:</strong> {assignment.description}
        </p>

        {submission ? (
          <div className="existing-submission">
            <p className="submitted-text">{submission.submissionText}</p>
            <p>
              <em>
                Submitted at{" "}
                {new Date(submission.submittedAt).toLocaleString()}
                {submission.isLate && " (Late)"}
              </em>
            </p>
            <p>
              <strong>Graded By:</strong>{" "}
              {submission.gradedBy
                ? `${submission.gradedBy} on ${new Date(
                    submission.gradedAt!
                  ).toLocaleString()}`
                : "Not graded yet"}
            </p>
            {submission.score != null && (
              <p>
                <strong>Score:</strong> {submission.score}{" "}
                <em>({submission.feedback})</em>
              </p>
            )}
            {submission.status && (
              <p>
                <strong>Status:</strong> {submission.status}
              </p>
            )}
          </div>
        ) : (
          <form className="submission-form" onSubmit={handleSubmit}>
            <label htmlFor="submissionText">Your Answer:</label>
            <textarea
              id="submissionText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              required
            />
            {submitError && <p className="form-error">{submitError}</p>}
            <button type="submit" disabled={submitting || !text.trim()}>
              {submitting ? "Submitting…" : "Submit Assignment"}
            </button>
          </form>
        )}
      </section>

      <Link to={`/lectures/${lectureId}`} className="back-link">
        ← Back to Lecture
      </Link>
    </div>
  );
}
