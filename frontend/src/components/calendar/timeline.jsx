import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Users, Sparkles, ChevronRight } from 'lucide-react';
import { EventCategory } from '../../types';

function getEventColor(category) {
    switch (category) {
        case EventCategory.Religious:
            return {
                bg: 'from-blue-50 to-blue-100/50',
                border: 'border-blue-200',
                accent: 'bg-blue-500',
                text: 'text-blue-700',
                dot: 'bg-blue-500'
            };
        case EventCategory.Academic:
            return {
                bg: 'from-indigo-50 to-indigo-100/50',
                border: 'border-indigo-200',
                accent: 'bg-indigo-500',
                text: 'text-indigo-700',
                dot: 'bg-indigo-500'
            };
        case EventCategory.Volunteering:
            return {
                bg: 'from-green-50 to-green-100/50',
                border: 'border-green-200',
                accent: 'bg-green-500',
                text: 'text-green-700',
                dot: 'bg-green-500'
            };
        case EventCategory.Fundraising:
            return {
                bg: 'from-amber-50 to-amber-100/50',
                border: 'border-amber-200',
                accent: 'bg-amber-500',
                text: 'text-amber-700',
                dot: 'bg-amber-500'
            };
        case EventCategory.Social:
            return {
                bg: 'from-pink-50 to-pink-100/50',
                border: 'border-pink-200',
                accent: 'bg-pink-500',
                text: 'text-pink-700',
                dot: 'bg-pink-500'
            };
        case EventCategory.RamadanEid:
            return {
                bg: 'from-purple-50 to-purple-100/50',
                border: 'border-purple-200',
                accent: 'bg-purple-500',
                text: 'text-purple-700',
                dot: 'bg-purple-500'
            };
        default:
            return {
                bg: 'from-gray-50 to-gray-100/50',
                border: 'border-gray-200',
                accent: 'bg-gray-500',
                text: 'text-gray-700',
                dot: 'bg-gray-500'
            };
    }
}

function EventCard({ event, onClick, index, side = 'right' }) {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    const colors = getEventColor(event.category);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), index * 50);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [index]);

    const eventDate = new Date(event.start);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div
            ref={cardRef}
            className={`timeline-card ${side} ${isVisible ? 'visible' : ''}`}
        >
            {/* Desktop: Timeline dot */}
            <div className={`hidden md:block absolute top-6 ${side === 'left' ? '-right-[21px]' : '-left-[21px]'} w-10 h-10 ${colors.dot} rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center`}>
                <Calendar className="w-4 h-4 text-white" />
            </div>

            {/* Event Card */}
            <div
                onClick={() => onClick(event)}
                className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-sm border ${colors.border} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]`}
            >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colors.accent} text-white shadow-sm`}>
                        <Sparkles className="w-3 h-3" />
                        {event.category}
                    </span>
                    <ChevronRight className={`w-5 h-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>

                {/* Event Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {event.title}
                </h3>

                {/* Date & Time */}
                <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{formattedTime}</span>
                    </div>
                </div>

                {/* Location */}
                {event.location && (
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{event.location}</span>
                    </div>
                )}

                {/* Description */}
                {event.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {event.description}
                    </p>
                )}

                {/* Volunteers Count */}
                {event.volunteers_count > 0 && (
                    <div className="flex items-center gap-2 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-medium">
                            {event.volunteers_count} volunteer{event.volunteers_count !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                {/* Hover Accent Bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.accent} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
        </div>
    );
}

function SectionHeader({ title, count, icon: Icon, isPast = false }) {
    return (
        <div className={`flex items-center justify-center gap-3 mb-8 ${isPast ? 'opacity-75' : ''}`}>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg">
                <Icon className="w-5 h-5" />
                <span className="font-bold text-sm md:text-base uppercase tracking-wide">
                    {title}
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {count}
                </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
        </div>
    );
}

export default function Timeline({ events, onEventClick, focusEventTitle }) {
    const now = new Date();

    // Separate past and upcoming events
    const pastEvents = events
        .filter(event => new Date(event.start) < now)
        .sort((a, b) => new Date(b.start) - new Date(a.start)); // Newest first for past events

    const upcomingEvents = events
        .filter(event => new Date(event.start) >= now)
        .sort((a, b) => new Date(a.start) - new Date(b.start)); // Oldest first for upcoming

    return (
        <div className="timeline-wrapper">
            <style>{`
        .timeline-wrapper {
          position: relative;
          max-width: 100%;
          margin: 0 auto;
        }

        /* Timeline vertical line (desktop only) */
        @media (min-width: 768px) {
          .timeline-wrapper::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, 
              transparent 0%, 
              #d1d5db 10%, 
              #d1d5db 90%, 
              transparent 100%
            );
            transform: translateX(-50%);
            z-index: 0;
          }
        }

        .timeline-card {
          position: relative;
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .timeline-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mobile: Full width cards */
        @media (max-width: 767px) {
          .timeline-card {
            width: 100%;
            padding-left: 1rem;
            border-left: 3px solid #22c55e;
          }
        }

        /* Desktop: Alternating layout */
        @media (min-width: 768px) {
          .timeline-card {
            width: calc(50% - 2rem);
          }

          .timeline-card.left {
            margin-right: auto;
            padding-right: 2rem;
          }

          .timeline-card.right {
            margin-left: auto;
            padding-left: 2rem;
          }
        }

        /* Smooth scrolling */
        .timeline-container {
          scroll-behavior: smooth;
        }
      `}</style>

            <div className="timeline-container space-y-12">
                {/* Upcoming Events Section */}
                {upcomingEvents.length > 0 && (
                    <div>
                        <SectionHeader
                            title="Upcoming Events"
                            count={upcomingEvents.length}
                            icon={Sparkles}
                        />
                        <div className="space-y-6 md:space-y-8">
                            {upcomingEvents.map((event, index) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onClick={onEventClick}
                                    index={index}
                                    side={index % 2 === 0 ? 'right' : 'left'}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Events Section */}
                {pastEvents.length > 0 && (
                    <div className="mt-16">
                        <SectionHeader
                            title="Past Events"
                            count={pastEvents.length}
                            icon={Calendar}
                            isPast={true}
                        />
                        <div className="space-y-6 md:space-y-8 opacity-80">
                            {pastEvents.map((event, index) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onClick={onEventClick}
                                    index={index}
                                    side={index % 2 === 0 ? 'left' : 'right'}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {events.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Events Found
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your filters to see more events
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
