import Image from 'next/image';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const page = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area - Sidebar er pore start hobe */}
      <div className="flex-1 flex flex-col">
        {/* Header - Sidebar er width er por theke shuru */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-8 bg-linear-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h1 className="text-[24px] font-bold whitespace-nowrap">
                Account Information
              </h1>
              <div className="w-[161px] border-b-2 border-[#5272FF] mt-2"></div>
            </div>

            <form>
              {/* Profile Image Upload */}
              <div
                className="mb-8 flex items-center gap-6 p-4 border border-[#A1A3AB]/63 rounded-2xl w-[365px] h-[124px]"
                style={{ boxShadow: '0px 2px 1px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <div className="relative">
                  <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/img.png"
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button type="button" className="absolute bottom-6 right-0">
                    <Image
                      src="/camera.png"
                      alt="Upload"
                      width={32}
                      height={32}
                      className="object-contain"
                      unoptimized
                    />
                  </button>
                </div>

                {/* Upload Button */}
                <button
                  type="button"
                  className="flex justify-center items-center gap-2 w-[197px] h-10 py-2 bg-[#5272FF] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Image
                    src="/svg.png"
                    alt="Upload icon"
                    width={16}
                    height={16}
                    className="object-contain"
                    unoptimized
                  />
                  <span>Upload new photo</span>
                </button>
              </div>

              {/* Form Fields */}
              <div
                className="p-4 border border-[#A1A3AB]/63 rounded-2xl"
                style={{ boxShadow: '0px 2px 1px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder="Enter email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Enter address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birthday
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="birthday"
                      placeholder=""
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Image
                        src="/birthday.png"
                        alt="Birthday"
                        width={16}
                        height={16}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    className="bg-[#5272FF] text-white w-[200px] h-10 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="w-[200px] h-10 bg-[#8CA3CD] text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center"
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

export default page;
