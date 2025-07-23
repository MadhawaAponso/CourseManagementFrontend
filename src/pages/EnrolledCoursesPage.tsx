import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axios";
import type { CourseResponseDTO } from "../types/CourseResponse";
import { useAuth } from "../hooks/useAuth";
import "./style/EnrolledCoursesPage.css";

export default function EnrolledCoursesPage() {
  const { isAuthenticated, isInstructor } = useAuth();
  const [courses, setCourses] = useState<CourseResponseDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("You need to log in.");
      return;
    }

    const path = isInstructor
      ? "/courses/instructor"
      : "/courses/enrolled";

    axios
      .get<CourseResponseDTO[]>(path)
      .then(({ data }) => setCourses(data))
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        setError("Failed to fetch courses.");
      });
  }, [isAuthenticated, isInstructor]);

  return (
    <div className="enrolled-courses-container">
      <h2>
        My {isInstructor ? "Teaching" : "Enrolled"} Courses
      </h2>
      {error && <div className="error">{error}</div>}
      <div className="course-list">
        {courses.map((c) => (
          <Link
            to={`/courses/${c.id}`}
            key={c.id}
            className="course-card"
          >
            <h3>
              {c.courseName}{" "}
              <span className="course-code">
                ({c.courseCode})
              </span>
            </h3>
            <p>
              <strong>Description:</strong> {c.description}
            </p>
            <p>
              <strong>Instructor:</strong> {c.instructorName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
