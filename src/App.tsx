import { useCallback, useEffect, useRef, useState } from 'react';
import LandingPage from './pages/landing/LandingPage';
import HomeJourney from './pages/home/HomeJourney';
import WorkPage from './pages/work/WorkPage';
import ProfilePage from './pages/profile/ProfilePage';
import SiteNav, { type PortfolioPage } from './components/navigation/SiteNav';
import TransitionOverlay from './components/navigation/TransitionOverlay';
import ScrollProgress from './components/scroll/ScrollProgress';
import SiteFooter from './components/SiteFooter';

import './portfolio.css';
// import { scrollToTop } from './pages/lib/scroll';

// // navigate(), same-page branch (line 26):
// scrollToTop();

// // revealTargetPage() (line 39):
// scrollToTop(true);

// // handleLandingNavigation() (line 65):
// if (href === '#home') scrollToTop();

type Page = PortfolioPage;

function App() {
  const [page, setPage] = useState<Page>('home');
  const [transitioning, setTransitioning] = useState(false);
  const [workStartIndex, setWorkStartIndex] = useState(0);
  const [introCompleted,setIntroCompleted] =useState(false);
  const targetPage = useRef<Page>('home');
  const targetWorkIndex = useRef(0);

  const navigate = useCallback(
    (nextPage: Page, projectIndex = 0) => {
      if (transitioning) return;
      if (nextPage === page) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }
      targetPage.current = nextPage;
      targetWorkIndex.current = projectIndex;
      setTransitioning(true);
    },
    [page, transitioning],
  );

  const revealTargetPage = useCallback(() => {
    setWorkStartIndex(targetWorkIndex.current);
    setPage(targetPage.current);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const finishTransition = useCallback(() => {
    setTransitioning(false);
  }, []);

  // Keep the existing HeroSection source untouched: delegate its current hash links
  // to this single-page navigator so the same animated transition works for every view.
  useEffect(() => {
    const handleLandingNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const destination: Record<string, Page> = {
        '#home': 'home',
        '#mywork': 'work',
        '#myprofile': 'profile',
      };
      const nextPage = href ? destination[href] : undefined;
      if (!nextPage) return;

      if (nextPage === page) {
        if (href === '#home') window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      event.preventDefault();
      navigate(nextPage);
    };

    document.addEventListener('click', handleLandingNavigation);
    return () => document.removeEventListener('click', handleLandingNavigation);
  }, [navigate, page]);

  return (
    <div className={`portfolio-app portfolio-app--${page}`} data-page={page}>
      {introCompleted && <ScrollProgress />} 
      {page === 'home' ? (
        <HomeJourney
          Landing={LandingPage}
          onNavigate={(nextPage, projectIndex) => navigate(nextPage, projectIndex)}
          onIntroComplete={() => setIntroCompleted(true)}
        />
      ) : (
        <div className="portfolio-page-shell" key={page}>
          <SiteNav activePage={page} onNavigate={navigate} />
          {page === 'work' ? (
            <WorkPage initialIndex={workStartIndex} />
          ) : (
            <ProfilePage />
          )}
          <SiteFooter onNavigate={navigate} />
        </div>
      )}

     
      <TransitionOverlay
        active={transitioning}
        onCovered={revealTargetPage}
        onComplete={finishTransition}
      />
    </div>
  );
}

export default App;
