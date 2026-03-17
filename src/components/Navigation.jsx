import React, { useContext } from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';

const Navigation = () => {
  const { lang, setLang } = useContext(AppContext);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#dadce0] shadow-sm">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white">
            <BookOpen size={18} />
          </div>
          <span className="font-medium text-xl text-[#3c4043]">LearnHub</span>
        </Link>
        
        <div className="flex bg-[#f1f3f4] p-[2px] rounded-full">
          {[
            { id: 'mg', label: 'MG' },
            { id: 'fr', label: 'FR' },
            { id: 'en', label: 'EN' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === l.id 
                ? 'bg-white text-[#1a73e8] shadow-sm' 
                : 'text-[#5f6368] hover:bg-black/5'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
