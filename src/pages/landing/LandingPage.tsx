import { useState } from 'react';
import './LandingPage.css';
import RedCreamTransition from "./RedCreamTransition";
import LandingArtWork from './LandingArtWork';
import "./LandingPage.css"
import HeroSection from './HeroSection';
import FluidCursor from '../../components/FluidCursor'; 
import useScrollLock from '../../hooks/useScrollLock';
import MechaLoader from './MechaLoader';
let introPlayed = false;

function LandingPage(){
    const [skipIntro] = useState(introPlayed);
    const [playArtwork, setPlayArtwork] = useState(introPlayed);
    const [showHero, setShowHero] = useState(introPlayed);
    const [loaded, setLoaded] = useState(introPlayed);
    useScrollLock(!skipIntro && !showHero);
    return( 
   <main className="landing-shell">
      <FluidCursor/>
      <LandingArtWork 
      visible={playArtwork} 
      instant = {skipIntro}
      onComplete={() => {
        introPlayed=true;
        setShowHero(true);
      }}
      />
      {showHero && <HeroSection instant={skipIntro} />}
           {!skipIntro && !loaded && <MechaLoader onDone={() => setLoaded(true)} />}
      {!skipIntro && loaded && (
        <RedCreamTransition onSplitComplete={() => setPlayArtwork(true)} />
      )} 
    </main>
  );

    
}
export default LandingPage;