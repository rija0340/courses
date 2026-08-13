import { useCallback, useEffect, useState } from 'react';
import courses from '../data/courses.json';
import { getStaticPresentation } from '../data/vocabs';
import vocabStorage from '../services/vocabStorage';
import { pickLangText } from '../data/vocabs/vocabItemStructure';

function mergeCourseCard(domainEntry, lang) {
  const staticCourse = courses.find(c => c.id === domainEntry.id && c.type === 'vocabs');
  const staticPres = getStaticPresentation(domainEntry.id);
  const meta = domainEntry.meta || {};

  const title = meta.title || staticCourse?.title || staticPres?.title || { fr: domainEntry.id };
  const description = meta.description || staticCourse?.description || staticPres?.description || { fr: '' };
  const icon = meta.icon || staticCourse?.icon || staticPres?.icon || 'BookOpen';
  const color = meta.color || staticCourse?.color || staticPres?.color || '#1a73e8';

  return {
    id: domainEntry.id,
    type: 'vocabs',
    title,
    description,
    icon,
    color,
    itemCount: domainEntry.itemCount ?? 0,
    label: pickLangText(title, lang) || domainEntry.id
  };
}

export default function useVocabDomainsList(lang = 'fr') {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (options = {}) => {
    const { soft = false } = options;
    if (!soft) setLoading(true);
    setError(null);
    try {
      const list = await vocabStorage.listDomains();
      const fromDb = list.map(d => mergeCourseCard(d, lang));

      const dbIds = new Set(fromDb.map(d => d.id));
      const jsonVocabs = courses
        .filter(c => c.type === 'vocabs' && !dbIds.has(c.id))
        .map(c => ({
          ...c,
          itemCount: 0,
          label: pickLangText(c.title, lang)
        }));

      setDomains([...fromDb, ...jsonVocabs].sort((a, b) =>
        (a.label || a.id).localeCompare(b.label || b.id)
      ));
    } catch (err) {
      setError(err.message || 'Erreur chargement domaines');
      const fallback = courses
        .filter(c => c.type === 'vocabs')
        .map(c => ({ ...c, itemCount: 0, label: pickLangText(c.title, lang) }));
      setDomains(fallback);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { domains, loading, error, refresh };
}
