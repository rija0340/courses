import courses from './courses.json';
import englishLessons from './english/index.json';
import englishSentence from './english/sentence-structure-basics.json';
import englishVerbToBe from './english/verb-to-be.json';
import jsLessons from './javascript/index.json';
import jsIntro from './javascript/intro.json';
import { getAllDomainMetas } from './vocabs';

const vocabDomainMetas = getAllDomainMetas();

const vocabDomains = {};
vocabDomainMetas.forEach(m => {
  vocabDomains[m.id] = m;
});

const dataRegistry = {
  courses,
  courseLessons: {
    english: englishLessons,
    javascript: jsLessons
  },
  lessons: {
    english: {
      'sentence-structure-basics': englishSentence,
      'verb-to-be': englishVerbToBe
    },
    javascript: {
      'intro': jsIntro
    }
  },
  vocabDomains
};

export default dataRegistry;
