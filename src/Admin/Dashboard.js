import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Voice Artist YouTube Dashboard
        </h1>

        {/* Grid for responsive card layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Subscribers Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Subscribers</h2>
            <p className="text-2xl font-bold text-blue-600">12.5K</p>
            <p className="text-gray-500 text-sm sm:text-base mt-2">+1.2K this month</p>
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base">
              View Subscriber Trends
            </button>
          </div>

          {/* Total Videos Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Total Videos</h2>
            <p className="text-2xl font-bold text-blue-600">48</p>
            <p className="text-gray-500 text-sm sm:text-base mt-2">3 uploaded this week</p>
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base">
              View All Videos
            </button>
          </div>

          {/* Likes Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Total Likes</h2>
            <p className="text-2xl font-bold text-blue-600">85.3K</p>
            <p className="text-gray-500 text-sm sm:text-base mt-2">+4.5K this month</p>
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base">
              View Like Analytics
            </button>
          </div>

          {/* Recent Voiceovers Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Voiceovers</h2>
            <ul className="space-y-3">
              <li className="text-gray-600 text-sm sm:text-base">
                <span className="font-medium">Podcast Intro</span> - Uploaded 2 days ago
              </li>
              <li className="text-gray-600 text-sm sm:text-base">
                <span className="font-medium">Audiobook Sample</span> - Uploaded 5 days ago
              </li>
            </ul>
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base">
              View All
            </button>
          </div>

          {/* Collaborations Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Collaborations</h2>
            <ul className="space-y-3">
              <li className="text-gray-600 text-sm sm:text-base">
                <span className="font-medium">Studio X</span> - Animation Project
              </li>
              <li className="text-gray-600 text-sm sm:text-base">
                <span className="font-medium">Podcast Network</span> - Guest Episode
              </li>
            </ul>
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base">
              Explore Opportunities
            </button>
          </div>

          {/* Community Engagement Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Community Engagement</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-medium">Recent Comments:</span> 45
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-medium">Live Stream Attendance:</span> 320
            </p>
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base">
              Engage Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;