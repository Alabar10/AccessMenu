# AccessMenu 🧑‍🍳📱

**AccessMenu** is an inclusive mobile app built with **React Native (Expo)** and a **Flask backend**, designed to help people with disabilities browse a food menu with accessibility in mind.

---

## 🔑 Features

- 🧏 Sign Language Videos for menu items  
- 🔊 Text-to-Speech (read items out loud)  
- ⚠️ Allergen Filters and Personal Preferences  
- 🎨 Theme switching (Light, Dark, Yellow)  
- 📅 Save dietary preferences to user profile  
- 🧠 Screen reader and keyboard navigation support  
- 📲 Login/Register system

---

## 📦 Technologies Used

### Frontend
- React Native (Expo)
- expo-av (for video)
- expo-speech
- Styled with `StyleSheet` and `LinearGradient`

### Backend
- Flask (Python)
- SQLAlchemy
- REST API for users, login, menu, and preferences

---

## 🚀 How to Run the App

### 📱 Frontend

1. Navigate to the frontend folder:
   ```bash
   cd AccessMenuApp
   ```

2. Start Expo:
   ```bash
   npx expo start
   ```

3. Scan the QR code on your phone with Expo Go.

---

### 💻 Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Run the Flask server:
   ```bash
   python3 app.py
   ```

Make sure you’ve installed dependencies in a virtual environment beforehand:
```bash
python3 -m venv .venv
source .venv/bin/activate  # on macOS/Linux
.venv\Scripts\activate   # on Windows
pip install -r requirements.txt
```

---

## 🧪 Accessibility Considerations

This project supports:
- Screen readers
- Keyboard navigation
- Font scaling
- Audio feedback
- Visual feedback
- Sign language for inclusivity

---


