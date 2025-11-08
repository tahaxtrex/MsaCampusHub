import { useState, useEffect } from 'react';
import Calendar from '../components/calendar/calendar';
import EventModal from '../components/calendar/eventmodal';
import FilterBar from '../components/calendar/filterbar';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import { useAuthStore } from '../store/useAuthStore';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mode, setMode] = useState('view');
  const { firebaseUser } = useAuthStore();

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents();
      setEvents(data);
      setFilteredEvents(data);
    }
    loadEvents();
  }, []);

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

  async function handleSave(formData) {
    if (mode === 'add') {
      const newEvent = await createEvent(formData);
      setEvents((prev) => [...prev, newEvent]);
    } else if (mode === 'edit') {
      const updated = await updateEvent(selectedEvent.id, formData);
      setEvents((prev) => prev.map((e) => (e.id === selectedEvent.id ? updated : e)));
    }
    setModalOpen(false);
  }

  async function handleDelete(id) {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalOpen(false);
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

      {firebaseUser ? <div className="mt-6">
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
      />
    </div>
  );
}
