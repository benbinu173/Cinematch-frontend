import React, { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import axios from 'axios';

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
        const response = await axios.get('http://localhost:4000/api/admin/users');
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
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">User Management Dashboard</h2>
      <div className="row">
        {/* User Statistics Card */}
        <div className="col-md-6 mx-auto">
          <div className="card shadow-lg p-4 text-center border-0 rounded-4">
            <FaUsers size={50} className="mb-3 text-primary" />
            <h4 className="fw-bold text-dark">User Statistics</h4>
            <div className="mt-3">
              <p className="fs-5 text-muted">Total Users: <span className="fw-bold text-dark">{users.total}</span></p>
              <p className="fs-5 text-muted">Active Users: <span className="fw-bold text-success">{users.active}</span></p>
              <p className="fs-5 text-muted">New Signups: <span className="fw-bold text-info">{users.newSignups}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-5">
        <h4 className="fw-bold text-dark">Recent User Activity</h4>
        <div className="card shadow-sm p-3 border-0 rounded-4">
          <ul className="list-group list-group-flush">
            {users.recentActivity.length > 0 ? (
              users.recentActivity.map((activity, index) => (
                <li key={index} className="list-group-item text-muted border-0">
                  {activity}
                </li>
              ))
            ) : (
              <li className="list-group-item text-center text-muted">No recent activity</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminUserManagement;