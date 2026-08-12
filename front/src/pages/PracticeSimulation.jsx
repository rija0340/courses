import React, { useContext, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Ear, Keyboard, Brain } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import SimulationPanel from '../practice/components/SimulationPanel';
import WrittenSimulationPanel from '../practice/components/WrittenSimulationPanel';
import QuizPracticePanel from '../practice/components/QuizPracticePanel';
import { isPracticeEnabled } from '../practice/config';
import useVocabDomain from '../hooks/useVocabDomain';
import { simulationUi } from '../practice/data/simulationUiCopy';
import {
  PracticePageShell,
  SegmentedControl,
} from '../practice/components/practiceUi';

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
  const scenarioKind = domainId === 'medi-vocabs' ? 'medical' : 'general';
  const ui = useMemo(() => simulationUi(lang, scenarioKind), [lang, scenarioKind]);
  const theme = params.get('theme') || '';
  const categoryId = params.get('category') || '';
  const [modality, setModality] = useState(() => initialModalityFromParams(params));
  const { domain, items, loading } = useVocabDomain(domainId);

  if (!isPracticeEnabled()) {
    return (
      <PracticePageShell>
        <p className="text-[#64748b]">{ui.practiceDisabled}</p>
        <Link to={domainId ? `/vocabs/${domainId}` : '/'} className="text-teal-700 text-sm mt-2 inline-block font-semibold">
          {ui.back}
        </Link>
      </PracticePageShell>
    );
  }

  const crumbs = [
    { label: ui.home, path: '/' },
    domainId ? { label: ui.vocabs, path: `/vocabs/${domainId}` } : null,
    { label: ui.simulation },
  ].filter(Boolean);

  const categories = domain?.organization?.categories || [];
  const domainTitle = domain?.meta?.title || domainId;

  return (
    <PracticePageShell>
      <Breadcrumb items={crumbs} />
      <div className="mb-6 mt-2">
        <Link
          to={domainId ? `/vocabs/${domainId}` : '/'}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {ui.back}
        </Link>
        <h1 className="mt-3 text-[28px] sm:text-[32px] font-semibold tracking-tight text-[#0f172a]">
          {ui.simulation}
        </h1>
        <p className="text-[14px] text-[#64748b] mt-1">
          {domainTitle}
          <span className="text-[#cbd5e1]"> · </span>
          {scenarioKind === 'medical' ? 'Profil médical' : 'Profil général'}
        </p>
      </div>

      {loading ? (
        <p className="text-[14px] text-[#64748b]">{ui.loading}</p>
      ) : (
        <>
          <div className="mb-5 overflow-x-auto">
            <SegmentedControl
              className="w-full sm:w-auto min-w-[280px]"
              value={modality}
              onChange={setModality}
              options={[
                { id: 'oral', label: ui.listening, icon: <Ear className="w-3.5 h-3.5" /> },
                { id: 'written', label: ui.writtenOral, icon: <Keyboard className="w-3.5 h-3.5" /> },
                { id: 'quiz', label: ui.quiz, icon: <Brain className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          {modality === 'oral' && (
            <SimulationPanel
              defaultTheme={theme}
              categories={categories}
              items={items}
              defaultCategoryId={categoryId}
              domainId={domainId}
            />
          )}
          {modality === 'written' && (
            <WrittenSimulationPanel
              defaultTheme={theme}
              categories={categories}
              items={items}
              defaultCategoryId={categoryId}
              domainId={domainId}
            />
          )}
          {modality === 'quiz' && (
            <QuizPracticePanel
              defaultTheme={theme}
              categories={categories}
              items={items}
              defaultCategoryId={categoryId}
              domainId={domainId}
            />
          )}
        </>
      )}
    </PracticePageShell>
  );
}
