import MenuItem from '../components/MenuItem';
import '../styles/MenuPage.css';
import React, { useEffect, useState } from 'react';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [glutenFreeMode, setGlutenFreeMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    fetch('/menu.json')
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error('Error loading menu:', error));
  }, []);

  const speakAllItems = () => {
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const allText = menuItems
        .filter(item =>
          (!glutenFreeMode || !item.allergens.includes("Gluten")) &&
          (selectedCategory === "All" || item.category === selectedCategory)
        )
        .map(item => `${item.name}. ${item.description}. Allergens: ${item.allergens.join(", ")}.`)
        .join(' ');
      const speech = new SpeechSynthesisUtterance(allText);
      window.speechSynthesis.speak(speech);
    }, 200);
  };

  const categories = ["All", "Breakfast", "Dinner", "Dessert", "Drinks"];

  const filteredItems = menuItems.filter(item =>
    (!glutenFreeMode || !item.allergens.includes("Gluten")) &&
    (selectedCategory === "All" || item.category === selectedCategory)
  );

  return (
    <div className={`menu-page ${theme}`}>
      <h1>Menu</h1>

      {/* Theme Selector */}
      <div style={{ margin: '20px 0' }}>
        <label style={{ marginRight: '10px' }}>Select Theme:</label>
        <select
          value={theme}
          onChange={(e) => {
            const selectedTheme = e.target.value;
            setTheme(selectedTheme);
            localStorage.setItem('theme', selectedTheme);
          }}
        >
          <option value="light">🌞 Light</option>
          <option value="dark">🌙 Dark</option>
          <option value="contrast">🔳 High Contrast</option>
        </select>
      </div>

      {/* Gluten-Free Mode */}
      <label style={{ display: "block", margin: "20px" }}>
        <input
          type="checkbox"
          checked={glutenFreeMode}
          onChange={() => setGlutenFreeMode(!glutenFreeMode)}
        />{" "}
        Gluten-Free Mode
      </label>

      {/* Category Drawer */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              backgroundColor: selectedCategory === cat ? "#007BFF" : "#ccc",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu-container">
        {filteredItems.map(item => (
          <MenuItem
            key={item.id}
            name={item.name}
            description={item.description}
            image={item.image}
            allergens={item.allergens}
            signVideo={item.signVideo}
          />
        ))}
      </div>

      {/* Floating Buttons */}
      <div className="floating-buttons">
        <button onClick={speakAllItems} className="floating-button">
          🔊 Speak All
        </button>
        <button onClick={() => window.speechSynthesis.cancel()} className="stop-button">
          🛑 Stop Speaking
        </button>
      </div>
    </div>
  );
}

export default MenuPage;
