import SplitText from "../components/title";
import TiltedCard from '../components/logo';
import logo from '../assets/msapng.png'
import BlurText from "./liner";


const MsaCard = () => {

    return (
        <>
        <div className=' flex justify-around items-end flex-wrap mt-11'>
            
                <section className="whitespace-pre-line flex flex-col items-center justify-center py-50 px-1 flex-wrap">
                    <SplitText
                    text={"The Muslim Student Association"}
                    className="text-3xl sm:text-3xl md:4xl lg:text-5xl font-bold font-serif text-gray-800 text-center leading-tight flex-wrap"
                    delay={50}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                                />
                    
                    <BlurText
                        text="Your new family away from home"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        className="text-2xl mb-8 italic "
                        />
                </section>

             <TiltedCard
              imageSrc={logo}
              altText="msa logo"
              captionText="hover me"
              containerHeight="500px"
              containerWidth="500px"
              imageHeight="500px"
              imageWidth="500px"
              rotateAmplitude={18}
              scaleOnHover={1.1}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="tilted-card-demo-text mt-12 mr-10">
                </p>
              }
              />
       </div>
       </>
    )
}

export default MsaCard