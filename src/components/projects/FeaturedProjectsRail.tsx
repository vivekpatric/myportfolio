// import { useLayoutEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import type { Project } from './projectData';
// import { featuredProjects } from './projectData';
// import GlareCard from './GlareCard';
// import './FeaturedProjectsRail.css';

// gsap.registerPlugin(ScrollTrigger);

// type FeaturedProjectsRailProps = {
//   onOpenWork: (projectIndex?: number) => void;
// };

// function FeaturedCard({ project, onOpenWork }: { project: Project; onOpenWork: (projectIndex?: number) => void }) {
//   const workIndex = featuredProjects.indexOf(project) < 3 ? featuredProjects.indexOf(project) : 0;
//   return (
//     <button className="featured-project-card" type="button" onClick={() => onOpenWork(workIndex)}>
//       <GlareCard className="featured-project-card__surface" label={`Explore ${project.title}`}>
//         <div className="featured-project-card__image-wrap">
//           <img src={project.image} alt={project.imageAlt} loading="lazy" />
//           <span className="featured-project-card__index">{project.number} / 04</span>
//           <span className="featured-project-card__open" aria-hidden="true">↗</span>
//           {project.status && <span className="featured-project-card__status">{project.status}</span>}
//         </div>
//         <div className="featured-project-card__copy">
//           <div className="featured-project-card__meta">
//             <span>{project.category}</span>
//             <span>{project.date}</span>
//           </div>
//           <h3>{project.title}</h3>
//           <p>{project.summary}</p>
//           <div className="featured-project-card__bottom">
//             <span>{project.tech.slice(0, 3).join(' · ')}</span>
//             <span className="featured-project-card__arrow">VIEW PROJECT ↗</span>
//           </div>
//         </div>
//       </GlareCard>
//     </button>
//   );
// }

// export default function FeaturedProjectsRail({ onOpenWork }: FeaturedProjectsRailProps) {
//   const sectionRef = useRef<HTMLElement>(null);
//   const viewportRef = useRef<HTMLDivElement>(null);
//   const trackRef = useRef<HTMLDivElement>(null);

//   useLayoutEffect(() => {
//     const section = sectionRef.current;
//     const viewport = viewportRef.current;
//     const track = trackRef.current;
//     if (!section || !viewport || !track) return;

//     let media: ReturnType<typeof gsap.matchMedia> | null = null;
//     const context = gsap.context(() => {
//       media = gsap.matchMedia();
//       media.add('(min-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
//         // Travel the full content width inside the padded viewport, not merely the
//         // section width, so the final card arrives fully in view before page scroll resumes.
//         const getDistance = () => {
//           const styles = window.getComputedStyle(viewport);
//           const horizontalPadding =
//             Number.parseFloat(styles.paddingLeft || '0') + Number.parseFloat(styles.paddingRight || '0');
//           const usableWidth = Math.max(1, viewport.clientWidth - horizontalPadding);
//           return Math.max(0, track.scrollWidth - usableWidth + 8);
//         };
//         const horizontalTween = gsap.to(track, {
//           x: () => -getDistance(),
//           ease: 'none',
//           scrollTrigger: {
//             trigger: section,
//             start: 'top top',
//             end: () => `+=${Math.max(getDistance(), window.innerHeight * 0.65)}`,
//             pin: section,
//             scrub: 0.85,
//             invalidateOnRefresh: true,
//             anticipatePin: 1,
//           },
//         });
//         return () => {
//           horizontalTween.scrollTrigger?.kill();
//           horizontalTween.kill();
//         };
//       });
//     }, section);

//     return () => {
//       media?.revert();
//       context.revert();
//     };
//   }, []);

//   return (
//     <section className="featured-rail" ref={sectionRef} id="featured-work" aria-labelledby="featured-rail-title">
//       <div className="featured-rail__intro">
//         <div>
//           <p className="eyebrow eyebrow--light"><span /> SELECTED WORK / 2023—26</p>
//           <h2 id="featured-rail-title">Built with <em>purpose.</em><br />Made to <em>move.</em></h2>
//         </div>
//         <div className="featured-rail__hint">
//           <span className="featured-rail__hint-line" />
//           <span>SCROLL TO TRAVEL</span>
//           <span aria-hidden="true">↓</span>
//         </div>
//         <p className="featured-rail__intro-note">
//           A few systems, dashboards and experiments where engineering meets the feel of a good interface.
//         </p>
//       </div>

//       <div className="featured-rail__viewport" ref={viewportRef}>
//         <div className="featured-rail__track" ref={trackRef}>
//           {featuredProjects.map((project) => (
//             <FeaturedCard key={project.id} project={project} onOpenWork={onOpenWork} />
//           ))}
//         </div>
//       </div>

//       <div className="featured-rail__footnote">
//         <span>01 — 04 / SELECTED EXPERIMENTS</span>
//         <button type="button" onClick={() => onOpenWork(0)}>OPEN PROJECT INDEX <span aria-hidden="true">↗</span></button>
//       </div>
//     </section>
//   );
// }
//from here
// import { Fragment, useLayoutEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import type { Project } from './projectData';
// import { featuredProjects } from './projectData';
// import GlareCard from './GlareCard';
// import './FeaturedProjectsRail.css';

// gsap.registerPlugin(ScrollTrigger);

// type FeaturedProjectsRailProps = {
//   onOpenWork: (projectIndex?: number) => void;
// };

// const STATEMENT =
//   'Backends that keep their shape under load. Interfaces that keep your attention. Every project here sits where Spring Boot discipline meets front-end craft.';

// const STATS = [
//   { value: 4, suffix: '', label: 'Selected builds, from full-stack to creative coding' },
//   { value: 35, suffix: '%', label: 'Fewer redundant API calls through route-history analytics' },
//   { value: 10, suffix: ' min', label: 'Congestion look-ahead in the Traffic Navigator' },
// ];

// /* ---------- text splitters (no paid plugin needed) ---------- */

// function Words({ text, mask = false }: { text: string; mask?: boolean }) {
//   return (
//     <>
//       {text.split(' ').map((word, i) => (
//         <Fragment key={`${word}-${i}`}>
//           <span className={`rail-word${mask ? ' rail-word--mask' : ''}`}>
//             <span className="rail-word__inner">{word}</span>
//           </span>{' '}
//         </Fragment>
//       ))}
//     </>
//   );
// }

// function Chars({ text }: { text: string }) {
//   return (
//     <>
//       {text.split(' ').map((word, wi) => (
//         <Fragment key={`${word}-${wi}`}>
//           <span className="rail-chars__word" aria-hidden="true">
//             {[...word].map((char, ci) => (
//               <span className="rail-char" key={ci}>
//                 <span className="rail-char__inner">{char}</span>
//               </span>
//             ))}
//           </span>{' '}
//         </Fragment>
//       ))}
//     </>
//   );
// }

// /* ---------- card ---------- */

// function FeaturedCard({
//   project,
//   index,
//   total,
//   onOpenWork,
// }: {
//   project: Project;
//   index: number;
//   total: number;
//   onOpenWork: (projectIndex?: number) => void;
// }) {
//   const workIndex = index < 3 ? index : 0;
//   return (
//     <button className="featured-project-card" type="button" onClick={() => onOpenWork(workIndex)}>
//       <GlareCard className="featured-project-card__surface" label={`Explore ${project.title}`}>
//         <div className="featured-project-card__image-wrap">
//           <img src={project.image} alt={project.imageAlt} loading="lazy" />
//           <span className="featured-project-card__index">
//             {project.number} / {String(total).padStart(2, '0')}
//           </span>
//           <span className="featured-project-card__open" aria-hidden="true">↗</span>
//           {project.status && <span className="featured-project-card__status">{project.status}</span>}
//         </div>
//         <div className="featured-project-card__copy">
//           <div className="featured-project-card__meta">
//             <span>{project.category}</span>
//             <span>{project.date}</span>
//           </div>
//           <h3 aria-label={project.title}>
//             <Chars text={project.title} />
//           </h3>
//           <p className="featured-project-card__summary">{project.summary}</p>
//           <ul className="featured-project-card__highlights">
//             {project.highlights.map((item, i) => (
//               <li key={item}>
//                 <span>{String(i + 1).padStart(2, '0')}</span>
//                 {item}
//               </li>
//             ))}
//           </ul>
//           <div className="featured-project-card__tech">
//             {project.tech.map((t) => (
//               <span key={t}>{t}</span>
//             ))}
//           </div>
//           <div className="featured-project-card__bottom">
//             <span>CASE FILE {project.number}</span>
//             <span className="featured-project-card__arrow">VIEW PROJECT ↗</span>
//           </div>
//         </div>
//       </GlareCard>
//     </button>
//   );
// }

// /* ---------- rail ---------- */

// export default function FeaturedProjectsRail({ onOpenWork }: FeaturedProjectsRailProps) {
//   const sectionRef = useRef<HTMLElement>(null);
//   const viewportRef = useRef<HTMLDivElement>(null);
//   const trackRef = useRef<HTMLDivElement>(null);

//   useLayoutEffect(() => {
//     const section = sectionRef.current;
//     const viewport = viewportRef.current;
//     const track = trackRef.current;
//     if (!section || !viewport || !track) return;

//     const media = gsap.matchMedia();

//     media.add('(min-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
//       const one = <T extends HTMLElement>(sel: string) => section.querySelector<T>(sel)!;
//       const all = (sel: string, scope: HTMLElement = section) =>
//         gsap.utils.toArray<HTMLElement>(sel, scope);

//       const intro = one('.featured-rail__intro');
//       const outro = one('.featured-rail__outro');
//       const hud = one('.featured-rail__hud');
//       const bar = one('.featured-rail__hud-bar i');
//       const hudIndex = one('[data-hud-index]');
//       const ghost = one('.featured-rail__ghost');
//       const grid = one('.featured-rail__grid');
//       const headline = one('#featured-rail-title');
//       const lower = one('.featured-rail__intro-lower');
//       const stage = one('.featured-rail__stage');
//       const cards = all('.featured-project-card', track);
//       const images = cards.map((c) => c.querySelector<HTMLElement>('img')!);
//       const TOTAL = 9;
//       const getDistance = () =>
//         Math.max(0, cards[cards.length - 1].offsetLeft - cards[0].offsetLeft);

//       /* 1. Sheet corners flatten as the section reaches the top */
//       gsap.fromTo(
//         section,
//         { borderTopLeftRadius: 36, borderTopRightRadius: 36 },
//         {
//           borderTopLeftRadius: 0,
//           borderTopRightRadius: 0,
//           ease: 'none',
//           scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true },
//         },
//       );

//       /* 2. Intro reveal: plays once as the sheet rises into view */
//       const counters: Array<() => void> = [];
//       const introIn = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
//       introIn
//         .from(all('.featured-rail__intro .eyebrow > span'), { opacity: 0, y: 12, stagger: 0.1, duration: 0.6 }, 0)
//         .from(
//           all('#featured-rail-title .rail-word__inner'),
//           {
//             rotationX: -95,
//             yPercent: 40,
//             opacity: 0,
//             transformOrigin: '50% 100% -60px',
//             transformPerspective: 900,
//             stagger: 0.12,
//             duration: 1.1,
//             ease: 'expo.out',
//           },
//           0.1,
//         )
//         .from(
//           all('.featured-rail__stat'),
//           { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)', stagger: 0.15, duration: 0.9 },
//           0.7,
//         )
//         .from(all('.featured-rail__hint > *'), { opacity: 0, x: -16, stagger: 0.1, duration: 0.6 }, 1.1);

//       all('[data-count]').forEach((el) => {
//         const target = Number(el.dataset.count);
//         const counter = { v: 0 };
//         el.textContent = '0';
//         introIn.to(
//           counter,
//           {
//             v: target,
//             duration: 1.6,
//             ease: 'power2.out',
//             onUpdate: () => {
//               el.textContent = String(Math.round(counter.v));
//             },
//           },
//           0.8,
//         );
//         counters.push(() => {
//           el.textContent = String(target);
//         });
//       });

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 70%',
//         once: true,
//         onEnter: () => introIn.play(),
//       });

//       /* 3. Per-card text timelines (each text type animates differently) */
//       const textTls = cards.map((card) => {
//         const within = (sel: string) => all(sel, card);
//         return gsap
//           .timeline({ paused: true, defaults: { ease: 'power3.out' } })
//           .from(within('.featured-project-card__index'), { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 0)
//           .fromTo(
//             within('.featured-project-card__meta'),
//             { clipPath: 'inset(0 100% 0 0)' },
//             { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.inOut' },
//             0.05,
//           )
//           .from(
//             within('.rail-char__inner'),
//             { yPercent: 120, rotationZ: 7, opacity: 0, transformOrigin: '0% 100%', stagger: 0.022, duration: 0.8, ease: 'power4.out' },
//             0.1,
//           )
//           .from(within('.featured-project-card__summary'), { opacity: 0, y: 22, filter: 'blur(10px)', duration: 0.9 }, 0.4)
//           .from(within('.featured-project-card__highlights li'), { opacity: 0, x: 70, stagger: 0.12, duration: 0.7 }, 0.55)
//           .from(
//             within('.featured-project-card__tech span'),
//             { scale: 0.3, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'back.out(2.5)' },
//             0.9,
//           )
//           .from(within('.featured-project-card__bottom > *'), { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, 1.1);
//       });

//       /* 4. Master scrubbed timeline (7 units ≈ 7 screen-heights of scroll) */
//       gsap.set(viewport, { transformOrigin: '50% 50%', transformPerspective: 1600 });
//       gsap.set(intro, { transformOrigin: '50% 40%', transformPerspective: 1200 });

//       const statementWords = all('.featured-rail__statement .rail-word__inner');
//       const outroWords = all('.featured-rail__outro h2 .rail-word__inner');
//       const outroText = all('.featured-rail__outro-text .rail-word__inner');

//       const tl = gsap.timeline({ defaults: { ease: 'none' } });

//       // background depth layers drift for the whole journey
//       tl.to(ghost, { xPercent: -38, duration: TOTAL }, 0)
//         .to(grid, { backgroundPosition: '0px 1360px', duration: 7 }, 0);

//       // 0 → 1  intro dwell: statement fills in, layers separate in depth
//       tl.fromTo(
//         statementWords,
//         { opacity: 0.14 },
//         { opacity: 1, stagger: { each: 0.7 / statementWords.length }, duration: 0.18 },
//         0.1,
//       )
//         .to(headline, { y: -60, duration: 1 }, 0)
//         .to(lower, { y: -110, duration: 1 }, 0);

//       // 1 → 1.9  intro falls back in Z while the cards rise like a page
//       tl.to(
//         intro,
//         { z: -500, rotationX: 14, yPercent: -18, autoAlpha: 0, duration: 0.9, ease: 'power2.in' },
//         1.0,
//       )
//         .fromTo(
//           viewport,
//           { yPercent: 110, rotationX: 22, scale: 0.9 },
//           { yPercent: 0, rotationX: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
//           1.0,
//         )
//         .fromTo(hud, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.5);

//       // 1.9 → 5.9  horizontal travel
//       tl.to(track, { x: () => -getDistance(), duration: 4 }, 1.9).fromTo(
//         bar,
//         { scaleX: 0 },
//         { scaleX: 1, duration: 4 },
//         1.9,
//       );

//       // 5.9 → 6.5  cards leave upward
//       tl.to(
//         viewport,
//         { yPercent: -45, rotationX: -16, scale: 0.82, autoAlpha: 0, duration: 0.6, ease: 'power2.in' },
//         5.9,
//       ).to(hud, { autoAlpha: 0, y: -20, duration: 0.3 }, 5.9);

//       // 6.1 → 6.9  outro
//       tl.fromTo(outro, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 6.1)
//         .from(all('.featured-rail__outro .eyebrow > span'), { opacity: 0, y: 12, stagger: 0.05, duration: 0.3, ease: 'power3.out' }, 6.15)
//         .from(
//           outroWords,
//           {
//             rotationY: -90,
//             xPercent: -30,
//             opacity: 0,
//             transformOrigin: '0% 50%',
//             transformPerspective: 900,
//             stagger: 0.08,
//             duration: 0.4,
//             ease: 'power3.out',
//           },
//           6.2,
//         )
//         .from(outroText, { yPercent: 110, stagger: 0.015, duration: 0.3, ease: 'power3.out' }, 6.5)
//         .from(all('.featured-rail__cta'), { scale: 0.6, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, 6.7);

//       // 6.9 → 8: hold. The finished outro stays fully on screen.
//       // 8 → 9: the footer rises over it, so the stage tilts back and dims.
//       tl.to(
//         stage,
//         {
//           scale: 0.9,
//           opacity: 0.5,
//           rotationX: 6,
//           yPercent: -3,
//           transformPerspective: 1200,
//           transformOrigin: '50% 100%',
//           duration: 1,
//           ease: 'none',
//         },
//         TOTAL - 1,
//       ).set({}, {}, TOTAL); // makes the timeline exactly TOTAL long, so 1 unit = 1 screen

//       /* 5. Per-frame card 3D + active-card detection */
//       const setters = cards.map((card, i) => ({
//         rotY: gsap.quickSetter(card, 'rotationY'),
//         scale: gsap.quickSetter(card, 'scale'),
//         z: gsap.quickSetter(card, 'z', 'px'),
//         opacity: gsap.quickSetter(card, 'opacity'),
//         imgX: gsap.quickSetter(images[i], 'xPercent'),
//       }));
//       gsap.set(cards, { transformPerspective: 1400 });

//       let centers: number[] = [];
//       let vw = window.innerWidth;
//       const measure = () => {
//         vw = window.innerWidth;
//         centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2); // ignores transforms
//       };
//till here
      // let active = -1;
      // const updateCards = () => {
      //   const vw = window.innerWidth;
      //   const time = tl.time();
      //   let nearest = 0;
      //   let nearestDist = Infinity;

      //   cards.forEach((card, i) => {
      //     const rect = card.getBoundingClientRect();
      //     const raw = (rect.left + rect.width / 2 - vw / 2) / (vw * 0.72);
      //     const d = gsap.utils.clamp(-1.3, 1.3, raw);
      //     const a = Math.min(Math.abs(d), 1);
      //     gsap.set(card, {
      //       transformPerspective: 1400,
      //       rotationY: d * 24,
      //       scale: 1 - a * 0.12,
      //       z: -a * 140,
      //       opacity: 1 - a * 0.4,
      //     });
      //     gsap.set(images[i], { xPercent: -d * 8 });
      //     if (Math.abs(d) < nearestDist) {
      //       nearestDist = Math.abs(d);
      //       nearest = i;
      //     }
      //   });

      //   const next = time > 1.45 && time < 6.2 ? nearest : -1;
      //   if (next !== active) {
      //     if (active >= 0) {
      //       cards[active].classList.remove('is-active');
      //       textTls[active].timeScale(1.8).reverse();
      //     }
      //     if (next >= 0) {
      //       cards[next].classList.add('is-active');
      //       textTls[next].timeScale(1).play();
      //       hudIndex.textContent = String(next + 1).padStart(2, '0');
      //     }
      //     active = next;
      //   }
      // };

      // const trigger = ScrollTrigger.create({
      //   animation: tl,
      //   trigger: section,
      //   start: 'top top',
      //   end: () => `+=${window.innerHeight * TOTAL}`,
      //   pin: true,
      //   scrub: 0.4,
      //   anticipatePin: 1,
      //   invalidateOnRefresh: true,
      //   onUpdate: updateCards,
      //   onRefresh: updateCards,
      // });
      // updateCards();

      //from here

//       let active = -1;
//         const updateCards = () => {
//           const time = tl.time();
//           const trackX = gsap.getProperty(track, 'x') as number;
//           let nearest = 0;
//           let nearestDist = Infinity;

//           cards.forEach((_, i) => {
//             const raw = (centers[i] + trackX - vw / 2) / (vw * 0.72);
//             const d = gsap.utils.clamp(-1.3, 1.3, raw);
//             const a = Math.min(Math.abs(d), 1);
//             const s = setters[i];
//             s.rotY(d * 24);
//             s.scale(1 - a * 0.12);
//             s.z(-a * 140);
//             s.opacity(1 - a * 0.4);
//             s.imgX(-d * 8);
//             if (Math.abs(d) < nearestDist) { nearestDist = Math.abs(d); nearest = i; }
//           });

//           const next = time > 1.45 && time < 6.2 ? nearest : -1;
//           if (next !== active) {
//             if (active >= 0) {
//               cards[active].classList.remove('is-active');
//               textTls[active].timeScale(1.8).reverse();
//             }
//             if (next >= 0) {
//               cards[next].classList.add('is-active');
//               textTls[next].timeScale(1).play();
//               hudIndex.textContent = String(next + 1).padStart(2, '0');
//             }
//             active = next;
//           }
//         };

//         tl.eventCallback('onUpdate', updateCards); // synced with the scrubbed animation

//         const trigger = ScrollTrigger.create({
//           animation: tl,
//           trigger: section,
//           start: 'top top',
//           end: () => `+=${window.innerHeight * TOTAL}`,
//           pin: true,
//           scrub: 0.4,                 // was 0.9, see #2
//           anticipatePin: 1,
//           invalidateOnRefresh: true,
//           onRefresh: () => { measure(); updateCards(); },
//         });
//         measure();
//         updateCards();

//       return () => {
//         trigger.kill();
//         cards.forEach((c) => c.classList.remove('is-active'));
//         counters.forEach((reset) => reset());
//       };
//     });

//     return () => media.revert();
//   }, []);

//   return (
//     <section className="featured-rail" ref={sectionRef} id="featured-work" aria-labelledby="featured-rail-title">
//       <div className="featured-rail__grid" aria-hidden="true" />
//       <div className="featured-rail__ghost" aria-hidden="true">
//         SELECTED WORK — BUILT WITH PURPOSE — MADE TO MOVE — SELECTED WORK — BUILT WITH PURPOSE —
//       </div>

//       <div className="featured-rail__stage">
//         {/* ---------- intro ---------- */}
//         <div className="featured-rail__intro">
//           <p className="eyebrow eyebrow--light">
//             <span className="eyebrow__dot" />
//             <span>SELECTED WORK / 2023—26</span>
//             <span className="eyebrow__line" />
//           </p>
//           <h2 id="featured-rail-title">
//             <Words text="Built with" /> <em><Words text="purpose." /></em>
//             <br />
//             <Words text="Made to" /> <em><Words text="move." /></em>
//           </h2>

//           <div className="featured-rail__intro-lower">
//             <p className="featured-rail__statement">
//               <Words text={STATEMENT} />
//             </p>
//             <dl className="featured-rail__stats">
//               {STATS.map((s) => (
//                 <div className="featured-rail__stat" key={s.label}>
//                   <dt className="featured-rail__stat-num">
//                     <span data-count={s.value}>{s.value}</span>
//                     {s.suffix}
//                   </dt>
//                   <dd>{s.label}</dd>
//                 </div>
//               ))}
//             </dl>
//           </div>

//           <div className="featured-rail__hint">
//             <span className="featured-rail__hint-line" />
//             <span>SCROLL TO TRAVEL</span>
//             <span aria-hidden="true">↓</span>
//           </div>
//         </div>

//         {/* ---------- cards ---------- */}
//         <div className="featured-rail__viewport" ref={viewportRef}>
//           <div className="featured-rail__track" ref={trackRef}>
//             {featuredProjects.map((project, i) => (
//               <FeaturedCard
//                 key={project.id}
//                 project={project}
//                 index={i}
//                 total={featuredProjects.length}
//                 onOpenWork={onOpenWork}
//               />
//             ))}
//           </div>
//         </div>

//         {/* ---------- outro ---------- */}
//         <div className="featured-rail__outro">
//           <p className="eyebrow eyebrow--light">
//             <span className="eyebrow__dot" />
//             <span>NEXT / THE WHOLE INDEX</span>
//           </p>
//           <h2>
//             <Words text="Four builds." /> <em><Words text="Endless" /></em> <Words text="iterations." />
//           </h2>
//           <p className="featured-rail__outro-text">
//             <Words
//               mask
//               text="From JWT-secured APIs to liquid cursor experiments, every project has a case file with the stack, the decisions and the details behind it."
//             />
//           </p>
//           <button className="featured-rail__cta" type="button" onClick={() => onOpenWork(0)}>
//             OPEN PROJECT INDEX <span aria-hidden="true">↗</span>
//           </button>
//         </div>

