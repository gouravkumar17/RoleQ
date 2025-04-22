import React, { useState, useEffect } from "react";
import { useAuth } from "../authContext";
import axios from "axios";

const ProfilePage = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill: "", proficiency: 0, dateGained: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`https://skillsnap-gyex.onrender.com/api/skills/?userId=${user.userId}`);
        setSkills(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching skills.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.userId) {
      fetchSkills();
    }
  }, [user]);

  if (!user || !user.userId) {
    return (
      <div className="auth-required-message">
        <div className="auth-message-content">
          <h2>Please log in to access your profile</h2>
          <p>You need to be authenticated to view this content.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSkill({ ...newSkill, [name]: value });
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("https://skillsnap-gyex.onrender.com/api/skills", {
        ...newSkill,
        userId: user.userId,
      });
      setSkills([...skills, res.data.skills[res.data.skills.length - 1]]);
      setMessage("Skill added successfully!");
      setNewSkill({ skill: "", proficiency: 0, dateGained: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Error adding skill.");
    } finally {
      setIsLoading(false);
    }
  };

  const proficiencyColors = {
    0: "beginner",
    1: "intermediate",
    2: "expert"
  };

  const proficiencyText = {
    0: "Beginner",
    1: "Intermediate",
    2: "Expert"
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Welcome back, {user.username}!</h1>
        <p>Manage your skills and professional profile</p>
      </div>

      <div className="profile-content">
        {/* Add Skill Card */}
        <div className="profile-card">
          <h2>Add New Skill</h2>
          <form onSubmit={handleAddSkill} className="skill-form">
            <div className="form-group">
              <label htmlFor="skill">Skill Name</label>
              <input
                type="text"
                id="skill"
                name="skill"
                placeholder="e.g. React, Python, Project Management"
                value={newSkill.skill}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="proficiency">Proficiency Level</label>
              <select
                id="proficiency"
                name="proficiency"
                value={newSkill.proficiency}
                onChange={handleChange}
                required
              >
                <option value="0">Beginner</option>
                <option value="1">Intermediate</option>
                <option value="2">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateGained">Date Acquired</label>
              <input
                type="date"
                id="dateGained"
                name="dateGained"
                value={newSkill.dateGained}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Adding...
                </>
              ) : (
                'Add Skill'
              )}
            </button>
          </form>

          {message && (
            <div className="alert success">
              {message}
            </div>
          )}
          {error && (
            <div className="alert error">
              {error}
            </div>
          )}
        </div>

        {/* Skills List Card */}
        <div className="profile-card">
          <div className="skills-header">
            <h2>Your Skills</h2>
            <span className="skills-count">
              {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
            </span>
          </div>

          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : skills.length > 0 ? (
            <ul className="skills-list">
              {skills.map((skill, index) => (
                <li key={index} className="skill-item">
                  <div className="skill-content">
                    <h3>{skill.skill}</h3>
                    <div className="skill-meta">
                      <span className={`proficiency-badge ${proficiencyColors[skill.proficiency]}`}>
                        {proficiencyText[skill.proficiency]}
                      </span>
                      <span className="skill-date">
                        Acquired: {new Date(skill.dateGained).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3>No skills yet</h3>
              <p>Get started by adding your first skill above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// CSS Styles
const styles = `
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a1a1a;
}

.profile-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.profile-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.profile-header p {
  font-size: 1rem;
  color: #4a5568;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.profile-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.skill-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.submit-btn {
  padding: 0.75rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #3182ce;
}

.submit-btn:disabled {
  background-color: #bee3f8;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert {
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.alert.success {
  background-color: #f0fff4;
  color: #2f855a;
  border: 1px solid #c6f6d5;
}

.alert.error {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
}

.skills-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.skills-count {
  background-color: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.skills-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-item {
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.skill-item:last-child {
  border-bottom: none;
}

.skill-content h3 {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.skill-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.proficiency-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
}

.proficiency-badge.beginner {
  background-color: #ebf8ff;
  color: #2b6cb0;
}

.proficiency-badge.intermediate {
  background-color: #faf5ff;
  color: #6b46c1;
}

.proficiency-badge.expert {
  background-color: #f0fff4;
  color: #2f855a;
}

.skill-date {
  color: #718096;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: #cbd5e0;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state h3 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.auth-required-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.auth-message-content {
  text-align: center;
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 28rem;
  width: 100%;
}

.auth-message-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.auth-message-content p {
  color: #4a5568;
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);