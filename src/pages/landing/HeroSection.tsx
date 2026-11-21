
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './HeroSection.css';

function HeroSection({instant = false} : {instant ?: boolean}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const navFrameRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Top Header & Nav Frame expand
      timeline
        .to('.hero-header__brand', {
          y: 0,
          opacity: 1,
          duration: 0.7,
        })
        .to(
          '.hero-nav__frame',
          {
            width: 'min(460px, calc(100vw - 32px))',
            height: 52,
            padding: '6px',
            opacity: 1,
            duration: 0.85,
            ease: 'power4.inOut',
          },
          '-=0.4'
        )
        .to(
          '.hero-nav__link',
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.1,
          },
          '-=0.25'
        )

        // Left Column Hero Copy Stagger
        .to(
          '.hero-copy__eyebrow',
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          '-=0.3'
        )
        .to(
          '.hero-copy__title',
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power4.out',
          },
          '-=0.3'
        )
        .to(
          '.hero-copy__description p',
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
          },
          '-=0.3'
        )
        .to(
          '.hero-copy__cta',
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
          },
          '-=0.2'
        )

        // Right Column Creative Spotlight
        .to(
          '.hero-right__card',
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.15,
          },
          '-=0.6'
        )

        // Bottom Engineering Quote
        .to(
          '.hero-footer__quote',
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          '-=0.4'
        );
        if(instant)timeline.progress(1);
    },
    { scope: heroRef }
  );

  function shineNavbar(): void {
    const frame = navFrameRef.current;
    if (!frame) return;

    frame.classList.remove('is-shining');
    void frame.offsetWidth;
    frame.classList.add('is-shining');
  }

  return (
    <div ref={heroRef} className="hero-section">
      {/* TOP HEADER: BRANDING + NAV */}
      <header className="hero-header">
        <div className="hero-header__brand">
          <span className="hero-header__name">Vivek Patric</span>
          <span className="hero-header__tagline">Architecting Digital Realities</span>
        </div>

        <nav className="hero-nav" aria-label="Main navigation">
          <div
            ref={navFrameRef}
            className="hero-nav__frame"
            onMouseEnter={shineNavbar}
          >
            <a className="hero-nav__link" href="#home">Home</a>
            <a className="hero-nav__link" href="#mywork">My Work</a>
            <a className="hero-nav__link" href="#myprofile">My Profile</a>
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="hero-body">
        {/* LEFT COLUMN */}
        <section className="hero-copy" id="home">
          <p className="hero-copy__eyebrow">WHO IS AN</p>
          
          <h1 className="hero-copy__title">
            Engineer<span>.</span>
          </h1>

          <div className="hero-copy__description">
            <p>
              Where pragmatic decision-making meets uncompromised visual fidelity.
            </p>
            <p>
              In an era overflowing with fleeting trends, I engineer resilient, high-craft digital systems built on clarity, conviction, and vision. You can trust me to shape something truly unique.
            </p>
          </div>

          <a className="hero-copy__cta" href="#mywork">
            Explore my work <span aria-hidden="true">↗</span>
          </a>
        </section>

        {/* RIGHT COLUMN (Shifted Right) */}
        <aside className="hero-right">
          <div className="hero-right__card">
            <span className="hero-right__label">Philosophy</span>
            <p className="hero-right__text">
              "Code is merely the tool; execution is the art. Every architectural decision serves a purpose."
            </p>
          </div>

          <div className="hero-right__card">
            <span className="hero-right__label">01 / Craft</span>
            <p className="hero-right__text">
              Precision UI Engineering &amp; High-Performance Web Animations
            </p>
          </div>

          <div className="hero-right__card">
            <span className="hero-right__label">02 / System</span>
            <p className="hero-right__text">
              Scalable Frontend Architecture built for tomorrow's scale.
            </p>
          </div>
        </aside>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="hero-footer">
        <blockquote className="hero-footer__quote">
          “Engineers turn abstract dreams into tangible reality—building trust through precision and purpose.”
        </blockquote>
      </footer>
    </div>
  );
}

export default HeroSection;
// import { useRef } from 'react';
// import { gsap } from 'gsap';
// import { useGSAP } from '@gsap/react';
// import './HeroSection.css';

// function HeroSection({ instant = false }: { instant?: boolean }) {
//   const heroRef = useRef<HTMLDivElement>(null);
//   const navFrameRef = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       const timeline = gsap.timeline({
//         defaults: { ease: 'power3.out' },
//       });

//       timeline
//         .to('.hero-header__brand', {
//           y: 0,
//           opacity: 1,
//           duration: 0.7,
//         })
//         .to(
//           '.hero-nav__frame',
//           {
//             width: 'min(460px, calc(100vw - 32px))',
//             height: 52,
//             padding: '6px',
//             opacity: 1,
//             duration: 0.85,
//             ease: 'power4.inOut',
//           },
//           '-=0.4',
//         )
//         .to(
//           '.hero-nav__link',
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.45,
//             stagger: 0.1,
//           },
//           '-=0.25',
//         )
//         .to(
//           '.hero-copy__eyebrow',
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.5,
//           },
//           '-=0.3',
//         )
//         .to(
//           '.hero-copy__title',
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.85,
//             ease: 'power4.out',
//           },
//           '-=0.3',
//         )
//         .to(
//           '.hero-copy__description p',
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.5,
//             stagger: 0.12,
//           },
//           '-=0.3',
//         )
//         .to(
//           '.hero-copy__cta',
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.45,
//           },
//           '-=0.2',
//         )
//         .to(
//           '.hero-right__card',
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.75,
//             stagger: 0.15,
//           },
//           '-=0.6',
//         )
//         .to(
//           '.hero-footer__quote',
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.6,
//           },
//           '-=0.4',
//         );

//       if (instant) timeline.progress(1);
//     },
//     { scope: heroRef, dependencies: [instant], revertOnUpdate: true },
//   );

//   function shineNavbar(): void {
//     const frame = navFrameRef.current;
//     if (!frame) return;

//     frame.classList.remove('is-shining');
//     void frame.offsetWidth;
//     frame.classList.add('is-shining');
//   }

//   return (
//     <div ref={heroRef} className="hero-section">
     

//       <header className="hero-header">
//         <div className="hero-header__brand">
//           <span className="hero-header__name">Vivek Patric</span>
//           <span className="hero-header__tagline">Full Stack Engineer</span>
//         </div>

//         <nav className="hero-nav" aria-label="Main navigation">
//           <div
//             ref={navFrameRef}
//             className="hero-nav__frame"
//             onMouseEnter={shineNavbar}
//           >
//             <a className="hero-nav__link" href="#home">Home</a>
//             <a className="hero-nav__link" href="#mywork">My Work</a>
//             <a className="hero-nav__link" href="#myprofile">My Profile</a>
//           </div>
//         </nav>
//       </header>

//       <main className="hero-body">
//         <section className="hero-copy" id="home">
          

//           <h1 className="hero-copy__title">
//             <span className="hero-copy__title-line">Full Stack</span>
//             <span className="hero-copy__title-line">
//               Engineer<span className="hero-copy__title-period">.</span>
//             </span>
//           </h1>

//           <div className="hero-copy__description">
//             <p className="hero-copy__lead">
             
//               From thoughtful interfaces to dependable backends, I bring the
//               entire experience together — with clarity, craft and purpose.
//             </p>
         
//           </div>

//           <a className="hero-copy__cta" href="#mywork">
//             Explore my work <span aria-hidden="true">↗</span>
//           </a>
//         </section>

//         <div className="hero-body__art-spacer" aria-hidden="true" />

//         <aside className="hero-right" aria-label="What I do">
//           <div className="hero-right__card">
//             <span className="hero-right__label">Build</span>
//             <p className="hero-right__text">
//               Turn ideas into functional, scalable applications that solve real
//               problems.
//             </p>
//           </div>

//           <div className="hero-right__card">
//             <span className="hero-right__label">Create</span>
//             <p className="hero-right__text">
//               Shape intuitive interfaces with thoughtful interactions and
//               considered visual detail.
//             </p>
//           </div>

//           <div className="hero-right__card">
//             <span className="hero-right__label">Connect</span>
//             <p className="hero-right__text">
//               Bring frontend, backend and data together into one cohesive
//               digital experience.
//             </p>
//           </div>
//         </aside>
//       </main>

//       <footer className="hero-footer">
//         <p className="hero-footer__quote">
//           “Turning ideas into interactive, scalable realities.”
//         </p>
//       </footer>
//     </div>
//   );
// }

// export default HeroSection;
