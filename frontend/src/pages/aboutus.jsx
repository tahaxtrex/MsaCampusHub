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
            image: 'https://plus.unsplash.com/premium_photo-1670148434900-5f0af77ba500?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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


        <div style={{ height: '800px', position: 'relative' }}>
          <InfiniteMenu items={items}/>
        </div>

      </main>
    </>
  );
}


export default AboutUs
