import React, { useState } from 'react';
import Hero from './Hero.jsx';
import Health from './Health.jsx';
import Upcoming from './Upcoming.jsx';
import { INITIAL_EVENTS } from './data.js';

export default function App() {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  const completeEvent = (id) =>
    setEvents((cur) =>
      cur.map((e) => (e.id === id ? { ...e, done: true, completedAt: Date.now() } : e))
    );
  const restoreEvent = (id) =>
    setEvents((cur) =>
      cur.map((e) => (e.id === id ? { ...e, done: false, completedAt: null } : e))
    );
  const deleteEvent = (id) =>
    setEvents((cur) => cur.filter((e) => e.id !== id));

  return (
    <main className="page">
      <Hero />
      <Health />
      <Upcoming
        events={events}
        onComplete={completeEvent}
        onRestore={restoreEvent}
        onDelete={deleteEvent}
      />
    </main>
  );
}
