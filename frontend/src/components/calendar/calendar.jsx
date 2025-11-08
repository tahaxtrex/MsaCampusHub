// src/components/Calendar.jsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { EventCategory } from '../../types';
import React from 'react';
import { useRef, useEffect } from 'react';



function getEventColor(category) {
  switch (category) {
    case EventCategory.Religious:
      return '#3b82f6';
    case EventCategory.Academic:
      return '#6366f1';
    case EventCategory.Volunteering:
      return '#22c55e';
    case EventCategory.Fundraising:
      return '#f59e0b';
    case EventCategory.Social:
      return '#ec4899';
    case EventCategory.RamadanEid:
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
}

export default function Calendar({ events, onEventClick, focusEventTitle }) {
  const calendarRef = useRef(null);

  // 🔍 whenever focusEventTitle changes, move to that event
  useEffect(() => {
    if (!focusEventTitle || !calendarRef.current) return;

    const calendarApi = calendarRef.current.getApi();
    const matchingEvents = calendarApi
      .getEvents()
      .filter((e) =>
        e.title.toLowerCase().includes(focusEventTitle.toLowerCase())
      );

    if (matchingEvents.length === 1) {
      // jump directly to that event’s date
      calendarApi.gotoDate(matchingEvents[0].start);
    } else if (matchingEvents.length > 1) {
      // temporary highlight effect
      matchingEvents.forEach((ev) => {
        const el = calendarApi.getEventById(ev.id)?.el;
        if (el) el.style.boxShadow = '0 0 8px 2px #3b82f6';
      });

      setTimeout(() => {
        matchingEvents.forEach((ev) => {
          const el = calendarApi.getEventById(ev.id)?.el;
          if (el) el.style.boxShadow = '';
        });
      }, 2500);
    }
  }, [focusEventTitle]);

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
    if (onEventClick) onEventClick(clickInfo.event.extendedProps);
  }

  return (
    <div className="fc-wrapper">
      <FullCalendar
        ref={calendarRef}
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
