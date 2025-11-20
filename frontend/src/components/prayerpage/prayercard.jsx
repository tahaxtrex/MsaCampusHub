import { useEffect, useState } from "react";
import Axios from "axios";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const PrayerCard = () => {
  const [fajrtime, setfajrtime] = useState("");
  const [duhrtime, setduhrtime] = useState("");
  const [asrtime, setasrtime] = useState("");
  const [maghribtime, setmaghribtime] = useState("");
  const [ishatime, setishatime] = useState("");

  const [nextPrayer, setNextPrayer] = useState("");
  const [countdown, setCountdown] = useState("");
  const [registeredPrayers, setRegisteredPrayers] = useState(new Set());
  const { authUser, isCheckingAuth } = useAuthStore();

  // Fetch prayer times
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fallback to a public API if backend fails or is not running
        // Using aladhan API as a robust alternative
        const date = new Date();
        const response = await Axios.get(`https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=51.5074&longitude=-0.1278&method=2`);
        const timings = response.data.data.timings;

        setfajrtime(timings.Fajr);
        setduhrtime(timings.Dhuhr);
        setasrtime(timings.Asr);
        setmaghribtime(timings.Maghrib);
        setishatime(timings.Isha);

      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };
    fetchData();
  }, []);

  // Fetch existing registrations for today
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!authUser) return;

      const today = new Date().toISOString().split("T")[0];

      try {
        const { data, error } = await supabase
          .from("prayer_registrations")
          .select("prayer_name")
          .eq("user_id", authUser.id)
          .eq("date", today);

        if (error) throw error;

        const registered = new Set(data.map(r => r.prayer_name));
        setRegisteredPrayers(registered);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, [authUser]);

  const stringToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const stringToHourMinute = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return [hour, minute];
  };

  const isPrayerPassed = (prayerTime) => {
    if (!prayerTime) return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes > stringToMinutes(prayerTime);
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

  const handleRegister = async (prayerName, prayerTime) => {
    if (!authUser) {
      toast.error("Please login to register");
      return;
    }

    // Check if prayer has passed
    if (isPrayerPassed(prayerTime)) {
      toast.error("Cannot register for a prayer that has already passed");
      return;
    }

    // Check if already registered
    if (registeredPrayers.has(prayerName)) {
      toast.error("You are already registered for this prayer");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      const { error } = await supabase
        .from("prayer_registrations")
        .insert([
          { user_id: authUser.id, prayer_name: prayerName, date: today }
        ]);

      if (error) throw error;

      // Update local state
      setRegisteredPrayers(prev => new Set([...prev, prayerName]));
      toast.success(`Registered for ${prayerName}!`);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register");
    }
  };

  const handleUnregister = async (prayerName) => {
    if (!authUser) {
      toast.error("Please login to unregister");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      const { error } = await supabase
        .from("prayer_registrations")
        .delete()
        .eq("user_id", authUser.id)
        .eq("prayer_name", prayerName)
        .eq("date", today);

      if (error) throw error;

      // Update local state
      setRegisteredPrayers(prev => {
        const updated = new Set(prev);
        updated.delete(prayerName);
        return updated;
      });
      toast.success(`Unregistered from ${prayerName}`);
    } catch (error) {
      console.error("Unregister error:", error);
      toast.error("Failed to unregister");
    }
  };

  const cardStyle = (prayerName) =>
    `bg-white/50 w-72 h-auto min-h-96 rounded-2xl shadow-lg border-4 flex flex-col justify-between items-center p-6 transition-transform duration-300 hover:-translate-y-1 ${nextPrayer === prayerName ? "border-green-600" : "border-white"
    }`;

  const textStyle = "font-extrabold text-2xl font-serif underline mb-2";
  const timeStyle = "font-semibold text-xl font-mono mb-4";

  const cards = [
    { name: "fajr", time: fajrtime, img: "./prayertime/fajr.PNG" },
    { name: "duhr", time: duhrtime, img: "./prayertime/duhr.PNG" },
    { name: "asr", time: asrtime, img: "./prayertime/asr.PNG" },
    { name: "maghrib", time: maghribtime, img: "./prayertime/maghrib.PNG" },
    { name: "isha", time: ishatime, img: "./prayertime/isha.PNG" },
  ];

  return (
    <section className="flex flex-wrap justify-center items-center gap-6 mt-10 px-4 mb-20">
      {cards.map((prayer, idx) => (
        <div key={idx} className={cardStyle(prayer.name)}>
          <img
            src={prayer.img}
            alt={prayer.name}
            className="aspect-square w-full object-cover rounded-lg border border-white mb-4"
          />
          <h2 className={textStyle}>{prayer.name.toUpperCase()}</h2>
          <h3 className={timeStyle}>{prayer.time}</h3>

          {nextPrayer === prayer.name && (
            <h4 className="text-sm mb-4 text-green-800 font-semibold">
              Next prayer in: {countdown}
            </h4>
          )}

          <button
            onClick={() => registeredPrayers.has(prayer.name)
              ? handleUnregister(prayer.name)
              : handleRegister(prayer.name, prayer.time)
            }
            disabled={isCheckingAuth || isPrayerPassed(prayer.time)}
            className={`btn btn-sm w-full mt-auto ${registeredPrayers.has(prayer.name)
              ? 'btn-warning'
              : isPrayerPassed(prayer.time)
                ? 'btn-disabled'
                : 'btn-outline btn-success'
              }`}
          >
            {isCheckingAuth
              ? "Loading..."
              : registeredPrayers.has(prayer.name)
                ? "Unregister"
                : isPrayerPassed(prayer.time)
                  ? "Passed"
                  : "Register"}
          </button>
        </div>
      ))}
    </section>
  );
};

export default PrayerCard;
