// src/types.js

// Category values used across the app
export const EventCategory = {
  Religious: 'Religious',
  Academic: 'Academic',
  Volunteering: 'Volunteering',
  Fundraising: 'Fundraising',
  Social: 'Social',
  RamadanEid: 'Ramadan / Eid',
};

// Handy array if you need to loop over categories
export const EVENT_CATEGORIES = Object.values(EventCategory);

/**
 * @typedef {Object} MSAEvent
 * @property {string} id
 * @property {string} title
 * @property {string} start      ISO 8601 datetime string
 * @property {string} end        ISO 8601 datetime string
 * @property {string} category   One of EventCategory values
 * @property {string} [location]
 * @property {string} [description]
 * @property {string} [organizer]
 * @property {string} [image_url]
 * @property {boolean} [allDay]
 */
