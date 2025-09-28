import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { routesConfig } from '../../routes';

const ProgrammationLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get programming section from routes
  const programmationSection = routesConfig.find(route => route.path === '/programmation');
  const menuItems = programmationSection?.children || [];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Programmation</h2>
              <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">Cours de développement</p>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto h-full">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Menu</h3>
          <ul className="space-y-1 sm:space-y-2">
            {menuItems.map((item, index) => {
              const itemPath = item.path === '' ? '/programmation' : `/programmation/${item.path}`;
              return (
                <li key={index}>
                  <Link
                    to={itemPath}
                    onClick={closeSidebar}
                    className={`block p-2 sm:p-3 rounded-lg transition-colors ${
                      location.pathname === itemPath
                        ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {item.icon && (
                        <span className="text-lg mr-2 sm:mr-3">{item.icon}</span>
                      )}
                      <span className="flex-1 text-sm sm:text-base">{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Programmation</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProgrammationLayout;
