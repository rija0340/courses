import React, { useContext, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import SimulationPanel from '../practice/components/SimulationPanel';
import WrittenSimulationPanel from '../practice/components/WrittenSimulationPanel';
import { isPracticeEnabled } from '../practice/config';
import useVocabDomain from '../hooks/useVocabDomain';

export default function PracticeSimulation() {
  const { domainId } = useParams();
  const [params] = useSearchParams();
  const { lang } = useContext(AppContext);
  const theme = params.get('theme') || '';
  const categoryId = params.get('category') || '';
  const initialModality = params.get('mode') === 'written' ? 'written' : 'oral';
  const [modality, setModality] = useState(initialModality);
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
        <>
          <div className="flex gap-2 mb-5">
            <ModalityChip active={modality === 'oral'} onClick={() => setModality('oral')}>
              Écoute
            </ModalityChip>
            <ModalityChip active={modality === 'written'} onClick={() => setModality('written')}>
              Écrit et oral
            </ModalityChip>
          </div>
          {modality === 'oral' ? (
            <SimulationPanel
              defaultTheme={theme}
              categories={categories}
              items={items}
              defaultCategoryId={categoryId}
            />
          ) : (
            <WrittenSimulationPanel
              defaultTheme={theme}
              categories={categories}
              items={items}
              defaultCategoryId={categoryId}
            />
          )}
        </>
      )}
    </div>
  );
}

function ModalityChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[13px] font-semibold px-4 py-2 rounded-full border transition-colors ${
        active
          ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
          : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]'
      }`}
    >
      {children}
    </button>
  );
}
