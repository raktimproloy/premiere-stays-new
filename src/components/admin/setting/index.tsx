'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, Save, Loader2, Lock } from 'lucide-react';
import { CameraIcon, EditIcon } from '../../../../public/images/svg';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  profileImage?: string;
  guestId?: string;
  role: string;
  registerType?: 'manual' | 'google';
}

const Setting: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    phone: '',
    dob: ''
  });

  const [passwordInfo, setPasswordInfo] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setPersonalInfo({
          fullName: data.user.fullName || '',
          phone: data.user.phone || '',
          dob: data.user.dob || ''
        });
      } else {
        setError(data.error || 'Failed to fetch user data');
      }
    } catch (error) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUser(prev => prev ? { ...prev, profileImage: data.imageUrl } : null);
        setSuccess('Profile image updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalInfo),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(prev => prev ? { ...prev, ...personalInfo } : null);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    if (passwordInfo.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      setSavingPassword(true);
      setError(null);

      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordInfo),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordInfo({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('Password updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (error) {
      setError('Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No user data found</p>
          <button 
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isGoogleUser = user.registerType === 'google';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-xl font-medium text-gray-800">Profile Settings</h1>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fadeIn">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fadeIn">
            {error}
          </div>
        )}

        {/* Profile Picture */}
        <div className="flex-shrink-0 mb-6">
          <div className="w-28 h-28 relative bg-gray-200 rounded-full flex items-center justify-center">
            <img 
              src={user.profileImage || "/images/profile2.jpg"} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50 disabled:opacity-50"
            >
              {uploadingImage ? (
                <Loader2 className="animate-spin" size={12} />
              ) : (
                <CameraIcon />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-800">Personal Information</h2>
            </div>

            <form onSubmit={handlePersonalInfoSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={personalInfo.dob}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-800">Change Password</h2>
            </div>

            {isGoogleUser ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Google Account</h3>
                <p className="text-gray-600 mb-4">
                  You registered with Google, so you cannot change your password here.
                </p>
                <p className="text-sm text-gray-500">
                  To change your password, please visit your Google Account settings.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Old Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••"
                      value={passwordInfo.oldPassword}
                      onChange={(e) => setPasswordInfo(prev => ({ ...prev, oldPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••"
                      value={passwordInfo.newPassword}
                      onChange={(e) => setPasswordInfo(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••"
                      value={passwordInfo.confirmPassword}
                      onChange={(e) => setPasswordInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Changing Password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;