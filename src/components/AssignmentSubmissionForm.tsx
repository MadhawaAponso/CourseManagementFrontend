// src/components/AssignmentSubmissionForm.tsx
import { useState, useEffect, type FormEvent } from "react";
import {
  submitAssignment,
  fetchMySubmission
} from "../services/submissionService";
import type { AssignmentSubmissionRequestDTO, AssignmentSubmissionResponseDTO } from "../types/AssignmentSubmission";

interface Props {
  assignmentId: number;
  onSubmitted?: (resp: AssignmentSubmissionResponseDTO) => void;
}

export default function AssignmentSubmissionForm({
  assignmentId,
  onSubmitted,
}: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] =
    useState<AssignmentSubmissionResponseDTO | null>(null);

  // Load existing submission
  useEffect(() => {
    fetchMySubmission(assignmentId)
      .then((resp) => setExisting(resp))
      .catch(() => {
        /* ignore if none */
      });
  }, [assignmentId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: AssignmentSubmissionRequestDTO = {
      assignmentId,
      submissionText: text.trim(),
    };

    try {
      const resp = await submitAssignment(payload);
      setExisting(resp);
      onSubmitted?.(resp);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (existing) {
    return (
      <div className="p-4 border rounded bg-gray-50">
        <h4 className="font-semibold">Your Submission</h4>
        <p>{existing.submissionText}</p>
        <p className="text-sm text-gray-600">
          Submitted at{" "}
          {new Date(existing.submittedAt).toLocaleString()}
          {existing.isLate && (
            <span className="text-red-600 ml-2">(Late)</span>
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full p-2 border rounded"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your submission here..."
        required
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit Assignment"}
      </button>
    </form>
  );
}
