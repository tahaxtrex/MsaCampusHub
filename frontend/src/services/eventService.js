// src/services/eventService.js
import { supabase } from '../lib/supabase';

const TABLE_NAME = 'events';

function fromSupabase(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    start: row.date, // Calendar expects 'start'
    end: row.date,   // For single day events
    category: row.type,
    location: row.location || '',
    description: row.description || '',
    max_volunteers: row.max_volunteers || 0,
    created_by: row.created_by,
    allDay: false,
  };
}

function toSupabase(event) {
  return {
    title: event.title,
    date: event.start, // Calendar sends 'start'
    location: event.location || null,
    description: event.description || null,
    type: event.category || 'social',
    max_volunteers: event.max_volunteers || 0,
  };
}

export async function getEvents() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return (data || []).map(fromSupabase);
}

export async function createEvent(event) {
  const payload = toSupabase(event);

  // Get current user for created_by
  const { data: { user } } = await supabase.auth.getUser();
  if (user) payload.created_by = user.id;

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

export async function volunteerForEvent(eventId, userId) {
  const { error } = await supabase
    .from('event_volunteers')
    .insert([{ event_id: eventId, user_id: userId }]);

  if (error) throw error;
}

export async function getVolunteerCount(eventId) {
  const { count, error } = await supabase
    .from('event_volunteers')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId);

  if (error) throw error;
  return count;
}

export async function isVolunteering(eventId, userId) {
  const { data, error } = await supabase
    .from('event_volunteers')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows returned'
  return !!data;
}
