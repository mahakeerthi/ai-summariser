import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/storage';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('ai_summarizer_current_user');
    navigate('/login');
  };

  const getNavLinkClass = (isActive: boolean) => {
    return `inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
      isActive
        ? 'border-black text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;
  };

  const getMobileNavLinkClass = (isActive: boolean) => {
    return `block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
      isActive
        ? 'border-black bg-gray-50 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/dashboard" className="text-2xl font-bold text-black">
                  AI Summarizer
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                  end
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/dashboard/upload"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Upload
                </NavLink>
                <NavLink
                  to="/dashboard/summaries"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Summaries
                </NavLink>
              </div>
            </div>

            {/* Profile dropdown */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {currentUser.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                </div>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      {currentUser.email}
                    </div>
                    <hr />
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isProfileDropdownOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => getMobileNavLinkClass(isActive)}
                end
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/dashboard/upload"
                className={({ isActive }) => getMobileNavLinkClass(isActive)}
              >
                Upload
              </NavLink>
              <NavLink
                to="/dashboard/summaries"
                className={({ isActive }) => getMobileNavLinkClass(isActive)}
              >
                Summaries
              </NavLink>
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="px-4 py-2">
                <div className="text-base font-medium text-gray-800">{currentUser.email}</div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

DashboardLayout.displayName = 'DashboardLayout';
export default DashboardLayout; 