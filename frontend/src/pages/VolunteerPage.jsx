import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Calendar, MapPin, Clock, Users, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const VolunteerPage = () => {
    const { authUser } = useAuthStore();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [volunteerCounts, setVolunteerCounts] = useState({});
    const [userVolunteeredEvents, setUserVolunteeredEvents] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
        if (authUser) {
            fetchPhoneNumber();
            fetchUserVolunteerStatus();
        }
    }, [authUser]);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .gte('date', new Date().toISOString())
                .order('date', { ascending: true });

            if (error) throw error;
            setEvents(data);

            // Fetch volunteer counts for each event
            const counts = {};
            for (const event of data) {
                const { count } = await supabase
                    .from('event_volunteers')
                    .select('*', { count: 'exact', head: true })
                    .eq('event_id', event.id);
                counts[event.id] = count || 0;
            }
            setVolunteerCounts(counts);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const fetchPhoneNumber = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('phone_number')
                .eq('id', authUser.id)
                .single();

            if (error) throw error;
            if (data?.phone_number) {
                setPhoneNumber(data.phone_number);
            }
        } catch (error) {
            console.error('Error fetching phone number:', error);
        }
    };

    const fetchUserVolunteerStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('event_volunteers')
                .select('event_id')
                .eq('user_id', authUser.id);

            if (error) throw error;
            const eventIds = new Set(data.map(r => r.event_id));
            setUserVolunteeredEvents(eventIds);
        } catch (error) {
            console.error('Error fetching volunteer status:', error);
        }
    };

    const handleVolunteer = async (e) => {
        e.preventDefault();

        if (!authUser) {
            toast.error('Please login to volunteer');
            navigate('/login');
            return;
        }

        if (!phoneNumber || phoneNumber.trim().length < 10) {
            toast.error('Please enter a valid phone number (min 10 digits)');
            return;
        }

        try {
            // Update phone number in profile if changed
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ phone_number: phoneNumber })
                .eq('id', authUser.id);

            if (profileError) throw profileError;

            // Add volunteer entry
            const { error: volunteerError } = await supabase
                .from('event_volunteers')
                .insert([{
                    event_id: selectedEvent.id,
                    user_id: authUser.id
                }]);

            if (volunteerError) throw volunteerError;

            toast.success(`Successfully volunteered for ${selectedEvent.title}!`);
            setSelectedEvent(null);
            setPhoneNumber('');
            fetchEvents();
            fetchUserVolunteerStatus();
        } catch (error) {
            console.error('Error volunteering:', error);
            if (error.code === '23505') {
                toast.error('You are already volunteered for this event');
            } else {
                toast.error('Failed to volunteer. Please try again.');
            }
        }
    };

    const isEventFull = (eventId, maxVolunteers) => {
        return volunteerCounts[eventId] >= maxVolunteers;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <span className="loading loading-spinner loading-lg text-green-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Volunteer Opportunities</h1>
                    <p className="text-gray-600">Join us in making a difference in our community</p>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const isFull = isEventFull(event.id, event.max_volunteers);
                        const hasVolunteered = userVolunteeredEvents.has(event.id);

                        return (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className={`h-2 ${event.type === 'religious' ? 'bg-green-500' : event.type === 'charity' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Clock size={16} className="text-gray-400" />
                                            <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Users size={16} className="text-gray-400" />
                                            <span>{volunteerCounts[event.id] || 0} / {event.max_volunteers} volunteers</span>
                                        </div>
                                    </div>

                                    {event.description && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                    )}

                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        disabled={isFull || hasVolunteered}
                                        className={`w-full btn btn-sm ${hasVolunteered
                                            ? 'btn-success'
                                            : isFull
                                                ? 'btn-disabled'
                                                : 'btn-primary'
                                            }`}
                                    >
                                        {hasVolunteered ? '✓ Already Volunteered' : isFull ? 'Full' : 'Volunteer'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No upcoming events available at the moment.</p>
                    </div>
                )}
            </div>

            {/* Volunteer Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Volunteer for {selectedEvent.title}</h2>

                        <form onSubmit={handleVolunteer} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={authUser?.username || 'No username set'}
                                    className="input input-bordered w-full bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    readOnly
                                    value={authUser?.email || ''}
                                    className="input input-bordered w-full bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Enter your phone number"
                                        minLength="10"
                                        maxLength="15"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="input input-bordered w-full pl-10"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">We'll contact you with event updates</p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedEvent(null)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Confirm Volunteer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerPage;
