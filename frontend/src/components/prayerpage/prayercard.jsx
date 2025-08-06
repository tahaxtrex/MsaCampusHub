import { useEffect, useState } from "react";
import Axios from "axios";

const PrayerCard = () => {
  const [fajrtime, setfajrtime] = useState("");
  const [duhrtime, setduhrtime] = useState("");
  const [asrtime, setasrtime] = useState("");
  const [maghribtime, setmaghribtime] = useState("");
  const [ishatime, setishatime] = useState("");

  const [nextPrayer, setNextPrayer] = useState("");
  const [countdown, setCountdown] = useState("");

  // Fetch prayer times
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/prayertime`);
        setfajrtime(response.data.Fajr);
        setduhrtime(response.data.Dhuhr);
        setasrtime(response.data.Asr);
        setmaghribtime(response.data.Maghrib);
        setishatime(response.data.Isha);
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };
    fetchData();
  }, []);

  const stringToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const stringToHourMinute = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return [hour, minute];
  };

  // Determine next prayer and countdown
  useEffect(() => {
    const updateCountdown = () => {
      if (!fajrtime || !duhrtime || !asrtime || !maghribtime || !ishatime) return;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const schedule = [
        { name: "fajr", time: fajrtime },
        { name: "duhr", time: duhrtime },
        { name: "asr", time: asrtime },
        { name: "maghrib", time: maghribtime },
        { name: "isha", time: ishatime },
      ];

      let next = schedule.find(p => currentMinutes < stringToMinutes(p.time)) || schedule[0];
      setNextPrayer(next.name);

      let target = new Date();
      const [h, m] = stringToHourMinute(next.time);
      target.setHours(h);
      target.setMinutes(m);
      target.setSeconds(0);
      if (target < now) target.setDate(target.getDate() + 1);

      const diffMs = target - now;
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;

      setCountdown(`${hours}h ${minutes}min`);
    };

    updateCountdown(); // initial run
    const interval = setInterval(updateCountdown, 60000); // update every minute

    return () => clearInterval(interval);
  }, [fajrtime, duhrtime, asrtime, maghribtime, ishatime]);

  const cardStyle = (prayerName) =>
    `bg-white/50 w-72 h-96 rounded-2xl shadow-lg border-4 flex flex-col justify-between items-center p-4 transition-transform duration-300 hover:-translate-y-1 ${
      nextPrayer === prayerName ? "border-green-600" : "border-white"
    }`;

  const textStyle = "font-extrabold text-2xl font-serif underline";
  const timeStyle = "font-semibold text-xl font-mono";

  const cards = [
    { name: "fajr", time: fajrtime, img: "./prayertime/fajr.PNG" },
    { name: "duhr", time: duhrtime, img: "./prayertime/duhr.PNG" },
    { name: "asr", time: asrtime, img: "./prayertime/asr.PNG" },
    { name: "maghrib", time: maghribtime, img: "./prayertime/maghrib.PNG" },
    { name: "isha", time: ishatime, img: "./prayertime/isha.PNG" },
  ];

  return (
    <section className="flex flex-wrap justify-center items-center gap-6 mt-10 px-4">
      {cards.map((prayer, idx) => (
        <div key={idx} className={cardStyle(prayer.name)}>
          <img
            src={prayer.img}
            alt={prayer.name}
            className="aspect-square w-full object-cover rounded-lg border border-white"
          />
          <h2 className={textStyle}>{prayer.name.toUpperCase()}</h2>
          <h3 className={timeStyle}>{prayer.time}</h3>
          {nextPrayer === prayer.name && (
            <h4 className="text-sm mt-2 text-green-800 font-semibold">
              Next prayer in: {countdown}
            </h4>
          )}
        </div>
      ))}
    </section>
  );
};

export default PrayerCard;
