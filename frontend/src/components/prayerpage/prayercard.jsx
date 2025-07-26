import { useEffect, useState } from "react";
import Axios from "axios";
import CountUp from "./countup";

const PrayerCard = ()=>{
    const day = 0

    const [fajrtime, setfajrtime] = useState("");
    const [duhrtime, setduhrtime] = useState("");
    const [asrtime, setasrtime] = useState("");
    const [maghribtime, setmaghribtime] = useState("");
    const [ishatime, setishatime] = useState("");

    let salahtime = [fajrtime, duhrtime, asrtime, maghribtime, ishatime]
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(`${import.meta.env.VITE_BACKEND_URL}/prayertime`)
                const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/prayertime`);
                setfajrtime(response.data.Fajr);
                setduhrtime(response.data.Dhuhr);
                setasrtime(response.data.Asr);
                setmaghribtime(response.data.Maghrib);
                setishatime(response.data.Isha);
                console.log(response.data);
            } catch (error) {
                console.error("Fetch error:", error.message);
            }
        };
        fetchData();
        }, []);
        

        const dataLoaded = fajrtime && duhrtime && asrtime && maghribtime && ishatime;
        let nextPrayer = "";
        let timeleft = 0

        if(dataLoaded) {
            let now = new Date();
            let current = now.getHours() * 60 + now.getMinutes();

            const calculeminute = (stringoftime) => {
            const [hour, minute] = stringoftime.split(":").map(Number);
            return hour * 60 + minute;
        };

            if (current < calculeminute(fajrtime)) {
            nextPrayer = "fajr";
            timeleft = calculeminute(fajrtime)-current
            } else if (current < calculeminute(duhrtime)) {
            nextPrayer = "duhr";
            timeleft = calculeminute(duhrtime)-current
            } else if (current < calculeminute(asrtime)) {
            nextPrayer = "asr";
            timeleft = calculeminute(asrtime)-current
            } else if (current < calculeminute(maghribtime)) {
            nextPrayer = "maghrib";
            timeleft = calculeminute(maghribtime)-current
            } else {
            nextPrayer = "isha";
            timeleft = calculeminute(ishatime)-current
        }}

    const cardproperty = "bg-white/30 lg:w-55 lg:h-80 sm:w-50 sm:h-50 rounded shadow-2xl border-6 transition duration-600 ease-in-out hover:-translate-y-1"
    const imageproperty = " border-1 border-white rounded"
    const textproperty = "flex justify-center font-extrabold text-3xl font-serif underline"
    const timeproperty ="flex justify-center font-semibold text-2xl font-mono"

    return (
        <>

        <section className="flex flex-wrap justify-around items-center mt-10">
            <div className= {` ${cardproperty} ${nextPrayer === 'fajr' ? "border-green-600 lg:w-70 lg:h-90 sm:w-50 sm:h-60":"border-white"}`} >
                <img src="./prayertime/fajr.PNG" alt="fajr" className={imageproperty} />
                <h2 className={textproperty}> FAJR</h2>
                <h3 className={timeproperty}>{fajrtime} </h3>

                {(nextPrayer === 'fajr') && (<h4>next prayer is in : 
                    <CountUp
                    from={0}
                    to={timeleft}
                    separator=","
                    direction="up"
                    duration={2}
                    className="count-up-text"
                    />
                </h4>)}
            </div>
            <div className= {` ${cardproperty} ${nextPrayer === 'duhr' ? "border-green-600 lg:w-70 lg:h-90 sm:w-50 sm:h-60":"border-white"}`}>
                <img src="./prayertime/duhr.PNG" alt="duhr" />
                <h2 className={textproperty}> DHUHR</h2>
                <h3 className={timeproperty}>{duhrtime} </h3>
                {(nextPrayer === 'duhr') && (<h4>next prayer is in : {" "}
                    {<CountUp
                    from={0}
                    to={timeleft}
                    separator=","
                    direction="up"
                    duration={2}
                    className="count-up-text"
                    />}
                </h4>)}
            </div>
            <div className={` ${cardproperty} ${nextPrayer === 'asr' ? "border-green-600 lg:w-70 lg:h-90 sm:w-50 sm:h-60":"border-white"}`}>
                <img src="./prayertime/asr.PNG" alt="asr" />
                <h2 className={textproperty}> ASR</h2>
                <h3 className={timeproperty}>{asrtime} </h3>
                {(nextPrayer === 'asr') && (<h4>next prayer is in : 
                    <CountUp
                    from={0}
                    to={timeleft}
                    separator=","
                    direction="up"
                    duration={2}
                    className="count-up-text"
                    />
                </h4>)}
            </div>
            <div className={` ${cardproperty} ${nextPrayer === 'maghrib' ? "border-green-600 lg:w-70 lg:h-90 sm:w-50 sm:h-60":"border-white"}`}>
                <img src="./prayertime/maghrib.PNG" alt="maghrib" />
                <h2 className={textproperty}> MAGHRIB</h2>
                <h3 className={timeproperty}>{maghribtime} </h3>
                {(nextPrayer === 'maghrib') && (<h4>next prayer is in : 
                    <CountUp
                    from={0}
                    to={timeleft}
                    separator=","
                    direction="up"
                    duration={2}
                    className="count-up-text"
                    />
                </h4>)}
            </div>
            <div className={` ${cardproperty} ${nextPrayer === 'isha' ? "border-green-600 lg:w-70 lg:h-90 sm:w-50 sm:h-60":"border-white "}`}>
                <img src="./prayertime/isha.PNG" alt="isha" />
                <h2 className={textproperty}> ISHA</h2>
                <h3 className={timeproperty} >{ishatime} </h3>
                {(nextPrayer === 'isha') && (<h4>next prayer is in : 
                    <CountUp
                    from={0}
                    to={timeleft}
                    separator=","
                    direction="up"
                    duration={2}
                    className="count-up-text"
                    />
                </h4>)}
            </div >
            
            
        </section>
        </>
    )}


export default PrayerCard;