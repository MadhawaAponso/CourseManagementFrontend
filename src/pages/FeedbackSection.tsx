// src/components/FeedbackSection.tsx
import { useEffect, useState } from "react";
import api from "../services/axios";
import { useAuth } from "../hooks/useAuth";
import "./style/FeedbackSection.css"

export interface CourseFeedbackResponseDTO {
  id: number;
  studentName: string | null;
  feedbackText: string;
  rating: number;
  submittedAt: string;
  isAnonymous: boolean;
}

export interface CourseFeedbackRequestDTO {
  feedbackText: string;
  rating: number;
  isAnonymous: boolean;
}

interface FeedbackSectionProps {
  courseId: string;
}

export default function FeedbackSection({ courseId }: FeedbackSectionProps) {
  const { roles } = useAuth();
  const isStudent = roles.includes("student");
  const isInstructor = roles.includes("instructor");

  const [myFeedback, setMyFeedback] = useState<CourseFeedbackResponseDTO | null>(null);
  const [allFeedbacks, setAllFeedbacks] = useState<CourseFeedbackResponseDTO[]>([]);
  const [loadingMine, setLoadingMine] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch student’s own feedback
  // having error because they havenot yet submitted the feedback
  useEffect(() => {
    if (!isStudent) {
      setLoadingMine(false);
      return;
    }
    api
      .get<CourseFeedbackResponseDTO>(`/feedback/course/${courseId}/mine`)
      .then(res => setMyFeedback(res.data))
      .catch(err => {
        if (err.response?.status !== 404) {
          setError("Failed to load your feedback");
        }
      })
      .finally(() => setLoadingMine(false));
  }, [courseId, isStudent]);

  // Fetch all feedbacks (for instructor)
  useEffect(() => {
    if (!isInstructor) {
      setLoadingAll(false);
      return;
    }
    api
      .get<CourseFeedbackResponseDTO[]>(`/feedback/course/${courseId}`)
      .then(res => setAllFeedbacks(res.data))
      .catch(() => setError("Failed to load feedbacks"))
      .finally(() => setLoadingAll(false));
  }, [courseId, isInstructor]);

  // form state
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [anon, setAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post(`/feedback/course/${courseId}`, {
        feedbackText: text,
        rating,
        isAnonymous: anon,
      } as CourseFeedbackRequestDTO);
      // set my feedback so form disappears
      setMyFeedback({
        id: -1,
        studentName: "You",
        feedbackText: text,
        rating,
        submittedAt: new Date().toISOString(),
        isAnonymous: anon,
      });
      // if instructor, refresh list
      if (isInstructor) {
        const res = await api.get<CourseFeedbackResponseDTO[]>(`/feedback/course/${courseId}`);
        setAllFeedbacks(res.data);
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("You’ve already submitted feedback.");
      } else {
        setError("Submission failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-section">
      {error && <div className="error">{error}</div>}

      {/* Student view */}
      {isStudent && !loadingMine && (
        myFeedback ? (
          <div className="my-feedback">
            <h4>Your Feedback</h4>
            <p><strong>Rating:</strong> {myFeedback.rating}/5</p>
            <p>{myFeedback.feedbackText}</p>
            <small>Submitted on {new Date(myFeedback.submittedAt).toLocaleDateString()}</small>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <h3>Submit Feedback</h3>
            <label>
              Rating:
              <select value={rating} onChange={e => setRating(+e.target.value)}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label>
              Feedback:
              <textarea
                required
                rows={3}
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={anon}
                onChange={e => setAnon(e.target.checked)}
              />
              Submit anonymously
            </label>
            <button type="submit" disabled={submitting || !text.trim()}>
              {submitting ? "Submitting…" : "Submit Feedback"}
            </button>
          </form>
        )
      )}

      {/* Instructor view */}
      {isInstructor && !loadingAll && (
        <section className="feedback-list">
          <h3>All Feedback</h3>
          {allFeedbacks.length === 0 ? (
            <p className="empty-state">No feedback submitted yet.</p>
          ) : (
            <ul>
              {allFeedbacks.map(fb => (
                <li key={fb.id} className="feedback-item">
                  <p>
                    <strong>{fb.isAnonymous ? "Anonymous" : fb.studentName}</strong>{" "}
                    rated {fb.rating}/5
                  </p>
                  <p>{fb.feedbackText}</p>
                  <small>{new Date(fb.submittedAt).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
