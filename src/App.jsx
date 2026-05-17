import React from 'react';
import Header from './components/Header.jsx';
import Profile from './sections/Profile.jsx';
import Health from './sections/Health.jsx';
import Tasks from './sections/Tasks.jsx';
import Insights from './sections/Insights.jsx';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Profile />
        <Health />
        <Tasks />
        <Insights />
        <footer className="site-footer">© 2026 Prooofile</footer>
      </main>
    </div>
  );
}
