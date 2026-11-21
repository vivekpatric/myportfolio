// import type { ComponentType } from 'react';
// import type { PortfolioPage } from '../../components/navigation/SiteNav';
// import FeaturedProjectsRail from '../../components/projects/FeaturedProjectsRail';
// import SiteFooter from '../../components/SiteFooter';

// type HomeJourneyProps = {
//   Landing: ComponentType;
//   onNavigate: (page: PortfolioPage, projectIndex?: number) => void;
// };

// export default function HomeJourney({ Landing, onNavigate }: HomeJourneyProps) {
//   return (
//     <div id="top" className="home-journey">
//       <Landing />
//       <FeaturedProjectsRail onOpenWork={(projectIndex = 0) => onNavigate('work', projectIndex)} />
//       <SiteFooter onNavigate={onNavigate} />
//     </div>
//   );
// }
// import {  useLayoutEffect, useRef, type ComponentType } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import type { PortfolioPage } from '../../components/navigation/SiteNav';
// import FeaturedProjectsRail from '../../components/projects/FeaturedProjectsRail';
// import SiteFooter from '../../components/SiteFooter';
// //import Lenis from 'lenis';
// import useSmoothScroll from '../../hooks/useSmoothScroll';
// gsap.registerPlugin(ScrollTrigger);

// type LandingComponentProps = {
//   onIntroComplete?: () => void;
// };

// type HomeJourneyProps = {
//   Landing: ComponentType<LandingComponentProps>;
//   onNavigate: (page: PortfolioPage, projectIndex?: number) => void;
//   onIntroComplete?: () => void;
// };

// export default function HomeJourney({ Landing, onNavigate,onIntroComplete }: HomeJourneyProps) {
//   const wrapRef = useRef<HTMLDivElement>(null);
//   const innerRef = useRef<HTMLDivElement>(null);
//   const shadeRef = useRef<HTMLDivElement>(null);
  
//   // useEffect(()=>{
//   //   const lenis = new Lenis({ lerp: 0.09 });
//   //   lenis.on('scroll', ScrollTrigger.update);
//   //   const tick = (t: number) => lenis.raf(t * 1000);
//   //   gsap.ticker.add(tick);
//   //   gsap.ticker.lagSmoothing(0);
//   //   return () => {
//   //     gsap.ticker.remove(tick);
//   //     lenis.destroy();
//   //   };
//   // },[]);
//   useSmoothScroll(0.09);
//   useLayoutEffect(() => {
//     const wrap = wrapRef.current;
//     const inner = innerRef.current;
//     const shade = shadeRef.current;
//     if (!wrap || !inner || !shade) return;

//     const media = gsap.matchMedia();
//     media.add('(min-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
//       // Landing stays put once fully seen, while the projects sheet slides over it.
//       const end = () => `+=${window.innerHeight}`;
//       const pin = ScrollTrigger.create({
//         trigger: wrap,
//         start: 'bottom bottom',
//         end,
//         pin: true,
//         pinSpacing: false,
//         anticipatePin: 1,
//         invalidateOnRefresh: true,
//       });

//       // It also recedes in 3D as it gets covered.
//       const recede = gsap.timeline({
//         defaults: { ease: 'none' },
//         scrollTrigger: {
//           trigger: wrap,
//           start: 'bottom bottom',
//           end,
//           scrub: true,
//           invalidateOnRefresh: true,
//         },
//       });
//       recede
//         .to(inner, {
//           scale: 0.88,
//           rotationX: 8,
//           yPercent: -4,
//           transformPerspective: 1200,
//           transformOrigin: '50% 100%',
//         }, 0)
//         .to(shade, { opacity: 0.65 }, 0);

//       return () => {
//         pin.kill();
//         recede.scrollTrigger?.kill();
//         recede.kill();
//       };
//     });

//     return () => media.revert();
//   }, []);

//   return (
//     <div id="top" className="home-journey">
//       {/* Change the background to whatever colour sits behind your landing page */}
//       <div ref={wrapRef} style={{ position: 'relative', zIndex: 0, background: '#0a0a0a' }}>
//         <div ref={innerRef} style={{ willChange: 'transform' }}>
//           <Landing onIntroComplete={onIntroComplete} />
//         </div>
//         <div
//           ref={shadeRef}
//           aria-hidden="true"
//           style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, pointerEvents: 'none' }}
//         />
//       </div>
//       <FeaturedProjectsRail onOpenWork={(projectIndex = 0) => onNavigate('work', projectIndex)} />
//       <SiteFooter onNavigate={onNavigate} />
//     </div>
//   );
// }
// import type { ComponentType } from 'react';
// import type { PortfolioPage } from '../../components/navigation/SiteNav';
// import FeaturedProjectsRail from '../../components/projects/FeaturedProjectsRail';
// import SiteFooter from '../../components/SiteFooter';

