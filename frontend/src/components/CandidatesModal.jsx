import { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';

export default function CandidatesModal({ job, onClose, onUpdate }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [job.id]);

  const loadApplications = async () => {
    try {
      const response = await applicationAPI.getJobApplications(job.id);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await applicationAPI.updateStatus(applicationId, status);
      await loadApplications();
      await onUpdate(); // Update dashboard stats
    } catch (error) {
      alert('Failed to update application status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEWING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Candidates for {job.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No applications yet
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{app.seeker_name}</h3>
                      <p className="text-gray-600 text-sm">{app.seeker_email}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      View Resume →
                    </a>
                  </div>

                  <div className="flex gap-2">
                    {app.status !== 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                    )}
                    {app.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    )}
                    {app.status === 'NEW' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'REVIEWING')}
                        className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                      >
                        Mark as Reviewing
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}