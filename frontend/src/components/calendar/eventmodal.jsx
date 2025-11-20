import React, { useState, useEffect } from 'react';
import { EventCategory, EVENT_CATEGORIES } from '../../types';

/**
 * Modal for viewing, adding, or editing an event.
 * 
 * Props:
 *  - isOpen: boolean  → controls visibility
 *  - mode: 'view' | 'add' | 'edit'
 *  - event: event object (can be null)
 *  - onClose: function → close modal
 *  - onSave: function(eventData) → save or update event
 *  - onDelete: function(eventId) → delete event
 */
export default function EventModal({ isOpen, mode, event, onClose, onSave, onDelete, onVolunteer, isVolunteering }) {
  const [form, setForm] = useState({
    title: '',
    start: '',
    end: '',
    category: EventCategory.Religious,
    location: '',
    description: '',
    organizer: '',
    allDay: false,
    max_volunteers: 0,
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || '',
        start: event.start ? event.start.slice(0, 16) : '',
        end: event.end ? event.end.slice(0, 16) : '',
        category: event.category || EventCategory.Religious,
        location: event.location || '',
        description: event.description || '',
        organizer: event.organizer || '',
        allDay: event.allDay || false,
        max_volunteers: event.max_volunteers || 0,
      });
    } else {
      setForm({
        title: '',
        start: '',
        end: '',
        category: EventCategory.Religious,
        location: '',
        description: '',
        organizer: '',
        allDay: false,
        max_volunteers: 0,
      });
    }
  }, [event, isOpen]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.start) {
      alert('Title and start time are required.');
      return;
    }
    onSave(form);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {mode === 'add' && 'Add New Event'}
          {mode === 'edit' && 'Edit Event'}
          {mode === 'view' && 'Event Details'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                name="start"
                value={form.start}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                name="end"
                value={form.end}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            >
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>

          {mode !== 'view' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Volunteers</label>
              <input
                type="number"
                name="max_volunteers"
                value={form.max_volunteers}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="allDay"
              checked={form.allDay}
              onChange={handleChange}
              disabled={mode === 'view'}
            />
            <label>All Day Event</label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            {mode === 'view' && onVolunteer && (
              <button
                type="button"
                onClick={() => onVolunteer(event.id)}
                disabled={isVolunteering}
                className={`px-4 py-2 rounded-md text-white ${isVolunteering ? 'bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isVolunteering ? 'Volunteered ✅' : 'Volunteer'}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Close
            </button>

            {mode !== 'view' && (
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            )}

            {mode === 'edit' && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
