import { useState } from 'react';
import './GuideModal.css';

export default function GuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('employer');

  if (!isOpen) return null;

  const employerSteps = [
    { icon: '📝', title: 'Create Account', desc: 'Sign up as an employer using your business email' },
    { icon: '🔐', title: 'Verify Email', desc: 'Check your inbox and verify your email address' },
    { icon: '📤', title: 'Post a Job', desc: 'Click "Post Job" and fill in the job details' },
    { icon: '📋', title: 'Manage Applications', desc: 'Review and track applications from job seekers' },
    { icon: '💬', title: 'Contact Candidates', desc: 'Reach out to candidates directly through the platform' },
  ];

  const seekerSteps = [
    { icon: '👤', title: 'Create Account', desc: 'Sign up as a job seeker with your email' },
    { icon: '🔐', title: 'Verify Email', desc: 'Verify your email to activate your account' },
    { icon: '🔍', title: 'Browse Jobs', desc: 'Search and filter jobs that match your skills' },
    { icon: '📄', title: 'Apply', desc: 'Submit your application with resume and cover letter' },
    { icon: '📊', title: 'Track Status', desc: 'Monitor your application status in your dashboard' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-header">
          <h2>📖 User Guides</h2>
          <p>Simple steps to use the platform</p>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'employer' ? 'active' : ''}`}
            onClick={() => setActiveTab('employer')}
          >
            🏢 For Employers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'seeker' ? 'active' : ''}`}
            onClick={() => setActiveTab('seeker')}
          >
            👤 For Job Seekers
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'employer' && (
            <div className="steps-grid">
              {employerSteps.map((step, index) => (
                <div key={index} className="step-card">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-info">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                  <span className="step-number">{index + 1}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'seeker' && (
            <div className="steps-grid">
              {seekerSteps.map((step, index) => (
                <div key={index} className="step-card">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-info">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                  <span className="step-number">{index + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

