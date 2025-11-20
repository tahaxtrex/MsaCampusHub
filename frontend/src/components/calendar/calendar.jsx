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
      return { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' }; // Blue
    case EventCategory.Academic:
      return { bg: '#eef2ff', border: '#6366f1', text: '#3730a3' }; // Indigo
    case EventCategory.Volunteering:
      return { bg: '#f0fdf4', border: '#22c55e', text: '#166534' }; // Green
    case EventCategory.Fundraising:
      return { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' }; // Amber
    case EventCategory.Social:
      return { bg: '#fdf2f8', border: '#ec4899', text: '#9d174d' }; // Pink
    case EventCategory.RamadanEid:
      return { bg: '#f5f3ff', border: '#8b5cf6', text: '#5b21b6' }; // Purple
    default:
      return { bg: '#f3f4f6', border: '#6b7280', text: '#374151' }; // Gray
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
        if (el) {
          el.style.transition = 'all 0.3s ease';
          el.style.transform = 'scale(1.05)';
          el.style.boxShadow = '0 0 0 2px #3b82f6';
          el.style.zIndex = '50';
        }
      });

      setTimeout(() => {
        matchingEvents.forEach((ev) => {
          const el = calendarApi.getEventById(ev.id)?.el;
          if (el) {
            el.style.transform = '';
            el.style.boxShadow = '';
            el.style.zIndex = '';
          }
        });
      }, 2500);
    }
  }, [focusEventTitle]);

  const calendarEvents = events.map((event) => {
    const colors = getEventColor(event.category);
    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      classNames: ['modern-event'],
      extendedProps: event,
    };
  });

  function handleEventClick(clickInfo) {
    if (onEventClick) onEventClick(clickInfo.event.extendedProps);
  }

  return (
    <div className="modern-calendar-wrapper">
      <style>{`
        .modern-calendar-wrapper .fc {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        .modern-calendar-wrapper .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #111827;
        }

        @media (max-width: 768px) {
          .modern-calendar-wrapper .fc-toolbar-title {
            font-size: 1rem !important;
          }
          .modern-calendar-wrapper .fc-toolbar {
            flex-direction: column;
            gap: 0.75rem;
          }
          .modern-calendar-wrapper .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }

        .modern-calendar-wrapper .fc-button-primary {
          background-color: white !important;
          border-color: #e5e7eb !important;
          color: #374151 !important;
          font-weight: 500 !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          transition: all 0.2s !important;
        }

        .modern-calendar-wrapper .fc-button-primary:hover {
          background-color: #f9fafb !important;
          border-color: #d1d5db !important;
        }

        .modern-calendar-wrapper .fc-button-primary:focus {
          box-shadow: 0 0 0 2px #e5e7eb, 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        }

        .modern-calendar-wrapper .fc-button-active {
          background-color: #f3f4f6 !important;
          border-color: #d1d5db !important;
          color: #111827 !important;
        }

        .modern-calendar-wrapper .fc-daygrid-day-number {
          color: #374151;
          font-weight: 500;
          padding: 8px !important;
        }

        .modern-calendar-wrapper .fc-col-header-cell-cushion {
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          padding: 12px 0 !important;
        }

        .modern-calendar-wrapper .fc-day-today {
          background-color: #f0fdf4 !important;
        }

        .modern-event {
          border-radius: 4px !important;
          padding: 2px 4px !important;
          font-weight: 500 !important;
          font-size: 0.85rem !important;
          border-left-width: 3px !important;
          transition: transform 0.2s !important;
        }

        .modern-event:hover {
          transform: scale(1.02);
          cursor: pointer;
        }

        .fc-daygrid-event-dot {
          border-width: 3px !important;
        }

        /* Mobile List View Optimizations */
        .fc-list-event-dot {
          border-width: 4px !important;
        }
        .fc-list-event-title {
          font-weight: 600 !important;
          color: #1f2937 !important;
        }
        .fc-list-event-time {
          color: #6b7280 !important;
          font-weight: 500 !important;
        }
        .fc-list-day-cushion {
          background-color: #f9fafb !important;
        }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={window.innerWidth < 768 ? "listWeek" : "dayGridMonth"}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek',
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={true}
        windowResize={(arg) => {
          if (window.innerWidth < 768) {
            arg.view.calendar.changeView('listWeek');
          } else {
            arg.view.calendar.changeView('dayGridMonth');
          }
        }}
      />
    </div>
  );
}
