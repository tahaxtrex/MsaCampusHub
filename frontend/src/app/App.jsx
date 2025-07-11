import { useState } from 'react'
import TiltedCard from '../components/msacard';
import logo from '../assets/msapng.png'
import NavBar from '../components/navbar';
import './App.css'



function App() {
  return (
    <>
      <main className="min-h-screen">
       <NavBar/>

       <div className=' flex justify-center-safe items-center mt-16'>
         <TiltedCard
          imageSrc={logo}
          altText="msa logo"
          captionText="Msa logo"
          containerHeight="500px"
          containerWidth="500px"
          imageHeight="500px"
          imageWidth="500px"
          rotateAmplitude={18}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={
            <p className="tilted-card-demo-text">
            </p>
          }
               />
       </div>

      </main>
    </>

    

  );
}


export default App
