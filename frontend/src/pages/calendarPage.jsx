import { useState, useEffect } from 'react';
import Timeline from '../components/calendar/timeline';
import EventModal from '../components/calendar/eventmodal';
import FilterBar from '../components/calendar/filterbar';
import { getEvents, createEvent, updateEvent, deleteEvent, volunteerForEvent, isVolunteering } from '../services/eventService';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Sparkles, Plus } from 'lucide-react';


export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mode, setMode] = useState('view');
  const [isUserVolunteering, setIsUserVolunteering] = useState(false);
  const { authUser } = useAuthStore();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const data = await getEvents();
    setEvents(data);
    setFilteredEvents(data);
  }

  useEffect(() => {
    let result = events;
    if (selectedCategory) result = result.filter((e) => e.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.location && e.location.toLowerCase().includes(q))
      );
    }
    setFilteredEvents(result);
  }, [selectedCategory, searchQuery, events]);

  // Check if user is volunteering when event is selected
  useEffect(() => {
    if (selectedEvent && authUser) {
      checkVolunteeringStatus(selectedEvent.id);
    } else {
      setIsUserVolunteering(false);
    }
  }, [selectedEvent, authUser]);

  async function checkVolunteeringStatus(eventId) {
    try {
      const status = await isVolunteering(eventId, authUser.id);
      setIsUserVolunteering(status);
    } catch (error) {
      console.error("Error checking volunteer status:", error);
    }
  }

  async function handleSave(formData) {
    try {
      if (mode === 'add') {
        const newEvent = await createEvent(formData);
        setEvents((prev) => [...prev, newEvent]);
        toast.success("Event created!");
      } else if (mode === 'edit') {
        const updated = await updateEvent(selectedEvent.id, formData);
        setEvents((prev) => prev.map((e) => (e.id === selectedEvent.id ? updated : e)));
        toast.success("Event updated!");
      }
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to save event");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setModalOpen(false);
      toast.success("Event deleted!");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  }

  async function handleVolunteer(eventId) {
    if (!authUser) {
      toast.error("Please login to volunteer");
      return;
    }
    try {
      await volunteerForEvent(eventId, authUser.id);
      setIsUserVolunteering(true);
      toast.success("Successfully volunteered!");
    } catch (error) {
      console.error("Volunteer error:", error);
      toast.error("Failed to volunteer (maybe already signed up?)");
    }
  }

  function handleReset() {
    setSelectedCategory(null);
    setSearchQuery('');
    setFilteredEvents(events);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CalendarIcon className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Events Timeline</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
            <p className="text-gray-500 mt-1">Browse past and upcoming community events</p>
          </div>

          {authUser?.is_admin && (
            <button
              onClick={() => {
                setSelectedEvent(null);
                setMode('add');
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add New Event
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onReset={handleReset}
            />
          </div>

          <div className="p-6">
            <Timeline
              events={filteredEvents}
              focusEventTitle={searchQuery}
              onEventClick={(ev) => {
                setSelectedEvent(ev);
                setMode('view');
                setModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      <EventModal
        isOpen={modalOpen}
        mode={mode}
        event={selectedEvent}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        onVolunteer={handleVolunteer}
        isVolunteering={isUserVolunteering}
      />
    </div>
  );
}
