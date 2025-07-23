import Footer1 from '../components/footer';
import NavBar from '../components/navbar';
import CurvedLoop from '../components/home/identity';
import MsaCard from '../components/msacard';
import InfiniteMenu from '../components/eventscard';



function Home() {


  return (
    <>
      <main className="min-h-screen">

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
      </main>
    </>

    

  );
}


export default Home
