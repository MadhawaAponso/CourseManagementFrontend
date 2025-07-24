import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/axios";
import { useAuth } from "../hooks/useAuth";
import LectureForm from "../components/LectureForm";
import FeedbackSection from "./FeedbackSection";

import "./style/CoursePage.css";
import type { CourseResponseDTO } from "../types/CourseResponse";
import type { LectureResponseDTO, LectureRequestDTO } from "../types/Lecture";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const { roles } = useAuth();
  const isInstructor = roles.includes("instructor");

  const [course, setCourse] = useState<CourseResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureResponseDTO | undefined>(undefined);

  // load course + lectures
  useEffect(() => {
    if (!id) return;
    api
      .get<CourseResponseDTO>(`/courses/${id}`)
      .then((res) => {
        const sorted = {
          ...res.data,
          lectures: (res.data.lectures || []).slice().sort((a, b) => a.weekNumber - b.weekNumber),
        };
        setCourse(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // handle delete
  const handleDelete = async (lectureId: number) => {
    try {
      await api.delete(`/lectures/${lectureId}`);
      setCourse((c) =>
        c && { ...c, lectures: c.lectures.filter((l) => l.id !== lectureId) }
      );
    } catch (e) {
      console.error(e);
    }
  };

  // handle create/update
  const handleSave = async (formData: LectureRequestDTO) => {
    // build payload matching LectureRequestDTO on the server
    const payload = {
      lectureTitle:      formData.lectureTitle,
      description:       formData.description,
      // tack on time so backend Instant/LocalDateTime parses it
      scheduledDate:     `${formData.scheduledDate}T00:00:00`,
      weekNumber:        formData.weekNumber,
      onlineLectureLink: formData.onlineLectureLink,
    };

    try {
      let updated: LectureResponseDTO;
      if (editingLecture) {
        updated = await api
          .put<LectureResponseDTO>(`/lectures/${editingLecture.id}`, payload)
          .then((r) => r.data);
      } else {
        updated = await api
          .post<LectureResponseDTO>(`/lectures/course/${id}`, payload)
          .then((r) => r.data);
      }

      setCourse((c) =>
        c && {
          ...c,
          lectures: editingLecture
            ? c.lectures.map((l) => (l.id === updated.id ? updated : l))
            : [...c.lectures, updated].sort((a, b) => a.weekNumber - b.weekNumber),
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setShowForm(false);
      setEditingLecture(undefined);
    }
  };

  if (loading) return <div className="course-loading">Loading...</div>;
  if (!course) return <div className="course-error">Course not found.</div>;

  return (
    <div className="course-page">
      {/* course header */}
      <div className="course-details-card">
        <h2>
          {course.courseCode} – {course.courseName}
        </h2>
        <p><strong>Description:</strong> {course.description || "—"}</p>
        <p><strong>Instructor:</strong> {course.instructorName}</p>
        <p>
          <strong>Duration:</strong> {course.startDate} → {course.endDate}
        </p>
      </div>

      {/* instructor: show add/edit UI */}
      {isInstructor && !showForm && (
        <button
          className="add-lecture-btn"
          onClick={() => {
            setEditingLecture(undefined);
            setShowForm(true);
          }}
        >
          + Add Lecture
        </button>
      )}
      {showForm && (
        <LectureForm
          initialData={editingLecture}
          courseId={Number(id)}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSave}
        />
      )}

      {/* lectures list */}
      <section className="lectures-section">
        <h3>Lectures</h3>
        {course.lectures.length === 0 ? (
          <p className="empty-state">No lectures scheduled.</p>
        ) : (
          <div className="lectures-grid">
            {course.lectures.map((lec) => (
              <div key={lec.id} className="lecture-card">
                <Link to={`/lectures/${lec.id}`} className="lecture-summary">
                  <h4>{lec.lectureTitle}</h4>
                  <p><strong>Week:</strong> {lec.weekNumber}</p>
                  <p>
                    <strong>When:</strong>{" "}
                    {new Date(lec.scheduledDate).toLocaleString()}
                  </p>
                </Link>

                {lec.onlineLectureLink && (
                  <p className="join-link">
                    <a href={lec.onlineLectureLink} target="_blank" rel="noreferrer">
                      Join Lecture
                    </a>
                  </p>
                )}

                {isInstructor && (
                  <div className="instructor-controls">
                    <button onClick={() => { setEditingLecture(lec); setShowForm(true); }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(lec.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* feedback always visible */}
      <FeedbackSection courseId={id!} />
    </div>
  );
}
