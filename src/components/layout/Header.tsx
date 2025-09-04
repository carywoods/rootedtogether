import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
import { Sprout, User, MessageSquare, Map, BookOpen, Menu, X } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

export function Header() {
  const { user, profile, signOut } = useAuthContext();
  const location = useLocation();

  const navigation = [
    { name: 'Discover', href: '/discover', icon: Map },
    { name: 'Feed', href: '/feed', icon: BookOpen },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="w-8 h-8 text-green-500" />
              <span className="text-xl font-bold text-gray-900">Rooted Together</span>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Profile Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.display_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {profile?.display_name}
                        </span>
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            <Link
                              to="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Your Profile
                            </Link>
                            <button
                              onClick={() => signOut()}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Sign out
                            </button>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>

              {/* Mobile menu button */}
              <Popover className="md:hidden">
                {({ open }) => (
                  <>
                    <Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                      {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute top-16 inset-x-0 z-10 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                          {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                                  isActive(item.href)
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                              </Link>
                            );
                          })}
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center px-3 py-2">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                {profile?.avatar_url ? (
                                  <img
                                    src={profile.avatar_url}
                                    alt={profile.display_name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">
                                  {profile?.display_name}
                                </div>
                                <div className="text-sm text-gray-500">{profile?.experience_level}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => signOut()}
                              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                            >
                              Sign out
                            </button>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </>
          )}
        </div>
      </div>
    </header>
  );
}