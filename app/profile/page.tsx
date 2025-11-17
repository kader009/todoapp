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
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6">Account Information</h1>
            
            <form>
              {/* Profile Image Upload */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400 text-4xl">👤</span>
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    📷
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  name="birthday"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                
                <button
                  type="button"
                  className="bg-gray-400 text-white px-8 py-3 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
