
import { Fragment, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GlareCard from '../../components/projects/GlareCard';
import type { Project } from '../../components/projects/projectData';
import type { CaseStudy as Study } from './caseStudies';
import { Words } from './split';
import './CaseStudy.css';
gsap.registerPlugin(ScrollTrigger);

type CaseStudyProps = {
  project: Project;
  study: Study;
  nextTitle: string;
  onNext: () => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

export default function CaseStudy({
  project,
  study,
  nextTitle,
  onNext,
}: CaseStudyProps) {
  const rootRef = useRef<HTMLElement>(null);

  // Defensive content handling: never leave the problem or footer empty.
  const problemPoints = (
    typeof study.problem === 'string'
      ? study.problem.split(/(?<=[.!?])\s+/)
      : []
  ).filter((point) => point.trim().length > 0);

  const nextItems =
    Array.isArray(study.next) && study.next.length > 0
      ? study.next
      : project.highlights?.length
        ? project.highlights
        : [
            'Continue improving performance and reliability.',
            'Add automated tests for the main user journeys.',
            'Document the architecture and future improvements.',
          ];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const q = (
          selector: string,
          scope: Element = root
        ) => gsap.utils.toArray<HTMLElement>(selector, scope);

        const enter = (
          trigger: Element,
          start = 'top 86%'
        ) => ({
          trigger,
          start,
          toggleActions: 'play none none reverse',
        });

        /*
         * HEADINGS
         * Words flip upward out of their masks.
         */
        q('[data-anim="heading"]').forEach((element) => {
          const words = q('.wd-i', element);

          if (!words.length) return;

          gsap.from(words, {
            yPercent: 115,
            rotationX: -65,
            opacity: 0,
            transformOrigin: '50% 100%',
            transformPerspective: 800,
            stagger: 0.055,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: enter(element, 'top 88%'),
          });
        });

        /*
         * PROBLEM SUMMARY
         * Each word appears individually as the user scrolls.
         * The stagger is deliberately restrained to keep longer
         * summaries readable rather than making them feel slow.
         */
        q('[data-anim="problem-words"]').forEach((element) => {
          const words = q('.wd-i', element);

          if (!words.length) return;

          gsap.from(words, {
            y: 24,
            opacity: 0,
            rotationX: -20,
            transformOrigin: '50% 100%',
            transformPerspective: 600,
            stagger: 0.018,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: enter(element, 'top 88%'),
          });
        });

        /*
         * SIMPLE FADE REVEALS
         */
        q('[data-anim="fade-in"]').forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: enter(element, 'top 88%'),
          });
        });

        /*
         * WORD RISE
         * Used for system-design descriptions and footer items.
         */
        q('[data-anim="rise"]').forEach((element) => {
          const words = q('.wd-i', element);

          if (!words.length) return;

          gsap.from(words, {
            yPercent: 105,
            opacity: 0,
            stagger: 0.018,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: enter(element, 'top 90%'),
          });
        });

        /*
         * CARD GROUPS
         */
        q('[data-anim="cards"]').forEach((group) => {
          const cards = q('.anim-card', group);

          if (!cards.length) return;

          gsap.from(cards, {
            y: 65,
            opacity: 0,
            rotationX: -20,
            rotationY: 5,
            transformPerspective: 900,
            transformOrigin: '50% 100%',
            stagger: 0.13,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: enter(group, 'top 82%'),
          });
        });

        /*
         * DESIGN GOALS
         */
        q('[data-anim="goals"]').forEach((list) => {
          gsap.from(q('li', list), {
            x: -45,
            opacity: 0,
            stagger: 0.08,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: enter(list, 'top 85%'),
          });
        });

        /*
         * SYSTEM DESIGN TIMELINE
         */
        const steps = root.querySelector('.case-steps');
        const stepsFill = root.querySelector('.case-steps__fill');

        if (steps && stepsFill) {
          gsap.fromTo(
            stepsFill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: steps,
                start: 'top 65%',
                end: 'bottom 60%',
                scrub: true,
              },
            }
          );

          q('.case-step', steps).forEach((step) => {
            gsap.from(
              q('.case-step__num, .case-step__title', step),
              {
                x: -40,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: enter(step, 'top 80%'),
              }
            );

            ScrollTrigger.create({
              trigger: step,
              start: 'top 60%',
              end: 'bottom 45%',
              toggleClass: {
                targets: step,
                className: 'is-active',
              },
            });
          });
        }

        /*
         * ARCHITECTURE
         */
        const arch = root.querySelector('.arch');

        if (arch) {
          gsap
            .timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: enter(arch, 'top 78%'),
            })
            .from(q('.arch__layer', arch), {
              y: 55,
              opacity: 0,
              rotationX: -20,
              transformPerspective: 900,
              transformOrigin: '50% 100%',
              stagger: 0.16,
              duration: 0.85,
            })
            .from(
              q('.arch__link', arch),
              {
                scaleX: 0,
                transformOrigin: '0% 50%',
                stagger: 0.16,
                duration: 0.5,
                ease: 'power2.inOut',
              },
              0.3
            )
            .from(
              q('.arch__chip', arch),
              {
                scale: 0.6,
                opacity: 0,
                stagger: 0.04,
                duration: 0.4,
                ease: 'back.out(2)',
              },
              0.45
            );
        }

        /*
         * OUTCOME CARDS
         */
        q('[data-anim="wipe"]').forEach((element) => {
          gsap.fromTo(
            element,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.9,
              ease: 'power3.inOut',
              scrollTrigger: enter(element, 'top 88%'),
            }
          );
        });

        /*
         * NUMBER COUNTERS
         */
        q('[data-count]').forEach((element) => {
          const target = Number(element.dataset.count);
          const counter = { value: 0 };

          element.textContent = '0';

          gsap.to(counter, {
            value: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              element.textContent = String(
                Math.round(counter.value)
              );
            },
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              once: true,
            },
          });
        });

        // Recalculate positions after the case study is mounted.
        ScrollTrigger.refresh();

        return () => {
          q('[data-count]').forEach((element) => {
            element.textContent = element.dataset.count ?? '';
          });
        };
      }
    );

    return () => {
      media.revert();
    };
  }, [project.id]);

  return (
    <section
      className="case"
      id="case-study"
      ref={rootRef}
      aria-label={`${project.title} case study`}
    >
      {/* CASE STUDY HEADER */}

      <header className="case__head">
        <p className="case__eyebrow">
          CASE STUDY / {project.number}
        </p>

        <h2 className="case__title" data-anim="heading">
          <Words text={project.title} />
        </h2>

        <p className="case__kicker">
          {study.kicker}
        </p>
      </header>

      {/* 01 — THE PROBLEM */}

      <div className="case__block">
        <p className="case__label">
          <span>01</span> The problem
        </p>

        <div className="case__problem">
          <ul className="case__lead-points">
            {problemPoints.length > 0 ? (
              problemPoints.map((point, index) => {
                const text = point.trim();

                return (
                  <li key={index}>
                    <span className="bullet-dot" />
                    <span
                      className="case__problem-text"
                      data-anim="problem-words"
                    >
                      <Words
                        text={
                          /[.!?]$/.test(text)
                            ? text
                            : `${text}.`
                        }
                      />
                    </span>
                  </li>
                );
              })
            ) : (
              <li>
                <span className="bullet-dot" />
                <span data-anim="fade-in">
                  {project.summary}
                </span>
              </li>
            )}
          </ul>

          <dl className="case__meta">
            <div>
              <dt>Timeline</dt>
              <dd>{project.date}</dd>
            </div>

            {study.meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}

            <div>
              <dt>Stack</dt>
              <dd>{project.tech.join(' · ')}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 02 — THE AUDIENCE */}

      <div className="case__block">
        <p className="case__label">
          <span>02</span> The audience
        </p>

        <h3 className="case__h" data-anim="heading">
          <Words text="Who it is built for." />
        </h3>

        <div className="case-audience" data-anim="cards">
          {study.audience.map((person, index) => (
            <div className="anim-card" key={person.who}>
              <GlareCard
                className="case-card"
                label={person.who}
              >
                <span className="case-card__num">
                  {pad(index + 1)}
                </span>

                <h4>{person.who}</h4>

                <p>
                  <b>They need</b>
                  {person.need}
                </p>

                <p>
                  <b>So I built</b>
                  {person.how}
                </p>
              </GlareCard>
            </div>
          ))}
        </div>
      </div>

      {/* 03 — THE GOALS */}

      <div className="case__block">
        <p className="case__label">
          <span>03</span> Design goals
        </p>

        <h3 className="case__h" data-anim="heading">
          <Words text="What the system had to do." />
        </h3>

        <ul className="case-goals" data-anim="goals">
          {study.goals.map((goal, index) => (
            <li key={goal}>
              <span>{pad(index + 1)}</span>
              {goal}
            </li>
          ))}
        </ul>
      </div>

      {/* 04 + 05 — SYSTEM DESIGN AND ARCHITECTURE */}

      <div className="case__band">
        <p className="case__label">
          <span>04</span> System design
        </p>

        <h3 className="case__h" data-anim="heading">
          <Words text="How I worked it out, step by step." />
        </h3>

        <div className="case-steps">
          <span className="case-steps__line" aria-hidden="true">
            <i className="case-steps__fill" />
          </span>

          <ol>
            {study.steps.map((step, index) => (
              <li className="case-step" key={step.title}>
                <span className="case-step__num">
                  {pad(index + 1)}
                </span>

                <div className="case-step__body">
                  <h4 className="case-step__title">
                    {step.title}
                  </h4>

                  <p data-anim="rise">
                    <Words text={step.text} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="case__label case__label--spaced">
          <span>05</span> Architecture
        </p>

        <h3 className="case__h" data-anim="heading">
          <Words text="The finished shape of the system." />
        </h3>

        <div className="arch">
          {study.layers.map((layer, index) => (
            <Fragment key={layer.title}>
              {index > 0 && (
                <span
                  className="arch__link"
                  aria-hidden="true"
                />
              )}

              <div className="arch__layer">
                <span className="arch__tag">
                  {layer.tag}
                </span>

                <h4>{layer.title}</h4>

                <ul>
                  {layer.items.map((item) => (
                    <li className="arch__chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Fragment>
          ))}
        </div>

        <p className="case__caption">
          Flow: {study.layers
            .map((layer) => layer.title)
            .join(' → ')}
        </p>
      </div>

      {/* 06 — KEY DECISIONS */}

      <div className="case__block">
        <p className="case__label">
          <span>06</span> Key decisions
        </p>

        <h3 className="case__h" data-anim="heading">
          <Words text="Three choices, and the reasoning." />
        </h3>

        <div className="case-decisions" data-anim="cards">
          {study.decisions.map((decision, index) => (
            <div className="anim-card" key={decision.question}>
              <GlareCard
                className="case-card case-card--decision"
                label={decision.question}
              >
                <span className="case-card__num">
                  {pad(index + 1)}
                </span>

                <p className="case-card__q">
                  {decision.question}
                </p>

                <h4>{decision.choice}</h4>

                <p>{decision.why}</p>
              </GlareCard>
            </div>
          ))}
        </div>
      </div>

      {/* 07 — OUTCOMES */}

      <div className="case__block">
        <p className="case__label">
          <span>07</span> Outcomes
        </p>

        <div className="case-stats">
          {study.outcomes.map((outcome) => (
            <div
              className="case-stat"
              key={outcome.label}
              data-anim="wipe"
            >
              <p className="case-stat__value">
                {outcome.to !== undefined ? (
                  <>
                    <span data-count={outcome.to}>
                      {outcome.to}
                    </span>
                    {outcome.suffix}
                  </>
                ) : (
                  outcome.text
                )}
              </p>

              <p className="case-stat__label">
                {outcome.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 08 — FOOTER / NEXT IMPROVEMENTS */}

      <div className="case__block case__block--end">
        <p className="case__label">
          <span>08</span> What I would improve next
        </p>

        <ul className="case-next">
          {nextItems.map((item, index) => (
            <li key={`${project.id}-next-${index}`}>
              <span
                className="case-next__number"
                aria-hidden="true"
              >
                {pad(index + 1)}
              </span>

              <span data-anim="rise">
                <Words text={item} />
              </span>
            </li>
          ))}
        </ul>

        {(project.githubUrl || project.demoUrl) && (
          <div className="case__links">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                GITHUB REPOSITORY ↗
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
        )}

        <button
          className="case-nextproject"
          type="button"
          onClick={onNext}
        >
          <span>NEXT PROJECT</span>
          <strong>{nextTitle}</strong>
          <i aria-hidden="true">→</i>
        </button>
      </div>
    </section>
  );
}
