import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    // Example logic (replace with real API call)
    if (email === 'test@example.com' && password === '123456') {
      alert('Login successful!');
      onLoginSuccess?.();
    } else {
      alert('Invalid credentials.');
    }
  };

  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '50px',
    },
    input: {
      padding: '10px',
      margin: '10px',
      width: '200px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      /><br />
      <button onClick={handleLogin} style={styles.button}>Login</button>
    </div>
  );
};

export default Login;
