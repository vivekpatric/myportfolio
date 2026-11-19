import { useEffect, useRef, useState, type MouseEvent } from 'react';
import './SiteNav.css';

export type PortfolioPage = 'home' | 'work' | 'profile';

type SiteNavProps = {
  activePage: PortfolioPage;
  onNavigate: (page: PortfolioPage, projectIndex?: number) => void;
};

const links: {
  label: string;
  page: PortfolioPage;
  number: string;
}[] = [
  { label: 'Home', page: 'home', number: '01' },
  { label: 'My work', page: 'work', number: '02' },
  { label: 'My profile', page: 'profile', number: '03' },
];

export default function SiteNav({
  activePage,
  onNavigate,
}: SiteNavProps) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    page: PortfolioPage
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onNavigate(page);
  };

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const difference = currentY - lastScrollY.current;

      // Always show the navbar close to the top.
      if (currentY < 90) {
        setHidden(false);
      } else if (Math.abs(difference) > 5) {
        // Scrolling down: hide (difference > 0)
        // Scrolling up: show (difference < 0)
        setHidden(difference > 0);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`site-nav__shell ${hidden ? 'is-hidden' : ''}`}>
      <a
        className="site-nav__brand"
        href="#home"
        onClick={(event) => handleClick(event, 'home')}
        aria-label="Vivek Patric — home"
      >
        <span className="site-nav__monogram">VP</span>

        <span className="site-nav__brand-copy">
          <strong>Vivek Patric</strong>
          <small>Developer · Creative technologist</small>
        </span>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a
            key={link.page}
            href={
              link.page === 'home'
                ? '#home'
                : link.page === 'work'
                  ? '#mywork'
                  : '#myprofile'
            }
            className={`site-nav__link ${
              activePage === link.page ? 'is-active' : ''
            }`}
            aria-current={
              activePage === link.page ? 'page' : undefined
            }
            onClick={(event) =>
              handleClick(event, link.page)
            }
          >
            <span className="site-nav__number">
              {link.number}
            </span>
            {link.label}
          </a>
        ))}
      </nav>

      <span className="site-nav__availability">
        <i />
        Open to opportunities
      </span>

      <span className="site-nav__ornament" aria-hidden="true">
        VP / 26
      </span>
    </div>
  );

}
