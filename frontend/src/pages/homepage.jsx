import CurvedLoop from '../components/home/identity';
import MsaCard from '../components/msacard';
import { FaArrowDown } from "react-icons/fa";


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

        <div className="hidden lg:block absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-0">
          <p className="text-gray-600 text-sm mb-1">Learn more</p>
          <FaArrowDown className="mx-auto text-green-600 animate-bounce" />
        </div>

      </main>
    </>

  );
}


export default Home
