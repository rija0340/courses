import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import dataRegistry from './data/registry';
import Home from './pages/Home';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';
import VocabsView from './pages/VocabsView';
import VocabsAdmin from './pages/VocabsAdmin';
import Navigation from './components/Navigation';

const AppContext = React.createContext();

const App = () => {
  const [lang, setLang] = useState('fr');

  return (
    <AppContext.Provider value={{ lang, setLang, dataRegistry }}>
      <Router>
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#3c4043] pb-24">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:courseId" element={<CourseView />} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
            <Route path="/vocabs/:domainId" element={<VocabsView />} />
            <Route path="/vocabs/:domainId/admin" element={<VocabsAdmin />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export { App as default, AppContext };
