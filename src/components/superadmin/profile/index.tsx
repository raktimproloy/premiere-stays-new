'use client';
import React, { useState } from 'react';
import { Edit2, Camera, User, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { CameraIcon, EditIcon } from '../../../../public/images/svg';
import Link from 'next/link';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Rifat',
    email: 'john@example.com',
    phone: '+1 (404) 123-4567',
    supportEmail: 'john@example.com',
    supportNumber: '+1 (404) 123-4567',
    address: '2345 Peachtree St, Atlanta'
  });
  const defaultImage = '/images/default_profile.png';
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-gray-50 flex items-start py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg p-8 gap-10">
            <div className="flex items-center gap-2 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Profile Details</h1>
                {/* <Edit2 size={20} className="text-blue-600" /> */}
                <Link href="/superadmin/settings">
                <EditIcon />
                
                </Link>
            </div>
          {/* Profile Image Section */}
          <div className=" flex-shrink-0">
            <div className="w-28 h-28 relative bg-gray-200 rounded-full flex items-center justify-center ">
              <img 
                src={defaultImage} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            <button className="absolute bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50">
              {/* <Camera size={16} className="text-gray-600" /> */}
              <CameraIcon />
            </button>
            </div>
          </div>

          {/* Details Table Section */}
          <div className="flex-1 mt-6">
            <table className="w-full text-left border-separate [border-spacing:0.5rem]">
              <tbody>
                <tr>
                  <th colSpan={2} className="text-xl font-semibold text-gray-900 pb-2 pt-0">Personal Info</th>
                </tr>
                <tr>
                  <td className=" text-gray-400 w-36">Full Name</td>
                  <td className="font-semibold text-gray-900">{profileData.fullName}</td>
                </tr>
                <tr>
                  <td className=" text-gray-400">Email Address</td>
                  <td className="ont-semibold text-gray-900">{profileData.email}</td>
                </tr>
                <tr>
                  <td className=" text-gray-400">Phone Number</td>
                  <td className="font-semibold text-gray-900">{profileData.phone}</td>
                </tr>
                <tr><td colSpan={2} className="h-4"></td></tr>
                <tr>
                  <th colSpan={2} className=" text-xl font-semibold text-gray-900 pb-2 pt-0">Support</th>
                </tr>
                <tr>
                  <td className=" text-gray-400">Support Email</td>
                  <td className=" font-semibold text-gray-900">{profileData.supportEmail}</td>
                </tr>
                <tr>
                  <td className=" text-gray-400">Support Number</td>
                  <td className="font-semibold text-gray-900">{profileData.supportNumber}</td>
                </tr>
                <tr>
                  <td className=" text-gray-400">Address</td>
                  <td className=" font-semibold text-gray-900">{profileData.address}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;