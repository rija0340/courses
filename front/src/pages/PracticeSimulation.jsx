import React, { useContext, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import SimulationPanel from '../practice/components/SimulationPanel';
import WrittenSimulationPanel from '../practice/components/WrittenSimulationPanel';
import QuizPracticePanel from '../practice/components/QuizPracticePanel';
import { isPracticeEnabled } from '../practice/config';
import useVocabDomain from '../hooks/useVocabDomain';
import { simulationUi } from '../practice/data/simulationUiCopy';

function initialModalityFromParams(params) {
  const mode = params.get('mode');
  if (mode === 'written') return 'written';
  if (mode === 'quiz') return 'quiz';
  return 'oral';
}

export default function PracticeSimulation() {
  const { domainId } = useParams();
  const [params] = useSearchParams();
  const { lang } = useContext(AppContext);
  const ui = useMemo(() => simulationUi(lang), [lang]);
  const theme = params.get('theme') || '';
  const categoryId = params.get('category') || '';
  const [modality, setModality] = useState(() => initialModalityFromParams(params));
  const { domain, items, loading } = useVocabDomain(domainId);

  if (!isPracticeEnabled()) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-[#5f6368]">{ui.practiceDisabled}</p>
        <Link to={domainId ? `/vocabs/${domainId}` : '/'} className="text-[#1a73e8] text-sm mt-2 inline-block">
          {ui.back}
        </Link>
      </div>
    );
  }

  const crumbs = [
    { label: ui.home, path: '/' },
    domainId ? { label: ui.vocabs, path: `/vocabs/${domainId}` } : null,
    { label: ui.simulation }
  ].filter(Boolean);

  const categories = domain?.organization?.categories || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumb items={crumbs} />
      <div className="mb-4">
        <Link
          to={domainId ? `/vocabs/${domainId}` : '/'}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124]"
        >
          <ArrowLeft className="w-4 h-4" />
          {ui.back}
        </Link>
      </div>
      {loading ? (
        <p className="text-[14px] text-[#5f6368]">{ui.loading}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-5">
            <ModalityChip active={modality === 'oral'} onClick={() => setModality('oral')}>
              {ui.listening}
            </ModalityChip>
            <ModalityChip active={modality === 'written'} onClick={() => setModality('written')}>
              {ui.writtenOral}
            </ModalityChip>
            <ModalityChip active={modality === 'quiz'} onClick={() => setModality('quiz')}>
              {ui.quiz}
            </ModalityChip>
          </div>
          {modality === 'oral' && (
            <SimulationPanel
              defaultTheme={theme}
              categories={categories}
              items={items}
              defaultCategoryId={categoryId}
            />
          )}
          {modality === 'written' && (
            <WrittenSimulationPanel
              defaultTheme={theme}
              categories={categories}
              items={items}
              defaultCategoryId={categoryId}
            />
          )}
          {modality === 'quiz' && (
            <QuizPracticePanel
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
          : 'bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#5f6368] text-[#5f6368] dark:text-[#e8eaed] hover:bg-[#f8f9fa]'
      }`}
    >
      {children}
    </button>
  );
}