// type HomeJourneyProps = {
//   Landing: ComponentType;
//   onNavigate: (page: PortfolioPage, projectIndex?: number) => void;
// };

// export default function HomeJourney({ Landing, onNavigate }: HomeJourneyProps) {
//   return (
//     <div id="top" className="home-journey">
//       <Landing />
//       <FeaturedProjectsRail onOpenWork={(projectIndex = 0) => onNavigate('work', projectIndex)} />
//       <SiteFooter onNavigate={onNavigate} />
//     </div>
//   );
// }
import {  useLayoutEffect, useRef, type ComponentType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PortfolioPage } from '../../components/navigation/SiteNav';
import FeaturedProjectsRail from '../../components/projects/FeaturedProjectsRail';
import SiteFooter from '../../components/SiteFooter';
//import Lenis from 'lenis';
import useSmoothScroll from '../../hooks/useSmoothScroll';
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // the phone address bar must not re-trigger layout

type LandingComponentProps = {
  onIntroComplete?: () => void;
};

type HomeJourneyProps = {
  Landing: ComponentType<LandingComponentProps>;
  onNavigate: (page: PortfolioPage, projectIndex?: number) => void;
  onIntroComplete?: () => void;
};

export default function HomeJourney({ Landing, onNavigate,onIntroComplete }: HomeJourneyProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  
  // useEffect(()=>{
  //   const lenis = new Lenis({ lerp: 0.09 });
  //   lenis.on('scroll', ScrollTrigger.update);
  //   const tick = (t: number) => lenis.raf(t * 1000);
  //   gsap.ticker.add(tick);
  //   gsap.ticker.lagSmoothing(0);
  //   return () => {
  //     gsap.ticker.remove(tick);
  //     lenis.destroy();
  //   };
  // },[]);
  useSmoothScroll(0.09);
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const shade = shadeRef.current;
    if (!wrap || !inner || !shade) return;

    const media = gsap.matchMedia();
    media.add(
      { desktop: '(min-width: 760px)', calm: '(prefers-reduced-motion: no-preference)' },
      (context) => {
        const { desktop, calm } = context.conditions as { desktop: boolean; calm: boolean };
        if (!calm) return undefined;

        const end = () => `+=${window.innerHeight}`;
        const pin = ScrollTrigger.create({
          trigger: wrap,
          start: 'bottom bottom',
          end,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        const recede = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: wrap,
            start: 'bottom bottom',
            end,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        recede
          .to(
            inner,
            desktop
              ? { scale: 0.88, rotationX: 8, yPercent: -4, transformPerspective: 1200, transformOrigin: '50% 100%' }
              : { scale: 0.94, yPercent: -2, transformOrigin: '50% 100%' }, // lighter on phones: no 3D tilt
            0,
          )
          .to(shade, { opacity: desktop ? 0.65 : 0.5 }, 0);

        // The hero grows after it mounts (and is taller than the screen on phones). Re-measure the pin
        // whenever that happens, otherwise the projects section starts too early and covers the hero.
        let raf = 0;
        const resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => ScrollTrigger.refresh());
        });
        resizeObserver.observe(inner);

        return () => {
          cancelAnimationFrame(raf);
          resizeObserver.disconnect();
          pin.kill();
          recede.scrollTrigger?.kill();
          recede.kill();
        };
      },
    );

    return () => media.revert();
  }, []);

  return (
    <div id="top" className="home-journey">
      {/* Change the background to whatever colour sits behind your landing page */}
      <div ref={wrapRef} style={{ position: 'relative', zIndex: 0, background: '#0a0a0a' }}>
        <div ref={innerRef} style={{ willChange: 'transform' }}>
          <Landing onIntroComplete={onIntroComplete} />
        </div>
        <div
          ref={shadeRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, pointerEvents: 'none' }}
        />
      </div>
      <FeaturedProjectsRail onOpenWork={(projectIndex = 0) => onNavigate('work', projectIndex)} />
      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}