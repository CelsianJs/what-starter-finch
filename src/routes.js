import Shell from './components/Shell.jsx';
import Build from './pages/Build.jsx';
import Home from './pages/Home.jsx';
import LessonDetail from './pages/LessonDetail.jsx';
import Lessons from './pages/Lessons.jsx';
import NotFound from './pages/NotFound.jsx';
import Practice from './pages/Practice.jsx';

const withShell = (path, component) => ({ path, component, layout: Shell });

export const routes = [
  withShell('/', Home),
  withShell('/lessons', Lessons),
  withShell('/lessons/:slug', LessonDetail),
  withShell('/practice', Practice),
  withShell('/build', Build),
  withShell('/404', NotFound),
  withShell('/*', NotFound),
];
