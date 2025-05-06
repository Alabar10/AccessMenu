import React, { useState } from 'react';

const allergenIcons = {
    Gluten: "🌾",
    Dairy: "🥛",
    Nuts: "🥜",
    Eggs: "🥚",
    Fish: "🐟",
    Soy: "🌱",
    None: "✅"
  };

  
function MenuItem({ name, description, image, allergens, signVideo }) {
  const [showSign, setShowSign] = useState(false);

  const speakitem = () => {
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const text = `${name}. ${description}. Allergens: ${allergens.join(", ")}`;
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }, 200);
  };

  const toggleSignVideo = () => {
    setShowSign(prev => !prev);
  };

  return (
    <div className="menu-card">
      <img src={`/${image}`} alt={name} />
      <div className="menu-card-content">
        <h3>{name}</h3>
        <p>{description}</p>
        <p style={{ fontSize: "12px", color: "red", marginTop: "10px" }}>
          Allergens:{" "}
          {allergens.map((allergen, index) => (
            <span key={index}>
              {allergenIcons[allergen] || "⚠️"} {allergen}
              {index < allergens.length - 1 && " - "}
            </span>
          ))}
        </p>
        
        <button
          onClick={speakitem}
          aria-label={`Read description of ${name}`}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            fontSize: "14px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔊 Read
        </button>

        {signVideo && (
          <button
            onClick={toggleSignVideo}
            style={{
              marginLeft: "10px",
              marginTop: "10px",
              padding: "5px 10px",
              fontSize: "14px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            ✋ Sign Language
          </button>
        )}

        {showSign && signVideo && (
          <video width="100%" controls style={{ marginTop: "10px" }}>
            <source src={signVideo} type="video/mp4" />
            Sign language video not available.
          </video>
        )}
      </div>
    </div>
  );
}

export default MenuItem;
