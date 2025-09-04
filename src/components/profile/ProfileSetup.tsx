import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const EXPERIENCE_LEVELS = ['Sprout', 'Seedling', 'Sapling', 'Branch', 'Oak'];
const SPACE_OPTIONS = ['Balcony', 'Yard', 'Community Plot', 'Indoor', 'Other'];
const SUN_EXPOSURE_OPTIONS = ['Full Sun', 'Partial Sun', 'Shade'];
const GARDENING_GOALS = ['Food', 'Beauty', 'Pollinators', 'Education', 'Therapy'];

export function ProfileSetup() {
  const { user, refetchProfile } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    location_text: '',
    growing_zone: '',
    experience_level: 'Sprout',
    available_space: [] as string[],
    sun_exposure: [] as string[],
    gardening_goals: [] as string[],
    preferred_plants: '',
    bio: '',
  });

  const handleCheckboxChange = (field: 'available_space' | 'sun_exposure' | 'gardening_goals', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
        });

      if (error) throw error;

      await refetchProfile();
      navigate('/discover');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Rooted Together! 🌱</h1>
            <p className="mt-2 text-gray-600">Let's set up your gardening profile to connect you with fellow growers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Username"
                placeholder="e.g., GreenThumb2024"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                helperText="This will be your unique identifier"
              />
              
              <Input
                label="Display Name"
                placeholder="e.g., Sarah Johnson"
                value={formData.display_name}
                onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                required
                helperText="How you'd like to be known"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Location"
                placeholder="e.g., Portland, OR"
                value={formData.location_text}
                onChange={(e) => setFormData({...formData, location_text: e.target.value})}
                helperText="General area (for finding nearby gardeners)"
              />
              
              <Input
                label="Growing Zone"
                placeholder="e.g., Zone 9b"
                value={formData.growing_zone}
                onChange={(e) => setFormData({...formData, growing_zone: e.target.value})}
                helperText="USDA Hardiness Zone"
              />
            </div>

            <Select
              label="Experience Level"
              value={formData.experience_level}
              onChange={(e) => setFormData({...formData, experience_level: e.target.value as any})}
            >
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Space (select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SPACE_OPTIONS.map(space => (
                  <label key={space} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.available_space.includes(space)}
                      onChange={() => handleCheckboxChange('available_space', space)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{space}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sun Exposure (select all that apply)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {SUN_EXPOSURE_OPTIONS.map(exposure => (
                  <label key={exposure} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.sun_exposure.includes(exposure)}
                      onChange={() => handleCheckboxChange('sun_exposure', exposure)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{exposure}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gardening Goals (select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GARDENING_GOALS.map(goal => (
                  <label key={goal} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.gardening_goals.includes(goal)}
                      onChange={() => handleCheckboxChange('gardening_goals', goal)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Preferred Plants (Optional)"
              placeholder="e.g., Tomatoes, Roses, Native wildflowers..."
              value={formData.preferred_plants}
              onChange={(e) => setFormData({...formData, preferred_plants: e.target.value})}
              helperText="Help others find gardeners with similar interests"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio (Optional)
              </label>
              <textarea
                placeholder="Tell us about your gardening journey..."
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              size="lg"
            >
              Complete Profile & Start Growing! 🌿
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}