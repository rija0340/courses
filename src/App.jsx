import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import dataRegistry from './data/registry';
import Home from './pages/Home';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';
import VocabsView from './pages/VocabsView';
import VocabsGuide from './pages/VocabsGuide';
import VocabsAdmin from './pages/VocabsAdmin';
import VocabsAdminGuide from './pages/VocabsAdminGuide';
import VocabsGlobalAdmin from './pages/VocabsGlobalAdmin';
import PracticeSimulation from './pages/PracticeSimulation';
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
            <Route path="/admin/vocabs" element={<VocabsGlobalAdmin />} />
            <Route path="/vocabs/:domainId/guide" element={<VocabsGuide />} />
            <Route path="/vocabs/:domainId/admin/guide" element={<VocabsAdminGuide />} />
            <Route path="/vocabs/:domainId/admin" element={<VocabsAdmin />} />
            <Route path="/vocabs/:domainId/practice/simulation" element={<PracticeSimulation />} />
            <Route path="/practice/simulation" element={<PracticeSimulation />} />
            <Route path="/vocabs/:domainId/*" element={<VocabsView />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export { App as default, AppContext };
