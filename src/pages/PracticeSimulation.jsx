import React, { useContext } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import SimulationPanel from '../practice/components/SimulationPanel';
import { isPracticeEnabled } from '../practice/config';
import useVocabDomain from '../hooks/useVocabDomain';

export default function PracticeSimulation() {
  const { domainId } = useParams();
  const [params] = useSearchParams();
  const { lang } = useContext(AppContext);
  const theme = params.get('theme') || '';
  const categoryId = params.get('category') || '';
  const { domain, items, loading } = useVocabDomain(domainId);

  if (!isPracticeEnabled()) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-[#5f6368]">Practice is disabled.</p>
        <Link to={domainId ? `/vocabs/${domainId}` : '/'} className="text-[#1a73e8] text-sm mt-2 inline-block">
          Back
        </Link>
      </div>
    );
  }

  const crumbs = [
    { label: lang === 'fr' ? 'Accueil' : 'Home', path: '/' },
    domainId ? { label: 'Vocabs', path: `/vocabs/${domainId}` } : null,
    { label: 'Simulation' }
  ].filter(Boolean);

  const categories = domain?.organization?.categories || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumb items={crumbs} />
      <div className="mb-4">
        <Link
          to={domainId ? `/vocabs/${domainId}` : '/'}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#5f6368] hover:text-[#202124]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
      {loading ? (
        <p className="text-[14px] text-[#5f6368]">Loading vocabulary…</p>
      ) : (
        <SimulationPanel
          defaultTheme={theme}
          categories={categories}
          items={items}
          defaultCategoryId={categoryId}
        />
      )}
    </div>
  );
}
