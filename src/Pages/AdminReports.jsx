import React, { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../Services/ServerUrl';
import './AdminUserManagement.css';

function AdminUserManagement() {
  const [users, setUsers] = useState({
    total: 0,
    active: 0,
    newSignups: 0,
    recentActivity: [],
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/admin/users`);
        setUsers({
          total: response.data.totalUsers,
          active: response.data.activeUsers,
          newSignups: response.data.newSignups,
          recentActivity: response.data.recentActivity,
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    fetchUserStats();
  }, []);

  return (
    <div className="usermgmt-page">
      {/* Header */}
      <div className="usermgmt-header">
        <h2>User <span>Management</span></h2>
        <p>Admin · User Statistics &amp; Activity</p>
        <div className="usermgmt-divider" />
      </div>

      <div className="usermgmt-inner">

        {/* Stats card */}
        <div className="usermgmt-card">
          <div className="usermgmt-stats">
            <FaUsers size={38} className="usermgmt-stats-icon" />
            <p className="usermgmt-stats-title">User Statistics</p>

            <div className="usermgmt-stats-grid">
              <div className="usermgmt-stat total">
                <p className="usermgmt-stat-value">
                  {users.total.toLocaleString()}
                </p>
                <p className="usermgmt-stat-label">Total Users</p>
              </div>

              <div className="usermgmt-stat active">
                <p className="usermgmt-stat-value">
                  {users.active.toLocaleString()}
                </p>
                <p className="usermgmt-stat-label">Active</p>
              </div>

              <div className="usermgmt-stat signups">
                <p className="usermgmt-stat-value">
                  {users.newSignups.toLocaleString()}
                </p>
                <p className="usermgmt-stat-label">New Signups</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity card */}
        <div className="usermgmt-card">
          <div className="usermgmt-activity">
            <p className="usermgmt-activity-heading">
              Recent <span>Activity</span>
            </p>

            {users.recentActivity.length > 0 ? (
              <ul className="usermgmt-activity-list">
                {users.recentActivity.map((activity, index) => (
                  <li key={index} className="usermgmt-activity-item">
                    <span className="usermgmt-activity-dot" />
                    {activity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="usermgmt-activity-empty">No recent activity to display.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminUserManagement;