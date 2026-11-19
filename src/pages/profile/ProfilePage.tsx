// import { useLayoutEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import GlareCard from '../../components/projects/GlareCard';
// import { projects } from '../../components/projects/projectData';
// // import SceneBackdrop from '../../components/scenes/SceneBackdrop';
// // import SceneBar from '../../components/scenes/SceneBar';
// // import useSceneReveal from '../../components/scenes/useSceneReveal';
// import useSmoothScroll from '../../hooks/useSmoothScroll';
// import { Chars, Words } from '../work/split';
// import {
//   ABOUT, ACHIEVEMENTS, BELIEF, CERTIFICATIONS, FACTS, HERO_LEAD, JOURNEY, MARQUEE, PROFILE, ROLES, SKILL_GROUPS, STATS,
// } from './ProfileData';
// import './ProfilePage.css';
// import { useState } from 'react';
// import CursorKnot from './CursorKnot';
// import { ProfileSceneBackdrop, ProfileSceneBar, useWorkingScenes } from './Profilescenes';
// import SiteFooter from '../../components/SiteFooter';
// import type { PortfolioPage } from '../../components/navigation/SiteNav';
// import './ProfilePage.css';
// import './ProfilePage.theme.css'; // must come after ProfilePage.css

// gsap.registerPlugin(ScrollTrigger);

// /**
//  * The 5 backgrounds the hover bar cycles through (it loops forever).
//  * Use remote links or files in /public/images. A link that fails to load is skipped automatically.
//  */
// const SCENES = [
//   'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1920&q=70',
//   'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1920&q=70',
//   'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1920&q=70',
//   'https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=1920&q=70',
//   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1920&q=70',
// ];

// const pad = (n: number) => String(n).padStart(2, '0');

// /** Types `text` into `el` by resolving letters left to right out of random glyphs. */
// function scramble(el: HTMLElement, text: string, duration: number) {
//   const glyphs = '!<>-_\\/[]{}—=+*^?#';
//   const state = { progress: 0 };
//   return gsap.to(state, {
//     progress: 1,
//     duration,
//     ease: 'none',
//     onUpdate: () => {
//       const done = Math.floor(state.progress * text.length);
//       let out = text.slice(0, done);
//       for (let i = done; i < text.length; i += 1) {
//         out += text[i] === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)];
//       }
//       el.textContent = out;
//     },
//     onComplete: () => {
//       el.textContent = text;
//     },
//   });
// }

// export default function ProfilePage({ onNavigate }: { onNavigate: (page: PortfolioPage, projectIndex?: number) => void }) {
//   useSmoothScroll();
//   const pageRef = useRef<HTMLElement>(null);
//   // const { backdropRef, barRef } = useSceneReveal(SCENES);

 
//   const scenes = useWorkingScenes(SCENES);
//   const [activeScene, setActiveScene] = useState<number | null>(null);
//   useLayoutEffect(() => {
//     const page = pageRef.current;
//     if (!page) return;

//     const media = gsap.matchMedia();
//     media.add('(prefers-reduced-motion: no-preference)', () => {
//       const q = (selector: string, scope: Element = page) => gsap.utils.toArray<HTMLElement>(selector, scope);
//       // PACE is the one knob for speed: raise it for slower, calmer animations, lower it for snappier ones.
//       const PACE = 1.5;
//       const d = (seconds: number) => seconds * PACE;
//       const enter = (trigger: Element, start = 'top 80%') => ({
//         trigger,
//         start,
//         toggleActions: 'play none none reverse',
//       });

//       /* ---------- hero intro ---------- */
//       gsap
//         .timeline({ delay: 0.3, defaults: { ease: 'power3.out' } })
//         .from(q('.pr-portrait'), { clipPath: 'inset(0% 0% 100% 0%)', duration: d(1), ease: 'power3.inOut' }, 0)
//         .from(q('.pr-eyebrow'), { opacity: 0, x: -20, duration: d(0.6) }, 0.1)
//         .from(q('.pr-hero__title .ch-i'), { yPercent: 120, rotationZ: 6, opacity: 0, stagger: d(0.03), duration: d(0.9), ease: 'power4.out' }, 0.25)
//         .from(q('.pr-role'), { opacity: 0, y: 16, duration: d(0.6) }, d(0.7))
//         .from(q('.pr-hero__lead .wd-i'), { yPercent: 105, opacity: 0, stagger: d(0.016), duration: d(0.7) }, d(0.85))
//         .from(q('[data-late]'), { opacity: 0, y: 24, stagger: d(0.1), duration: d(0.7) }, d(1.1));

//       /* ---------- role line: scrambles from one role to the next ---------- */
//       const roleEl = q('.pr-role__text')[0];
//       let roleIndex = 0;
//       let scrambling: gsap.core.Tween | null = null;
//       const roleLoop = roleEl
//         ? gsap
//             .timeline({ repeat: -1, delay: 3.4 })
//             .call(() => {
//               roleIndex = (roleIndex + 1) % ROLES.length;
//               scrambling?.kill();
//               scrambling = scramble(roleEl, ROLES[roleIndex], d(0.7));
//             })
//             .to({}, { duration: 3.2 })
//         : null;

//       /* ---------- headings: words flip up out of a mask ---------- */
//       q('[data-anim="heading"]').forEach((el) => {
//         gsap.from(q('.wd-i', el), {
//           yPercent: 115,
//           rotationX: -80,
//           opacity: 0,
//           transformOrigin: '50% 100%',
//           transformPerspective: 800,
//           stagger: d(0.07),
//           duration: d(0.95),
//           ease: 'expo.out',
//           scrollTrigger: enter(el, 'top 82%'),
//         });
//       });

//       /* ---------- about: the paragraph fills in word by word with the scroll ---------- */
//       q('[data-anim="fill"]').forEach((el) => {
//         gsap.fromTo(
//           q('.wd-i', el),
//           { opacity: 0.14 },
//           { opacity: 1, ease: 'none', stagger: 0.12, duration: 0.4, scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 38%', scrub: 1 } },
//         );
//       });
//       q('[data-anim="rows"]').forEach((list) => {
//         gsap.from(q('.pr-fact', list), { y: 36, opacity: 0, stagger: d(0.12), duration: d(0.8), ease: 'power3.out', scrollTrigger: enter(list, 'top 82%') });
//       });

//       /* ---------- stats: wipe in and count up ---------- */
//       q('[data-anim="wipe"]').forEach((el, i) => {
//         gsap.fromTo(
//           el,
//           { clipPath: 'inset(0% 0% 100% 0%)' },
//           { clipPath: 'inset(0% 0% 0% 0%)', duration: d(0.9), delay: i * 0.12, ease: 'power3.inOut', scrollTrigger: enter(el, 'top 86%') },
//         );
//       });
//       q('[data-count]').forEach((el) => {
//         const target = Number(el.dataset.count);
//         const decimals = Number(el.dataset.decimals ?? 0);
//         const counter = { value: 0 };
//         el.textContent = (0).toFixed(decimals);
//         gsap.to(counter, {
//           value: target,
//           duration: 2.4,
//           ease: 'power2.out',
//           onUpdate: () => {
//             el.textContent = counter.value.toFixed(decimals);
//           },
//           scrollTrigger: { trigger: el, start: 'top 88%', once: true },
//         });
//       });

//       /* ---------- toolkit: cards swing up, chips pop ---------- */
//       q('.pr-skill-grid').forEach((grid) => {
//         gsap.from(q('.pr-anim-card', grid), {
//           y: 90,
//           opacity: 0,
//           rotationX: -28,
//           rotationY: 8,
//           transformPerspective: 900,
//           transformOrigin: '50% 100%',
//           stagger: d(0.14),
//           duration: d(1),
//           ease: 'expo.out',
//           scrollTrigger: enter(grid, 'top 78%'),
//         });
//         q('.pr-anim-card', grid).forEach((card) => {
//           gsap.from(q('.pr-chip', card), {
//             scale: 0.4,
//             opacity: 0,
//             stagger: d(0.05),
//             duration: d(0.5),
//             ease: 'back.out(2.5)',
//             scrollTrigger: enter(card, 'top 68%'),
//           });
//         });
//       });

//       /* ---------- journey: a line draws down the page, moments arrive from alternating sides ---------- */
//       const journey = page.querySelector('.pr-journey__list');
//       const journeyFill = page.querySelector('.pr-journey__fill');
//       if (journey && journeyFill) {
//         gsap.fromTo(
//           journeyFill,
//           { scaleY: 0 },
//           { scaleY: 1, ease: 'none', scrollTrigger: { trigger: journey, start: 'top 65%', end: 'bottom 60%', scrub: 1 } },
//         );
//         const wide = window.innerWidth >= 900;
//         q('.pr-moment', journey).forEach((item, i) => {
//           const fromLeft = wide ? i % 2 === 0 : false;
//           const shift = wide ? 90 : 40;
//           gsap.from(q('.pr-moment__card', item), {
//             x: fromLeft ? -shift : shift,
//             opacity: 0,
//             rotationY: wide ? (fromLeft ? 14 : -14) : 0,
//             transformPerspective: 900,
//             duration: d(1),
//             ease: 'expo.out',
//             scrollTrigger: enter(item, 'top 80%'),
//           });
//           gsap.from(q('.pr-moment__dot', item), { scale: 0, duration: d(0.5), ease: 'back.out(3)', scrollTrigger: enter(item, 'top 80%') });
//           ScrollTrigger.create({
//             trigger: item,
//             start: 'top 58%',
//             end: 'bottom 45%',
//             toggleClass: { targets: item, className: 'is-active' },
//           });
//         });
//       }

