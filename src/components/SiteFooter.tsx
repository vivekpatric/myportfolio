// import type { PortfolioPage } from './navigation/SiteNav';

// type SiteFooterProps = {
//   onNavigate: (page: PortfolioPage, projectIndex?: number) => void;
// };

// export default function SiteFooter({ onNavigate }: SiteFooterProps) {
//   return (
//     <footer className="site-footer" id="contact">
//       <div className="site-footer__topline">
//         <span>VIVEK PATRIC / PORTFOLIO</span>
//         <span>MADE WITH CURIOSITY · 2026</span>
//       </div>
//       <div className="site-footer__main">
//         <p className="eyebrow eyebrow--light"><span /> HAVE A GOOD PROBLEM?</p>
//         <h2>Let’s make<br /><em>something move.</em></h2>
//         <a className="site-footer__cta" href="https://github.com/vivekpatric" target="_blank" rel="noreferrer">
//           FIND ME ON GITHUB <span aria-hidden="true">↗</span>
//         </a>
//       </div>
//       <div className="site-footer__bottom">
//         <span>ENGINEERED WITH INTENTION.</span>
//         <nav aria-label="Footer navigation">
//           <button type="button" onClick={() => onNavigate('home')}>HOME</button>
//           <button type="button" onClick={() => onNavigate('work')}>WORK</button>
//           <button type="button" onClick={() => onNavigate('profile')}>PROFILE</button>
//         </nav>
//         <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>BACK TO TOP ↑</a>
//       </div>
//     </footer>
//   );
// }
// import { Fragment, useLayoutEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import type { PortfolioPage } from './navigation/SiteNav';
// import GlareCard from './projects/GlareCard';
// import './SiteFooter.css';

// gsap.registerPlugin(ScrollTrigger);

// type SiteFooterProps = {
//   onNavigate: (page: PortfolioPage, projectIndex?: number) => void;
// };

// /* ---------- EDIT THESE ---------- */
// const CONTACT = {
//   email: 'you@example.com', // TODO
//   github: 'https://github.com/vivekpatric',
//   githubHandle: '@vivekpatric',
//   linkedin: 'https://www.linkedin.com/in/your-handle', // TODO
//   linkedinHandle: '/in/your-handle', // TODO
//   resume: '/vivekpatricresumeupdated.pdf', // put the PDF in /public
// };
// const AVAILABILITY = 'OPEN TO JAVA / SPRING BOOT ROLES';
// // Leave empty for now. Later: '/images/footer-bg.jpg' (file in /public/images)
// const FOOTER_BG = '';
// const STACK = ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'JWT', 'WebSocket', 'GSAP', 'Mapbox GL'];
// /* -------------------------------- */

// type Card = { label: string; value: string; href: string; external?: boolean; download?: boolean };

// const CARDS: Card[] = [
//   { label: 'EMAIL', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
//   { label: 'GITHUB', value: CONTACT.githubHandle, href: CONTACT.github, external: true },
//   { label: 'LINKEDIN', value: CONTACT.linkedinHandle, href: CONTACT.linkedin, external: true },
//   { label: 'RESUME', value: 'Download PDF', href: CONTACT.resume, download: true },
// ];

// function Words({ text }: { text: string }) {
//   return (
//     <>
//       {text.split(' ').map((word, i) => (
//         <Fragment key={`${word}-${i}`}>
//           <span className="pf-word">
//             <span className="pf-word__inner">{word}</span>
//           </span>{' '}
//         </Fragment>
//       ))}
//     </>
//   );
// }

// export default function SiteFooter({ onNavigate }: SiteFooterProps) {
//   const footerRef = useRef<HTMLElement>(null);
//   const innerRef = useRef<HTMLDivElement>(null);
//   const bgRef = useRef<HTMLDivElement>(null);

//   useLayoutEffect(() => {
//     const footer = footerRef.current;
//     const inner = innerRef.current;
//     const bg = bgRef.current;
//     if (!footer || !inner || !bg) return;

//     const media = gsap.matchMedia();
//     media.add(
//       {
//         desktop: '(min-width: 760px)',
//         fine: '(hover: hover) and (pointer: fine)',
//         calm: '(prefers-reduced-motion: no-preference)',
//       },
//       (context) => {
//         const { desktop, fine, calm } = context.conditions as { desktop: boolean; fine: boolean; calm: boolean };
//         if (!calm) return;
//         const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, footer);

