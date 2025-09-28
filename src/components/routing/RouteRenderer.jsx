import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routesConfig } from '../../routes';

const RouteRenderer = () => {
  const renderRoute = (route, parentPath = '') => {
    const fullPath = route.path === '/' ? '/' : parentPath + route.path;
    const Component = route.component;
    
    if (route.children && route.children.length > 0) {
      // Parent route with children
      return (
        <Route key={fullPath} path={route.path} element={<Component />}>
          {route.children.map(child => renderRoute(child, fullPath === '/' ? '' : fullPath + '/'))}
        </Route>
      );
    } else {
      // Leaf route
      return (
        <Route 
          key={fullPath} 
          path={route.path} 
          element={<Component />} 
        />
      );
    }
  };

  return (
    <Routes>
      {routesConfig.map(route => renderRoute(route))}
    </Routes>
  );
};

export default RouteRenderer;
