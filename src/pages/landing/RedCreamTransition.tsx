// import { gsap } from "gsap/gsap-core";
// import { useGSAP } from "@gsap/react";
// import { useRef } from "react"
// import './RedCreamTransition.css'
// import { useLayoutEffect} from 'react';
// type RedCreamTransitionProps = {
//   onSplitComplete: () => void;
// };
// function RedCreamTransition({
//   onSplitComplete,
// }: RedCreamTransitionProps) {
//      const transitionRef = useRef<HTMLDivElement>(null);
//        useLayoutEffect(() => {
//         const id = requestAnimationFrame(() =>
//             requestAnimationFrame(() => document.documentElement.classList.remove('boot')),
//         );
//         return () => cancelAnimationFrame(id);
//         }, []); 
//        useGSAP(
//         ()=>{
//             const timeline = gsap.timeline({
//                 delay:0.2,paused:true
//             });

//             timeline
//             .from(
//                 '.transition_web',{
//                     y:'-110vh',
//                     rotation:-12,
//                     scale:0.8,
//                     opacity:0,
//                     duration:1.8,
//                     ease:'power3.inOut',
//                 }
//             )
//             .from(
//                 '.transition_spider',{
//                     y:'110vh',
//                     rotation:12,
//                     scale:0.8,
//                     opacity:0,
//                     duration:1.8,
//                     ease:'power3.inOut',
//                 },
//                 '<'
//             )
          
//             .to(
//                 {},{
//                     duration:0.35,
//                 }
//             )
//             .to(
//                 '.transition_top',{
//                     yPercent:-100,
//                     duration:1.2,
//                     ease:'power4.inOut',
//                 }
//             )
//             .to(
//                 '.transition_bottom',{
//                     yPercent:100,
//                     duration:1.2,
//                     ease:'power4.inOut',
//                 },
//                 '<',
//             )
//             .to(
//                 '.transition_web',{
//                     y:'-120vh',
//                     opacity:0,
//                     duration:1.2,
//                     ease:'power4.inOut'
//                 },
//                 '<'
//             )
//             .to(
//                 '.transition_spider',{
//                     y:'120vh',
//                     opacity:0,
//                     duration:1.2,
//                     ease:'power4.inOut'
//                 },
//                 '<'
//             )
//             .set(
//                 '.transition',{
//                     display:'none'
//                 }
//             )
//             .call(onSplitComplete);
//             const imgs = Array.from(transitionRef.current?.querySelectorAll('img') ?? []);
//             Promise.all(imgs.map((img) => img.decode().catch(() => {}))).then(() => timeline.play());
//         },
//         {
//             scope : transitionRef
//         },
        

//        );
//     return(

//        <div
//          ref={transitionRef}
//          className="transition"
//          aria-hidden="true"
//        >
//         <div className="transition_top">
           
//         <img 
//             className="transition_web"
//             src="/images/webimage.png"
//             alt="webimage"
//         />
//         </div>
//         <div className="transition_bottom">
//           <img 
//             className="transition_spider"
//             src="/images/spiderimage.png"
//             alt="spiderimage"
//         />  
//         </div>
        
//        </div>
//     )
// }
// export default RedCreamTransition;
import { gsap } from "gsap/gsap-core";
import { useGSAP } from "@gsap/react";
import { useRef } from "react"
import './RedCreamTransition.css'
import { useLayoutEffect} from 'react';
type RedCreamTransitionProps = {
  onSplitComplete: () => void;
};
function RedCreamTransition({
  onSplitComplete,
}: RedCreamTransitionProps) {
     const transitionRef = useRef<HTMLDivElement>(null);
       useLayoutEffect(() => {
        const id = requestAnimationFrame(() =>
            requestAnimationFrame(() => document.documentElement.classList.remove('boot')),
        );
        return () => cancelAnimationFrame(id);
        }, []); 
       useGSAP(
        ()=>{
            // Centre both images with xPercent/yPercent. They used to be centred by a CSS translate(-50%,-50%),
            // which GSAP converts to pixels the first time it reads it. These <img>s mount just now, so on a
            // real phone they have no height yet at that moment and GSAP silently drops the vertical -50%.
            gsap.set('.transition_web, .transition_spider', { xPercent: -50, yPercent: -50 });
            const timeline = gsap.timeline({
                delay:0.2,paused:true
            });

            timeline
            .from(
                '.transition_web',{
                    y:'-110vh',
                    rotation:-12,
                    scale:0.8,
                    opacity:0,
                    duration:1.8,
                    ease:'power3.inOut',
                }
            )
            .from(
                '.transition_spider',{
                    y:'110vh',
                    rotation:12,
                    scale:0.8,
                    opacity:0,
                    duration:1.8,
                    ease:'power3.inOut',
                },
                '<'
            )
          
            .to(
                {},{
                    duration:0.35,
                }
            )
            .to(
                '.transition_top',{
                    yPercent:-100,
                    duration:1.2,
                    ease:'power4.inOut',
                }
            )
            .to(
                '.transition_bottom',{
                    yPercent:100,
                    duration:1.2,
                    ease:'power4.inOut',
                },
                '<',
            )
            .to(
                '.transition_web',{
                    y:'-120vh',
                    opacity:0,
                    duration:1.2,
                    ease:'power4.inOut'
                },
                '<'
            )
            .to(
                '.transition_spider',{
                    y:'120vh',
                    opacity:0,
                    duration:1.2,
                    ease:'power4.inOut'
                },
                '<'
            )
            .set(
                '.transition',{
                    display:'none'
                }
            )
            .call(onSplitComplete);
            const imgs = Array.from(transitionRef.current?.querySelectorAll('img') ?? []);
            Promise.all(imgs.map((img) => img.decode().catch(() => {}))).then(() => timeline.play());
        },
        {
            scope : transitionRef
        },
        

       );
    return(

       <div
         ref={transitionRef}
         className="transition"
         aria-hidden="true"
       >
        <div className="transition_top">
           
        <img 
            className="transition_web"
            src="/images/webimage.png"
            alt="webimage"
        />
        </div>
        <div className="transition_bottom">
          <img 
            className="transition_spider"
            src="/images/spiderimage.png"
            alt="spiderimage"
        />  
        </div>
        
       </div>
    )
}
export default RedCreamTransition;