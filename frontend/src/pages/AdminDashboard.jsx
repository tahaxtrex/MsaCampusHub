import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Calendar, UserCheck, Plus, Trash2, MapPin, Clock, Edit2, Phone, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const { authUser } = useAuthStore();
    const [stats, setStats] = useState({ users: 0, events: 0, volunteers: 0 });
    const [events, setEvents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('events'); // 'events' or 'volunteers'

    // New state for user list and event volunteers
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [showEventVolunteersModal, setShowEventVolunteersModal] = useState(false);
    const [selectedEventVolunteers, setSelectedEventVolunteers] = useState([]);
    const [selectedEventTitle, setSelectedEventTitle] = useState('');
    const [eventVolunteerCounts, setEventVolunteerCounts] = useState({});

    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        type: "social",
        max_volunteers: 5
    });

    useEffect(() => {
        if (authUser?.is_admin) {
            fetchStats();
            fetchEvents();
            fetchVolunteers();
        }
    }, [authUser]);

    const fetchStats = async () => {
        try {
            const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
            const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });
            const { count: volCount } = await supabase.from("event_volunteers").select("*", { count: "exact", head: true });

            setStats({ users: userCount || 0, events: eventCount || 0, volunteers: volCount || 0 });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .order("date", { ascending: true });

            if (error) throw error;
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVolunteers = async () => {
        try {
            // First, get all event_volunteers
            const { data: volunteersData, error: volunteersError } = await supabase
                .from("event_volunteers")
                .select("*")
                .order("created_at", { ascending: false });

            if (volunteersError) {
                console.error("Error fetching event_volunteers:", volunteersError);
                console.error("Full error details:", JSON.stringify(volunteersError, null, 2));
                throw volunteersError;
            }

            if (!volunteersData || volunteersData.length === 0) {
                console.log("No volunteers data found");
                setVolunteers([]);
                return;
            }

            console.log("Found volunteers:", volunteersData);

            // Get unique event IDs and user IDs
            const eventIds = [...new Set(volunteersData.map(v => v.event_id))];
            const userIds = [...new Set(volunteersData.map(v => v.user_id))];

            console.log("Event IDs:", eventIds);
            console.log("User IDs:", userIds);

            // Fetch events
            const { data: eventsData, error: eventsError } = await supabase
                .from("events")
                .select("id, title, date")
                .in("id", eventIds);

            if (eventsError) {
                console.error("Error fetching events:", eventsError);
                console.error("Events error details:", JSON.stringify(eventsError, null, 2));
            } else {
                console.log("Fetched events:", eventsData);
            }

            // Fetch profiles
            const { data: profilesData, error: profilesError } = await supabase
                .from("profiles")
                .select("id, username, email, phone_number")
                .in("id", userIds);

            if (profilesError) {
                console.error("Error fetching profiles:", profilesError);
                console.error("Profiles error details:", JSON.stringify(profilesError, null, 2));
            } else {
                console.log("Fetched profiles:", profilesData);
            }

            // Create lookup maps
            const eventsMap = {};
            (eventsData || []).forEach(event => {
                eventsMap[event.id] = event;
            });

            const profilesMap = {};
            (profilesData || []).forEach(profile => {
                profilesMap[profile.id] = profile;
            });

            // Join the data manually
            const joinedData = volunteersData.map(volunteer => ({
                id: volunteer.id,
                volunteered_at: volunteer.created_at,  // Map created_at to volunteered_at for display
                event_id: volunteer.event_id,
                user_id: volunteer.user_id,
                events: eventsMap[volunteer.event_id] || null,
                profiles: profilesMap[volunteer.user_id] || null
            }));

            console.log("Joined volunteer data:", joinedData);
            setVolunteers(joinedData);
        } catch (error) {
            console.error("Error in fetchVolunteers:", error);
            setVolunteers([]);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, username, email, phone_number, created_at")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setAllUsers(data || []);
            setShowUsersModal(true);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        }
    };

    const fetchEventVolunteers = async (eventId, eventTitle) => {
        try {
            // Get volunteers for this event
            const { data: volunteersData, error: volunteersError } = await supabase
                .from("event_volunteers")
                .select("*")
                .eq("event_id", eventId);

            if (volunteersError) throw volunteersError;

            if (!volunteersData || volunteersData.length === 0) {
                setSelectedEventVolunteers([]);
                setSelectedEventTitle(eventTitle);
                setShowEventVolunteersModal(true);
                return;
            }

            // Get user IDs
            const userIds = volunteersData.map(v => v.user_id);

            // Fetch profiles
            const { data: profilesData, error: profilesError } = await supabase
                .from("profiles")
                .select("id, username, email, phone_number")
                .in("id", userIds);

            if (profilesError) throw profilesError;

            // Create profiles map
            const profilesMap = {};
            (profilesData || []).forEach(profile => {
                profilesMap[profile.id] = profile;
            });

            // Join data
            const volunteers = volunteersData.map(v => ({
                ...v,
                profile: profilesMap[v.user_id] || null
            }));

            setSelectedEventVolunteers(volunteers);
            setSelectedEventTitle(eventTitle);
            setShowEventVolunteersModal(true);
        } catch (error) {
            console.error("Error fetching event volunteers:", error);
            toast.error("Failed to load volunteers");
        }
    };

    // Fetch volunteer counts per event
    useEffect(() => {
        const fetchVolunteerCounts = async () => {
            if (events.length === 0) return;

            const counts = {};
            for (const event of events) {
                const { count } = await supabase
                    .from("event_volunteers")
                    .select("*", { count: "exact", head: true })
                    .eq("event_id", event.id);
                counts[event.id] = count || 0;
            }
            setEventVolunteerCounts(counts);
        };

        fetchVolunteerCounts();
    }, [events]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            // Combine date and time
            const dateTime = new Date(`${newEvent.date}T${newEvent.time}`).toISOString();

            const { error } = await supabase.from("events").insert([{
                title: newEvent.title,
                date: dateTime,
                location: newEvent.location,
                description: newEvent.description,
                type: newEvent.type,
                max_volunteers: parseInt(newEvent.max_volunteers),
                created_by: authUser.id
            }]);

            if (error) throw error;

            toast.success("Event created successfully!");
            setShowCreateModal(false);
            setNewEvent({ title: "", date: "", time: "", location: "", description: "", type: "social", max_volunteers: 5 });
            fetchEvents();
            fetchStats();
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error("Failed to create event");
        }
    };

    const handleEditEvent = async (e) => {
        e.preventDefault();
        try {
            const dateTime = new Date(`${editingEvent.date}T${editingEvent.time}`).toISOString();

            const { error } = await supabase
                .from("events")
                .update({
                    title: editingEvent.title,
                    date: dateTime,
                    location: editingEvent.location,
                    description: editingEvent.description,
                    type: editingEvent.type,
                    max_volunteers: parseInt(editingEvent.max_volunteers),
                })
                .eq("id", editingEvent.id);

            if (error) throw error;

            toast.success("Event updated successfully!");
            setShowEditModal(false);
            setEditingEvent(null);
            fetchEvents();
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Failed to update event");
        }
    };

    const openEditModal = (event) => {
        const eventDate = new Date(event.date);
        setEditingEvent({
            ...event,
            date: eventDate.toISOString().split('T')[0],
            time: eventDate.toTimeString().slice(0, 5)
        });
        setShowEditModal(true);
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const { error } = await supabase.from("events").delete().eq("id", id);
            if (error) throw error;

            toast.success("Event deleted");
            fetchEvents();
            fetchStats();
            fetchVolunteers();
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event");
        }
    };

    if (!authUser?.is_admin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="text-gray-600">You must be an admin to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} /> Create Event
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div
                        onClick={fetchAllUsers}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                            <p className="text-xs text-blue-600 mt-1">Click to view all</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Events</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.events}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Volunteers</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.volunteers}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'events'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Events Management
                    </button>
                    <button
                        onClick={() => setActiveTab('volunteers')}
                        className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'volunteers'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Volunteer Requests
                    </button>
                </div>

                {/* Events List */}
                {activeTab === 'events' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Manage Events</h2>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading events...</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {events.map((event) => (
                                    <div key={event.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => fetchEventVolunteers(event.id, event.title)}
                                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                            >
                                                <UserCheck size={16} />
                                                {eventVolunteerCounts[event.id] || 0} Volunteers
                                            </button>
                                            <button
                                                onClick={() => openEditModal(event)}
                                                className="text-gray-600 hover:text-blue-600"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="text-gray-600 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Volunteer Requests */}
                {activeTab === 'volunteers' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Volunteer Requests</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {volunteers.map((vol) => (
                                        <tr key={vol.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {vol.profiles?.username || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{vol.events?.title}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(vol.events?.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-900">
                                                        <Mail size={14} className="text-gray-400" />
                                                        {vol.profiles?.email}
                                                    </div>
                                                    {vol.profiles?.phone_number && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                                            <Phone size={14} className="text-gray-400" />
                                                            {vol.profiles?.phone_number}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(vol.volunteered_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {volunteers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No volunteer requests yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="input input-bordered w-full"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="input input-bordered w-full"
                                        value={newEvent.time}
                                        onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    value={newEvent.location}
                                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={newEvent.type}
                                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                >
                                    <option value="social">Social</option>
                                    <option value="religious">Religious</option>
                                    <option value="educational">Educational</option>
                                    <option value="charity">Charity</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Volunteers</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="input input-bordered w-full"
                                    value={newEvent.max_volunteers}
                                    onChange={e => setNewEvent({ ...newEvent, max_volunteers: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows="3"
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}
            {showEditModal && editingEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Edit Event</h2>
                        <form onSubmit={handleEditEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    value={editingEvent.title}
                                    onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="input input-bordered w-full"
                                        value={editingEvent.date}
                                        onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="input input-bordered w-full"
                                        value={editingEvent.time}
                                        onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    value={editingEvent.location}
                                    onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={editingEvent.type}
                                    onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })}
                                >
                                    <option value="social">Social</option>
                                    <option value="religious">Religious</option>
                                    <option value="educational">Educational</option>
                                    <option value="charity">Charity</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Volunteers</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="input input-bordered w-full"
                                    value={editingEvent.max_volunteers}
                                    onChange={e => setEditingEvent({ ...editingEvent, max_volunteers: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows="3"
                                    value={editingEvent.description}
                                    onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingEvent(null);
                                    }}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Users List Modal */}
            {showUsersModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">All Users ({allUsers.length})</h2>
                            <button
                                onClick={() => setShowUsersModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {allUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">{user.username || 'No username'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{user.phone_number || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Volunteers Modal */}
            {showEventVolunteersModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Volunteers for "{selectedEventTitle}"</h2>
                            <button
                                onClick={() => setShowEventVolunteersModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        {selectedEventVolunteers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No volunteers for this event yet</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedEventVolunteers.map((vol) => (
                                            <tr key={vol.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {vol.profile?.username || 'Unknown'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{vol.profile?.email || 'N/A'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{vol.profile?.phone_number || 'N/A'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {new Date(vol.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
