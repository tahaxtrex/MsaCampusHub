import React, { useState, useEffect } from 'react';
import { EventCategory, EVENT_CATEGORIES } from '../../types';
import { X, Calendar, MapPin, User, AlignLeft, Clock, Users, CheckCircle } from 'lucide-react';

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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {mode === 'add' && <><Calendar className="w-5 h-5 text-green-600" /> Add New Event</>}
            {mode === 'edit' && <><Calendar className="w-5 h-5 text-blue-600" /> Edit Event</>}
            {mode === 'view' && <><Calendar className="w-5 h-5 text-purple-600" /> Event Details</>}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={mode === 'view'}
              placeholder="e.g., Friday Prayer"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  name="start"
                  value={form.start}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  name="end"
                  value={form.end}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  placeholder="Room 101"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {mode !== 'view' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Volunteers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="max_volunteers"
                  value={form.max_volunteers}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={mode === 'view'}
                placeholder="Event details..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <input
              type="checkbox"
              name="allDay"
              checked={form.allDay}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">All Day Event</label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            {mode === 'view' && onVolunteer && (
              <button
                type="button"
                onClick={() => onVolunteer(event.id)}
                disabled={isVolunteering}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${isVolunteering
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                  }`}
              >
                {isVolunteering ? <><CheckCircle className="w-4 h-4" /> Volunteered</> : 'Volunteer Now'}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>

            {mode !== 'view' && (
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
              >
                Save Event
              </button>
            )}

            {mode === 'edit' && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
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
