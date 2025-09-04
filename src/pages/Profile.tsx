import { useAuthContext } from '../contexts/AuthContext';
import { MapPin, User, Edit } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Profile() {
  const { profile } = useAuthContext();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 -mt-12">
              <div className="w-24 h-24 bg-white rounded-full p-2 mb-4 sm:mb-0">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{profile.display_name}</h1>
                <p className="text-gray-600">@{profile.username}</p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{profile.location_text || 'Location not set'}</span>
                  {profile.growing_zone && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Zone {profile.growing_zone}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-700">
                {profile.bio || 'No bio added yet. Share your gardening story!'}
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience Level</h2>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">{profile.experience_level}</span>
                <div className="text-sm text-gray-600">
                  <p>Growing and learning every day!</p>
                </div>
              </div>
            </div>

            {/* Preferred Plants */}
            {profile.preferred_plants && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Preferred Plants</h2>
                <p className="text-gray-700">{profile.preferred_plants}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Growing Conditions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Growing Conditions</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Space</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.available_space.length > 0 ? (
                      profile.available_space.map((space, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {space}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Not specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sun Exposure</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.sun_exposure.length > 0 ? (
                      profile.sun_exposure.map((exposure, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          {exposure}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Not specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gardening Goals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gardening Goals</h3>
              <div className="flex flex-wrap gap-2">
                {profile.gardening_goals.length > 0 ? (
                  profile.gardening_goals.map((goal, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {goal}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No goals set</span>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Since</h3>
              <p className="text-gray-700">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}