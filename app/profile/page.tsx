'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAppDispatch, useAppSelector } from '@/libs/hook';
import {
  updateUserProfile,
  resetUpdateSuccess,
  getUserProfile,
} from '@/libs/feature/authSlice';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error, updateSuccess } = useAppSelector(
    (state) => state.auth
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    birthday: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        address: user.address || '',
        contactNumber: user.contact_number || '',
        birthday: user.birthday || '',
        bio: user.bio || '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Profile updated successfully!');
      dispatch(resetUpdateSuccess());
      setImagePreview(null);
      setImageFile(null);
      dispatch(getUserProfile());
    }
    if (error && !loading) {
      toast.error(error);
    }
  }, [updateSuccess, error, loading, dispatch]);

  // Auth protection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare update data
    const updateData: Partial<{
      firstName: string;
      lastName: string;
      address: string;
      contactNumber: string;
      birthday: string;
      bio: string;
      profileImage: File;
    }> = {};

    if (formData.firstName !== user?.first_name) {
      updateData.firstName = formData.firstName;
    }
    if (formData.lastName !== user?.last_name) {
      updateData.lastName = formData.lastName;
    }
    if (formData.address !== user?.address) {
      updateData.address = formData.address;
    }
    if (formData.contactNumber !== user?.contact_number) {
      updateData.contactNumber = formData.contactNumber;
    }
    if (formData.birthday !== user?.birthday) {
      updateData.birthday = formData.birthday;
    }
    if (formData.bio !== user?.bio) {
      updateData.bio = formData.bio;
    }
    if (imageFile) {
      updateData.profileImage = imageFile;
    }

    // Check if there are any changes
    if (Object.keys(updateData).length === 0) {
      toast.info('No changes to save');
      return;
    }

    await dispatch(updateUserProfile(updateData));
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        address: user.address || '',
        contactNumber: user.contact_number || '',
        birthday: user.birthday || '',
        bio: user.bio || '',
      });
    }
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Hidden on mobile/tablet, visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-5 bg-linear-to-br from-blue-50 to-indigo-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-5">
            <div className="mb-3">
              <h1 className="text-[22px] font-bold whitespace-nowrap">
                Account Information
              </h1>
              <div className="w-[161px] border-b-2 border-[#5272FF] mt-2"></div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Profile Image Upload */}
              <div
                className="mb-4 flex items-center gap-4 p-3 border border-[#A1A3AB]/63 rounded-2xl w-full md:w-[350px] h-[105px]"
                style={{ boxShadow: '0px 2px 1px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <div className="relative shrink-0">
                  <div className="w-22 h-22 flex items-center justify-center overflow-hidden rounded-full">
                    <Image
                      src={
                        imagePreview ||
                        (user?.profile_image
                          ? user.profile_image.startsWith('http')
                            ? user.profile_image
                            : `https://todo-app.pioneeralpha.com${
                                user.profile_image.startsWith('/') ? '' : '/'
                              }${user.profile_image}`
                          : '/img.png')
                      }
                      alt="Profile"
                      width={84}
                      height={84}
                      className="object-cover rounded-full w-[84px] h-[84px]"
                      unoptimized
                    />
                  </div>
                  <button type="button" className="absolute bottom-2 right-0">
                    <Image
                      src="/camera.png"
                      alt="Upload"
                      width={26}
                      height={26}
                      className="object-contain"
                      unoptimized
                    />
                  </button>
                </div>

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="flex justify-center items-center gap-2 w-full h-9 py-1 bg-[#5272FF] text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Image
                    src="/svg.png"
                    alt="Upload icon"
                    width={15}
                    height={15}
                    className="object-contain"
                    unoptimized
                  />
                  <span className="capitalize">Upload new photo</span>
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Form Fields */}
              <div
                className="p-4 border border-[#A1A3AB]/63 rounded-2xl"
                style={{ boxShadow: '0px 2px 1px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none bg-gray-100"
                    placeholder="Enter email"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Enter address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Birthday
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="w-full p-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Image
                        src="/birthday.png"
                        alt="Birthday"
                        width={15}
                        height={15}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#5272FF] text-white w-full md:w-[180px] h-9 text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full md:w-[180px] h-9 bg-[#8CA3CD] text-white text-sm rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