//         /* 1. Sheet rising over the projects page (scrubbed to scroll) */
//         if (desktop) {
//           gsap.fromTo(
//             footer,
//             { borderTopLeftRadius: 36, borderTopRightRadius: 36 },
//             {
//               borderTopLeftRadius: 0,
//               borderTopRightRadius: 0,
//               ease: 'none',
//               scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top top', scrub: true },
//             },
//           );
//           gsap.fromTo(
//             inner,
//             { yPercent: 8, scale: 0.94, rotationX: 10, transformPerspective: 1200, transformOrigin: '50% 100%' },
//             {
//               yPercent: 0,
//               scale: 1,
//               rotationX: 0,
//               ease: 'none',
//               scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top top', scrub: true },
//             },
//           );
//         }

//         /* 2. Background image parallax (only when you set one) */
//         if (FOOTER_BG) {
//           gsap.fromTo(
//             bg,
//             { yPercent: -8 },
//             {
//               yPercent: 8,
//               ease: 'none',
//               scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: true },
//             },
//           );
//         }

//         /* 3. Content reveal: plays as the sheet rises, reverses when you scroll back */
//         const tl = gsap.timeline({
//           defaults: { ease: 'power3.out' },
//           scrollTrigger: { trigger: footer, start: desktop ? 'top 55%' : 'top 85%', toggleActions: 'play none none reverse' },
//         });
//         tl.from(q('.pf__topline > *'), { opacity: 0, y: -16, stagger: 0.08, duration: 0.6 }, 0)
//           .from(q('.pf__eyebrow > *'), { opacity: 0, x: -14, stagger: 0.1, duration: 0.6 }, 0.1)
//           .from(
//             q('.pf__title .pf-word__inner'),
//             {
//               rotationX: -100,
//               yPercent: 60,
//               opacity: 0,
//               transformOrigin: '50% 100% -80px',
//               transformPerspective: 900,
//               stagger: 0.1,
//               duration: 1.1,
//               ease: 'expo.out',
//             },
//             0.2,
//           )
//           .from(q('.pf__lead'), { opacity: 0, y: 24, duration: 0.9 }, 0.7)
//           .fromTo(
//             q('.pf__email'),
//             { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
//             { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1, ease: 'power2.inOut' },
//             0.8,
//           )
//           .from(
//             q('.pf__card'),
//             {
//               opacity: 0,
//               y: 90,
//               rotationX: -40,
//               rotationY: 14,
//               transformPerspective: 900,
//               transformOrigin: '50% 100%',
//               stagger: 0.12,
//               duration: 1.1,
//               ease: 'expo.out',
//             },
//             0.55,
//           )
//           .from(q('.pf__marquee'), { opacity: 0, scaleX: 0.9, duration: 1 }, 1)
//           .from(
//             q('.pf-letter'),
//             {
//               opacity: 0,
//               yPercent: 80,
//               rotationX: -90,
//               transformOrigin: '50% 100%',
//               transformPerspective: 900,
//               stagger: 0.05,
//               duration: 1,
//               ease: 'expo.out',
//             },
//             1.1,
//           )
//           .from(q('.pf__bottom > *'), { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, 1.5);

//         /* 4. Magnetic email button (mouse only) */
//         let cleanup: (() => void) | undefined;
//         if (fine) {
//           const zone = footer.querySelector<HTMLElement>('.pf__cta-zone');
//           const cta = footer.querySelector<HTMLElement>('.pf__email');
//           if (zone && cta) {
//             const xTo = gsap.quickTo(cta, 'x', { duration: 0.5, ease: 'power3' });
//             const yTo = gsap.quickTo(cta, 'y', { duration: 0.5, ease: 'power3' });
//             const move = (e: PointerEvent) => {
//               const r = zone.getBoundingClientRect(); // the zone never moves, so no feedback loop
//               xTo((e.clientX - r.left - r.width / 2) * 0.3);
//               yTo((e.clientY - r.top - r.height / 2) * 0.4);
//             };
//             const leave = () => {
//               xTo(0);
//               yTo(0);
//             };
//             zone.addEventListener('pointermove', move);
//             zone.addEventListener('pointerleave', leave);
//             cleanup = () => {
//               zone.removeEventListener('pointermove', move);
//               zone.removeEventListener('pointerleave', leave);
//             };
//           }
//         }
//         return cleanup;
//       },
//     );

//     return () => media.revert();
//   }, []);