//       /* ---------- proof cards + project rows ---------- */
//       q('[data-anim="cards"]').forEach((group) => {
//         gsap.from(q('.pr-anim-card', group), {
//           y: 70,
//           opacity: 0,
//           rotationX: -22,
//           transformPerspective: 900,
//           transformOrigin: '50% 100%',
//           stagger: d(0.16),
//           duration: d(1),
//           ease: 'expo.out',
//           scrollTrigger: enter(group, 'top 80%'),
//         });
//       });
//       q('.pr-row').forEach((row) => {
//         gsap.from(row, { opacity: 0, y: 44, duration: d(0.8), ease: 'power3.out', scrollTrigger: enter(row, 'top 88%') });
//         gsap.from(q('.pr-row__line', row), { scaleX: 0, transformOrigin: '0% 50%', duration: d(1), ease: 'power3.inOut', scrollTrigger: enter(row, 'top 88%') });
//       });

//       /* ---------- belief: the two lines drift in opposite directions as you scroll ---------- */
//       const belief = page.querySelector('.pr-belief');
//       if (belief) {
//         q('.pr-belief__line', belief).forEach((line, i) => {
//           gsap.fromTo(
//             line,
//             { xPercent: i % 2 === 0 ? 14 : -14 },
//             { xPercent: i % 2 === 0 ? -6 : 6, ease: 'none', scrollTrigger: { trigger: belief, start: 'top bottom', end: 'bottom top', scrub: 1 } },
//           );
//         });
//       }
//       gsap.from(q('.pr-tile'), { y: 30, opacity: 0, scale: 0.9, stagger: d(0.04), duration: d(0.6), ease: 'back.out(1.6)', clearProps: 'all', scrollTrigger: enter(q('.pr-skills')[0], 'top 85%') });
//       return () => {

//         roleLoop?.kill();
//         scrambling?.kill();
//         if (roleEl) roleEl.textContent = ROLES[0];
//         // show the real numbers again if the animations are reverted
//         q('[data-count]').forEach((el) => {
//           el.textContent = Number(el.dataset.count).toFixed(Number(el.dataset.decimals ?? 0));
//         });
//       };
//     });

//     return () => media.revert();
//   }, []);

//   return (
//     <>
//           <main ref={pageRef} className="pr" id="myprofile">
//       {/* <SceneBackdrop ref={backdropRef} /> */}
//       <ProfileSceneBackdrop scenes={scenes} active={activeScene} />
//       {/* ---------- hero ---------- */}
//       <section className="pr-hero">
//         <div className="pr-hero__copy">
//           <p className="pr-eyebrow"><span /> PROFILE / FULL STACK DEVELOPER</p>
//           <h1 className="pr-hero__title" aria-label="Code with character.">
//             <Chars text="Code with" />
//             <br />
//             <em><Chars text="character." /></em>
//           </h1>
//           <p className="pr-role">
//             <span className="pr-role__pre">I’m a</span>
//             <span className="pr-role__text" aria-hidden="true">{ROLES[0]}</span>
//             <span className="sr-only">Full Stack Developer</span>
//           </p>
//           <p className="pr-hero__lead"><Words text={HERO_LEAD} /></p>

//           <div className="pr-hero__bar" data-late>
//             {/* <SceneBar ref={barRef} total={SCENES.length} /> */}
//             <ProfileSceneBar total={scenes.length} active={activeScene} onSelect={setActiveScene} />
//           </div>

//           <div className="pr-links" data-late>
//             <a href={PROFILE.resume} download>RESUME <span aria-hidden="true">↓</span></a>
//             <a href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB <span aria-hidden="true">↗</span></a>
//             <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LINKEDIN <span aria-hidden="true">↗</span></a>
//             <a href={`mailto:${PROFILE.email}`}>EMAIL <span aria-hidden="true">↗</span></a>
//           </div>
//         </div>

//         <figure className="pr-portrait">
//           <GlareCard className="pr-portrait__frame" label="Portrait placeholder">
//             {/* <img
//               src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80"
//               alt="Placeholder portrait: replace with a personal photo when ready"
//               loading="eager"
//               decoding="async"
//             /> */}
//             <CursorKnot/>
//             <span className="pr-portrait__stamp">STAY<br />CURIOUS</span>
//           </GlareCard>
//           <figcaption><span>{PROFILE.location.toUpperCase()}</span><span>FIG. 01</span></figcaption>
//         </figure>
//       </section>

