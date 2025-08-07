import CurvedLoop from '../components/home/identity';
import MsaCard from '../components/msacard';
import { FaArrowDown } from "react-icons/fa";
import GridMotion from '../components/home/gridmotion';


function Home() {


  const githubBase =
    "https://raw.githubusercontent.com/tahaxtrex/Msa-images/26bc34b7f569f18d480d91a9f5bf54ff876e2743";

  const imageNames = [
    "amphi.JPG",
    "bbq.JPG",
    "women%20amphi.JPG",
    "men%20certificate.JPG",
    "bbq2.JPG",
    "finaliftarMSAdenoiseed-78.JPG",
    "khaoula%20nouha.JPG",
    "women%20amphi.JPG",
  ];

  // 🔁 Generate 28 image items by repeating the base list
  const items = Array.from({ length: 22 }, (_, index) =>
    `${githubBase}/${imageNames[index % imageNames.length]}`
  );


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

      <div className='h-180'>
        <GridMotion items={items} />
      </div>
      


      </main>
    </>

  );
}


export default Home
