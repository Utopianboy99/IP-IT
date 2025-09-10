
import { useEffect, useState } from "react";
import { Play, Pause, Square, Plus, Search, Bell, Mail, Settings, HelpCircle, LogOut, Calendar, BarChart3, Users, TrendingUp, BookOpen, Clock, Award, Target } from 'lucide-react';
import "./UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [isTimeTrackerRunning, setIsTimeTrackerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentSession, setCurrentSession] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyStreak, setStudyStreak] = useState(0);
  const [weeklyGoals, setWeeklyGoals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user from localStorage or auth
  const getCurrentUser = () => {
    const authHeader = localStorage.getItem("auth");

    if (authHeader && authHeader.startsWith("Basic ")) {
      try {
        const decoded = atob(authHeader.split(" ")[1]);
        const [email] = decoded.split(":");
        return { email };
      } catch (err) {
        console.error("Failed to decode auth header:", err);
        return null;
      }
    }

    return null;
  };



  useEffect(() => {
    async function fetchUserDashboardData() {
      setLoading(true);
      setError("");

      try {
        const authHeader = localStorage.getItem("auth");
        if (!authHeader) {
          setError("Please log in to view dashboard");
          setLoading(false);
          return;
        }

        const decoded = atob(authHeader.split(" ")[1]);
        const [email] = decoded.split(":");

        const response = await fetch(`http://localhost:3000/dashboard/user/${email}`, {
          headers: { Authorization: authHeader }
        });

        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();

        // set state directly from API response
        setUser({ email: data.user.email });
        setEnrolledCourses(data.enrolledCourses);
        setUserProgress(data.progress);
        setRecentActivity(data.recentActivity);
        setAchievements(data.achievements);
        setStudyStreak(data.studyStreak);
        setWeeklyGoals(data.weeklyGoals);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDashboardData();
  }, []);


  // Calculate user progress based on courses and activity
  const calculateUserProgress = (orders, courses) => {
    const totalCourses = courses.length;
    const completedCourses = Math.floor(totalCourses * 0.3); // Mock completion
    const inProgressCourses = totalCourses - completedCourses;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      completionRate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
      totalStudyTime: 1240, // Mock minutes
      averageScore: 87,
      certificatesEarned: completedCourses
    };
  };

  const generateRecentActivity = (user, orders) => {
    return [
      { id: 1, type: 'course_start', title: 'Started "Advanced JavaScript"', time: '2 hours ago', icon: '📚' },
      { id: 2, type: 'assignment', title: 'Completed Chapter 5 Quiz', time: '1 day ago', icon: '✅' },
      { id: 3, type: 'purchase', title: 'Purchased React Masterclass', time: '2 days ago', icon: '🛒' },
      { id: 4, type: 'achievement', title: 'Earned "Quick Learner" badge', time: '3 days ago', icon: '🏆' },
      { id: 5, type: 'forum', title: 'Posted in Discussion Forum', time: '4 days ago', icon: '💬' }
    ];
  };

  const calculateAchievements = (progress, orders) => {
    const achievements = [];
    if (progress.completedCourses > 0) achievements.push({ name: 'First Course', icon: '🎓', earned: true });
    if (progress.totalStudyTime > 1000) achievements.push({ name: 'Study Master', icon: '📖', earned: true });
    if (progress.averageScore > 80) achievements.push({ name: 'High Achiever', icon: '⭐', earned: true });
    achievements.push({ name: 'Course Creator', icon: '🎨', earned: false });
    achievements.push({ name: 'Community Helper', icon: '🤝', earned: false });
    return achievements;
  };

  const calculateStudyStreak = (user) => {
    // Mock calculation - in real app, track daily study activity
    return 7;
  };

  const calculateWeeklyGoals = (progress) => {
    return {
      studyHours: { current: 8, target: 15 },
      coursesComplete: { current: 1, target: 2 },
      quizzesPassed: { current: 5, target: 8 }
    };
  };

  // Timer functions
  useEffect(() => {
    let interval;
    if (isTimeTrackerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimeTrackerRunning]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatMinutesToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) return (
    <div className="udb-center-screen udb-bg">
      <div className="udb-center-col">
        <div className="udb-spinner"></div>
        <div className="udb-loading-text">Loading your dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="udb-center-screen udb-bg">
      <div className="udb-error-box">
        <div className="udb-error-text">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="udb-btn udb-btn-green"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="udb-root">
      {/* Sidebar */}
      <div className="udb-sidebar">
        <div className="udb-sidebar-header">
          <div className="udb-sidebar-logo-row">
            <div className="udb-sidebar-logo"><BookOpen className="udb-sidebar-logo-icon" /></div>
            <span className="udb-sidebar-title">LearnHub</span>
          </div>
        </div>

        <nav className="udb-sidebar-nav">
          <div className="udb-sidebar-section">Learning</div>

          <a href="#" className="udb-sidebar-link udb-sidebar-link-active">
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </a>

          <a href="#" className="udb-sidebar-link">
            <BookOpen size={20} />
            <span>My Courses</span>
          </a>

          <a href="#" className="udb-sidebar-link">
            <Target size={20} />
            <span>Assignments</span>
          </a>

          <a href="#" className="udb-sidebar-link">
            <Award size={20} />
            <span>Achievements</span>
          </a>

          <a href="#" className="udb-sidebar-link">
            <Users size={20} />
            <span>Study Groups</span>
          </a>
        </nav>

        <div className="udb-sidebar-footer">
          <div className="udb-sidebar-section">Account</div>

          <a href="#" className="udb-sidebar-link">
            <Settings size={20} />
            <span>Settings</span>
          </a>

          <a href="#" className="udb-sidebar-link">
            <HelpCircle size={20} />
            <span>Help Center</span>
          </a>

          <a href="#" className="udb-sidebar-link">
            <LogOut size={20} />
            <span>Logout</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="udb-main">
        {/* Header */}
        <header className="udb-header">
          <div className="udb-header-row">
            <div>
              <h1 className="udb-header-title">
                Welcome back, {user?.email?.split('@')[0] || 'Student'}!
              </h1>
              <p className="udb-header-sub">Continue your learning journey</p>
            </div>

            <div className="udb-header-actions">
              <div className="udb-header-search-wrap">
                <Search className="udb-header-search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="udb-header-search"
                />
              </div>

              <button className="udb-header-bell">
                <Bell size={20} />
                <span className="udb-header-bell-badge">3</span>
              </button>

              <div className="udb-header-user-row">
                <div className="udb-header-user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="udb-header-user-name">{user?.email?.split('@')[0] || 'User'}</div>
                  <div className="udb-header-user-role">Student</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="udb-content">
          {/* Progress Overview Cards */}
          <div className="udb-cards-row">
            <div className="udb-card">
              <div className="udb-card-row">
                <h3 className="udb-card-title">Courses Enrolled</h3>
                <BookOpen size={20} className="udb-card-icon-green" />
              </div>
              <div className="udb-card-main">{userProgress.totalCourses}</div>
              <div className="udb-card-sub udb-card-sub-green">
                <TrendingUp size={14} className="udb-card-sub-icon" />
                {userProgress.inProgressCourses} in progress
              </div>
            </div>

            <div className="udb-card">
              <div className="udb-card-row">
                <h3 className="udb-card-title">Study Time</h3>
                <Clock size={20} className="udb-card-icon-blue" />
              </div>
              <div className="udb-card-main">{formatMinutesToHours(userProgress.totalStudyTime)}</div>
              <div className="udb-card-sub udb-card-sub-blue">
                <TrendingUp size={14} className="udb-card-sub-icon" />
                This week: 8h 30m
              </div>
            </div>

            <div className="udb-card">
              <div className="udb-card-row">
                <h3 className="udb-card-title">Average Score</h3>
                <Target size={20} className="udb-card-icon-purple" />
              </div>
              <div className="udb-card-main">{userProgress.averageScore}%</div>
              <div className="udb-card-sub udb-card-sub-purple">
                <TrendingUp size={14} className="udb-card-sub-icon" />
                +5% from last month
              </div>
            </div>

            <div className="udb-card udb-card-green">
              <div className="udb-card-row">
                <h3 className="udb-card-title udb-card-title-green">Study Streak</h3>
                <Award size={20} className="udb-card-icon-green-light" />
              </div>
              <div className="udb-card-main">{studyStreak} days</div>
              <div className="udb-card-sub udb-card-sub-green-light">
                <TrendingUp size={14} className="udb-card-sub-icon" />
                Keep it up!
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="udb-main-grid">
            {/* Learning Progress */}
            <div className="udb-main-grid-progress">
              <h3 className="udb-section-title">Course Progress</h3>
              <div className="udb-progress-list">
                {enrolledCourses.map((course, index) => {
                  const progress = Math.floor(Math.random() * 100);
                  return (
                    <div key={index} className="udb-progress-item">
                      <div className="udb-progress-icon">📚</div>
                      <div className="udb-progress-info">
                        <h4 className="udb-progress-title">{course.title || course.course_name}</h4>
                        <p className="udb-progress-author">{course.instructor || course.author}</p>
                        <div className="udb-progress-bar-row">
                          <div className="udb-progress-bar-bg">
                            <div
                              className="udb-progress-bar"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="udb-progress-bar-label">{progress}%</span>
                        </div>
                      </div>
                      <button className="udb-btn udb-btn-outline-green">
                        Continue
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Study Timer & Goals */}
            <div className="udb-main-grid-side">
              {/* Study Timer */}
              <div className="udb-timer-box">
                <h3 className="udb-section-title">Study Timer</h3>
                <div className="udb-timer-center">
                  <div className="udb-timer-time">{formatTime(timeElapsed)}</div>
                  <div className="udb-timer-btn-row">
                    <button
                      onClick={() => setIsTimeTrackerRunning(!isTimeTrackerRunning)}
                      className="udb-btn udb-btn-timer"
                    >
                      {isTimeTrackerRunning ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                      onClick={() => {
                        setIsTimeTrackerRunning(false);
                        setTimeElapsed(0);
                      }}
                      className="udb-btn udb-btn-timer-stop"
                    >
                      <Square size={20} />
                    </button>
                  </div>
                  {currentSession && (
                    <div className="udb-timer-session">
                      Session: {currentSession}
                    </div>
                  )}
                </div>
              </div>

              {/* Weekly Goals */}
              <div className="udb-goals-box">
                <h3 className="udb-section-title">Weekly Goals</h3>
                <div className="udb-goals-list">
                  {Object.entries(weeklyGoals).map(([goal, data]) => {
                    const percentage = Math.round((data.current / data.target) * 100);
                    return (
                      <div key={goal} className="udb-goal-item">
                        <div className="udb-goal-row">
                          <span className="udb-goal-label">
                            {goal.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="udb-goal-value">
                            {data.current}/{data.target}
                          </span>
                        </div>
                        <div className="udb-goal-bar-bg">
                          <div
                            className={`udb-goal-bar ${percentage >= 100 ? 'udb-goal-bar-green' :
                                percentage >= 70 ? 'udb-goal-bar-yellow' : 'udb-goal-bar-red'
                              }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="udb-main-grid-activity">
              <h3 className="udb-section-title">Recent Activity</h3>
              <div className="udb-activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="udb-activity-item">
                    <div className="udb-activity-icon">{activity.icon}</div>
                    <div className="udb-activity-info">
                      <p className="udb-activity-title">{activity.title}</p>
                      <p className="udb-activity-time">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="udb-main-grid-achievements">
              <h3 className="udb-section-title">Achievements</h3>
              <div className="udb-achievements-list">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`udb-achievement-item ${achievement.earned ? 'udb-achievement-earned' : 'udb-achievement-not-earned'}`}>
                    <div className={`udb-achievement-icon ${achievement.earned ? '' : 'udb-achievement-grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="udb-achievement-info">
                      <div className={`udb-achievement-name ${achievement.earned ? 'udb-achievement-name-earned' : 'udb-achievement-name-not-earned'}`}>
                        {achievement.name}
                      </div>
                      <div className={`udb-achievement-status ${achievement.earned ? 'udb-achievement-status-earned' : 'udb-achievement-status-not-earned'}`}>
                        {achievement.earned ? 'Earned' : 'Not earned yet'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;