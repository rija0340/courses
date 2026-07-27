import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-lh-secondary font-medium mb-8 overflow-x-auto pb-2 -mb-2 scrollbar-none">
      <Link
        to="/"
        className="hover:text-lh-accent transition-colors flex items-center gap-1 shrink-0 p-1 -ml-1 rounded-md hover:bg-lh-accent-soft"
        title="Home"
      >
        <Home size={18} />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="mx-1 text-lh-border shrink-0" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-lh-accent transition-colors truncate max-w-[200px] shrink-0 p-1 rounded-md hover:bg-lh-accent-soft text-left"
            >
              {item.label}
            </button>
          ) : item.path ? (
            <Link
              to={item.path}
              className="hover:text-lh-accent transition-colors truncate max-w-[200px] shrink-0 p-1 rounded-md hover:bg-lh-accent-soft"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-lh-text truncate max-w-[250px] shrink-0 p-1">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
