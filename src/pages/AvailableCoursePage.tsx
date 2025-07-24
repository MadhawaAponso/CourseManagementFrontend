import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getAvailableCourses,
  enrollCourse,
} from "../services/enrollmentService";
import type {
  EnrollmentRequestDTO,
  EnrollmentResponseDTO,
} from "../types/Enrollment";
import type { CourseResponseDTO } from "../types/CourseResponse";
import "./style/AvailableCoursePage.css";

export default function AvailableCoursesPage() {
  const { userId } = useAuth();
  const [courses, setCourses] = useState<CourseResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [enrollingIds, setEnrollingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!userId) return;
    getAvailableCourses(userId)
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleEnroll = async (courseId: number) => {
    if (!userId) return;
    // optimistically disable this button
    setEnrollingIds(prev => new Set(prev).add(courseId));
    const dto: EnrollmentRequestDTO = { studentId: userId, courseId };

    try {
      const resp: EnrollmentResponseDTO = await enrollCourse(dto);
      setMessage({
        text: `✅ Enrolled in ${resp.courseName} (${resp.courseCode}) on ${new Date(
          resp.enrollmentDate
        ).toLocaleDateString()}`,
        isError: false,
      });
      // remove it from the available list
      setCourses(cs => cs.filter(c => c.id !== courseId));
    } catch (err: any) {
      console.error("Enroll failed:", err);
      if (err.response?.status === 409) {
        setMessage({
          text: "⚠️ You’re already enrolled in that course!",
          isError: true,
        });
      } else {
        setMessage({
          text: "❌ Enrollment failed. Try again later.",
          isError: true,
        });
      }
    } finally {
      // re-enable button if it wasn't removed
      setEnrollingIds(prev => {
        const next = new Set(prev);
        next.delete(courseId);
        return next;
      });
    }
  };

  if (loading) {
    return <div className="empty-state">Loading available courses…</div>;
  }

  if (courses.length === 0) {
    return <div className="empty-state">No new courses available to enroll in at this time.</div>;
  }

  return (
    <div className="available-courses-page">
      <h2>Available Courses to Enroll</h2>
      {message && (
        <p className={`enroll-message ${message.isError ? "error" : ""}`}>
          {message.text}
        </p>
      )}
      <ul className="course-list-available">
        {courses.map(c => (
          <li key={c.id} className="course-item-available">
            <div className="course-info">
              <h3>
                {c.courseCode} – {c.courseName}
              </h3>
              <p>{c.description}</p>
              <p><strong>Instructor:</strong> {c.instructorName}</p>
              <p><strong>Duration:</strong> {c.startDate} to {c.endDate}</p>
            </div>
            <button
              className="enroll-button"
              disabled={enrollingIds.has(c.id)}
              onClick={() => handleEnroll(c.id)}
            >
              {enrollingIds.has(c.id) ? "Enrolling…" : "Enroll Now"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
