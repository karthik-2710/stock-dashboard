import { useState } from 'react';

function ModeToggle() {
  const [dark, setDark] = useState(true);

  const toggleMode = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleMode}
      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded mb-4"
    >
      {dark ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

export default ModeToggle;
