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

function MenuItem({ name, description, image, allergens = [], signVideo }) {
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
    <div
      className="menu-card"
      tabIndex="0"
      role="region"
      aria-label={`Menu item: ${name}`}
      style={{
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "15px",
        marginBottom: "20px",
        backgroundColor: "#fff",
        maxWidth: "400px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <img src={`/${image}`} alt={name} style={{ width: "100%", borderRadius: "8px" }} />

      <div className="menu-card-content" style={{ marginTop: "12px" }}>
        <h3 style={{ fontSize: "28px", lineHeight: "1.2" }}>{name}</h3>
        <p style={{ fontSize: "18px", color: "#555" }}>{description}</p>

        {allergens.length > 0 ? (
          <p style={{ fontSize: "20px", color: "#d00", marginTop: "10px" }}>
            <strong>Allergens:</strong>{" "}
            {allergens.map((allergen, index) => (
              <span key={index}>
                {allergenIcons[allergen] || "⚠️"} {allergen}
                {index < allergens.length - 1 && " - "}
              </span>
            ))}
          </p>
        ) : (
          <p style={{ fontSize: "20px", color: "#28a745", marginTop: "10px" }}>
            <strong>Allergens:</strong> ✅ None
          </p>
        )}

        <div style={{ marginTop: "15px" }}>
          <button
            onClick={speakitem}
            aria-label={`Read aloud description of ${name}`}
            style={buttonStyle("#007BFF")}
          >
            🔊 Read
          </button>

          {signVideo && (
            <button
              onClick={toggleSignVideo}
              aria-label={`Show sign language video for ${name}`}
              style={{ ...buttonStyle("#28a745"), marginLeft: "10px" }}
            >
              ✋ Sign
            </button>
          )}
        </div>

        {showSign && signVideo && (
          <video
            width="100%"
            controls
            aria-label={`Sign language video for ${name}`}
            style={{ marginTop: "12px", borderRadius: "8px" }}
          >
            <source src={signVideo} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        )}
      </div>
    </div>
  );
}

function buttonStyle(color) {
  return {
    padding: "8px 16px",
    fontSize: "16px",
    backgroundColor: color,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };
}

export default MenuItem;
