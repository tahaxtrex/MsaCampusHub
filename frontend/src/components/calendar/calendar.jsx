// src/components/Calendar.jsx
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { EventCategory } from '../../types';

function getEventColor(category) {
  switch (category) {
    case EventCategory.Religious:
      return '#3b82f6'; // blue-500
    case EventCategory.Academic:
      return '#6366f1'; // indigo-500
    case EventCategory.Volunteering:
      return '#22c55e'; // green-500
    case EventCategory.Fundraising:
      return '#f59e0b'; // amber-500
    case EventCategory.Social:
      return '#ec4899'; // pink-500
    case EventCategory.RamadanEid:
      return '#8b5cf6'; // violet-500
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * @param {{ events: import('../../types').MSAEvent[], onEventClick: (event: any) => void }} props
 */
export default function Calendar({ events, onEventClick }) {
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    backgroundColor: getEventColor(event.category),
    borderColor: getEventColor(event.category),
    extendedProps: event,
  }));

  function handleEventClick(clickInfo) {
    if (onEventClick) {
      // TS did: clickInfo.event.extendedProps as MSAEvent
      onEventClick(clickInfo.event.extendedProps);
    }
  }

  return (
    <div className="fc-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek',
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        height="auto"
        windowResize={(arg) => {
          if (window.innerWidth < 768) {
            arg.view.calendar.changeView('listWeek');
          }
        }}
      />
    </div>
  );
}
