// Pages
import HomePage from './pages/HomePage';
import ProgrammationPage from './pages/ProgrammationPage';

// Layout Components
import ProgrammationLayout from './components/layouts/ProgrammationLayout';
import JavaScriptLayout from './components/layouts/JavaScriptLayout';

// Course Components
import JavaScriptCourse from './courses/javascript/JavaScriptCourse';
import EnglishCourse from './courses/english/EnglishCourse';
import GuitarCourse from './courses/guitar/GuitarCourse';

// JavaScript Lessons
import Lesson1 from './courses/javascript/Lesson1';
import Lesson2 from './courses/javascript/Lesson2';
import Lesson3 from './courses/javascript/Lesson3';
import Lesson4 from './courses/javascript/Lesson4';
import Lesson5 from './courses/javascript/Lesson5';
import Lesson6 from './courses/javascript/Lesson6';
import Lesson7 from './courses/javascript/Lesson7';
import Lesson8 from './courses/javascript/Lesson8';
import Lesson9 from './courses/javascript/Lesson9';

// English Lessons
import EnglishLesson1 from './courses/english/lessons/Lesson1';
import EnglishLesson2 from './courses/english/lessons/Lesson2';

// Coming Soon Component
import ComingSoon from './components/common/ComingSoon';

// Routes Configuration
export const routesConfig = [
  {
    path: '/',
    name: 'Accueil',
    component: HomePage,
    showInNav: false
  },
  {
    path: '/programmation',
    name: 'Programmation',
    icon: '💻',
    component: ProgrammationLayout,
    showInNav: true,
    children: [
      {
        path: '',
        name: 'Accueil Programmation',
        component: ProgrammationPage,
        showInNav: true
      },
      {
        path: 'javascript',
        name: 'JavaScript',
        icon: '⚡',
        component: JavaScriptLayout,
        showInNav: true,
        children: [
          {
            path: '',
            name: 'Aperçu du Cours',
            component: JavaScriptCourse,
            showInNav: true
          },
          {
            path: 'lesson1',
            name: 'Introduction à JavaScript',
            component: Lesson1,
            showInNav: true,
            lessonId: 1
          },
          {
            path: 'lesson2',
            name: 'Fonctions et Portée',
            component: Lesson2,
            showInNav: true,
            lessonId: 2
          },
          {
            path: 'lesson3',
            name: 'Tableaux et Objets',
            component: Lesson3,
            showInNav: true,
            lessonId: 3
          },
          {
            path: 'lesson4',
            name: 'Manipulation du DOM',
            component: Lesson4,
            showInNav: true,
            lessonId: 4
          },
          {
            path: 'lesson5',
            name: 'Événements et Programmation Asynchrone',
            component: Lesson5,
            showInNav: true,
            lessonId: 5
          },
          {
            path: 'lesson6',
            name: 'Gestion des événements (écouteurs, propagation, objets d\'événement)',
            component: Lesson6,
            showInNav: true,
            lessonId: 6
          },
          {
            path: 'lesson7',
            name: 'Asynchronisme (callbacks, Promises, async/await)',
            component: Lesson7,
            showInNav: true,
            lessonId: 7
          },
          {
            path: 'lesson8',
            name: 'API Fetch (requêtes HTTP, gestion des réponses)',
            component: Lesson8,
            showInNav: true,
            lessonId: 8
          },
          {
            path: 'lesson9',
            name: 'Manipulation du DOM avancée (création dynamique, fragments, performance)',
            component: Lesson9,
            showInNav: true,
            lessonId: 9
          },
          
        ]
      }
    ]
  },
  {
    path: '/anglais',
    name: 'Anglais',
    icon: '📚',
    component: EnglishCourse,
    showInNav: true,
    children: [
      {
        path: '',
        name: 'Accueil Anglais',
        component: EnglishCourse,
        showInNav: true
      },
      {
        path: 'lesson1',
        name: 'The Alphabet & Basic Sounds',
        component: EnglishLesson1,
        showInNav: true,
        lessonId: 1
      },
      {
        path: 'lesson2',
        name: 'Parts of Speech (Ny Sokajin-teny)',
        component: EnglishLesson2,
        showInNav: true,
        lessonId: 2
      }
    ]
  },
  // {
  //   path: '/guitare',
  //   name: 'Guitare',
  //   icon: '🎸',
  //   component: GuitarCourse,
  //   showInNav: true,
  //   children: [
  //     {
  //       path: '',
  //       name: 'Accueil Guitare',
  //       component: GuitarCourse,
  //       showInNav: true
  //     }
  //     // Future Guitar lessons can be added here
  //   ]
  // }
];

// Helper function to get navigation items
export const getNavigationItems = () => {
  const navItems = [];

  const processRoute = (route, parentPath = '') => {
    const fullPath = parentPath + route.path;

    if (route.showInNav) {
      navItems.push({
        id: route.path.replace('/', '') || 'home',
        name: route.name,
        icon: route.icon,
        path: fullPath
      });
    }

    if (route.children) {
      route.children.forEach(child => {
        processRoute(child, fullPath + '/');
      });
    }
  };

  routesConfig.forEach(route => processRoute(route));
  return navItems;
};

// Helper function to get course lessons
export const getCourseLessons = (coursePath) => {
  const findCourse = (routes, targetPath) => {
    for (const route of routes) {
      const fullPath = route.path === '/' ? '' : route.path;
      if (fullPath === targetPath && route.children) {
        return route.children.filter(child => child.lessonId);
      }
      if (route.children) {
        const found = findCourse(route.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  const lessons = findCourse(routesConfig, coursePath);
  return lessons ? lessons.map(lesson => ({
    id: lesson.lessonId,
    title: lesson.name,
    path: `${coursePath}/${lesson.path}`,
    completed: false
  })) : [];
};
