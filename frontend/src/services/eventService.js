// src/services/eventService.js
import { supabase } from './supabase';

const TABLE_NAME = 'events';

function fromSupabase(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    start: row.start_time,
    end: row.end_time,
    category: row.category,
    location: row.location || '',
    description: row.description || '',
    organizer: row.organizer || '',
    image_url: row.image_url || '',
    allDay: row.all_day || false,
  };
}

function toSupabase(event) {
  return {
    title: event.title,
    start_time: event.start,
    end_time: event.end,
    category: event.category,
    location: event.location || null,
    description: event.description || null,
    organizer: event.organizer || null,
    image_url: event.image_url || null,
    all_day: event.allDay || false,
  };
}

export async function getEvents() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return (data || []).map(fromSupabase);
}

export async function createEvent(event) {
  const payload = toSupabase(event);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return fromSupabase(data);
}

export async function updateEvent(id, event) {
  const payload = toSupabase(event);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return fromSupabase(data);
}

export async function deleteEvent(id) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}
