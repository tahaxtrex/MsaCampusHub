import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { Trophy, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const LeaderboardPage = () => {
    const { authUser } = useAuthStore();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);

    useEffect(() => {
        fetchLeaderboard();
        if (authUser) {
            checkIfCheckedIn();
        }
    }, [authUser]);

    const fetchLeaderboard = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("username, fajr_points, avatar_url")
                .order("fajr_points", { ascending: false })
                .limit(15);

            if (error) throw error;
            setLeaders(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkIfCheckedIn = async () => {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
            .from("fajr_checkins")
            .select("*")
            .eq("user_id", authUser.id)
            .eq("date", today)
            .single();

        if (data) {
            setHasCheckedIn(true);
        }
    };

    const handleCheckIn = async () => {
        if (!authUser) return toast.error("Please login to check in");

        const today = new Date().toISOString().split("T")[0];

        try {
            // 1. Record check-in
            const { error: checkInError } = await supabase
                .from("fajr_checkins")
                .insert([{ user_id: authUser.id, date: today }]);

            if (checkInError) throw checkInError;

            // 2. Update points
            const { error: updateError } = await supabase.rpc("increment_points", {
                user_id: authUser.id,
                points_to_add: 10
            });

            // Fallback if RPC not exists (though RPC is better for atomicity)
            // For now, let's just update directly if RPC fails or just use direct update
            if (updateError) {
                // Try direct update
                const { error: directUpdateError } = await supabase
                    .from("profiles")
                    .update({ fajr_points: (authUser.fajr_points || 0) + 10 })
                    .eq("id", authUser.id);

                if (directUpdateError) throw directUpdateError;
            }

            toast.success("Fajr Check-in Successful! +10 Points");
            setHasCheckedIn(true);
            fetchLeaderboard(); // Refresh list
        } catch (error) {
            console.error("Check-in error:", error);
            toast.error("Failed to check in. You might have already checked in today.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <Trophy className="text-yellow-500" size={40} />
                        Fajr Leaderboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Compete for the sake of Allah! Check in for Fajr prayer and earn points.
                    </p>
                </div>

                {/* Check-in Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center transform transition-all hover:scale-105">
                    <h2 className="text-2xl font-semibold mb-6">Today's Fajr</h2>
                    {hasCheckedIn ? (
                        <div className="flex flex-col items-center text-green-600">
                            <CheckCircle size={64} className="mb-4" />
                            <span className="text-xl font-medium">You have checked in today!</span>
                            <span className="text-sm text-gray-500 mt-2">Come back tomorrow for more points.</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleCheckIn}
                            disabled={!authUser}
                            className={`btn btn-lg w-full sm:w-auto px-12 py-4 rounded-full text-xl font-bold text-white shadow-lg transition-all ${authUser
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/30"
                                : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {authUser ? "Check In Now (+10 Points)" : "Login to Check In"}
                        </button>
                    )}
                </div>

                {/* Leaderboard List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800">Top Worshippers</h3>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading rankings...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {leaders.map((user, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${index < 3 ? "bg-yellow-50/50" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index === 0
                                                ? "bg-yellow-100 text-yellow-700"
                                                : index === 1
                                                    ? "bg-gray-100 text-gray-700"
                                                    : index === 2
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-blue-50 text-blue-600"
                                                }`}
                                        >
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {user.username || "Anonymous"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {index === 0 ? "Current Leader" : "Consistent Worshipper"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-600 font-bold">
                                        <span>{user.fajr_points}</span>
                                        <span className="text-xs font-normal text-gray-500">pts</span>
                                    </div>
                                </div>
                            ))}

                            {leaders.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    No check-ins yet. Be the first!
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
