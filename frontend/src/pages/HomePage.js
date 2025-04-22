import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authContext";

const HomePage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `https://skillsnap-gyex.onrender.com/api/applications?userId=${user.userId}`
        );
        setApplications(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching applications.");
      }
    };

    if (user && user.userId) {
      fetchApplications();
    }
  }, [user]);

  if (!user || !user.userId) {
    return (
      <div className="auth-prompt">
        <div className="auth-prompt-content">
          <h2>Please log in to access your applications</h2>
          <div className="wave-animation">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSkillRecommendations = async (company, job) => {
    setLoading(true);
    setModalVisible(true);
    try {
      const response = await axios.post(
        "https://skillsnap-gyex.onrender.com/api/applications/skillRecommendations",
        { userId: user.userId, company, job },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOutput({ type: "skills", data: response.data.skillRecommendations });
    } catch (err) {
      setOutput({ type: "error", message: err.response?.data?.message || "Error fetching skill recommendations." });
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewPrep = async (company, job) => {
    setLoading(true);
    setModalVisible(true);
    try {
      const response = await axios.post(
        "https://skillsnap-gyex.onrender.com/api/applications/interviewPrep",
        { userId: user.userId, company, job },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOutput({ type: "interview", data: response.data.recommendations });
    } catch (err) {
      setOutput({ type: "error", message: err.response?.data?.message || "Error fetching interview prep tips." });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAnalysis = async (company, job) => {
    setLoading(true);
    setModalVisible(true);
    try {
      const response = await axios.post(
        "https://skillsnap-gyex.onrender.com/api/applications/skillAnalysis",
        { userId: user.userId, company, job },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOutput({ type: "skillAnalysis", data: response.data });
    } catch (err) {
      setOutput({ type: "error", message: err.response?.data?.message || "Error fetching skill analysis." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await axios.delete(`https://skillsnap-gyex.onrender.com/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setApplications(applications.filter((app) => app._id !== applicationId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting application.");
    }
  };

  const truncateText = (text, maxLines = 4) => {
    const lineLimit = 100 * maxLines;
    return text.length > lineLimit ? `${text.substring(0, lineLimit)}...` : text;
  };

  return (
    <div className="home-container">
      <div className="header-section">
        <h2>Your Applications</h2>
        <p className="subtitle">Manage and optimize your job applications</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {applications.length > 0 ? (
        <div className="applications-grid">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="card-header">
                <h3>{app.company}</h3>
                <span className="deadline-badge">
                  {new Date(app.deadline).toLocaleDateString()}
                </span>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Position:</span>
                  <span className="info-value">{app.job}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Details:</span>
                  <p className="info-value">{truncateText(app.jobDetails)}</p>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Contact:</span>
                  <span className="info-value">{app.contactInfo}</span>
                </div>
              </div>
              
              <div className="card-actions">
                <button
                  onClick={() => handleSkillRecommendations(app.company, app.job)}
                  className="action-btn skill-btn"
                >
                  <span className="btn-icon"></span> Skills
                </button>
                <button
                  onClick={() => handleInterviewPrep(app.company, app.job)}
                  className="action-btn interview-btn"
                >
                  <span className="btn-icon"></span> Interview
                </button>
                <button
                  onClick={() => handleSkillAnalysis(app.company, app.job)}
                  className="action-btn analysis-btn"
                >
                  <span className="btn-icon"></span> Analysis
                </button>
                <button
                  onClick={() => handleDeleteApplication(app._id)}
                  className="action-btn delete-btn"
                >
                  <span className="btn-icon"></span> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No applications found</h3>
          <p>Start by adding your first job application</p>
        </div>
      )}

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button
              onClick={() => setModalVisible(false)}
              className="modal-close-btn"
            >
              &times;
            </button>
            
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading recommendations...</p>
              </div>
            ) : (
              <>
                {output?.type === "skills" && (
                  <RecommendationSection 
                    title="Recommended Skills" 
                    items={output.data} 
                    renderItem={renderSkill} 
                  />
                )}
                {output?.type === "interview" && (
                  <RecommendationSection 
                    title="Interview Prep Tips" 
                    items={output.data} 
                    renderItem={renderInterviewTip} 
                  />
                )}
                {output?.type === "skillAnalysis" && renderSkillAnalysis(output.data)}
                {output?.type === "error" && (
                  <div className="error-message">{output.message}</div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Component for consistent recommendation sections
const RecommendationSection = ({ title, items, renderItem }) => (
  <div className="recommendation-section">
    <h4>{title}</h4>
    <div className="recommendation-list">
      {items.map((item, index) => (
        <div key={index} className="recommendation-card">
          {renderItem(item)}
        </div>
      ))}
    </div>
  </div>
);

const renderSkill = (skill) => (
  <>
    <h5>{skill.skill}</h5>
    <div className="skill-detail">
      <span className="detail-label">Course:</span>
      <span className="detail-value">{skill.courseName}</span>
    </div>
    <div className="skill-detail">
      <span className="detail-label">Provider:</span>
      <span className="detail-value">{skill.provider}</span>
    </div>
    <div className="skill-detail">
      <span className="detail-label">Description:</span>
      <p className="detail-value">{skill.description}</p>
    </div>
  </>
);

const renderInterviewTip = (tip) => (
  <>
    <h5>{tip.platformName}</h5>
    <div className="skill-detail">
      <span className="detail-label">Focus:</span>
      <span className="detail-value">{tip.focus}</span>
    </div>
    <div className="skill-detail">
      <span className="detail-label">Category:</span>
      <span className="detail-value">{tip.category}</span>
    </div>
    <div className="skill-detail">
      <span className="detail-label">URL:</span>
      <a href={tip.url} target="_blank" rel="noopener noreferrer" className="detail-link">
        {tip.url}
      </a>
    </div>
  </>
);

const renderSkillAnalysis = (data) => (
  <div className="skill-analysis">
    <h4>Skill Analysis</h4>
    <div className="analysis-section">
      <h5>✅ Matched Skills</h5>
      <div className="skill-tags">
        {data.matchedSkills.map((skill, index) => (
          <span key={index} className="skill-tag matched">{skill}</span>
        ))}
      </div>
    </div>
    <div className="analysis-section">
      <h5>📈 Skills to Improve</h5>
      <div className="skill-tags">
        {data.improveSkills.map((skill, index) => (
          <span key={index} className="skill-tag improve">{skill}</span>
        ))}
      </div>
    </div>
    <div className="analysis-section">
      <h5>❌ Missing Skills</h5>
      <div className="skill-tags">
        {data.missingSkills.map((skill, index) => (
          <span key={index} className="skill-tag missing">{skill}</span>
        ))}
      </div>
    </div>
  </div>
);

// CSS (should be in a separate file or CSS-in-JS)
const styles = `
  :root {
    --primary-color: #4361ee;
    --secondary-color: #3f37c9;
    --accent-color: #4895ef;
    --danger-color: #f72585;
    --success-color: #4cc9f0;
    --warning-color: #f8961e;
    --light-color: #f8f9fa;
    --dark-color: #212529;
    --gray-color: #6c757d;
    --border-radius: 12px;
    --box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }

  .home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .header-section {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .header-section h2 {
    font-size: 2.2rem;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  .subtitle {
    color: var(--gray-color);
    font-size: 1.1rem;
  }

  .applications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .application-card {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
    transition: var(--transition);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .application-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .card-header h3 {
    margin: 0;
    color: var(--primary-color);
    font-size: 1.3rem;
  }

  .deadline-badge {
    background: var(--accent-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .card-body {
    padding: 1.5rem;
  }

  .info-row {
    margin-bottom: 1rem;
  }

  .info-label {
    font-weight: 600;
    color: var(--dark-color);
    margin-right: 0.5rem;
  }

  .info-value {
    color: var(--gray-color);
  }

  .card-actions {
    padding: 1rem 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .action-btn {
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .action-btn:hover {
    transform: translateY(-2px);
  }

  .skill-btn {
    background: var(--primary-color);
    color: white;
  }

  .interview-btn {
    background: var(--success-color);
    color: white;
  }

  .analysis-btn {
    background: var(--warning-color);
    color: white;
  }

  .delete-btn {
    background: var(--danger-color);
    color: white;
  }

  .btn-icon {
    font-size: 1rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    max-width: 500px;
    margin: 2rem auto;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .empty-state h3 {
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: var(--gray-color);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .modal-container {
    background: white;
    border-radius: var(--border-radius);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: modalFadeIn 0.3s ease-out;
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--gray-color);
    transition: var(--transition);
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .modal-close-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--dark-color);
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .recommendation-section {
    margin-top: 1rem;
  }

  .recommendation-section h4 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--light-color);
  }

  .recommendation-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .recommendation-card {
    background: var(--light-color);
    padding: 1.25rem;
    border-radius: 10px;
    transition: var(--transition);
  }

  .recommendation-card:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }

  .recommendation-card h5 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: var(--dark-color);
  }

  .skill-detail {
    margin-bottom: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .detail-label {
    font-weight: 600;
    color: var(--dark-color);
    min-width: 80px;
  }

  .detail-value {
    color: var(--gray-color);
    flex: 1;
  }

  .detail-link {
    color: var(--accent-color);
    text-decoration: none;
    word-break: break-all;
  }

  .detail-link:hover {
    text-decoration: underline;
  }

  .skill-analysis {
    margin-top: 1rem;
  }

  .analysis-section {
    margin-bottom: 1.5rem;
  }

  .analysis-section h5 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skill-tag {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .matched {
    background: rgba(67, 97, 238, 0.1);
    color: var(--primary-color);
  }

  .improve {
    background: rgba(248, 150, 30, 0.1);
    color: var(--warning-color);
  }

  .missing {
    background: rgba(247, 37, 133, 0.1);
    color: var(--danger-color);
  }

  .error-message {
    background: rgba(247, 37, 133, 0.1);
    color: var(--danger-color);
    padding: 1rem;
    border-radius: var(--border-radius);
    margin: 1rem 0;
    text-align: center;
    border-left: 4px solid var(--danger-color);
  }

  .auth-prompt {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }

  .auth-prompt-content {
    text-align: center;
    padding: 2rem;
    max-width: 500px;
  }

  .auth-prompt h2 {
    color: var(--dark-color);
    margin-bottom: 2rem;
  }

  .wave-animation {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 50px;
    gap: 5px;
  }

  .wave {
    width: 6px;
    height: 20px;
    background: var(--primary-color);
    border-radius: 3px;
    animation: wave 1.2s ease-in-out infinite;
  }

  .wave:nth-child(2) {
    animation-delay: 0.2s;
  }

  .wave:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes wave {
    0%, 100% {
      height: 20px;
    }
    50% {
      height: 40px;
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default HomePage;