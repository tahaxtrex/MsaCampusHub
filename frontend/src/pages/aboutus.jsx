import { useState } from 'react'
import Footer1 from '../components/footer';
import NavBar from '../components/navbar';
import Taha from '../components/aboutus/tahacard';
import InfiniteMenu from '../components/eventscard';



function AboutUs() {

  const items = [
          {
            image: 'https://picsum.photos/300/300?grayscale',
            link: 'https://www.linkedin.com/in/tahahbirri/',
            title: 'Taha Hbirri',
            description: 'Computer science student'
          },
          {
            image: 'https://picsum.photos/400/400?grayscale',
            link: 'https://www.linkedin.com/in/ahmed-maghri/',
            title: 'Ahmed Maghri',
            description: 'Computer science student'
          },
          {
            image: 'https://picsum.photos/500/500?grayscale',
            link: 'https://google.com/',
            title: 'Item 3',
            description: 'Computer science student'
          },
          {
            image: 'https://picsum.photos/600/600?grayscale',
            link: 'https://google.com/',
            title: 'RANDOM student',
            description: 'Computer science student'
          }
        ];
  return (
    <>
      <main className="min-h-screen">
        <NavBar/>

        <div style={{ height: '800px', position: 'relative' }}>
          <InfiniteMenu items={items}/>
        </div>
      
        <Footer1/>
      </main>
    </>
  );
}


export default AboutUs