//   return (
//     <footer className="pf" id="contact" ref={footerRef}>
//       <div
//         className="pf__bg"
//         ref={bgRef}
//         aria-hidden="true"
//         style={FOOTER_BG ? { backgroundImage: `url(${FOOTER_BG})` } : undefined}
//       />
//       <div className="pf__shade" aria-hidden="true" />

//       <div className="pf__inner" ref={innerRef}>
//         <div className="pf__topline">
//           <span>VIVEK PATRIC / PORTFOLIO</span>
//           <span className="pf__status"><i aria-hidden="true" />{AVAILABILITY}</span>
//           <span>MADE WITH CURIOSITY · 2026</span>
//         </div>

//         <div className="pf__main">
//           <div className="pf__pitch">
//             <p className="pf__eyebrow">
//               <span className="pf__eyebrow-dot" />
//               <span>HAVE A GOOD PROBLEM?</span>
//               <span className="pf__eyebrow-line" />
//             </p>
//             <h2 className="pf__title">
//               <Words text="Let’s make" />
//               <br />
//               <em><Words text="something move." /></em>
//             </h2>
//             <p className="pf__lead">
//               Backend discipline, front-end craft. If you’re building something that needs both, I’d like to hear about it.
//             </p>
//             <div className="pf__cta-zone">
//               <a className="pf__email" href={`mailto:${CONTACT.email}`}>
//                 {CONTACT.email} <span aria-hidden="true">↗</span>
//               </a>
//             </div>
//           </div>

//           <div className="pf__cards">
//             {CARDS.map((card, i) => (
//               <a
//                 key={card.label}
//                 className="pf__card"
//                 href={card.href}
//                 {...(card.external ? { target: '_blank', rel: 'noreferrer' } : {})}
//                 {...(card.download ? { download: true } : {})}
//               >
//                 <GlareCard className="pf__card-surface" label={`${card.label}: ${card.value}`}>
//                   <span className="pf__card-top">
//                     <span>{String(i + 1).padStart(2, '0')}</span>
//                     <span className="pf__card-arrow" aria-hidden="true">↗</span>
//                   </span>
//                   <span className="pf__card-bottom">
//                     <span className="pf__card-label">{card.label}</span>
//                     <span className="pf__card-value">{card.value}</span>
//                   </span>
//                 </GlareCard>
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* <div className="pf__marquee" aria-hidden="true">
//           <div className="pf__marquee-track">
//             {[0, 1].map((group) => (
//               <div className="pf__marquee-group" key={group}>
//                 {STACK.map((item) => (
//                   <span key={item}>
//                     {item}
//                     <i>✦</i>
//                   </span>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="pf__name" aria-label="Vivek Patric">
//           {[...'VIVEK PATRIC'].map((ch, i) =>
//             ch === ' ' ? (
//               <span key={i} className="pf-letter pf-letter--space" aria-hidden="true" />
//             ) : (
//               <span key={i} className="pf-letter" aria-hidden="true">
//                 <span className="pf-letter__glyph">{ch}</span>
//               </span>
//             ),
//           )}
//         </div> */}

//         <div className="pf__bottom">
//           <span>ENGINEERED WITH INTENTION.</span>
//           <nav aria-label="Footer navigation">
//             <button type="button" onClick={() => onNavigate('home')}>HOME</button>
//             <button type="button" onClick={() => onNavigate('work')}>WORK</button>
//             <button type="button" onClick={() => onNavigate('profile')}>PROFILE</button>
//           </nav>
//           <a
//             href="#top"
//             onClick={(event) => {
//               event.preventDefault();
//               window.scrollTo({ top: 0, behavior: 'smooth' });
//             }}
//           >
//             BACK TO TOP ↑
//           </a>
//         </div>
//       </div>
//     </footer>
//   );
// }
import { Fragment, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PortfolioPage } from './navigation/SiteNav';
import GlareCard from './projects/GlareCard';
import { scrollToTop } from '../pages/lib/scroll';
import './SiteFooter.css';

gsap.registerPlugin(ScrollTrigger);

type SiteFooterProps = {
  onNavigate: (page: PortfolioPage, projectIndex?: number) => void;
};

/* ---------- EDIT THESE ---------- */
const CONTACT = {
  email: 'patricleo223@gmail.com', // TODO
  github: 'https://github.com/vivekpatric',
  githubHandle: '@vivekpatric',
  linkedin: 'https://www.linkedin.com/in/vivek-patric/', // TODO
  linkedinHandle: '/in/vivek-patric', // TODO
  resume: '/vivekpatricresumeupdated.pdf', // put the PDF in /public
};
const AVAILABILITY = 'OPEN TO JAVA / SPRING BOOT ROLES';
/* -------------------------------- */

