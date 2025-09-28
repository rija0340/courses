import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/common/Navigation';
import RouteRenderer from './components/routing/RouteRenderer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <RouteRenderer />
      </div>
    </Router>
  );
}

export default App;
