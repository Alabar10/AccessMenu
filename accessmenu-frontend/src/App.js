import React, { useState } from 'react';
import MenuPage from './pages/MenuPage'; 
import Login from './LogIn/LoginScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
        <MenuPage />
      
    </div>
  );
}

export default App;