type Card = { label: string; value: string; href: string; external?: boolean; download?: boolean };

const CARDS: Card[] = [
  { label: 'EMAIL', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: 'GITHUB', value: CONTACT.githubHandle, href: CONTACT.github, external: true },
  { label: 'LINKEDIN', value: CONTACT.linkedinHandle, href: CONTACT.linkedin, external: true },
  { label: 'RESUME', value: 'Download PDF', href: CONTACT.resume, download: true },
];

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="pf-word">
            <span className="pf-word__inner">{word}</span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

export default function SiteFooter({ onNavigate }: SiteFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    const inner = innerRef.current;
    const bg = bgRef.current;
    if (!footer || !inner || !bg) return;

    const media = gsap.matchMedia();
    media.add(
      {
        desktop: '(min-width: 760px)',
        fine: '(hover: hover) and (pointer: fine)',
        calm: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { desktop, fine, calm } = context.conditions as { desktop: boolean; fine: boolean; calm: boolean };
        if (!calm) return;
        const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, footer);

        /* 1. Sheet rising over the projects page (scrubbed to scroll) */
        if (desktop) {
          gsap.fromTo(
            footer,
            { borderTopLeftRadius: 36, borderTopRightRadius: 36 },
            {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ease: 'none',
              scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top top', scrub: true },
            },
          );
          gsap.fromTo(
            inner,
            { yPercent: 8, scale: 0.94, rotationX: 10, transformPerspective: 1200, transformOrigin: '50% 100%' },
            {
              yPercent: 0,
              scale: 1,
              rotationX: 0,
              ease: 'none',
              scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top top', scrub: true },
            },
          );
        }

        /* 2. Background parallax */
        gsap.fromTo(
          bg,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        );

        /* 3. Content reveal: plays as the sheet rises, reverses when you scroll back */
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: footer, start: desktop ? 'top 55%' : 'top 85%', toggleActions: 'play none none reverse' },
        });
        tl.from(q('.pf__topline > *'), { opacity: 0, y: -16, stagger: 0.08, duration: 0.6 }, 0)
          .from(q('.pf__eyebrow > *'), { opacity: 0, x: -14, stagger: 0.1, duration: 0.6 }, 0.1)
          .from(
            q('.pf__title .pf-word__inner'),
            {
              rotationX: -100,
              yPercent: 60,
              opacity: 0,
              transformOrigin: '50% 100% -80px',
              transformPerspective: 900,
              stagger: 0.1,
              duration: 1.1,
              ease: 'expo.out',
            },
            0.2,
          )
          .from(q('.pf__lead'), { opacity: 0, y: 24, duration: 0.9 }, 0.7)
          .fromTo(
            q('.pf__email'),
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1, ease: 'power2.inOut' },
            0.8,
          )
          .from(
            q('.pf__card'),
            {
              opacity: 0,
              y: 90,
              rotationX: -40,
              rotationY: 14,
              transformPerspective: 900,
              transformOrigin: '50% 100%',
              stagger: 0.12,
              duration: 1.1,
              ease: 'expo.out',
            },
            0.55,
          )

          .from(q('.pf__bottom > *'), { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, 1.5);

        // The marquee and the big name are optional blocks (commented out in the markup right now).
        // Animate them only when they exist, so GSAP never logs "target not found".
        const marquee = q('.pf__marquee');
        if (marquee.length) tl.from(marquee, { opacity: 0, scaleX: 0.9, duration: 1 }, 1);
        const letters = q('.pf-letter');
        if (letters.length) {
          tl.from(
            letters,
            {
              opacity: 0,
              yPercent: 80,
              rotationX: -90,
              transformOrigin: '50% 100%',
              transformPerspective: 900,
              stagger: 0.05,
              duration: 1,
              ease: 'expo.out',
            },
            1.1,
          );
        }

        /* 4. Magnetic email button (mouse only) */
        let cleanup: (() => void) | undefined;
        if (fine) {
          const zone = footer.querySelector<HTMLElement>('.pf__cta-zone');
          const cta = footer.querySelector<HTMLElement>('.pf__email');
          if (zone && cta) {
            const xTo = gsap.quickTo(cta, 'x', { duration: 0.5, ease: 'power3' });
            const yTo = gsap.quickTo(cta, 'y', { duration: 0.5, ease: 'power3' });
            const move = (e: PointerEvent) => {
              const r = zone.getBoundingClientRect(); // the zone never moves, so no feedback loop
              xTo((e.clientX - r.left - r.width / 2) * 0.3);
              yTo((e.clientY - r.top - r.height / 2) * 0.4);
            };
            const leave = () => {
              xTo(0);
              yTo(0);
            };
            zone.addEventListener('pointermove', move);
            zone.addEventListener('pointerleave', leave);
            cleanup = () => {
              zone.removeEventListener('pointermove', move);
              zone.removeEventListener('pointerleave', leave);
            };
          }
        }

        /* 5. On My Work and My Profile the page above holds still while the footer slides up over it,
              exactly like the rail on Home. Position: sticky does the holding (no DOM re-parenting). */
        let curtainCleanup: (() => void) | undefined;
        const page = footer.closest('.portfolio-page-shell') ? footer.previousElementSibling : null;
        if (desktop && page instanceof HTMLElement) {
          const fit = () =>
            page.style.setProperty('--curtain-top', `${Math.min(0, window.innerHeight - page.offsetHeight)}px`);
          page.classList.add('is-curtained');
          fit();
          const observer = new ResizeObserver(fit);
          observer.observe(page);
          window.addEventListener('resize', fit);
          curtainCleanup = () => {
            observer.disconnect();
            window.removeEventListener('resize', fit);
            page.classList.remove('is-curtained');
            page.style.removeProperty('--curtain-top');
          };
        }

        return () => {
          cleanup?.();
          curtainCleanup?.();
        };
      },
    );

    return () => media.revert();
  }, []);

  return (
    <footer className="pf" id="contact" ref={footerRef}>
      <div className="pf__bg" ref={bgRef} aria-hidden="true" />
      <div className="pf__shade" aria-hidden="true" />

      <div className="pf__inner" ref={innerRef}>
        <div className="pf__topline">
          <span>VIVEK PATRIC / PORTFOLIO</span>
          <span className="pf__status"><i aria-hidden="true" />{AVAILABILITY}</span>
          <span>MADE WITH CURIOSITY · 2026</span>
        </div>

        <div className="pf__main">
          <div className="pf__pitch">
            <p className="pf__eyebrow">
              <span className="pf__eyebrow-dot" />
              <span>HAVE A GOOD PROBLEM?</span>
              <span className="pf__eyebrow-line" />
            </p>
            <h2 className="pf__title">
              <Words text="Let’s make" />
              <br />
              <em><Words text="something move." /></em>
            </h2>
            <p className="pf__lead">
              Backend discipline, front-end craft. If you’re building something that needs both, I’d like to hear about it.
            </p>
            <div className="pf__cta-zone">
              <a className="pf__email" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="pf__cards">
            {CARDS.map((card, i) => (
              <a
                key={card.label}
                className="pf__card"
                href={card.href}
                {...(card.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                {...(card.download ? { download: true } : {})}
              >
                <GlareCard className="pf__card-surface" label={`${card.label}: ${card.value}`}>
                  <span className="pf__card-top">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span className="pf__card-arrow" aria-hidden="true">↗</span>
                  </span>
                  <span className="pf__card-bottom">
                    <span className="pf__card-label">{card.label}</span>
                    <span className="pf__card-value">{card.value}</span>
                  </span>
                </GlareCard>
              </a>
            ))}
          </div>
        </div>

        {/* <div className="pf__marquee" aria-hidden="true">
          <div className="pf__marquee-track">
            {[0, 1].map((group) => (
              <div className="pf__marquee-group" key={group}>
                {STACK.map((item) => (
                  <span key={item}>
                    {item}
                    <i>✦</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="pf__name" aria-label="Vivek Patric">
          {[...'VIVEK PATRIC'].map((ch, i) =>
            ch === ' ' ? (
              <span key={i} className="pf-letter pf-letter--space" aria-hidden="true" />
            ) : (
              <span key={i} className="pf-letter" aria-hidden="true">
                <span className="pf-letter__glyph">{ch}</span>
              </span>
            ),
          )}
        </div> */}

        <div className="pf__bottom">
          <span>ENGINEERED WITH INTENTION.</span>
          <nav aria-label="Footer navigation">
            <button type="button" onClick={() => onNavigate('home')}>HOME</button>
            <button type="button" onClick={() => onNavigate('work')}>WORK</button>
            <button type="button" onClick={() => onNavigate('profile')}>PROFILE</button>
          </nav>
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              scrollToTop();
            }}
          >
            BACK TO TOP ↑
          </a>
        </div>
      </div>
    </footer>
  );
}