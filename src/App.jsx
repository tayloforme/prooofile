import React, { useState } from 'react';
import ProfileScreen from './screens/ProfileScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';

export default function App() {
  const [active, setActive] = useState('home');

  return (
    <div className="stage">
      <div className="stage-inner">
        <Phone label="Profile">
          <ProfileScreen />
        </Phone>
        <Phone label="Home">
          <HomeScreen active={active} onTab={setActive} />
        </Phone>
      </div>
      <p className="stage-hint">
        Pet Profile · React template — designed for mobile, shown side-by-side.
      </p>
    </div>
  );
}

function Phone({ children }) {
  return (
    <div className="phone">
      <div className="phone-screen">{children}</div>
    </div>
  );
}
