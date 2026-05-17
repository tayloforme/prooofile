import React, { useState } from 'react';
import Hero from './Hero.jsx';
import Upcoming from './Upcoming.jsx';
import CalendarPage from './CalendarPage.jsx';
import { INITIAL_EVENTS } from './data.js';

export default function App() {
  const [page, setPage]     = useState('main');
  const [events, setEvents] = useState(INITIAL_EVENTS);

  const completeEvent = (id) =>
    setEvents((cur) => cur.map((e) => (e.id === id ? { ...e, done: true } : e)));

  if (page === 'calendar') {
    return <CalendarPage events={events} onBack={() => setPage('main')} />;
  }

  return (
    <main className="page">
      <Hero />
      <Upcoming
        events={events}
        onComplete={completeEvent}
        onOpenCalendar={() => setPage('calendar')}
      />
    </main>
  );
}
