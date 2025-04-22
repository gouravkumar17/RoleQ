import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../authContext";

const AddApplicationPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    company: "",
    job: "",
    jobDetails: "",
    deadline: "",
    contactInfo: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      await axios.post("https://skillsnap-gyex.onrender.com/api/applications", {
        ...formData,
        userId: user.userId,
      });
      setMessage("Application added successfully!");
      setFormData({
        company: "",
        job: "",
        jobDetails: "",
        deadline: "",
        contactInfo: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error adding application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="application-container">
      <div className="application-card">
        <div className="application-header">
          <h2>Add Job Application</h2>
          <p>Track your job applications in one place</p>
        </div>
        
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Enter company name"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="job">Job Title</label>
            <input
              type="text"
              id="job"
              name="job"
              placeholder="Enter job title"
              value={formData.job}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobDetails">Job Details</label>
            <textarea
              id="jobDetails"
              name="jobDetails"
              placeholder="Describe the job details"
              value={formData.jobDetails}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Application Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Information (Optional)</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              placeholder="Email/Phone of recruiter"
              value={formData.contactInfo}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span className="icon">+</span> Submit Application
              </>
            )}
          </button>
        </form>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
      </div>
    </div>
  );
};

export default AddApplicationPage;

// CSS (can be in a separate file or styled-components)
const styles = `
.application-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 2rem;
}

.application-card {
  width: 100%;
  max-width: 700px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  transition: transform 0.3s ease;
}

.application-card:hover {
  transform: translateY(-5px);
}

.application-header {
  margin-bottom: 2rem;
  text-align: center;
}

.application-header h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.application-header p {
  color: #7f8c8d;
  font-size: 1rem;
}

.application-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 0.85rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  padding: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.submit-btn .icon {
  font-size: 1.2rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-weight: 500;
  text-align: center;
}

.alert.success {
  background-color: rgba(46, 204, 113, 0.1);
  color: #27ae60;
  border: 1px solid #2ecc71;
}

.alert.error {
  background-color: rgba(231, 76, 60, 0.1);
  color: #c0392b;
  border: 1px solid #e74c3c;
}

@media (max-width: 768px) {
  .application-container {
    padding: 1rem;
  }
  
  .application-card {
    padding: 1.5rem;
  }
}
`;

// Add styles to the head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}