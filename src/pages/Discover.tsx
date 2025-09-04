import { useState, useEffect } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { MapPin, User, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Discover() {
  const { profile } = useAuthContext();
  const [nearbyUsers, setNearbyUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    experience_level: '',
    gardening_goals: '',
    available_space: '',
  });

  useEffect(() => {
    fetchNearbyUsers();
  }, [profile, filter]);

  const fetchNearbyUsers = async () => {
    if (!profile) return;

    let query = supabase
      .from('profiles')
      .select('*')
      .neq('id', profile.id)
      .limit(20);

    // Apply filters
    if (filter.experience_level) {
      query = query.eq('experience_level', filter.experience_level);
    }
    if (filter.gardening_goals) {
      query = query.contains('gardening_goals', [filter.gardening_goals]);
    }
    if (filter.available_space) {
      query = query.contains('available_space', [filter.available_space]);
    }

    try {
      const { data, error } = await query;
      if (error) throw error;
      setNearbyUsers(data || []);
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (addresseeId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: profile.id,
          addressee_id: addresseeId,
          status: 'pending',
        });

      if (error) throw error;
      // TODO: Show success message
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding gardeners near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Fellow Gardeners</h1>
          <p className="text-gray-600">Connect with like-minded growers in your area</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filter.experience_level}
              onChange={(e) => setFilter({...filter, experience_level: e.target.value})}
              className="rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">All experience levels</option>
              <option value="Sprout">Sprout</option>
              <option value="Seedling">Seedling</option>
              <option value="Sapling">Sapling</option>
              <option value="Branch">Branch</option>
              <option value="Oak">Oak</option>
            </select>

            <select
              value={filter.gardening_goals}
              onChange={(e) => setFilter({...filter, gardening_goals: e.target.value})}
              className="rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">All goals</option>
              <option value="Food">Food</option>
              <option value="Beauty">Beauty</option>
              <option value="Pollinators">Pollinators</option>
              <option value="Education">Education</option>
              <option value="Therapy">Therapy</option>
            </select>

            <select
              value={filter.available_space}
              onChange={(e) => setFilter({...filter, available_space: e.target.value})}
              className="rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">All spaces</option>
              <option value="Balcony">Balcony</option>
              <option value="Yard">Yard</option>
              <option value="Community Plot">Community Plot</option>
              <option value="Indoor">Indoor</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{user.display_name}</h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.location_text || 'Location not shared'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-green-600">{user.experience_level}</span>
                    {user.growing_zone && (
                      <span className="text-gray-600"> • Zone {user.growing_zone}</span>
                    )}
                  </div>
                </div>

                {user.gardening_goals.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Gardening Goals</p>
                    <div className="flex flex-wrap gap-1">
                      {user.gardening_goals.slice(0, 3).map((goal, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {goal}
                        </span>
                      ))}
                      {user.gardening_goals.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{user.gardening_goals.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {user.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{user.bio}</p>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => sendConnectionRequest(user.id)}
                    className="flex-1"
                  >
                    Connect
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {nearbyUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gardeners found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new members!</p>
          </div>
        )}
      </div>
    </div>
  );
}