import mediVocabsSeed from './seeds/medi-vocabs';
import techVocabsSeed from './seeds/tech-vocabs';

export {
  VOCAB_DOMAIN_VERSION,
  buildImportTemplate,
  buildExportPayload,
  validateAndNormalizeImport,
  getSchemaFieldDocs,
  templateToPrettyJson,
} from './vocabDomainSchema';

export {
  STRUCTURE_FIELD_CATALOG,
  STRUCTURE_LANG_OPTIONS,
  resolveItemStructure,
  resolveRootCategory,
  isRootCategory,
  normalizeItemStructure,
  emptyItemStructure,
} from './vocabItemStructure';

const domainRegistry = {
  'medi-vocabs': {
    seed: mediVocabsSeed,
    meta: {
      icon: 'HeartPulse',
      color: '#2563EB'
    }
  },
  'tech-vocabs': {
    seed: techVocabsSeed,
    meta: {
      icon: 'Cpu',
      color: '#10B981'
    }
  }
};

export function getDomainMeta(domainId) {
  const entry = domainRegistry[domainId];
  if (!entry) return null;
  return { id: domainId, ...entry.meta, ...entry.seed.meta };
}

export function getDomainSeed(domainId) {
  return domainRegistry[domainId]?.seed || null;
}

export function getAllDomainMetas() {
  return Object.entries(domainRegistry).map(([id, entry]) => ({
    id, ...entry.meta, ...entry.seed.meta
  }));
}

/** Static icon/color fallback for seeded domains (before DB meta is loaded). */
export function getStaticPresentation(domainId) {
  const entry = domainRegistry[domainId];
  if (!entry) return null;
  return { ...entry.meta, title: entry.seed?.meta?.title, description: entry.seed?.meta?.description };
}

export default domainRegistry;
