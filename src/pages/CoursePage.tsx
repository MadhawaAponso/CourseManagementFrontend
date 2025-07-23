// src/pages/CoursePage.tsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/axios';

import './style/CoursePage.css';
import type { CourseResponseDTO } from '../types/CourseResponse';
import type { LectureResponseDTO } from '../types/Lecture';
import FeedbackSection from './FeedbackSection';

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get<CourseResponseDTO>(`/courses/${id}`)
      .then(res => {
        const sorted = {
          ...res.data,
          lectures: (res.data.lectures || [])
            .slice()
            .sort((a, b) => a.weekNumber - b.weekNumber),
        };
        setCourse(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="course-loading">Loading...</div>;
  if (!course) return <div className="course-error">Course not found.</div>;

  return (
    <div className="course-page">
      {/* Course Details */}
      <div className="course-details-card">
        <h2>
          {course.courseCode} – {course.courseName}
        </h2>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Instructor:</strong> {course.instructorName}</p>
        <p>
          <strong>Duration:</strong> {course.startDate} → {course.endDate}
        </p>
      </div>

      {/* Lectures Grid */}
      <section className="lectures-section">
        <h3>Lectures</h3>
        {course.lectures.length === 0 ? (
          <p className="empty-state">No lectures scheduled.</p>
        ) : (
          <div className="lectures-grid">
            {course.lectures.map((lec: LectureResponseDTO) => (
              <div key={lec.id} className="lecture-card">
                {/* Only this Link wraps the card summary */}
                <Link to={`/lectures/${lec.id}`} className="lecture-summary">
                  <h4>{lec.lectureTitle}</h4>
                  <p><strong>Week:</strong> {lec.weekNumber}</p>
                  <p>
                    <strong>When:</strong>{' '}
                    {new Date(lec.scheduledDate).toLocaleString()}
                  </p>
                </Link>

                {/* Real anchor sits outside the Link */}
                {lec.onlineLectureLink && (
                  <p className="join-link">
                    <a
                      href={lec.onlineLectureLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Join Lecture
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Feedback Section */}
      <FeedbackSection courseId={id!} />
    </div>
  );
}
