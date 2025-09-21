import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Settings, Bell, Shield, Save, X, Edit3, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';

// Theme Context for dark mode management
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const Base_API = process.env.BASEAPI

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// API Service Functions - Mock implementations that simulate real API calls
const apiService = {
  // Fetch current user data
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const users = [
      {
        id: 0,
        profile: {
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
          role: 'Admin',
          joinDate: '2022-01-15'
        },
        preferences: {
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          language: 'en',
          timezone: 'America/New_York'
        },
        security: {
          twoFactorAuth: true,
          lastPasswordChange: '2023-10-01'
        }
      },
      {
        id: 1,
        profile: {
          name: 'Bob Smith',
          email: 'bob.smith@example.com',
          profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
          role: 'User',
          joinDate: '2021-06-10'
        },
        preferences: {
          notifications: {
            email: false,
            sms: true,
            push: false
          },
          language: 'es',
          timezone: 'Europe/Madrid'
        },
        security: {
          twoFactorAuth: false,
          lastPasswordChange: '2023-08-20'
        }
      },
      {
        id: 2,
        profile: {
          name: 'Charlie Lee',
          email: 'charlie.lee@example.com',
          profilePicture: 'https://randomuser.me/api/portraits/men/65.jpg',
          role: 'Moderator',
          joinDate: '2020-11-05'
        },
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: false
          },
          language: 'fr',
          timezone: 'Europe/Paris'
        },
        security: {
          twoFactorAuth: true,
          lastPasswordChange: '2023-09-15'
        }
      }
    ];

    // Simulate selecting a random user or you could use stored user ID
    const savedUserId = localStorage.getItem('currentUserId');
    const userId = savedUserId ? parseInt(savedUserId) : Math.floor(Math.random() * users.length);
    localStorage.setItem('currentUserId', userId.toString());
    
    return users[userId];
  },

  // Fetch login activity for current user
  getLoginActivity: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate dynamic login activity based on user
    const locations = [
      ['New York, USA', 'Chrome on Windows'],
      ['London, UK', 'Safari on MacOS'],
      ['Tokyo, Japan', 'Firefox on Linux'],
      ['Sydney, Australia', 'Edge on Windows'],
      ['Berlin, Germany', 'Chrome on Android'],
      ['San Francisco, USA', 'Safari on iPhone'],
      ['Toronto, Canada', 'Chrome on MacOS'],
      ['Amsterdam, Netherlands', 'Firefox on Windows']
    ];

    const activity = [];
    for (let i = 0; i < 5; i++) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      
      activity.push({
        id: i + 1,
        location: randomLocation[0],
        device: randomLocation[1],
        timestamp: date.toLocaleString(),
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      });
    }

    return activity;
  },

  // Save user settings
  saveUserSettings: async (userId, settings) => {
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API call
    
    // In a real app, this would make a PUT/PATCH request to your API
    console.log(`Saving settings for user ${userId}:`, settings);
    
    // Simulate success/failure
    if (Math.random() > 0.1) { // 90% success rate
      return { success: true, message: 'Settings saved successfully' };
    } else {
      throw new Error('Failed to save settings. Please try again.');
    }
  },

  // Update profile
  updateProfile: async (userId, profileData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Updating profile for user ${userId}:`, profileData);
    
    if (Math.random() > 0.05) { // 95% success rate
      return { success: true, data: profileData };
    } else {
      throw new Error('Failed to update profile. Please try again.');
    }
  },

  // Delete account
  deleteAccount: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`Deleting account for user ${userId}`);
    
    // Simulate account deletion
    localStorage.removeItem('currentUserId');
    return { success: true, message: 'Account deleted successfully' };
  }
};

// Loading Spinner Component
const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

// Error Display Component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <X className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);

// Profile Section Component
const ProfileSection = ({ userData, onUpdate, isEditing, onEdit, onSave, onCancel, isUpdating, error }) => {
  const [editData, setEditData] = useState({
    name: userData?.profile?.name || '',
    email: userData?.profile?.email || ''
  });

  useEffect(() => {
    if (userData?.profile) {
      setEditData({
        name: userData.profile.name,
        email: userData.profile.email
      });
    }
  }, [userData]);

  const handleSave = async () => {
    await onSave(editData);
  };

  if (!userData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <User className="mr-2 h-5 w-5" />
          User Profile
        </h3>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Edit3 className="mr-1 h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {error && <ErrorDisplay error={error} />}

      <div className="flex items-start space-x-4">
        <img
          src={userData.profile.profilePicture}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
        />
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isUpdating}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 flex items-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  onClick={onCancel}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-sm font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{userData.profile.name}</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{userData.profile.email}</p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>Role: {userData.profile.role}</p>
                <p>Member since: {new Date(userData.profile.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Account Settings Component
const AccountSettings = ({ onDeleteAccount, isDeleting }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
        <Settings className="mr-2 h-5 w-5" />
        Account Settings
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onDeleteAccount}
            disabled={isDeleting}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </div>
      </div>
    </div>
  );
};

// Preferences Section Component
const PreferencesSection = ({ preferences, onChange }) => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!preferences) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
        <Bell className="mr-2 h-5 w-5" />
        Preferences
      </h3>

      <div className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dark Mode
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable dark theme across the application
            </p>
          </div>
          <button
            onClick={handleDarkModeToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Notification Preferences */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Notification Preferences
          </label>
          <div className="space-y-3">
            {Object.entries(preferences.notifications).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange('notifications', key, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {key} notifications
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => onChange('language', null, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timezone
          </label>
          <select
            value={preferences.timezone || 'America/New_York'}
            onChange={(e) => onChange('timezone', null, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
            <option value="Europe/Madrid">Madrid (CET)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = ({ security, loginActivity, onChange, isLoadingActivity }) => {
  if (!security) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
        <Shield className="mr-2 h-5 w-5" />
        Security Settings
      </h3>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Two-Factor Authentication
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last password change: {new Date(security.lastPasswordChange).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => onChange('twoFactorAuth', null, !security.twoFactorAuth)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Recent Login Activity */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recent Login Activity
          </h4>
          {isLoadingActivity ? (
            <LoadingSpinner size="sm" text="Loading activity..." />
          ) : loginActivity && loginActivity.length > 0 ? (
            <div className="space-y-3">
              {loginActivity.map((login) => (
                <div
                  key={login.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {login.location}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {login.device} • IP: {login.ipAddress}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {login.timestamp}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Message Component
const SuccessMessage = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 z-50 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-sm">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="h-5 w-5 bg-green-400 rounded-full flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-3 flex-shrink-0 text-green-400 hover:text-green-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

// Main Settings Page Component
const SettingsPage = () => {
  // Core data states
  const [userData, setUserData] = useState(null);
  const [loginActivity, setLoginActivity] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  // Loading and UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Modal and message states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');

  // Initialize data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Load user data and login activity
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const user = await apiService.getCurrentUser();
      setUserData(user);
      setOriginalData(JSON.parse(JSON.stringify(user))); // Deep copy for comparison
      
      // Load login activity separately to avoid blocking the main UI
      setIsLoadingActivity(true);
      try {
        const activity = await apiService.getLoginActivity(user.id);
        setLoginActivity(activity);
      } catch (activityError) {
        console.error('Failed to load login activity:', activityError);
        // Don't show error for activity failure, just log it
      } finally {
        setIsLoadingActivity(false);
      }
      
    } catch (err) {
      setError('Failed to load user data. Please try again.');
      console.error('Error loading user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generic change handler for preferences and security settings
  const handleChange = (section, field, value) => {
    setUserData(prevData => {
      const newData = { ...prevData };
      
      if (section === 'notifications') {
        newData.preferences.notifications[field] = value;
      } else if (section === 'language' || section === 'timezone') {
        newData.preferences[section] = value;
      } else if (section === 'twoFactorAuth') {
        newData.security.twoFactorAuth = value;
      }
      
      return newData;
    });
  };

  // Profile editing handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileError('');
  };

  const handleSaveProfile = async (profileData) => {
    try {
      setIsUpdatingProfile(true);
      setProfileError('');
      
      const response = await apiService.updateProfile(userData.id, profileData);
      
      // Update user data with new profile info
      setUserData(prevData => ({
        ...prevData,
        profile: {
          ...prevData.profile,
          ...profileData
        }
      }));
      
      // Update original data to reflect saved state
      setOriginalData(prevData => ({
        ...prevData,
        profile: {
          ...prevData.profile,
          ...profileData
        }
      }));
      
      setIsEditingProfile(false);
      showSuccessMessage('Profile updated successfully!');
      
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    setProfileError('');
  };

  // Delete account handler
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await apiService.deleteAccount(userData.id);
      
      // In a real app, you would redirect to login page
      showSuccessMessage('Account deleted successfully');
      setShowDeleteModal(false);
      
      // Clear user data
      setUserData(null);
      setOriginalData(null);
      
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  // Save all changes
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      const settingsToSave = {
        preferences: userData.preferences,
        security: userData.security
      };
      
      const response = await apiService.saveUserSettings(userData.id, settingsToSave);
      
      // Update original data to reflect saved state
      setOriginalData(JSON.parse(JSON.stringify(userData)));
      
      showSuccessMessage(response.message || 'Settings saved successfully!');
      
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel all changes
  const handleCancelChanges = () => {
    if (originalData) {
      setUserData(JSON.parse(JSON.stringify(originalData)));
    }
    setIsEditingProfile(false);
    setError('');
    setProfileError('');
  };

  // Success message handler
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000); // Auto hide after 5 seconds
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!userData || !originalData) return false;
    
    return (
      JSON.stringify(userData.preferences) !== JSON.stringify(originalData.preferences) ||
      JSON.stringify(userData.security) !== JSON.stringify(originalData.security)
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your settings..." />
      </div>
    );
  }

  // Error state
  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ErrorDisplay error={error} onRetry={loadUserData} />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">No user data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <SuccessMessage 
            message={successMessage} 
            onClose={() => setSuccessMessage('')} 
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Welcome back, <span className="font-medium">{userData.profile.name}</span>
          </div>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorDisplay error={error} onRetry={() => setError('')} />
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Section */}
          <ProfileSection
            userData={userData}
            isEditing={isEditingProfile}
            onEdit={handleEditProfile}
            onSave={handleSaveProfile}
            onCancel={handleCancelProfileEdit}
            isUpdating={isUpdatingProfile}
            error={profileError}
          />

          {/* Account Settings */}
          <AccountSettings
            onDeleteAccount={handleDeleteAccount}
            isDeleting={isDeleting}
          />

          {/* Preferences */}
          <PreferencesSection
            preferences={userData.preferences}
            onChange={handleChange}
          />

          {/* Security Settings */}
          <SecuritySettings
            security={userData.security}
            loginActivity={loginActivity}
            onChange={handleChange}
            isLoadingActivity={isLoadingActivity}
          />
        </div>

        {/* Save/Cancel Buttons */}
        {hasUnsavedChanges() && (
          <div className="mt-8 flex justify-end space-x-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={handleCancelChanges}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 font-medium"
              disabled={isSaving}
            >
              Cancel Changes
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteAccount}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <ThemeProvider>
      <div className="App">
        <SettingsPage />
      </div>
    </ThemeProvider>
  );
};

export default App;