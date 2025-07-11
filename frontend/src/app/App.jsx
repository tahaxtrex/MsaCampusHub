import { useState } from 'react'
import Footer1 from '../components/footer';
import NavBar from '../components/navbar';
import './App.css'
import CurvedLoop from '../components/identity';
import MsaCard from '../components/msacard';



function App() {
  return (
    <>
      <main className="min-h-screen">
       <NavBar/>

      <MsaCard/>
      
       <div>
        <CurvedLoop 
          marqueeText="Family ✦ Faith ✦ Friendship ✦ Purpose ✦ Islam ✦ growth ✦"
          speed={4}
          curveAmount={500}
          direction="right"
          interactive={true}
          className="identity"
        />
       </div>
        <Footer1/>
      </main>
    </>

    

  );
}


export default App
