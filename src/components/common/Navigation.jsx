import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routesConfig } from '../../routes';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Get main navigation items (only top-level items with children)
  const mainNavItems = routesConfig.filter(route =>
    route.showInNav && route.children && route.children.length > 0
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const isActiveSection = (route) => {
    const basePath = route.path === '/' ? '/' : route.path;
    return location.pathname.startsWith(basePath);
  };

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
            onClick={closeMenu}
          >
            Plateforme d'Apprentissage
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 lg:space-x-6">
            {mainNavItems.map(item => (
              <div key={item.path} className="relative group">
                <button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                    isActiveSection(item)
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {item.children.map((child, index) => {
                      const childPath = child.path === '' ? item.path : `${item.path}/${child.path}`;
                      return (
                        <Link
                          key={index}
                          to={childPath}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            location.pathname === childPath
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            {child.icon && (
                              <span className="text-base mr-3">{child.icon}</span>
                            )}
                            <span>{child.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            aria-expanded="false"
          >
            <span className="sr-only">Ouvrir le menu principal</span>
            {/* Hamburger icon */}
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* Close icon */}
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-slate-700">
            {mainNavItems.map(item => (
              <div key={item.path}>
                <button
                  onClick={() => toggleDropdown(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActiveSection(item)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${openDropdown === item.path ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Dropdown */}
                {openDropdown === item.path && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.children.map((child, index) => {
                      const childPath = child.path === '' ? item.path : `${item.path}/${child.path}`;
                      return (
                        <Link
                          key={index}
                          to={childPath}
                          onClick={closeMenu}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            location.pathname === childPath
                              ? 'bg-blue-500 text-white'
                              : 'text-slate-300 hover:bg-slate-600 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center">
                            {child.icon && (
                              <span className="text-base mr-3">{child.icon}</span>
                            )}
                            <span>{child.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
