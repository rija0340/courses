import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Layers, Upload, Image as ImageIcon,
  Globe, Link2, FolderTree
} from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import { VOCAB_ADMIN_GUIDE, getAdminGuideText } from '../data/vocabs/vocabAdminGuideContent';
import useVocabDomain from '../hooks/useVocabDomain';

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

export default function VocabsAdminGuide() {
  const { domainId } = useParams();
  const { lang } = useContext(AppContext);
  const { domain, loading, error } = useVocabDomain(domainId);

  const t = (obj) => getAdminGuideText(obj, lang);
  const title = t(domain?.meta?.title) || domainId;

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
          { label: title, path: `/vocabs/${domainId}` },
          { label: 'Admin', path: `/vocabs/${domainId}/admin` },
          { label: t(VOCAB_ADMIN_GUIDE.pageTitle) }
        ]}
      />

      <div className="mt-4 mb-8">
        <Link
          to={`/vocabs/${domainId}/admin`}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1a73e8] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(VOCAB_ADMIN_GUIDE.backToAdmin)}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-normal text-[#202124] mb-3">
          {t(VOCAB_ADMIN_GUIDE.pageTitle)}
        </h1>
        <p className="text-lg text-[#5f6368] leading-relaxed">{t(VOCAB_ADMIN_GUIDE.pageIntro)}</p>
        {error && (
          <p className="mt-3 text-[13px] text-red-600">Erreur : {error}</p>
        )}
      </div>

      <div className="space-y-4">
        <GuideSection
          icon={FolderTree}
          title={t(VOCAB_ADMIN_GUIDE.categoriesHub.title)}
          body={t(VOCAB_ADMIN_GUIDE.categoriesHub.body)}
        />
        <GuideSection
          icon={Layers}
          title={t(VOCAB_ADMIN_GUIDE.tabsOrg.title)}
          body={t(VOCAB_ADMIN_GUIDE.tabsOrg.body)}
        />
        <GuideSection
          icon={Upload}
          title={t(VOCAB_ADMIN_GUIDE.import.title)}
          body={t(VOCAB_ADMIN_GUIDE.import.body)}
        />
        <GuideSection
          icon={ImageIcon}
          title={t(VOCAB_ADMIN_GUIDE.images.title)}
          body={t(VOCAB_ADMIN_GUIDE.images.body)}
        />
        <GuideSection
          icon={Link2}
          title={t(VOCAB_ADMIN_GUIDE.urlSharing.title)}
          body={t(VOCAB_ADMIN_GUIDE.urlSharing.body)}
        />
        <GuideSection
          icon={Globe}
          title={t(VOCAB_ADMIN_GUIDE.globalAdmin.title)}
          body={t(VOCAB_ADMIN_GUIDE.globalAdmin.body)}
        >
          <Link
            to="/admin/vocabs"
            className="inline-flex mt-3 h-10 px-4 items-center rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
          >
            {t(VOCAB_ADMIN_GUIDE.globalAdmin.linkLabel)}
          </Link>
        </GuideSection>
      </div>

      <div className="mt-8 text-center">
        <Link
          to={`/vocabs/${domainId}/admin`}
          className="inline-flex h-11 px-6 items-center rounded-xl bg-[#1a73e8] text-white text-[14px] font-semibold hover:bg-[#1b66c9]"
        >
          {t(VOCAB_ADMIN_GUIDE.backToAdmin)}
        </Link>
      </div>
    </div>
  );
}
