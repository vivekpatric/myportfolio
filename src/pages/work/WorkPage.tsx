

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import GlareCard from '../../components/projects/GlareCard';
import { projects } from '../../components/projects/projectData';
import CaseStudy from './CaseStudy';
import { caseStudies } from './caseStudies';
import { Chars } from './split';

import './WorkPage.css';

gsap.registerPlugin(ScrollTrigger);

type WorkPageProps = {
  initialIndex?: number;
};

const COUNT = projects.length;

const pad = (value: number) => String(value).padStart(2, '0');

const clampIndex = (value: number) =>
  Math.min(Math.max(value, 0), COUNT - 1);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function WorkPage({ initialIndex = 0 }: WorkPageProps) {
  useSmoothScroll();
  const [active, setActive] = useState(() => clampIndex(initialIndex));

  const slideRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);

  // 1 = next project enters from the right.
  // -1 = previous project enters from the left.
  const directionRef = useRef<1 | -1>(1);

  const project = projects[active];

  const prev = projects[(active - 1 + COUNT) % COUNT];
  const next = projects[(active + 1) % COUNT];

  // Keep the existing case-study content and fallback.
  const foundStudy = caseStudies.find(
    (item) => item.id === project.id
  );

  const study = foundStudy || {
    id: project.id,
    kicker: project.category,
    problem: project.summary,
    meta: [
      { label: 'Type', value: 'Full-stack application' },
      { label: 'Delivery', value: 'Cloud deployed' },
    ],
    audience: [
      {
        who: 'Users & Stakeholders',
        need: 'Reliable performance and clean architecture.',
        how: 'Built with modern best practices.',
      },
    ],
    goals: [
      'Clean code',
      'Responsive design',
      'Robust performance',
    ],
    steps: [
      {
        title: 'Architecture & Planning',
        text: 'Designed system requirements and data flow.',
      },
      {
        title: 'Implementation',
        text: 'Developed core features using the defined tech stack.',
      },
    ],
    layers: [
      {
        tag: 'Client',
        title: 'Frontend',
        items: [project.tech[0] || 'React'],
      },
      {
        tag: 'Server',
        title: 'Backend',
        items: [project.tech[1] || 'API'],
      },
    ],
    decisions: [
      {
        question: 'Tech Stack Selection',
        choice: project.tech.join(', '),
        why: 'Chosen for optimal performance and developer experience.',
      },
    ],
    outcomes: [
      {
        to: 100,
        suffix: '%',
        label: 'Functional requirement coverage',
      },
    ],
    next: [
      'Add automated testing',
      'Optimize bundle size',
    ],
  };

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const go = useCallback((delta: number) => {
    directionRef.current = delta > 0 ? 1 : -1;

    setActive((current) =>
      (current + delta + COUNT) % COUNT
    );

    if (window.scrollY > 40) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  const goTo = useCallback((index: number) => {
    if (index === active) return;

    directionRef.current = index > active ? 1 : -1;

    setActive(index);

    if (window.scrollY > 40) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [active]);

  const scrollToCase = () => {
    const element = document.getElementById('case-study');

    if (!element) return;

    window.scrollTo({
      top:
        element.getBoundingClientRect().top +
        window.scrollY -
        70,
      behavior: 'smooth',
    });
  };

  // --------------------------------------------------
  // PROJECT ENTRANCE ANIMATION
  // --------------------------------------------------

  useLayoutEffect(() => {
    const slide = slideRef.current;

    if (!slide) return;

    const direction = directionRef.current;
    const reduce = prefersReducedMotion();

    const media = slide.querySelector<HTMLElement>(
      '.work-slide__media'
    );

    const chars = gsap.utils.toArray<HTMLElement>(
      '.ch-i',
      slide
    );

    const summary = gsap.utils.toArray<HTMLElement>(
      '.work-slide__summary-points li',
      slide
    );

    const reveals = gsap.utils.toArray<HTMLElement>(
      '[data-slide-reveal]',
      slide
    );

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(
          [media, ...chars, ...summary, ...reveals],
          {
            clearProps: 'all',
          }
        );

        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      // Image enters from the correct direction.
      if (media) {
        timeline.fromTo(
          media,
          {
            x: direction * 42,
            autoAlpha: 0,
            scale: 1.035,
          },
          {
            x: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.05,
            ease: 'power3.out',
          },
          0
        );
      }

      // Heading character animation.
      if (chars.length) {
        timeline.fromTo(
          chars,
          {
            yPercent: 115,
            opacity: 0,
            rotationZ: 3,
          },
          {
            yPercent: 0,
            opacity: 1,
            rotationZ: 0,
            stagger: 0.02,
            duration: 0.9,
            ease: 'power4.out',
          },
          0.18
        );
      }

      // Summary points.
      if (summary.length) {
        timeline.fromTo(
          summary,
          {
            y: 18,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.09,
            duration: 0.65,
          },
          0.45
        );
      }

      // Project metadata, technology chips and buttons.
      if (reveals.length) {
        timeline.fromTo(
          reveals,
          {
            y: 20,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            duration: 0.65,
          },
          0.55
        );
      }
    }, slide);

    return () => {
      ctx.revert();
    };
  }, [active]);

  // --------------------------------------------------
  // PROGRESS INDICATOR
  // --------------------------------------------------

  useEffect(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      scaleX: (active + 1) / COUNT,
      duration: prefersReducedMotion() ? 0 : 0.8,
      ease: 'power3.out',
      overwrite: true,
    });
  }, [active]);

  // --------------------------------------------------
  // KEYBOARD NAVIGATION
  // --------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (
        target &&
        (
          target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
        )
      ) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        go(-1);
      }

      if (event.key === 'ArrowRight') {
        go(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [go]);

  // --------------------------------------------------
  // HIDE ARROWS WHEN CONTACT SECTION IS VISIBLE
  // --------------------------------------------------

  useEffect(() => {
    const footer = document.getElementById('contact');
    const arrows = arrowsRef.current;

    if (!footer || !arrows) return;

    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 85%',
      onToggle: (self) => {
        arrows.classList.toggle('is-hidden', self.isActive);
      },
    });

    return () => {
      trigger.kill();
      arrows.classList.remove('is-hidden');
    };
  }, []);

  // --------------------------------------------------
  // TOUCH SWIPE
  // --------------------------------------------------

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (
    event: React.TouchEvent<HTMLElement>
  ) => {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLElement>
  ) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;

    touchStartX.current = null;

    if (start === null || end === undefined) return;

    const difference = end - start;

    if (Math.abs(difference) < 55) return;

    go(difference < 0 ? 1 : -1);
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  const points = project.summary
    .split('. ')
    .filter(Boolean);

  return (
    <main className="work" id="mywork">

      {/* FEATURED PROJECT */}

      <section
        className="work-carousel"
        aria-label="Featured projects"
        aria-roledescription="carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        <article
          ref={slideRef}
          key={project.id}
          className="work-slide"
          aria-roledescription="slide"
          aria-label={`${active + 1} of ${COUNT}`}
        >

          {/* PROJECT IMAGE */}

          <div className="work-slide__media">

            <GlareCard
              className="work-media"
              label={`Preview of ${project.title}`}
            >
              <img
                src={project.image}
                alt={project.imageAlt}
                loading="eager"
                decoding="async"
              />

              <span className="work-media__shade" />

              <span className="work-media__index">
                {project.number} — {pad(COUNT)}
              </span>

              <span className="work-media__caption">
                {project.category}
              </span>
            </GlareCard>

          </div>

          {/* PROJECT CONTENT */}

          <div className="work-slide__copy">

            <span
              className="work-slide__ghost"
              aria-hidden="true"
            >
              {project.number}
            </span>

            <p
              className="work-slide__top"
              data-slide-reveal
            >
              <span>FEATURED PROJECT</span>
              <span>{project.date}</span>
            </p>

            <h2 aria-label={project.title}>
              <Chars text={project.title} />
            </h2>

            <ul className="work-slide__summary-points">
              {points.map((point, index) => (
                <li key={index}>
                  <span className="bullet-dot" />
                  <span>
                    {point.endsWith('.') ? point : `${point}.`}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="work-slide__chips"
              data-slide-reveal
            >
              {project.tech.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div
              className="work-slide__actions"
              data-slide-reveal
            >
              <button
                type="button"
                className="work-btn"
                onClick={scrollToCase}
              >
                READ THE CASE STUDY
                <span aria-hidden="true">↓</span>
              </button>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GITHUB ↗
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LIVE DEMO ↗
                </a>
              )}
            </div>

          </div>
        </article>

      </section>

      {/* PROJECT NAVIGATION / PROGRESS */}

      <div className="work-stage__bar">

        <div
          className="work-dots"
          role="group"
          aria-label="Choose a project"
        >
          {projects.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`work-dot ${
                index === active ? 'is-active' : ''
              }`}
              onClick={() => goTo(index)}
              aria-label={`Show project ${index + 1}: ${item.title}`}
              aria-pressed={index === active}
            >
              {item.number}
            </button>
          ))}
        </div>

        <span className="work-progress" aria-hidden="true">
          <i ref={progressRef} />
        </span>

        <span className="work-stage__count" aria-hidden="true">
          {pad(active + 1)} / {pad(COUNT)}
        </span>

      </div>

      <p className="sr-only" aria-live="polite">
        Showing project {active + 1} of {COUNT}: {project.title}
      </p>

      {/* CASE STUDY */}

      <CaseStudy
        key={project.id}
        project={project}
        study={study}
        nextTitle={next.title}
        onNext={() => go(1)}
      />

      {/* EDGE ARROWS */}

      <div className="work-arrows" ref={arrowsRef}>

        <button
          type="button"
          className="work-arrow work-arrow--prev"
          onClick={() => go(-1)}
          aria-label={`Previous project: ${prev.title}`}
        >
          <span className="work-arrow__disc" aria-hidden="true">
            ←
          </span>

          <span className="work-arrow__label" aria-hidden="true">
            <b>{prev.number}</b>
            {prev.shortTitle}
          </span>
        </button>

        <button
          type="button"
          className="work-arrow work-arrow--next"
          onClick={() => go(1)}
          aria-label={`Next project: ${next.title}`}
        >
          <span className="work-arrow__disc" aria-hidden="true">
            →
          </span>

          <span className="work-arrow__label" aria-hidden="true">
            <b>{next.number}</b>
            {next.shortTitle}
          </span>
        </button>

      </div>

    </main>
  );
}
