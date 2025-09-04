import { useState } from 'react';
import { Sprout, Users, MessageSquare, BookOpen, MapPin, Heart } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';

export function Landing() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sprout className="w-8 h-8 text-green-500" />
              <span className="text-xl font-bold text-gray-900">Rooted Together</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Grow Your Garden,
            <br />
            <span className="text-green-600">Grow Your Community</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with fellow gardeners in your area. Share knowledge, trade plants, 
            and cultivate friendships that help your garden flourish.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Nearby Gardeners</h3>
                <p className="text-gray-600">Find fellow plant enthusiasts in your area based on location, growing zones, and shared interests.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Collaborate</h3>
                <p className="text-gray-600">Match with gardeners who share your goals, whether it's growing food, creating beauty, or supporting pollinators.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Knowledge</h3>
                <p className="text-gray-600">Exchange tips, ask questions, and learn from experienced gardeners in your community.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Feed</h3>
                <p className="text-gray-600">Get personalized gardening advice based on your growing zone, space type, and experience level.</p>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {authMode === 'signin' ? 'Welcome Back!' : 'Join Rooted Together'}
              </h2>
              <p className="text-gray-600">
                {authMode === 'signin' 
                  ? 'Sign in to continue growing with your community'
                  : 'Start your journey with fellow gardeners today'
                }
              </p>
            </div>
            
            <AuthForm mode={authMode} onModeChange={setAuthMode} />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Grow</h2>
            <p className="text-lg text-gray-600">From beginners to experts, we help every gardener thrive</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">For Every Level</h3>
              <p className="text-gray-600">Whether you're a Sprout or an Oak, find your gardening community</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Focus</h3>
              <p className="text-gray-600">Connect with gardeners who understand your climate and challenges</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">Built by gardeners, for gardeners, with love for growing together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}