import StaffCard from "../components/aboutus/staffcards";



function AboutUs() {

  const items = [
    {
      image: "https://raw.githubusercontent.com/tahaxtrex/Msa-images/main/DSC_5978.jpg",
      title: "Ahmed Maghri",
      subtitle: "Computer Science Student",
      handle: "@iramxx",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "https://github.com/tahaxtrex"
    },
    {
      image: "https://raw.githubusercontent.com/tahaxtrex/Msa-images/main/edited-2237.jpg",
      title: "Taha Hbirri",
      subtitle: "Computer Science Student",
      handle: "@tahaxtrex",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)",
      url: "https://linkedin.com/in/tahahbirri"
    }
  ];
  
  return (
    <>
      <main className="min-h-screen bg-white">
      <br /><br />
      <div className="bg-white" style={{ backgroundColor: 'white', height: '600px', position: 'relative' }}>
        <StaffCard 
          items={items}
          radius={100}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>

      </main>
    </>
  );
}


export default AboutUs