//         {/* ---------- HUD ---------- */}
//         <div className="featured-rail__hud">
//           <span className="featured-rail__hud-count">
//             <b data-hud-index>01</b> / {String(featuredProjects.length).padStart(2, '0')}
//           </span>
//           <span className="featured-rail__hud-bar" aria-hidden="true"><i /></span>
//           <button type="button" onClick={() => onOpenWork(0)}>
//             OPEN PROJECT INDEX <span aria-hidden="true">↗</span>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
import { Fragment, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from './projectData';
import { featuredProjects } from './projectData';
import GlareCard from './GlareCard';
import './FeaturedProjectsRail.css';

gsap.registerPlugin(ScrollTrigger);

type FeaturedProjectsRailProps = {
  onOpenWork: (projectIndex?: number) => void;
};

const STATEMENT =
  'Backends that keep their shape under load. Interfaces that keep your attention. Every project here sits where Spring Boot discipline meets front-end craft.';

const STATS = [
  { value: 4, suffix: '', label: 'Selected builds, from full-stack to creative coding' },
  { value: 35, suffix: '%', label: 'Fewer redundant API calls through route-history analytics' },
  { value: 10, suffix: ' min', label: 'Congestion look-ahead in the Traffic Navigator' },
];

/* ---------- text splitters (no paid plugin needed) ---------- */

function Words({ text, mask = false }: { text: string; mask?: boolean }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className={`rail-word${mask ? ' rail-word--mask' : ''}`}>
            <span className="rail-word__inner">{word}</span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wi) => (
        <Fragment key={`${word}-${wi}`}>
          <span className="rail-chars__word" aria-hidden="true">
            {[...word].map((char, ci) => (
              <span className="rail-char" key={ci}>
                <span className="rail-char__inner">{char}</span>
              </span>
            ))}
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

/* ---------- card ---------- */

function FeaturedCard({
  project,
  index,
  total,
  onOpenWork,
}: {
  project: Project;
  index: number;
  total: number;
  onOpenWork: (projectIndex?: number) => void;
}) {
  const workIndex = index < 3 ? index : 0;
  return (
    <button className="featured-project-card" type="button" onClick={() => onOpenWork(workIndex)}>
      <GlareCard className="featured-project-card__surface" label={`Explore ${project.title}`}>
        <div className="featured-project-card__image-wrap">
          <img src={project.image} alt={project.imageAlt} loading="lazy" />
          <span className="featured-project-card__index">
            {project.number} / {String(total).padStart(2, '0')}
          </span>
          <span className="featured-project-card__open" aria-hidden="true">↗</span>
          {project.status && <span className="featured-project-card__status">{project.status}</span>}
        </div>
        <div className="featured-project-card__copy">
          <div className="featured-project-card__meta">
            <span>{project.category}</span>
            <span>{project.date}</span>
          </div>
          <h3 aria-label={project.title}>
            <Chars text={project.title} />
          </h3>
          <p className="featured-project-card__summary">{project.summary}</p>
          <ul className="featured-project-card__highlights">
            {project.highlights.map((item, i) => (
              <li key={item}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="featured-project-card__tech">
            {project.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="featured-project-card__bottom">
            <span>CASE FILE {project.number}</span>
            <span className="featured-project-card__arrow">VIEW PROJECT ↗</span>
          </div>
        </div>
      </GlareCard>
    </button>
  );
}

/* ---------- rail ---------- */

export default function FeaturedProjectsRail({ onOpenWork }: FeaturedProjectsRailProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const media = gsap.matchMedia();

    media.add('(min-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
      const one = <T extends HTMLElement>(sel: string) => section.querySelector<T>(sel)!;
      const all = (sel: string, scope: HTMLElement = section) =>
        gsap.utils.toArray<HTMLElement>(sel, scope);

      const intro = one('.featured-rail__intro');
      const outro = one('.featured-rail__outro');
      const hud = one('.featured-rail__hud');
      const bar = one('.featured-rail__hud-bar i');
      const hudIndex = one('[data-hud-index]');
      const ghost = one('.featured-rail__ghost');
      const grid = one('.featured-rail__grid');
      const stage = one('.featured-rail__stage');
      const cards = all('.featured-project-card', track);
      const images = cards.map((c) => c.querySelector<HTMLElement>('img')!);
      const TOTAL = 9;
      const getDistance = () =>
        Math.max(0, cards[cards.length - 1].offsetLeft - cards[0].offsetLeft);

      /* 1. Sheet corners flatten as the section reaches the top */
      gsap.fromTo(
        section,
        { borderTopLeftRadius: 36, borderTopRightRadius: 36 },
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true },
        },
      );

      /* 2. Intro reveal: plays once as the sheet rises into view */
      const counters: Array<() => void> = [];
      const introIn = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      introIn
        .from(all('.featured-rail__intro .eyebrow > span'), { opacity: 0, y: 12, stagger: 0.1, duration: 0.6 }, 0)
        .from(
          all('#featured-rail-title .rail-word__inner'),
          {
            rotationX: -95,
            yPercent: 40,
            opacity: 0,
            transformOrigin: '50% 100% -60px',
            transformPerspective: 900,
            stagger: 0.12,
            duration: 1.1,
            ease: 'expo.out',
          },
          0.1,
        )
        .from(
          all('.featured-rail__stat'),
          { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)', stagger: 0.15, duration: 0.9 },
          0.7,
        )
        .from(all('.featured-rail__hint > *'), { opacity: 0, x: -16, stagger: 0.1, duration: 0.6 }, 1.1);

      all('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const counter = { v: 0 };
        el.textContent = '0';
        introIn.to(
          counter,
          {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = String(Math.round(counter.v));
            },
          },
          0.8,
        );
        counters.push(() => {
          el.textContent = String(target);
        });
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => introIn.play(),
      });

      /* 3. Per-card text timelines */
      const textTls = cards.map((card) => {
        const within = (sel: string) => all(sel, card);
        return gsap
          .timeline({ paused: true, defaults: { ease: 'power3.out' } })
          .from(within('.featured-project-card__index'), { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 0)
          .fromTo(
            within('.featured-project-card__meta'),
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.inOut' },
            0.05,
          )
          .from(
            within('.rail-char__inner'),
            { yPercent: 120, rotationZ: 7, opacity: 0, transformOrigin: '0% 100%', stagger: 0.022, duration: 0.8, ease: 'power4.out' },
            0.1,
          )
          .from(within('.featured-project-card__summary'), { opacity: 0, y: 22, filter: 'blur(10px)', duration: 0.9 }, 0.4)
          .from(within('.featured-project-card__highlights li'), { opacity: 0, x: 70, stagger: 0.12, duration: 0.7 }, 0.55)
          .from(
            within('.featured-project-card__tech span'),
            { scale: 0.3, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'back.out(2.5)' },
            0.9,
          )
          .from(within('.featured-project-card__bottom > *'), { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, 1.1);
      });

      /* 4. Master scrubbed timeline */
      gsap.set(viewport, { transformOrigin: '50% 50%', transformPerspective: 1600 });
      gsap.set(intro, { transformOrigin: '50% 40%', transformPerspective: 1200 });
      gsap.set(outro, { autoAlpha: 0 }); // ensure outro starts hidden

      const statementWords = all('.featured-rail__statement .rail-word__inner');
      const outroWords = all('.featured-rail__outro h2 .rail-word__inner');
      const outroText = all('.featured-rail__outro-text .rail-word__inner');

      const tl = gsap.timeline({ defaults: { ease: 'none' } });

      // background depth layers drift
      tl.to(ghost, { xPercent: -38, duration: TOTAL }, 0)
        .to(grid, { backgroundPosition: '0px 1360px', duration: TOTAL }, 0);

      // Statement text fill-in during intro dwell
      tl.fromTo(
        statementWords,
        { opacity: 0.14 },
        { opacity: 1, stagger: { each: 0.7 / statementWords.length }, duration: 0.18 },
        0.1,
      );

      // 1.0 → 1.9: Intro falls back in Z while viewport cards rise into place cleanly
      tl.to(
        intro,
        { z: -500, rotationX: 14, yPercent: -18, autoAlpha: 0, duration: 0.9, ease: 'power2.in' },
        1.0,
      )
        .fromTo(
          viewport,
          { yPercent: 110, rotationX: 22, scale: 0.9 },
          { yPercent: 0, rotationX: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
          1.0,
        )
        .fromTo(hud, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.5);

      // 1.9 → 5.9: Horizontal travel of cards
      tl.to(track, { x: () => -getDistance(), duration: 4 }, 1.9)
        .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 4 }, 1.9);

      // 5.9 → 6.5: Cards leave upward smoothly
      tl.to(
        viewport,
        { yPercent: -45, rotationX: -16, scale: 0.82, autoAlpha: 0, duration: 0.6, ease: 'power2.in' },
        5.9,
      ).to(hud, { autoAlpha: 0, y: -20, duration: 0.3 }, 5.9);

      // 6.6 → 7.6: Outro sequence starts cleanly AFTER cards have cleared out
      tl.fromTo(outro, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 6.6)
        .from(all('.featured-rail__outro .eyebrow > span'), { opacity: 0, y: 12, stagger: 0.05, duration: 0.3, ease: 'power3.out' }, 6.7)
        .from(
          outroWords,
          {
            rotationY: -90,
            xPercent: -30,
            opacity: 0,
            transformOrigin: '0% 50%',
            transformPerspective: 900,
            stagger: 0.08,
            duration: 0.4,
            ease: 'power3.out',
          },
          6.8,
        )
        .from(outroText, { yPercent: 110, stagger: 0.015, duration: 0.3, ease: 'power3.out' }, 7.1)
        .from(all('.featured-rail__cta'), { scale: 0.6, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, 7.4);

      // 8 → 9: Footer rises over it, stage tilts back and dims
      tl.to(
        stage,
        {
          scale: 0.9,
          opacity: 0.5,
          rotationX: 6,
          yPercent: -3,
          transformPerspective: 1200,
          transformOrigin: '50% 100%',
          duration: 1,
          ease: 'none',
        },
        TOTAL - 1,
      ).set({}, {}, TOTAL);

      /* 5. Per-frame card 3D + active-card detection optimized */
      const setters = cards.map((card, i) => ({
        rotY: gsap.quickSetter(card, 'rotationY'),
        scale: gsap.quickSetter(card, 'scale'),
        z: gsap.quickSetter(card, 'z', 'px'),
        opacity: gsap.quickSetter(card, 'opacity'),
        imgX: gsap.quickSetter(images[i], 'xPercent'),
      }));
      gsap.set(cards, { transformPerspective: 1400, force3D: true });

      let centers: number[] = [];
      let vw = window.innerWidth;
      const measure = () => {
        vw = window.innerWidth;
        centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
      };

      let active = -1;
      const updateCards = () => {
        const time = tl.time();
        const trackX = gsap.getProperty(track, 'x') as number;
        let nearest = 0;
        let nearestDist = Infinity;

        cards.forEach((_, i) => {
          const raw = (centers[i] + trackX - vw / 2) / (vw * 0.72);
          const d = gsap.utils.clamp(-1.3, 1.3, raw);
          const a = Math.min(Math.abs(d), 1);
          const s = setters[i];
          s.rotY(d * 24);
          s.scale(1 - a * 0.12);
          s.z(-a * 140);
          s.opacity(1 - a * 0.4);
          s.imgX(-d * 8);
          if (Math.abs(d) < nearestDist) {
            nearestDist = Math.abs(d);
            nearest = i;
          }
        });

        const next = time > 1.45 && time < 6.2 ? nearest : -1;
        if (next !== active) {
          if (active >= 0) {
            cards[active].classList.remove('is-active');
            textTls[active].timeScale(1.8).reverse();
          }
          if (next >= 0) {
            cards[next].classList.add('is-active');
            textTls[next].timeScale(1).play();
            hudIndex.textContent = String(next + 1).padStart(2, '0');
          }
          active = next;
        }
      };

      tl.eventCallback('onUpdate', updateCards);

      const trigger = ScrollTrigger.create({
        animation: tl,
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * TOTAL}`, // Fixed syntax error here
        pin: true,
        scrub: 0.5, // Balanced smooth scrubbing to reduce lag
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          updateCards();
        },
      });

      measure();
      updateCards();

      return () => {
        trigger.kill();
        cards.forEach((c) => c.classList.remove('is-active'));
        counters.forEach((reset) => reset());
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section className="featured-rail" ref={sectionRef} id="featured-work" aria-labelledby="featured-rail-title">
      <div className="featured-rail__grid" aria-hidden="true" />
      <div className="featured-rail__ghost" aria-hidden="true">
        SELECTED WORK — BUILT WITH PURPOSE — MADE TO MOVE — SELECTED WORK — BUILT WITH PURPOSE —
      </div>

      <div className="featured-rail__stage">
        {/* ---------- intro ---------- */}
        <div className="featured-rail__intro">
          <p className="eyebrow eyebrow--light">
            <span className="eyebrow__dot" />
            <span>SELECTED WORK / 2023—26</span>
            <span className="eyebrow__line" />
          </p>
          <h2 id="featured-rail-title">
            <Words text="Built with" /> <em><Words text="purpose." /></em>
            <br />
            <Words text="Made to" /> <em><Words text="move." /></em>
          </h2>

          <div className="featured-rail__intro-lower">
            <p className="featured-rail__statement">
              <Words text={STATEMENT} />
            </p>
            <dl className="featured-rail__stats">
              {STATS.map((s) => (
                <div className="featured-rail__stat" key={s.label}>
                  <dt className="featured-rail__stat-num">
                    <span data-count={s.value}>{s.value}</span>
                    {s.suffix}
                  </dt>
                  <dd>{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="featured-rail__hint">
            <span className="featured-rail__hint-line" />
            <span>SCROLL TO TRAVEL</span>
            <span aria-hidden="true">↓</span>
          </div>
        </div>

        {/* ---------- cards ---------- */}
        <div className="featured-rail__viewport" ref={viewportRef}>
          <div className="featured-rail__track" ref={trackRef}>
            {featuredProjects.map((project, i) => (
              <FeaturedCard
                key={project.id}
                project={project}
                index={i}
                total={featuredProjects.length}
                onOpenWork={onOpenWork}
              />
            ))}
          </div>
        </div>

        {/* ---------- outro ---------- */}
        <div className="featured-rail__outro">
          <p className="eyebrow eyebrow--light">
            <span className="eyebrow__dot" />
            <span>NEXT / THE WHOLE INDEX</span>
          </p>
          <h2>
            <Words text="Four builds." /> <em><Words text="Endless" /></em> <Words text="iterations." />
          </h2>
          <p className="featured-rail__outro-text">
            <Words
              mask
              text="From JWT-secured APIs to liquid cursor experiments, every project has a case file with the stack, the decisions and the details behind it."
            />
          </p>
          <button className="featured-rail__cta" type="button" onClick={() => onOpenWork(0)}>
            OPEN PROJECT INDEX <span aria-hidden="true">↗</span>
          </button>
        </div>

        {/* ---------- HUD ---------- */}
        <div className="featured-rail__hud">
          <span className="featured-rail__hud-count">
            <b data-hud-index>01</b> / {String(featuredProjects.length).padStart(2, '0')}
          </span>
          <span className="featured-rail__hud-bar" aria-hidden="true"><i /></span>
          <button type="button" onClick={() => onOpenWork(0)}>
            OPEN PROJECT INDEX <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}