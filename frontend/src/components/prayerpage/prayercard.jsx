import { useEffect, useState } from "react";
import Axios from "axios";

const PrayerCard = ()=>{
    const day = 0

    const cardproperty = "bg-white/30 lg:w-60 lg:h-80 lg:w-35 lg:h-50 rounded shadow-2xl m-10 border-4 border-white transition duration-600 ease-in-out hover:-translate-y-1"
    const imageproperty = " border-1 border-white rounded"
    const textproperty = "flex justify-center font-extrabold text-3xl font-serif underline"
    const timeproperty ="flex justify-center font-semibold text-2xl font-mono m-6"




    const [fajrtime, setfajrtime] = useState("");
    const [duhrtime, setduhrtime] = useState("");
    const [asrtime, setasrtime] = useState("");
    const [maghribtime, setmaghribtime] = useState("");
    const [ishatime, setishatime] = useState("");

    let salahtime = [fajrtime, duhrtime, asrtime, maghribtime, ishatime]
    

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await Axios.get("http://localhost:8001/prayertime");
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

    return (
        <>
        <section className="flex justify-around flex-wrap items-center mt-10">
            <div className={cardproperty}>
                <img src="./prayertime/fajr.PNG" alt="fajr" className={imageproperty} />
                <h2 className={textproperty}> FAJR</h2>
                <h3 className={timeproperty}>{fajrtime} </h3>
            </div>
            <div className={cardproperty}>
                <img src="./prayertime/duhr.PNG" alt="dhuhr" />
                <h2 className={textproperty}> DHUHR</h2>
                <h3 className={timeproperty}>{duhrtime} </h3>
            </div>
            <div className={cardproperty}>
                <img src="./prayertime/asr.PNG" alt="asr" />
                <h2 className={textproperty}> ASR</h2>
                <h3 className={timeproperty}>{asrtime} </h3>
            </div>
            <div className={cardproperty}>
                <img src="./prayertime/maghrib.PNG" alt="maghrib" />
                <h2 className={textproperty}> MAGHRIB</h2>
                <h3 className={timeproperty}>{maghribtime} </h3>
            </div>
            <div className={cardproperty}>
                <img src="./prayertime/isha.PNG" alt="isha" />
                <h2 className={textproperty}> ISHA</h2>
                <h3 className={timeproperty} >{ishatime} </h3>
            </div >
            
            
        </section>
        </>
    )}


export default PrayerCard;