import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Eye, Image as ImageIcon, Search, FolderTree, LayoutGrid } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import { VOCAB_GUIDE, getGuideText } from '../data/vocabs/vocabGuideContent';
import useVocabDomain from '../hooks/useVocabDomain';

const MODE_ICONS = {
  lecture: BookOpen,
  revision: Eye,
  image: ImageIcon
};

function GuideSection({ icon: Icon, title, body, children }) {
  return (
    <section className="bg-white border border-[#dadce0] rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[#1a73e8]" />
          </div>
        )}
        <div>
          <h2 className="text-[18px] font-medium text-[#202124]">{title}</h2>
          <p className="text-[14px] text-[#5f6368] leading-relaxed mt-1">{body}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function VocabsGuide() {
  const { domainId } = useParams();
  const { lang } = useContext(AppContext);
  const { domain, loading, error } = useVocabDomain(domainId);

  const t = (obj) => getGuideText(obj, lang);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-20 flex justify-center">
        <div className="w-9 h-9 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-20">
      <Breadcrumb
        items={[
          { label: t(domain?.meta?.title) || domainId, path: `/vocabs/${domainId}` },
          { label: t(VOCAB_GUIDE.pageTitle) }
        ]}
      />

      <div className="mt-4 mb-8">
        <Link
          to={`/vocabs/${domainId}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1a73e8] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(VOCAB_GUIDE.backToVocabs)}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-normal text-[#202124] mb-3">
          {t(VOCAB_GUIDE.pageTitle)}
        </h1>
        <p className="text-lg text-[#5f6368] leading-relaxed">{t(VOCAB_GUIDE.pageIntro)}</p>
        {error && (
          <p className="mt-3 text-[13px] text-red-600">Erreur chargement domaine : {error}</p>
        )}
      </div>

      <div className="space-y-4">
        <GuideSection
          icon={LayoutGrid}
          title={t(VOCAB_GUIDE.modes.title)}
          body={t(VOCAB_GUIDE.modes.body)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {['lecture', 'revision', 'image'].map(key => {
              const ModeIcon = MODE_ICONS[key];
              const block = VOCAB_GUIDE.modes[key];
              return (
                <div key={key} className="rounded-xl bg-[#f8f9fa] border border-[#dadce0]/60 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ModeIcon className="w-4 h-4 text-[#1a73e8]" />
                    <h3 className="text-[14px] font-semibold text-[#202124]">{t(block.title)}</h3>
                  </div>
                  <p className="text-[13px] text-[#5f6368] leading-snug">{t(block.body)}</p>
                </div>
              );
            })}
          </div>
        </GuideSection>

        <GuideSection
          icon={Eye}
          title={t(VOCAB_GUIDE.revisionLang.title)}
          body={t(VOCAB_GUIDE.revisionLang.body)}
        />

        <GuideSection
          icon={LayoutGrid}
          title={t(VOCAB_GUIDE.tabs.title)}
          body={t(VOCAB_GUIDE.tabs.body)}
        />

        <GuideSection
          icon={FolderTree}
          title={t(VOCAB_GUIDE.categories.title)}
          body={t(VOCAB_GUIDE.categories.body)}
        />

        <GuideSection
          icon={Search}
          title={t(VOCAB_GUIDE.search.title)}
          body={t(VOCAB_GUIDE.search.body)}
        />

        <GuideSection
          icon={ImageIcon}
          title={t(VOCAB_GUIDE.images.title)}
          body={t(VOCAB_GUIDE.images.body)}
        />
      </div>

      <div className="mt-8 text-center">
        <Link
          to={`/vocabs/${domainId}`}
          className="inline-flex h-11 px-6 items-center rounded-xl bg-[#1a73e8] text-white text-[14px] font-semibold hover:bg-[#1b66c9]"
        >
          {t(VOCAB_GUIDE.backToVocabs)}
        </Link>
      </div>
    </div>
  );
}
