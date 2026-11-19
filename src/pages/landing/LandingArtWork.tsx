
import { useRef } from 'react';
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
