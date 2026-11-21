
// import { useRef } from 'react';
// import { useGSAP } from '@gsap/react';
// import { gsap } from 'gsap';
// import './LandingArtWork.css';

// type LandingArtWorkProps = {
//   visible: boolean;
//   instant?:boolean;
//   onComplete: () => void;
// };

// function LandingArtWork({ visible,instant=false, onComplete }: LandingArtWorkProps) {
//   const artworkref = useRef<HTMLElement>(null);

//   useGSAP(
//     () => {
//       if (!visible || instant) return;

//       const timeline = gsap.timeline();

//       timeline
//         .from('.artwork_line--left', {
//           scaleY: 0,
//           duration: 0.8,
//           transformOrigin: 'top',
//           ease: 'power3.inOut',
//         })
//         .from(
//           '.artwork_line--right',
//           {
//             scaleY: 0,
//             duration: 0.8,
//             transformOrigin: 'bottom',
//             ease: 'power3.inOut',
//           },
//           '<',
//         )
//         .from('.artwork_line--top', {
//           scaleX: 0,
//           duration: 0.8,
//           transformOrigin: 'left',
//           ease: 'power3.inOut',
//         })
//         .from(
//           '.artwork_line--bottom',
//           {
//             scaleX: 0,
//             duration: 0.8,
//             transformOrigin: 'right',
//             ease: 'power3.inOut',
//           },
//           '<',
//         )
//         .from(
//           '.artwork_image--adam',
//           {
//             xPercent: -100,
//             opacity: 0,
//             duration: 1.6,
//             ease: 'power3.out',
//           },
//         )
//         .from(
//           '.artwork_image--god',
//           {
//             xPercent: 100,
//             opacity: 0,
//             duration: 1.6,
//             ease: 'power3.out',
//           },
//           '<',
//         )
//         // Tell LandingPage that the artwork is finished.
//         .call(onComplete);
//     },
//     {
//       scope: artworkref,
//       dependencies: [visible],
//       revertOnUpdate: true,
//     },
//   );

//   return (
//     <section
//       ref={artworkref}
//       className={`artwork ${
//         visible ? 'artwork--playing' : 'artwork--waiting'
//       }`}
//       aria-label="Featured artwork"
//     >
//       <div className="artwork_frame">
//         <span className="artwork_line artwork_line--left" />
//         <span className="artwork_line artwork_line--right" />
//         <span className="artwork_line artwork_line--top" />
//         <span className="artwork_line artwork_line--bottom" />

//         <div className="artwork_images">
//           <div className="artwork_image artwork_image--adam">
//             <img src="/images/god-hand.png" alt="God's hand" />
//           </div>

//           <div className="artwork_image artwork_image--god">
//             <img src="/images/adam-hand.png" alt="Adam's hand" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default LandingArtWork;
import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import './LandingArtWork.css';

type LandingArtWorkProps = {
  visible: boolean;
  instant?:boolean;
  onComplete: () => void;
};

function LandingArtWork({ visible,instant=false, onComplete }: LandingArtWorkProps) {
  const artworkref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!visible || instant) return;

      const timeline = gsap.timeline();

      timeline
        .from('.artwork_line--left', {
          scaleY: 0,
          duration: 0.8,
          transformOrigin: 'top',
          ease: 'power3.inOut',
        })
        .from(
          '.artwork_line--right',
          {
            scaleY: 0,
            duration: 0.8,
            transformOrigin: 'bottom',
            ease: 'power3.inOut',
          },
          '<',
        )
        .from('.artwork_line--top', {
          scaleX: 0,
          duration: 0.8,
          transformOrigin: 'left',
          ease: 'power3.inOut',
        })
        .from(
          '.artwork_line--bottom',
          {
            scaleX: 0,
            duration: 0.8,
            transformOrigin: 'right',
            ease: 'power3.inOut',
          },
          '<',
        )
        .from(
          '.artwork_image--adam',
          {
            xPercent: -100,
            opacity: 0,
            duration: 1.6,
            ease: 'power3.out',
          },
        )
        .from(
          '.artwork_image--god',
          {
            xPercent: 100,
            opacity: 0,
            duration: 1.6,
            ease: 'power3.out',
          },
          '<',
        )
        // Tell LandingPage that the artwork is finished.
        .call(onComplete);
    },
    {
      scope: artworkref,
      dependencies: [visible],
      revertOnUpdate: true,
    },
  );

  // Phones: the hands sit in the gap the hero text column reserves for them
  // ('.hero-body__art-spacer'). Measure that gap and hand its position to the CSS.
  useEffect(() => {
    const root = artworkref.current;
    const shell = root?.closest<HTMLElement>('.landing-shell');
    if (!root || !shell) return undefined;
    const phone = window.matchMedia('(max-width: 700px)');
    let raf = 0;

    // offsetTop/offsetLeft ignore transforms, so this stays right while the page scales
    const offsetIn = (el: HTMLElement) => {
      let top = 0;
      let left = 0;
      let node: HTMLElement | null = el;
      while (node && node !== shell) {
        top += node.offsetTop;
        left += node.offsetLeft;
        node = node.offsetParent as HTMLElement | null;
      }
      return { top, left };
    };

    const place = () => {
      const spacer = shell.querySelector<HTMLElement>('.hero-body__art-spacer');
      if (!phone.matches || !spacer) {
        shell.classList.remove('has-phone-art');
        ['--art-top', '--art-cx', '--art-w'].forEach((name) => root.style.removeProperty(name));
        return;
      }
      // switch the phone layout on first (it shows the gap), then measure the gap
      shell.classList.add('has-phone-art');
      const { top, left } = offsetIn(spacer);
      root.style.setProperty('--art-top', `${top}px`);
      root.style.setProperty('--art-cx', `${left + spacer.offsetWidth / 2}px`);
      root.style.setProperty('--art-w', `${spacer.offsetWidth}px`);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(shell);
    const mutationObserver = new MutationObserver(schedule); // the hero mounts after the loader
    mutationObserver.observe(shell, { childList: true, subtree: true });
    phone.addEventListener('change', schedule);
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    schedule();

    return () => {
      shell.classList.remove('has-phone-art');
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      phone.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <section
      ref={artworkref}
      className={`artwork ${
        visible ? 'artwork--playing' : 'artwork--waiting'
      }`}
      aria-label="Featured artwork"
    >
      <div className="artwork_frame">
        <span className="artwork_line artwork_line--left" />
        <span className="artwork_line artwork_line--right" />
        <span className="artwork_line artwork_line--top" />
        <span className="artwork_line artwork_line--bottom" />

        <div className="artwork_images">
          <div className="artwork_image artwork_image--adam">
            <img src="/images/god-hand.png" alt="God's hand" />
          </div>

          <div className="artwork_image artwork_image--god">
            <img src="/images/adam-hand.png" alt="Adam's hand" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingArtWork;