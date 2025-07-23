// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUpcomingAssignments } from "../services/assignmentService";
import { getCurrentWeekLectures } from "../services/lectureService";
import { fetchCurrentUser } from "../services/userService";
import type { AssignmentResponseDTO } from "../types/Assignments";
import type { LectureResponseDTO } from "../types/Lecture";
import type { UserResponseDTO } from "../types/Users";
import "./style/Dashboard.css";
import luffyImage from "../assets/luffy.jpg";


export default function Dashboard() {
  // user state
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // lectures state
  const [lectures, setLectures] = useState<LectureResponseDTO[]>([]);
  const [lectLoading, setLectLoading] = useState(true);
  const [lectError, setLectError] = useState<string | null>(null);

  // assignments state
  const [assignments, setAssignments] = useState<AssignmentResponseDTO[]>([]);
  const [assignLoading, setAssignLoading] = useState(true);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  // fetch current user
  useEffect(() => {
    fetchCurrentUser()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setUserError("Could not load your profile.");
      })
      .finally(() => setUserLoading(false));
  }, []);

  // fetch this week's upcoming lectures
  useEffect(() => {
    getCurrentWeekLectures()
      .then((data) => setLectures(data))
      .catch((err) => {
        console.error("Failed to load lectures:", err);
        setLectError("Could not load this week’s lectures.");
      })
      .finally(() => setLectLoading(false));
  }, []);

  // fetch upcoming assignments
  useEffect(() => {
    getUpcomingAssignments()
      .then((data) => setAssignments(data))
      .catch((err) => {
        console.error("Failed to load assignments:", err);
        setAssignError("Could not load upcoming assignments.");
      })
      .finally(() => setAssignLoading(false));
  }, []);

  return (
    <>
      <div className="dashboard-page">
        {/* Profile Section */}
        <section className="profile-section">
          <div className="date-display">{currentDate}</div>
          {userLoading && <p>Loading profile…</p>}
          {userError && <p className="error">{userError}</p>}
          {user && (
            <div className="dashboard-card profile-card">
               <img src={luffyImage} alt="Profile" className="profile-image" />
              <h2>
                Welcome, {user.firstName} !
              </h2>
              {/* <p>
                <strong>Email:</strong> {user.email}
              </p> */}
            </div>
          )}
        </section>

        {/* Lectures Section */}
        <section className="lectures-section">
          <h2>🗓️ This Week’s Upcoming Lectures</h2>

          {lectLoading && <p>Loading lectures…</p>}
          {lectError && <p className="error">{lectError}</p>}

          {!lectLoading && !lectError && lectures.length === 0 && (
            <p>No lectures lined up this week. 🎉</p>
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

        {/* Assignments Section */}
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
                <li key={assn.id} className="dashboard-card assignment-card">
                  <h3>📄 {assn.assignmentTitle}</h3>
                  <p>
                    <strong>Question:</strong> {assn.description}
                  </p>
                  <p>
                    <strong>Due:</strong>{" "}
                    {new Date(assn.dueDate).toLocaleString()}
                  </p>
                  <Link
                    to={`/lectures/${assn.lectureId}/assignments/${assn.id}`}
                  >
                    View Assignment Details
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
