import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Calendar, UserCheck, Plus, Trash2, MapPin, Clock, Edit2, Phone, Mail, User, Search, Briefcase, Tag, Ticket } from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const { authUser } = useAuthStore();
    const [stats, setStats] = useState({ users: 0, events: 0, volunteers: 0, roles: 0 });
    const [events, setEvents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('events'); // 'events', 'volunteers', 'roles', 'tickets'

    // New state for user list and event volunteers
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    // Iftar tickets state
    const [iftarTickets, setIftarTickets] = useState([]);
    const [iftarTicketCount, setIftarTicketCount] = useState(0);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [ticketFilter, setTicketFilter] = useState('all'); // 'all', 'paid', 'unpaid'
    const [showEventVolunteersModal, setShowEventVolunteersModal] = useState(false);
    const [selectedEventVolunteers, setSelectedEventVolunteers] = useState([]);
    const [selectedEventTitle, setSelectedEventTitle] = useState('');
    const [eventVolunteerCounts, setEventVolunteerCounts] = useState({});
    const [eventSearchQuery, setEventSearchQuery] = useState('');

    // Roles state
    const [roles, setRoles] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [newRole, setNewRole] = useState({ name: '', description: '' });

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
            fetchRoles();
            fetchIftarTickets();
        }
    }, [authUser]);

    const fetchStats = async () => {
        try {
            const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
            const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });
            const { count: volCount } = await supabase.from("event_volunteers").select("*", { count: "exact", head: true });
            const { count: roleCount } = await supabase.from("volunteer_roles").select("*", { count: "exact", head: true });
            const { count: ticketCount } = await supabase.from("iftar_tickets").select("*", { count: "exact", head: true });

            setStats({ users: userCount || 0, events: eventCount || 0, volunteers: volCount || 0, roles: roleCount || 0 });
            setIftarTicketCount(ticketCount || 0);
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

    const fetchRoles = async () => {
        try {
            const { data, error } = await supabase
                .from("volunteer_roles")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;
            setRoles(data || []);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchIftarTickets = async () => {
        setLoadingTickets(true);
        try {
            const res = await axiosInstance.get("/api/iftar-tickets");
            setIftarTickets(res.data.tickets || []);
            setIftarTicketCount(res.data.total || 0);
        } catch (error) {
            console.error("Error fetching iftar tickets:", error);
            toast.error("Failed to load Iftar tickets");
        } finally {
            setLoadingTickets(false);
        }
    };

    const toggleTicketPaid = async (id, currentPaid) => {
        try {
            await axiosInstance.patch(`/api/iftar-tickets/${id}/paid`, { paid: !currentPaid });
            setIftarTickets(prev =>
                prev.map(t => t.id === id ? { ...t, paid: !currentPaid } : t)
            );
            toast.success(currentPaid ? "Marked as unpaid" : "✅ Marked as paid!");
        } catch (error) {
            console.error("Error toggling paid:", error);
            toast.error("Failed to update payment status");
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from("volunteer_roles").insert([newRole]);
            if (error) throw error;

            toast.success("Role created successfully");
            setShowRoleModal(false);
            setNewRole({ name: '', description: '' });
            fetchRoles();
            fetchStats();
        } catch (error) {
            console.error("Error creating role:", error);
            toast.error("Failed to create role");
        }
    };

    const handleDeleteRole = async (id) => {
        if (!window.confirm("Are you sure? This might affect volunteers assigned to this role.")) return;
        try {
            const { error } = await supabase.from("volunteer_roles").delete().eq('id', id);
            if (error) throw error;
            toast.success("Role deleted");
            fetchRoles();
            fetchStats();
        } catch (error) {
            console.error("Error deleting role:", error);
            toast.error("Failed to delete role");
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

            // Fetch only upcoming events (exclude past events)
            const currentDate = new Date().toISOString();
            const { data: eventsData, error: eventsError } = await supabase
                .from("events")
                .select("id, title, date")
                .in("id", eventIds)
                .gte("date", currentDate);

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

            // Join the data manually (only for volunteers with upcoming events)
            const joinedData = volunteersData
                .filter(volunteer => eventsMap[volunteer.event_id])
                .map(volunteer => ({
                    ...volunteer,
                    volunteered_at: volunteer.created_at,
                    events: eventsMap[volunteer.event_id],
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
            // Ensure date and time are valid before combining
            if (!editingEvent.date || !editingEvent.time) {
                toast.error("Date and time are required");
                return;
            }

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

    const getEventGradient = (type) => {
        switch (type) {
            case 'religious':
                return 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900 shadow-sm hover:shadow-md';
            case 'social':
                return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-blue-900 shadow-sm hover:shadow-md';
            case 'charity':
                return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-amber-900 shadow-sm hover:shadow-md';
            case 'education':
                return 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 text-violet-900 shadow-sm hover:shadow-md';
            default:
                return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 text-gray-900 shadow-sm hover:shadow-md';
        }
    };

    // Glassmorphism classes
    const glassModal = "bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20";

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
            // Call Supabase RPC function with admin privileges
            const { data, error } = await supabase.rpc('delete_event_admin', {
                event_id_param: id
            });

            if (error) throw error;

            // Check if the function returned success
            if (!data?.success) {
                throw new Error(data?.message || "Failed to delete event");
            }

            toast.success("Event deleted successfully");
            fetchEvents();
            fetchStats();
            fetchVolunteers();
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error(`Failed to delete event: ${error.message}`);
        }
    };

    const handleUpdateRole = async (volunteerId, roleId) => {
        try {
            const { error } = await supabase
                .from("event_volunteers")
                .update({ role_id: roleId })
                .eq("id", volunteerId);

            if (error) throw error;

            toast.success("Volunteer role updated");

            // Update local state to reflect change without refetching
            setSelectedEventVolunteers(prev =>
                prev.map(v => v.id === volunteerId ? { ...v, role_id: roleId } : v)
            );
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role");
        }
    };

    // Update global volunteers state as well to keep UI in sync
    useEffect(() => {
        if (selectedEventVolunteers.length > 0) {
            setVolunteers(prev => {
                const updated = [...prev];
                selectedEventVolunteers.forEach(sv => {
                    const index = updated.findIndex(v => v.id === sv.id);
                    if (index !== -1 && updated[index].role_id !== sv.role_id) {
                        updated[index] = { ...updated[index], role_id: sv.role_id };
                    }
                });
                return updated;
            });
        }
    }, [selectedEventVolunteers]);

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
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header - Stack on mobile */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <Plus size={20} /> <span className="sm:inline">Create Event</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Roles</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.roles}</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setActiveTab('tickets')}
                        className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl shadow-sm border border-amber-200 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
                            <Ticket size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-amber-700 font-medium">Iftar Tickets 🌙</p>
                            <p className="text-2xl font-bold text-gray-900">{iftarTicketCount} <span className="text-sm font-normal text-gray-400">/ 100</span></p>
                            <p className="text-xs text-amber-600 mt-1">Click to manage</p>
                        </div>
                    </div>
                </div>

                {/* Tabs - Scrollable on mobile */}
                <div className="flex gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base ${activeTab === 'events'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Events Management
                    </button>
                    <button
                        onClick={() => setActiveTab('volunteers')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base ${activeTab === 'volunteers'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Volunteer Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base ${activeTab === 'roles'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Roles Management
                    </button>
                    <button
                        onClick={() => { setActiveTab('tickets'); fetchIftarTickets(); }}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base flex items-center gap-1.5 ${activeTab === 'tickets'
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                    >
                        <Ticket size={16} /> 🌙 Iftar Tickets
                    </button>
                </div>

                {/* Events List */}
                {activeTab === 'events' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Manage Events</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search events by title, location, or type..."
                                    value={eventSearchQuery}
                                    onChange={(e) => setEventSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading events...</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {events
                                    .filter(event => {
                                        if (!eventSearchQuery) return true;
                                        const query = eventSearchQuery.toLowerCase();
                                        return event.title.toLowerCase().includes(query) ||
                                            event.location.toLowerCase().includes(query) ||
                                            event.type.toLowerCase().includes(query);
                                    })
                                    .map((event) => (
                                        <div key={event.id} className={`p-4 sm:p-6 mb-4 rounded-xl border transition-all duration-200 ${getEventGradient(event.type)}`}>
                                            {/* Stack on mobile, side-by-side on larger screens */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm opacity-80">
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
                                                            <span className="truncate">{event.location}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Action buttons - wrap on mobile */}
                                                <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                                                    <button
                                                        onClick={() => fetchEventVolunteers(event.id, event.title)}
                                                        className="text-xs sm:text-sm font-medium bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        <UserCheck size={16} />
                                                        {eventVolunteerCounts[event.id] || 0} Volunteers
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(event)}
                                                        className="p-2 bg-white/50 hover:bg-white/80 rounded-lg transition-colors"
                                                        aria-label="Edit event"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                                        aria-label="Delete event"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Roles Management */}
                {activeTab === 'roles' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">Manage Roles</h2>
                            <button
                                onClick={() => setShowRoleModal(true)}
                                className="btn btn-sm btn-primary flex items-center gap-2"
                            >
                                <Plus size={16} /> Add Role
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {roles.map((role) => (
                                        <tr key={role.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Tag size={16} className="text-gray-400" />
                                                    <span className="font-medium text-gray-900">{role.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600 truncate block max-w-xs">{role.description || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteRole(role.id)}
                                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {roles.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                                No roles defined. Create one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {volunteers.map((vol) => (
                                        <tr key={vol.id} className="hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {vol.profiles?.username || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="text-sm text-gray-900">{vol.events?.title}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(vol.events?.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vol.role_id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {roles.find(r => r.id === vol.role_id)?.name || 'None'}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-900">
                                                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="truncate max-w-[150px] sm:max-w-none">{vol.profiles?.email}</span>
                                                    </div>
                                                    {vol.profiles?.phone_number && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                                            <Phone size={14} className="text-gray-400 flex-shrink-0" />
                                                            {vol.profiles?.phone_number}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

                {/* Iftar Tickets Tab */}
                {activeTab === 'tickets' && (
                    <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">🌙 Iftar Dinner Tickets — March 7, 2026</h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {iftarTickets.filter(t => t.paid).length} confirmed paid &bull; {iftarTicketCount} / 100 registered
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {['all', 'paid', 'unpaid'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setTicketFilter(f)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${ticketFilter === f
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                            }`}
                                    >
                                        {f === 'all' ? `All (${iftarTicketCount})` : f === 'paid' ? `✅ Paid (${iftarTickets.filter(t => t.paid).length})` : `⏳ Unpaid (${iftarTickets.filter(t => !t.paid).length})`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {loadingTickets ? (
                                <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-amber-50 border-b border-amber-100">
                                        <tr>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Registered</th>
                                            <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Paid ✓</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {iftarTickets
                                            .filter(t => ticketFilter === 'all' || (ticketFilter === 'paid' ? t.paid : !t.paid))
                                            .map(ticket => (
                                                <tr key={ticket.id} className={`hover:bg-gray-50 transition-colors ${ticket.paid ? 'bg-green-50/30' : ''}`}>
                                                    <td className="px-4 sm:px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <User size={16} className="text-gray-400 flex-shrink-0" />
                                                            <span className="font-medium text-gray-900 text-sm">{ticket.full_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                                            <span className="truncate max-w-[140px] sm:max-w-none">{ticket.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                                        {ticket.phone ? (
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <Phone size={14} className="text-gray-400 flex-shrink-0" />
                                                                {ticket.phone}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 text-sm">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ticket.payment_method === 'paypal' ? 'bg-blue-100 text-blue-800' :
                                                            ticket.payment_method === 'revolut' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-indigo-100 text-indigo-800'
                                                            }`}>
                                                            {ticket.payment_method === 'paypal' ? '💙 PayPal' :
                                                                ticket.payment_method === 'revolut' ? '⚫ Revolut' :
                                                                    '🏦 Bank'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell whitespace-nowrap">
                                                        {new Date(ticket.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => toggleTicketPaid(ticket.id, ticket.paid)}
                                                            title={ticket.paid ? 'Click to mark unpaid' : 'Click to mark paid'}
                                                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mx-auto transition-all ${ticket.paid
                                                                ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                                                                : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                                                                }`}
                                                        >
                                                            {ticket.paid && (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        {iftarTickets.filter(t => ticketFilter === 'all' || (ticketFilter === 'paid' ? t.paid : !t.paid)).length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                                                    {iftarTicketCount === 0
                                                        ? 'No tickets registered yet. Share the link!'
                                                        : `No ${ticketFilter} tickets found.`}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className={`${glassModal} rounded-2xl w-full max-w-md p-4 sm:p-6 my-8`}>
                        <h2 className="text-lg sm:text-xl font-bold mb-4">Create New Event</h2>
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

            {/* Create Role Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Create New Role</h2>
                        <form onSubmit={handleCreateRole} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    value={newRole.name}
                                    onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                                    placeholder="e.g., Organizer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={newRole.description}
                                    onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                                    placeholder="Optional description..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowRoleModal(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}
            {showEditModal && editingEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className={`${glassModal} rounded-2xl w-full max-w-md p-6 my-8`}>
                        <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Event</h2>
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`${glassModal} rounded-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto`}>
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
                                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Phone</th>
                                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {allUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-2 sm:px-4 py-3 text-sm text-gray-900">{user.username || 'No username'}</td>
                                            <td className="px-2 sm:px-4 py-3 text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none">{user.email}</td>
                                            <td className="px-2 sm:px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{user.phone_number || 'N/A'}</td>
                                            <td className="px-2 sm:px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
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
                    <div className="bg-white rounded-2xl w-full max-w-3xl p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
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
                                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Phone</th>
                                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Registered</th>
                                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedEventVolunteers.map((vol) => (
                                            <tr key={vol.id} className="hover:bg-gray-50">
                                                <td className="px-2 sm:px-4 py-3 text-sm text-gray-900">
                                                    {vol.profile?.username || 'Unknown'}
                                                </td>
                                                <td className="px-2 sm:px-4 py-3 text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none">{vol.profile?.email || 'N/A'}</td>
                                                <td className="px-2 sm:px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{vol.profile?.phone_number || 'N/A'}</td>
                                                <td className="px-2 sm:px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                                                    {new Date(vol.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-2 sm:px-4 py-3 text-sm text-gray-900">
                                                    <select
                                                        value={vol.role_id || ''}
                                                        onChange={(e) => handleUpdateRole(vol.id, e.target.value)}
                                                        className="select select-bordered select-xs w-full max-w-xs focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">None</option>
                                                        {roles.map(role => (
                                                            <option key={role.id} value={role.id}>{role.name}</option>
                                                        ))}
                                                    </select>
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
