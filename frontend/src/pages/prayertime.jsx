import { useState } from 'react'
import Footer1 from '../components/footer';
import NavBar from '../components/navbar';
import PrayerCard from '../components/prayerpage/prayercard';



function Prayer() {
  return (
    <>
      <main className="min-h-screen">
        <NavBar/>
        <PrayerCard/>
        <br /><br /><br /><br /><br /><br /><br />
        <Footer1/>
      </main>
    </>
  );
}


export default Prayer
