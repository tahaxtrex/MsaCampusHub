import { useState } from 'react'
import Footer1 from '../components/footer';
import NavBar from '../components/navbar';
import './App.css'
import CurvedLoop from '../components/home/identity';
import MsaCard from '../components/msacard';
import InfiniteMenu from '../components/eventscard';



function App() {


  return (
    <>
      <main className="min-h-screen">
       <NavBar/>

      <MsaCard/>
      
       <div>
        <CurvedLoop 
          marqueeText="Family ✦ Faith ✦ Friendship ✦ Purpose ✦ Islam ✦ growth ✦"
          speed={2}
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
