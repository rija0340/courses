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
            name: 'Variables et Types de Données',
            component: () => ComingSoon({ lesson: 'Variables et Types de Données' }),
            showInNav: true,
            lessonId: 2
          },
          {
            path: 'lesson3',
            name: 'Fonctions',
            component: () => ComingSoon({ lesson: 'Fonctions' }),
            showInNav: true,
            lessonId: 3
          },
          {
            path: 'lesson4',
            name: 'Tableaux et Objets',
            component: () => ComingSoon({ lesson: 'Tableaux et Objets' }),
            showInNav: true,
            lessonId: 4
          },
          {
            path: 'lesson5',
            name: 'Manipulation du DOM',
            component: () => ComingSoon({ lesson: 'Manipulation du DOM' }),
            showInNav: true,
            lessonId: 5
          }
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
      }
      // Future English lessons can be added here
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
