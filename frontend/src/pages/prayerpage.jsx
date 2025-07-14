import { useState } from 'react'
import Footer1 from '../components/footer';
import NavBar from '../components/navbar';
import MsaCard from '../components/msacard';



function Prayer() {
  return (
    <>
      <main className="min-h-screen">
        <NavBar/>
        <MsaCard/>
      
        <Footer1/>
      </main>
    </>
  );
}


export default Prayer
