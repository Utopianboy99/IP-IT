import React from "react";
import "./Dashboard.css";
import { FiUsers, FiDollarSign, FiActivity, FiBarChart2 } from "react-icons/fi";

const Dashboard = () => {
  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <h2 className="logo">⚡Dash</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Reports</li>
            <li>Users</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard">
        <header className="dash-header">
          <input className="search-bar" type="text" placeholder="Search..." />
          <div className="user-info">👤 Admin</div>
        </header>

        <section className="card-grid">
          <div className="card">
            <FiDollarSign className="icon" />
            <div>
              <h4>Total Revenue</h4>
              <p>R 154,000</p>
            </div>
          </div>
          <div className="card">
            <FiUsers className="icon" />
            <div>
              <h4>New Users</h4>
              <p>1,205</p>
            </div>
          </div>
          <div className="card">
            <FiActivity className="icon" />
            <div>
              <h4>Activity</h4>
              <p>High</p>
            </div>
          </div>
          <div className="card">
            <FiBarChart2 className="icon" />
            <div>
              <h4>Reports</h4>
              <p>13</p>
            </div>
          </div>
        </section>

        <section className="chart-area">
          <h3>Performance Overview</h3>
          <div className="chart-placeholder">📊 Chart Coming Soon</div>
          <button className="lime-btn">Generate Report</button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