//       {/* ---------- stack marquee ---------- */}
//       {/* <div className="pr-marquee" aria-hidden="true">
//         <div className="pr-marquee__track">
//           {[0, 1].map((group) => (
//             <div className="pr-marquee__group" key={group}>
//               {MARQUEE.map((item) => (
//                 <span key={item}>{item}<i>✦</i></span>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div> */}
//       <section className="pr-skills" aria-label="Skills">
//         <div
//           className="pr-skills__grid"
//           onPointerMove={(e) => {
//             const tile = (e.target as HTMLElement).closest<HTMLElement>('.pr-tile');
//             if (!tile) return;
//             const r = tile.getBoundingClientRect();
//             tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
//             tile.style.setProperty('--my', `${e.clientY - r.top}px`);
//           }}
//         >
//           {MARQUEE.map((item) => <div className="pr-tile" key={item}><span>{item}</span><i>✦</i></div>)}
//         </div>
//       </section>

//       {/* ---------- 01 about ---------- */}
//       <section className="pr-section">
//         <p className="pr-label"><span>01</span> About</p>
//         <div className="pr-about">
//           <p className="pr-about__lead" data-anim="fill"><Words text={ABOUT} /></p>
//           <dl className="pr-facts" data-anim="rows">
//             {FACTS.map((fact) => (
//               <div className="pr-fact" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
//             ))}
//           </dl>
//         </div>
//       </section>

//       {/* ---------- stats ---------- */}
//       <section className="pr-section pr-section--tight">
//         <div className="pr-stats">
//           {STATS.map((stat) => (
//             <div className="pr-stat" key={stat.label} data-anim="wipe">
//               <p className="pr-stat__value">
//                 <span data-count={stat.to} data-decimals={stat.decimals ?? 0}>{stat.to.toFixed(stat.decimals ?? 0)}</span>
//                 {stat.suffix}
//               </p>
//               <p className="pr-stat__label">{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ---------- 02 toolkit ---------- */}
//       <section className="pr-section">
//         <p className="pr-label"><span>02</span> Toolkit</p>
//         <h2 className="pr-h" data-anim="heading"><Words text="Six layers of the same craft." /></h2>
//         <div className="pr-skill-grid">
//           {SKILL_GROUPS.map((group, i) => (
//             <div className="pr-anim-card" key={group.title}>
//               <GlareCard className="pr-card" label={group.title}>
//                 <span className="pr-card__num">{pad(i + 1)} / {pad(SKILL_GROUPS.length)}</span>
//                 <h3>{group.title}</h3>
//                 <p>{group.note}</p>
//                 <div className="pr-card__chips">
//                   {group.skills.map((skill) => <span className="pr-chip" key={skill}>{skill}</span>)}
//                 </div>
//               </GlareCard>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ---------- 03 journey ---------- */}
//       <section className="pr-section">
//         <p className="pr-label"><span>03</span> Journey</p>
//         <h2 className="pr-h" data-anim="heading"><Words text="From the classroom to cloud-deployed systems." /></h2>
//         <div className="pr-journey">
//           <span className="pr-journey__line" aria-hidden="true"><i className="pr-journey__fill" /></span>
//           <ol className="pr-journey__list">
//             {JOURNEY.map((moment) => (
//               <li className={`pr-moment pr-moment--${moment.kind}`} key={moment.title}>
//                 <span className="pr-moment__dot" aria-hidden="true" />
//                 <div className="pr-moment__card">
//                   <p className="pr-moment__when">{moment.when}</p>
//                   <h3>{moment.title}</h3>
//                   <p>{moment.text}</p>
//                 </div>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </section>

//       {/* ---------- 04 proof ---------- */}
//       <section className="pr-section">
//         <p className="pr-label"><span>04</span> Practice and certificates</p>
//         <div className="pr-proof" data-anim="cards">
//           <div className="pr-anim-card">
//             <GlareCard className="pr-card" label="Achievements">
//               <span className="pr-card__num">ACHIEVEMENTS</span>
//               {ACHIEVEMENTS.map((item) => <h3 key={item}>{item}</h3>)}
//             </GlareCard>
//           </div>
//           <div className="pr-anim-card">
//             <GlareCard className="pr-card" label="Certifications">
//               <span className="pr-card__num">CERTIFICATIONS</span>
//               <div className="pr-card__chips pr-card__chips--big">
//                 {CERTIFICATIONS.map((item) => <span className="pr-chip" key={item}>{item}</span>)}
//               </div>
//             </GlareCard>
//           </div>
//         </div>
//       </section>

