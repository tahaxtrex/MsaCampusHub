import CurvedLoop from "../components/home/identity";
import MsaCard from "../components/msacard";
import Mobilemsacard from "../components/mobilemsacard";
import { FaArrowDown } from "react-icons/fa";
import GridMotion from "../components/home/gridmotion";

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

  // Repeat base list to create gallery
  const items = Array.from({ length: 22 }, (_, index) =>
    `${githubBase}/${imageNames[index % imageNames.length]}`
  );

  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* 🕌 Hero Section */}
      <div className="hidden sm:block relative z-10 flex-col items-center justify-center px-4 sm:px-8 mt-4 sm:mt-8">
        <MsaCard />
      </div>

      {/* 📱 Mobile view */}
      <div className="block sm:hidden">
        <Mobilemsacard />
      </div>

      <div
        className="
          absolute lg:bottom-6 left-1/2 transform -translate-x-1/2 text-center z-0
          hidden lg:block
        "
      >
        <p className="text-gray-600 text-sm mb-1">Learn more</p>
        <FaArrowDown className="mx-auto text-green-600 animate-bounce" />
      </div>

      {/* 👇 Mobile replacement for Learn More */}
      <div className="hidden text-center mt-8 mb-2">
        <p className="text-gray-600 text-sm">Learn more</p>
        <FaArrowDown className="mx-auto text-green-600 animate-bounce text-lg" />
      </div>

      {/* 🌀 Curved Loop Banner */}
      <div className="relative z-10 mt-8 sm:mt-12 md:mt-20">
        <CurvedLoop
          marqueeText="Family ✦ Faith ✦ Friendship ✦ Purpose ✦ Islam ✦ Growth ✦"
          speed={2}
          curveAmount={500}
          direction="right"
          interactive={true}
          className="identity"
        />
      </div>

      {/* ⬇️ “Learn More” section */}
      <div
        className="
          absolute lg:bottom-6 left-1/2 transform -translate-x-1/2 text-center z-0
          hidden lg:block
        "
      >
        <p className="text-gray-600 text-sm mb-1">Learn more</p>
        <FaArrowDown className="mx-auto text-green-600 animate-bounce" />
      </div>

      {/* 👇 Mobile replacement for Learn More */}
      <div className="block lg:hidden text-center mt-8 mb-2">
        <p className="text-gray-600 text-sm">Learn more</p>
        <FaArrowDown className="mx-auto text-green-600 animate-bounce text-lg" />
      </div>

      {/* 🖼️ GridMotion Section */}
      <div className="relative z-10 w-full mt-8 sm:mt-12 md:mt-20 px-2 sm:px-6">
        <GridMotion items={items} />
      </div>
    </main>
  );
}

export default Home;
