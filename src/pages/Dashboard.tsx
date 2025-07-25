import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUpcomingAssignments } from "../services/assignmentService";
import {
  getCurrentWeekLectures,
  getCurrentWeekInstructor,
} from "../services/lectureService";
import { fetchCurrentUser } from "../services/userService";
import { useAuth } from "../hooks/useAuth";

import type { AssignmentResponseDTO } from "../types/Assignments";
import type { LectureResponseDTO } from "../types/Lecture";
import type { UserResponseDTO } from "../types/Users";

import "./style/Dashboard.css";
import luffyImage from "../assets/luffy.jpg";

export default function Dashboard() {
  const { userId, isInstructor, isStudent } = useAuth();

  // Profile
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // Lectures
  const [lectures, setLectures] = useState<LectureResponseDTO[]>([]);
  const [lectLoading, setLectLoading] = useState(true);
  const [lectError, setLectError] = useState<string | null>(null);

  // Assignments (students only)
  const [assignments, setAssignments] = useState<AssignmentResponseDTO[]>([]);
  const [assignLoading, setAssignLoading] = useState(true);
  const [assignError, setAssignError] = useState<string | null>(null);

  // Current date display
  const [currentDate, setCurrentDate] = useState("");

  // set date once
  useEffect(() => {
    const date = new Date();
    const opts: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(date.toLocaleDateString("en-US", opts));
  }, []);

  // fetch profile
  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setUserError("Could not load your profile.");
      })
      .finally(() => setUserLoading(false));
  }, []);

  // fetch lectures by role
  useEffect(() => {
    if (!userId) return;
    const loader = isInstructor
      ? getCurrentWeekInstructor(userId)
      : getCurrentWeekLectures();

    loader
      .then(setLectures)
      .catch((err) => {
        console.error("Failed to load lectures:", err);
        setLectError(
          isInstructor
            ? "Could not load your teaching schedule."
            : "Could not load this week’s lectures."
        );
      })
      .finally(() => setLectLoading(false));
  }, [userId, isInstructor]);

  // fetch assignments only for students
  useEffect(() => {
    if (!isStudent) return;
    getUpcomingAssignments()
      .then(setAssignments)
      .catch((err) => {
        console.error("Failed to load assignments:", err);
        setAssignError("Could not load upcoming assignments.");
      })
      .finally(() => setAssignLoading(false));
  }, [isStudent]);

  return (
    <div className="dashboard-page">
      {/* Profile Section */}
      <section className="profile-section">
        <div className="date-display">{currentDate}</div>
        {userLoading && <p>Loading profile…</p>}
        {userError && <p className="error">{userError}</p>}
        {user && (
          <div className="dashboard-card profile-card">
            <img src={luffyImage} alt="Profile" className="profile-image" />
            <h2>Welcome, {user.firstName}!</h2>
          </div>
        )}
      </section>

      {/* Lectures Section */}
      <section className="lectures-section">
        <h2>
          {isInstructor ? "🗓️ This Week’s Teaching Schedule" : "🗓️ This Week’s Upcoming Lectures"}
        </h2>

        {lectLoading && <p>Loading lectures…</p>}
        {lectError && <p className="error">{lectError}</p>}

        {!lectLoading && !lectError && lectures.length === 0 && (
          <p>
            {isInstructor
              ? "No lectures scheduled for this week."
              : "No lectures lined up this week. 🎉"}
          </p>
        )}

        {!lectLoading && !lectError && lectures.length > 0 && (
          <ul className="card-grid">
            {lectures.map((lec) => (
              <li key={lec.id} className="dashboard-card lecture-card">
                <Link to={`/lectures/${lec.id}`}>{lec.lectureTitle}</Link>
                <p>
                  {lec.courseCode} – {lec.courseName}
                </p>
                <p>{new Date(lec.scheduledDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Assignments Section (students only) */}
      {isStudent && (
        <section className="assignments-section">
          <h2>📚 Your Upcoming Assignments</h2>

          {assignLoading && <p>Loading…</p>}
          {assignError && <p className="error">{assignError}</p>}

          {!assignLoading && !assignError && assignments.length === 0 && (
            <p>No assignments on deck. Enjoy your free time! 😎</p>
          )}

          {!assignLoading && !assignError && assignments.length > 0 && (
            <ul className="card-grid">
              {assignments.map((assn) => (
                <li
                  key={assn.id}
                  className="dashboard-card assignment-card"
                >
                  <h3>📄 {assn.assignmentTitle}</h3>
                  <p>
                    <strong>Due:</strong>{" "}
                    {new Date(assn.dueDate).toLocaleString()}
                  </p>
                  <Link
                    to={`/lectures/${assn.lectureId}/assignments/${assn.id}`}
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