//       {/* ---------- 05 work ---------- */}
//       <section className="pr-section">
//         <p className="pr-label"><span>05</span> The proof</p>
//         <h2 className="pr-h" data-anim="heading"><Words text="Three projects, with the reasoning behind each." /></h2>
//         <div className="pr-rows">
//           {projects.map((project) => (
//             <a className="pr-row" href="#mywork" key={project.id}>
//               <span className="pr-row__line" aria-hidden="true" />
//               <span className="pr-row__num">{project.number}</span>
//               <strong>{project.title}</strong>
//               <span className="pr-row__tech">{project.tech.slice(0, 3).join(' · ')}</span>
//               <span className="pr-row__date">{project.date}</span>
//               <span className="pr-row__arrow" aria-hidden="true">↗</span>
//             </a>
//           ))}
//         </div>
//       </section>

//       {/* ---------- belief ---------- */}
//       <section className="pr-belief">
//         <p className="pr-belief__tag">MY WORKING BELIEF</p>
//         {BELIEF.map((line) => (
//           <p className="pr-belief__line" key={line}>{line}</p>
//         ))}
//       </section>

  
//     </main>
//     <SiteFooter onNavigate={onNavigate} />
//     </>

//   );
// }
import { useEffect,useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlareCard from '../../components/projects/GlareCard';
import { projects } from '../../components/projects/projectData';
// import SiteFooter from '../../components/SiteFooter';
//  import type { PortfolioPage } from '../../components/navigation/SiteNav';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import { Chars, Words } from '../work/split';
// import CursorKnot from './CursorKnot';
import SkillDisc from './Skilldisc';
import { ProfileSceneBackdrop, ProfileSceneBar, useSceneCycle, useWorkingScenes } from './Profilescenes';
import {
  ABOUT, ACHIEVEMENTS, BELIEF, CERTIFICATIONS, FACTS, HERO_LEAD, JOURNEY, MARQUEE, PROFILE, ROLES, SKILL_GROUPS, STATS,
} from './ProfileData';
import './ProfilePage.css';
import './Profilepage.theme.css'; // must come after ProfilePage.css
import spiderman from '../../assets/spidermangif.mp4';
import flowers from '../../assets/flowers.mp4';
import autumn from '../../assets/autumn.jpeg';
import cozy from '../../assets/cozy.jpeg';
import relax from '../../assets/relax.mp4';

import CatSlot from './CatSlot';
gsap.registerPlugin(ScrollTrigger);
 // three.js only loads when Profile opens
/**
 * The 5 backgrounds the energy bar cycles through. Charge all 5 boxes once to apply the next image.
 * Use remote links or files in /public/images. A link that fails to load is skipped automatically.
 */
const SCENES = [
  autumn,
  spiderman,
  flowers,
  cozy,
  relax,
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Types `text` into `el` by resolving letters left to right out of random glyphs. */
function scramble(el: HTMLElement, text: string, duration: number) {
  const glyphs = '!<>-_\\/[]{}—=+*^?#';
  const state = { progress: 0 };
  return gsap.to(state, {
    progress: 1,
    duration,
    ease: 'none',
    onUpdate: () => {
      const done = Math.floor(state.progress * text.length);
      let out = text.slice(0, done);
      for (let i = done; i < text.length; i += 1) {
        out += text[i] === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = text;
    },
  });
}



export default function ProfilePage( ) {
  useSmoothScroll();
  const pageRef = useRef<HTMLElement>(null);
  const scenes = useWorkingScenes(SCENES);
  const cycle = useSceneCycle(scenes.length);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const q = (selector: string, scope: Element = page) => gsap.utils.toArray<HTMLElement>(selector, scope);
      // PACE is the one knob for speed: raise it for slower, calmer animations, lower it for snappier ones.
      const PACE = 1.5;
      const d = (seconds: number) => seconds * PACE;
      const enter = (trigger: Element, start = 'top 80%') => ({
        trigger,
        start,
        toggleActions: 'play none none reverse',
      });

      /* ---------- hero intro ---------- */
      gsap
        .timeline({ delay: 0.3, defaults: { ease: 'power3.out' } })
        .from(q('.pr-portrait'), { clipPath: 'inset(0% 0% 100% 0%)', duration: d(1), ease: 'power3.inOut' }, 0)
        .from(q('.pr-eyebrow'), { opacity: 0, x: -20, duration: d(0.6) }, 0.1)
        .from(q('.pr-hero__title .ch-i'), { yPercent: 120, rotationZ: 6, opacity: 0, stagger: d(0.03), duration: d(0.9), ease: 'power4.out' }, 0.25)
        .from(q('.pr-role'), { opacity: 0, y: 16, duration: d(0.6) }, d(0.7))
        .from(q('.pr-hero__lead .wd-i'), { yPercent: 105, opacity: 0, stagger: d(0.016), duration: d(0.7) }, d(0.85))
        .from(q('[data-late]'), { opacity: 0, y: 24, stagger: d(0.1), duration: d(0.7) }, d(1.1));

      /* ---------- role line: scrambles from one role to the next ---------- */
      const roleEl = q('.pr-role__text')[0];
      let roleIndex = 0;
      let scrambling: gsap.core.Tween | null = null;
      const roleLoop = roleEl
        ? gsap
            .timeline({ repeat: -1, delay: 3.4 })
            .call(() => {
              roleIndex = (roleIndex + 1) % ROLES.length;
              scrambling?.kill();
              scrambling = scramble(roleEl, ROLES[roleIndex], d(0.7));
            })
            .to({}, { duration: 3.2 })
        : null;

      /* ---------- headings: words flip up out of a mask ---------- */
      q('[data-anim="heading"]').forEach((el) => {
        gsap.from(q('.wd-i', el), {
          yPercent: 115,
          rotationX: -80,
          opacity: 0,
          transformOrigin: '50% 100%',
          transformPerspective: 800,
          stagger: d(0.07),
          duration: d(0.95),
          ease: 'expo.out',
          scrollTrigger: enter(el, 'top 82%'),
        });
      });

      /* ---------- skills disc: spins up into place ---------- */
      const skills = q('.pr-skills')[0];
      if (skills) {
        gsap.from(q('.pr-cd', skills), {
          scale: 0.6,
          opacity: 0,
          rotation: -50,
          duration: d(1.1),
          ease: 'expo.out',
          clearProps: 'all',
          scrollTrigger: enter(skills, 'top 80%'),
        });
      }

      /* ---------- about: the paragraph fills in word by word with the scroll ---------- */
      q('[data-anim="fill"]').forEach((el) => {
        gsap.fromTo(
          q('.wd-i', el),
          { opacity: 0.14 },
          { opacity: 1, ease: 'none', stagger: 0.12, duration: 0.4, scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 38%', scrub: 1 } },
        );
      });
      q('[data-anim="rows"]').forEach((list) => {
        gsap.from(q('.pr-fact', list), { y: 36, opacity: 0, stagger: d(0.12), duration: d(0.8), ease: 'power3.out', scrollTrigger: enter(list, 'top 82%') });
      });

      /* ---------- stats: wipe in and count up ---------- */
      q('[data-anim="wipe"]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: d(0.9), delay: i * 0.12, ease: 'power3.inOut', scrollTrigger: enter(el, 'top 86%') },
        );
      });
      q('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals ?? 0);
        const counter = { value: 0 };
        el.textContent = (0).toFixed(decimals);
        gsap.to(counter, {
          value: target,
          duration: 2.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = counter.value.toFixed(decimals);
          },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      /* ---------- toolkit: cards swing up, chips pop ---------- */
      q('.pr-skill-grid').forEach((grid) => {
        gsap.from(q('.pr-anim-card', grid), {
          y: 90,
          opacity: 0,
          rotationX: -28,
          rotationY: 8,
          transformPerspective: 900,
          transformOrigin: '50% 100%',
          stagger: d(0.14),
          duration: d(1),
          ease: 'expo.out',
          scrollTrigger: enter(grid, 'top 78%'),
        });
        q('.pr-anim-card', grid).forEach((card) => {
          gsap.from(q('.pr-chip', card), {
            scale: 0.4,
            opacity: 0,
            stagger: d(0.05),
            duration: d(0.5),
            ease: 'back.out(2.5)',
            scrollTrigger: enter(card, 'top 68%'),
          });
        });
      });

      /* ---------- journey: a line draws down the page, moments arrive from alternating sides ---------- */
      const journey = page.querySelector('.pr-journey__list');
      const journeyFill = page.querySelector('.pr-journey__fill');
      if (journey && journeyFill) {
        gsap.fromTo(
          journeyFill,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: journey, start: 'top 65%', end: 'bottom 60%', scrub: 1 } },
        );
        const wide = window.innerWidth >= 900;
        q('.pr-moment', journey).forEach((item, i) => {
          const fromLeft = wide ? i % 2 === 0 : false;
          const shift = wide ? 90 : 40;
          gsap.from(q('.pr-moment__card', item), {
            x: fromLeft ? -shift : shift,
            opacity: 0,
            rotationY: wide ? (fromLeft ? 14 : -14) : 0,
            transformPerspective: 900,
            duration: d(1),
            ease: 'expo.out',
            scrollTrigger: enter(item, 'top 80%'),
          });
          gsap.from(q('.pr-moment__dot', item), { scale: 0, duration: d(0.5), ease: 'back.out(3)', scrollTrigger: enter(item, 'top 80%') });
          ScrollTrigger.create({
            trigger: item,
            start: 'top 58%',
            end: 'bottom 45%',
            toggleClass: { targets: item, className: 'is-active' },
          });
        });
      }

      /* ---------- proof cards + project rows ---------- */
      q('[data-anim="cards"]').forEach((group) => {
        gsap.from(q('.pr-anim-card', group), {
          y: 70,
          opacity: 0,
          rotationX: -22,
          transformPerspective: 900,
          transformOrigin: '50% 100%',
          stagger: d(0.16),
          duration: d(1),
          ease: 'expo.out',
          scrollTrigger: enter(group, 'top 80%'),
        });
      });
      q('.pr-row').forEach((row) => {
        gsap.from(row, { opacity: 0, y: 44, duration: d(0.8), ease: 'power3.out', scrollTrigger: enter(row, 'top 88%') });
        gsap.from(q('.pr-row__line', row), { scaleX: 0, transformOrigin: '0% 50%', duration: d(1), ease: 'power3.inOut', scrollTrigger: enter(row, 'top 88%') });
      });

      /* ---------- belief: the two lines drift in opposite directions as you scroll ---------- */
      const belief = page.querySelector('.pr-belief');
      if (belief) {
        q('.pr-belief__line', belief).forEach((line, i) => {
          gsap.fromTo(
            line,
            { xPercent: i % 2 === 0 ? 14 : -14 },
            { xPercent: i % 2 === 0 ? -6 : 6, ease: 'none', scrollTrigger: { trigger: belief, start: 'top bottom', end: 'bottom top', scrub: 1 } },
          );
        });
      }

      return () => {
        roleLoop?.kill();
        scrambling?.kill();
        if (roleEl) roleEl.textContent = ROLES[0];
        // show the real numbers again if the animations are reverted
        q('[data-count]').forEach((el) => {
          el.textContent = Number(el.dataset.count).toFixed(Number(el.dataset.decimals ?? 0));
        });
      };
    });

    return () => media.revert();
  }, []);
    // Re-measure every ScrollTrigger (including the footer's) whenever the page height changes,
  // e.g. when the web font loads or the layout shifts.
  // useEffect(() => {
  //   const page = pageRef.current;
  //   if (!page) return undefined;
  //   let timer = 0;
  //   const refresh = () => {
  //     window.clearTimeout(timer);
  //     timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
  //   };
  //   const observer = new ResizeObserver(refresh);
  //   observer.observe(page);
  //   document.fonts?.ready.then(refresh);
  //   return () => {
  //     observer.disconnect();
  //     window.clearTimeout(timer);
  //   };
  // }, []);
  // Re-measure once the web font and layout settle, so the footer's trigger point is right.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [1500,3000].map((ms) => window.setTimeout(refresh, ms));
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener('load', refresh);
    };
  }, []);
  return (
    <>
      <main ref={pageRef} className="pr" id="myprofile">
        <ProfileSceneBackdrop scenes={scenes} cycle={cycle} />

        {/* ---------- hero ---------- */}
        <section className="pr-hero">
          <div className="pr-hero__copy">
            <p className="pr-eyebrow"><span /> PROFILE / FULL STACK DEVELOPER</p>
            <h1 className="pr-hero__title" aria-label="Code with character.">
              <Chars text="Code with" />
              <br />
              <em><Chars text="character." /></em>
            </h1>
            <p className="pr-role">
              <span className="pr-role__pre">I’m a</span>
              <span className="pr-role__text" aria-hidden="true">{ROLES[0]}</span>
              <span className="sr-only">Full Stack Developer</span>
            </p>
            <p className="pr-hero__lead"><Words text={HERO_LEAD} /></p>

            <div className="pr-hero__bar" data-late>
              <ProfileSceneBar cycle={cycle} count={scenes.length} />
            </div>

            <div className="pr-links" data-late>
              <a href={PROFILE.resume} download>RESUME <span aria-hidden="true">↓</span></a>
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB <span aria-hidden="true">↗</span></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LINKEDIN <span aria-hidden="true">↗</span></a>
              <a href={`mailto:${PROFILE.email}`}>EMAIL <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <figure className="pr-portrait">
              <GlareCard className="pr-portrait__frame" label="Interactive 3D zebra">
                <CatSlot/>
                <span className="pr-portrait__stamp">STAY<br />CURIOUS</span>
              </GlareCard>
            <figcaption><span>{PROFILE.location.toUpperCase()}</span><span>FIG. 01</span></figcaption>
          </figure>
        </section>

        {/* ---------- skills on a spinning CD ---------- */}
        <section className="pr-skills" aria-label="Skills">
          <SkillDisc skills={MARQUEE} />
        </section>

        {/* ---------- 01 about ---------- */}
        <section className="pr-section">
          <p className="pr-label"><span>01</span> About</p>
          <div className="pr-about">
            <p className="pr-about__lead" data-anim="fill"><Words text={ABOUT} /></p>
            <dl className="pr-facts" data-anim="rows">
              {FACTS.map((fact) => (
                <div className="pr-fact" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- stats ---------- */}
        <section className="pr-section pr-section--tight">
          <div className="pr-stats">
            {STATS.map((stat) => (
              <div className="pr-stat" key={stat.label} data-anim="wipe">
                <p className="pr-stat__value">
                  <span data-count={stat.to} data-decimals={stat.decimals ?? 0}>{stat.to.toFixed(stat.decimals ?? 0)}</span>
                  {stat.suffix}
                </p>
                <p className="pr-stat__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 02 toolkit ---------- */}
        <section className="pr-section">
          <p className="pr-label"><span>02</span> Toolkit</p>
          <h2 className="pr-h" data-anim="heading"><Words text="Six layers of the same craft." /></h2>
          <div className="pr-skill-grid">
            {SKILL_GROUPS.map((group, i) => (
              <div className="pr-anim-card" key={group.title}>
                <GlareCard className="pr-card" label={group.title}>
                  <span className="pr-card__num">{pad(i + 1)} / {pad(SKILL_GROUPS.length)}</span>
                  <h3>{group.title}</h3>
                  <p>{group.note}</p>
                  <div className="pr-card__chips">
                    {group.skills.map((skill) => <span className="pr-chip" key={skill}>{skill}</span>)}
                  </div>
                </GlareCard>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 03 journey ---------- */}
        <section className="pr-section">
          <p className="pr-label"><span>03</span> Journey</p>
          <h2 className="pr-h" data-anim="heading"><Words text="From the classroom to cloud-deployed systems." /></h2>
          <div className="pr-journey">
            <span className="pr-journey__line" aria-hidden="true"><i className="pr-journey__fill" /></span>
            <ol className="pr-journey__list">
              {JOURNEY.map((moment) => (
                <li className={`pr-moment pr-moment--${moment.kind}`} key={moment.title}>
                  <span className="pr-moment__dot" aria-hidden="true" />
                  <div className="pr-moment__card">
                    <p className="pr-moment__when">{moment.when}</p>
                    <h3>{moment.title}</h3>
                    <p>{moment.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- 04 proof ---------- */}
        <section className="pr-section">
          <p className="pr-label"><span>04</span> Practice and certificates</p>
          <div className="pr-proof" data-anim="cards">
            <div className="pr-anim-card">
              <GlareCard className="pr-card" label="Achievements">
                <span className="pr-card__num">ACHIEVEMENTS</span>
                {ACHIEVEMENTS.map((item) => <h3 key={item}>{item}</h3>)}
              </GlareCard>
            </div>
            <div className="pr-anim-card">
              <GlareCard className="pr-card" label="Certifications">
                <span className="pr-card__num">CERTIFICATIONS</span>
                <div className="pr-card__chips pr-card__chips--big">
                  {CERTIFICATIONS.map((item) => <span className="pr-chip" key={item}>{item}</span>)}
                </div>
              </GlareCard>
            </div>
          </div>
        </section>

        {/* ---------- 05 work ---------- */}
        <section className="pr-section">
          <p className="pr-label"><span>05</span> The proof</p>
          <h2 className="pr-h" data-anim="heading"><Words text="Three projects, with the reasoning behind each." /></h2>
          <div className="pr-rows">
            {projects.map((project) => (
              <a className="pr-row" href="#mywork" key={project.id}>
                <span className="pr-row__line" aria-hidden="true" />
                <span className="pr-row__num">{project.number}</span>
                <strong>{project.title}</strong>
                <span className="pr-row__tech">{project.tech.slice(0, 3).join(' · ')}</span>
                <span className="pr-row__date">{project.date}</span>
                <span className="pr-row__arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        {/* ---------- belief ---------- */}
        <section className="pr-belief">
          <p className="pr-belief__tag">MY WORKING BELIEF</p>
          {BELIEF.map((line) => (
            <p className="pr-belief__line" key={line}>{line}</p>
          ))}
        </section>
      </main>
     
    </>
  );
}