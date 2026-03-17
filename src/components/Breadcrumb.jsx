import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-[#5f6368] font-medium mb-8 overflow-x-auto pb-2 -mb-2 scrollbar-none">
      <Link 
        to="/" 
        className="hover:text-[#1a73e8] transition-colors flex items-center gap-1 shrink-0 p-1 -ml-1 rounded-md hover:bg-[#1a73e8]/5"
        title="Home"
      >
        <Home size={18} />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="mx-1 text-[#dadce0] shrink-0" />
          {item.path ? (
            <Link 
              to={item.path} 
              className="hover:text-[#1a73e8] transition-colors truncate max-w-[200px] shrink-0 p-1 rounded-md hover:bg-[#1a73e8]/5"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#202124] truncate max-w-[250px] shrink-0 p-1">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
