import React from 'react';
import { Target, Award, AlertCircle, Lightbulb, MessageCircle, Sparkles } from 'lucide-react';
import { localize } from '../../data/coursePackSchema';

function StyledText({ item, styles }) {
  const style = styles?.[item.highlight] || {};
  return <span style={style}>{item.text}</span>;
}

function SectionTitle({ icon: Icon, color, children }) {
  return (
    <h2 className="text-xl sm:text-2xl font-normal text-[#202124] dark:text-[#e8eaed] mb-4 sm:mb-5 flex items-center gap-3">
      {Icon && (
        <div className={color || 'text-[#1a73e8]'}>
          <Icon size={22} />
        </div>
      )}
      {children}
    </h2>
  );
}

export default function LessonSections({ sections = [], styles = {}, lang }) {
  const renderSection = (section, index) => {
    switch (section.type) {
      case 'core-concept':
        return (
          <div key={index} className="mb-8 sm:mb-10">
            <SectionTitle icon={Target}>{localize(section.title, lang)}</SectionTitle>
            <div className="bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 sm:p-7 shadow-sm">
              {(section.content || []).map((block, bIdx) => {
                if (block.items) {
                  return (
                    <p key={bIdx} className="text-[16px] sm:text-[17px] mb-5 leading-relaxed text-[#3c4043] dark:text-[#dadce0]">
                      {localize(block.text, lang)}
                      <span className="inline-flex flex-wrap gap-1 ml-1">
                        {block.items.map((item, iIdx) => (
                          <StyledText key={iIdx} item={item} styles={styles} />
                        ))}
                      </span>
                    </p>
                  );
                }
                if (block.type === 'definition') {
                  const term = localize(block.term, lang, typeof block.term === 'string' ? block.term : '');
                  return (
                    <div
                      key={bIdx}
                      className="mb-3 p-4 sm:p-5 bg-[#f8f9fa] dark:bg-[#303134] rounded-xl border border-[#dadce0] dark:border-[#5f6368]"
                    >
                      <span
                        className="font-medium text-[13px] tracking-wide mb-1 block"
                        style={{ color: styles[block.highlight]?.color || '#3c4043' }}
                      >
                        {term}
                      </span>
                      <p className="text-[#202124] dark:text-[#e8eaed] text-base">
                        {localize(block.definitions, lang)}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );

      case 'rules':
        return (
          <div key={index} className="mb-8 sm:mb-10">
            <SectionTitle icon={Award} color="text-[#f29900]">
              {localize(section.title, lang)}
            </SectionTitle>
            <div className="bg-[#fff8e1] dark:bg-[#3c3010] border border-[#fde293] dark:border-[#8d6e00] rounded-2xl p-5 sm:p-7">
              <div className="text-[16px] sm:text-[17px] leading-relaxed text-[#3c4043] dark:text-[#fde293] mb-4">
                {(section.content || []).map((item, iIdx) => (
                  <StyledText key={iIdx} item={item} styles={styles} />
                ))}
              </div>
              {section.notes && (
                <div className="flex items-start gap-3 text-sm text-[#8d6e00] dark:text-[#fde293] bg-[#fffcf0] dark:bg-[#2a2410] p-4 rounded-xl border border-[#fde293]/40">
                  <AlertCircle size={18} className="text-[#f29900] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="font-medium tracking-wide text-[12px] block mb-0.5">Note</span>
                    {localize(section.notes, lang)}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div key={index} className="mb-8 sm:mb-10 -mx-2 sm:mx-0">
            <figure className="overflow-hidden rounded-none sm:rounded-2xl">
              <img
                src={section.src}
                alt={localize(section.caption, lang, localize(section.title, lang, 'Lesson image'))}
                className="w-full max-h-[420px] object-cover"
                loading="lazy"
              />
              {(section.caption || section.title) && (
                <figcaption className="px-4 sm:px-0 pt-3 text-sm text-[#5f6368] dark:text-[#9aa0a6]">
                  {localize(section.caption || section.title, lang)}
                </figcaption>
              )}
            </figure>
          </div>
        );

      case 'gallery':
        return (
          <div key={index} className="mb-8 sm:mb-10">
            {section.title && (
              <SectionTitle icon={Sparkles}>{localize(section.title, lang)}</SectionTitle>
            )}
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
              {(section.images || []).map((img, i) => (
                <figure
                  key={i}
                  className="snap-start shrink-0 w-[72%] sm:w-[40%] rounded-2xl overflow-hidden border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124]"
                >
                  <img
                    src={img.src}
                    alt={localize(img.caption, lang, `Gallery ${i + 1}`)}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                  {img.caption && (
                    <figcaption className="p-3 text-sm text-[#5f6368] dark:text-[#9aa0a6]">
                      {localize(img.caption, lang)}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        );

      case 'dialogue':
        return (
          <div key={index} className="mb-8 sm:mb-10">
            <SectionTitle icon={MessageCircle} color="text-[#7c4dff]">
              {localize(section.title, lang, lang === 'en' ? 'Dialogue' : 'Dialogue')}
            </SectionTitle>
            <div className="space-y-3">
              {(section.lines || []).map((line, i) => {
                const isA = (line.speaker || 'A').toUpperCase() === 'A';
                return (
                  <div key={i} className={`flex ${isA ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                        isA
                          ? 'bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-bl-md'
                          : 'bg-[#e8f0fe] dark:bg-[#1a3a5c] text-[#174ea6] dark:text-[#aecbfa] rounded-br-md'
                      }`}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider opacity-60 block mb-1">
                        {line.speaker || (isA ? 'A' : 'B')}
                      </span>
                      {localize(line.text, lang)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'tip':
        return (
          <div key={index} className="mb-8 sm:mb-10">
            <div className="flex gap-3 p-4 sm:p-5 rounded-2xl bg-[#e6f4ea] dark:bg-[#0d2818] border border-[#ceead6] dark:border-[#1e8e3e]/40">
              <Lightbulb size={22} className="text-[#1e8e3e] shrink-0 mt-0.5" />
              <div>
                {section.title && (
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#137333] dark:text-[#81c995] mb-1">
                    {localize(section.title, lang)}
                  </p>
                )}
                <p className="text-[15px] sm:text-[16px] text-[#137333] dark:text-[#ceead6] leading-relaxed">
                  {localize(section.text, lang)}
                </p>
              </div>
            </div>
          </div>
        );

      case 'example':
        return (
          <div key={index} className="mb-8 sm:mb-10">
            {section.title && (
              <SectionTitle icon={Sparkles} color="text-[#1a73e8]">
                {localize(section.title, lang)}
              </SectionTitle>
            )}
            <div className="rounded-2xl border border-[#dadce0] dark:border-[#3c4043] overflow-hidden">
              <div className="bg-[#1a73e8] text-white px-5 py-3 text-[13px] font-medium tracking-wide">
                {lang === 'mg' ? 'Ohatra' : lang === 'en' ? 'Example' : 'Exemple'}
              </div>
              <div className="bg-white dark:bg-[#202124] px-5 py-4">
                <p className="text-lg text-[#202124] dark:text-[#e8eaed] font-medium mb-2">
                  {localize(section.text, lang)}
                </p>
                {section.translation && (
                  <p className="text-[15px] text-[#5f6368] dark:text-[#9aa0a6]">
                    {localize(section.translation, lang)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <>{(sections || []).map(renderSection)}</>;
}
