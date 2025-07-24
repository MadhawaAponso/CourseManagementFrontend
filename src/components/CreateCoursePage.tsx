import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createCourse } from "../services/CourseService";
import type { CourseRequestDTO } from "../types/CourseResponse";
import type { CourseResponseDTO } from "../types/CourseResponse";
import "./style/CreateCoursePage.css";

export default function CreateCoursePage() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<CourseRequestDTO>({
    courseCode:   "",
    courseName:   "",
    description:  "",
    instructorId: userId!,    // you’re an instructor here
    createdById:  userId!,
    startDate:    new Date().toISOString().slice(0, 10),
    endDate:      new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const course: CourseResponseDTO = await createCourse(form);
      navigate(`/courses/${course.id}`, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-course-page">
      <h2>Create New Course</h2>
      {error && <p className="field-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="courseCode"
          placeholder="Course Code (e.g., CS101)"
          value={form.courseCode}
          onChange={handleChange}
          required
        />
        <input
          name="courseName"
          placeholder="Course Name (e.g., Introduction to Computer Science)"
          value={form.courseName}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="A brief description of the course."
          value={form.description}
          onChange={handleChange}
          rows={4}
        />
        <label>
          Start Date
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Creating…" : "Create Course"}
        </button>
      </form>
    </div>
  );
}
