import { useState, useEffect } from 'react';
import Calendar from '../components/calendar/calendar';
import EventModal from '../components/calendar/eventmodal';
import FilterBar from '../components/calendar/filterbar';
import { getEvents, createEvent, updateEvent, deleteEvent, volunteerForEvent, isVolunteering } from '../services/eventService';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onReset={handleReset}
      />

      <Calendar
        events={filteredEvents}
        focusEventTitle={searchQuery}
        onEventClick={(ev) => {
          setSelectedEvent(ev);
          setMode('view');
          setModalOpen(true);
        }}
      />

      {authUser?.is_admin ? <div className="mt-6">
        <button
          onClick={() => {
            setSelectedEvent(null);
            setMode('add');
            setModalOpen(true);
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
        >
          + Add Event
        </button>
      </div> : <div></div>}

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
