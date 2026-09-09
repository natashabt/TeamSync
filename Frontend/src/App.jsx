/*import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App */

/*import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful! 🎉");

      console.log("Login response:", data);
    } catch (error) {
      setMessage("Unable to connect to server.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <div className="login-card">
        <div className="logo">
          <h1>TeamSync</h1>
          <p>Connect. Collaborate. Sync.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="signup-text">
          Don't have an account? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default App;
*/

/*import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check saved login
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid saved user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Fetch rooms after user login
  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        // If backend didn't return user,
        // get profile using JWT
        const profileResponse = await fetch(
          "http://localhost:5000/api/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const profileData = await profileResponse.json();

        console.log("Profile response:", profileData);

        if (profileResponse.ok && profileData.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(profileData.user)
          );

          setUser(profileData.user);
        } else {
          setMessage("Login successful, but user profile could not be loaded.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server.");
    }

    setLoading(false);
  };

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/rooms",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Rooms response:", data);

      if (!response.ok) {
        setMessage(data.message || "Unable to fetch rooms");
        return;
      }

      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Rooms error:", error);
      setMessage("Unable to fetch rooms.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setRooms([]);
    setEmail("");
    setPassword("");
    setMessage("");
  };

  // Login Page
  if (!user) {
    return (
      <div className="app">
        <div className="login-card">
          <div className="logo">
            <h1>TeamSync</h1>
            <p>Connect. Collaborate. Sync.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <p className="signup-text">
            Don't have an account? <span>Sign Up</span>
          </p>
        </div>
      </div>
    );
  }

  // Rooms Dashboard
  return (
    <div className="dashboard">
      <header className="navbar">
        <div>
          <h1>TeamSync</h1>
          <p>Welcome, {user.name}</p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="rooms-container">
        <div className="rooms-header">
          <div>
            <h2>Your Rooms</h2>
            <p>Select a room to start chatting.</p>
          </div>

          <button onClick={fetchRooms}>
            Refresh
          </button>
        </div>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        {rooms.length === 0 ? (
          <div className="empty-state">
            <h3>No rooms found</h3>
            <p>
              Create or join a room to start collaborating.
            </p>
          </div>
        ) : (
          <div className="room-grid">
            {rooms.map((room) => (
              <div
                className="room-card"
                key={room._id}
              >
                <h3>{room.name}</h3>

                <p>
                  Members: {room.members.length}
                </p>

                <p>
                  Created by: {room.createdBy?.name}
                </p>

                <button>
                  Open Room
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;*/


/*import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check saved login
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid saved user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Fetch rooms after login
  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/rooms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to fetch rooms");
        return;
      }

      setRooms(data.rooms || []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to fetch rooms.");
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server.");
    }

    setLoading(false);
  };

  // Open Room
  const openRoom = async (room) => {
    setSelectedRoom(room);
    setMessages([]);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/rooms/${room._id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to fetch messages"
        );
        return;
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to fetch messages.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setRooms([]);
    setSelectedRoom(null);
    setMessages([]);
  };

  // Login Page
  if (!user) {
    return (
      <div className="app">
        <div className="login-card">
          <div className="logo">
            <h1>TeamSync</h1>
            <p>Connect. Collaborate. Sync.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {message && (
            <p className="message">{message}</p>
          )}

          <p className="signup-text">
            Don't have an account?{" "}
            <span>Sign Up</span>
          </p>
        </div>
      </div>
    );
  }

  // Chat Screen
  if (selectedRoom) {
    return (
      <div className="chat-page">
        <header className="chat-header">
          <div>
            <h1>{selectedRoom.name}</h1>
            <p>
              {selectedRoom.members.length} members
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedRoom(null);
              setMessages([]);
            }}
          >
            Back to Rooms
          </button>
        </header>

        <div className="chat-container">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="no-messages">
                <h3>No messages yet</h3>
                <p>Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  className={
                    msg.sender?._id === user._id
                      ? "message-bubble own-message"
                      : "message-bubble"
                  }
                  key={msg._id}
                >
                  <strong>
                    {msg.sender?.name || "User"}
                  </strong>

                  <p>{msg.text}</p>

                  <small>
                    {new Date(
                      msg.createdAt
                    ).toLocaleTimeString()}
                  </small>
                </div>
              ))
            )}
          </div>

          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) =>
                setNewMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("Send:", newMessage);
                }
              }}
            />

            <button
              onClick={() => {
                console.log("Send:", newMessage);
                setNewMessage("");
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rooms Dashboard
  return (
    <div className="dashboard">
      <header className="navbar">
        <div>
          <h1>TeamSync</h1>
          <p>Welcome, {user.name}</p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="rooms-container">
        <div className="rooms-header">
          <div>
            <h2>Your Rooms</h2>
            <p>Select a room to start chatting.</p>
          </div>

          <button onClick={fetchRooms}>
            Refresh
          </button>
        </div>

        {message && (
          <p className="message">{message}</p>
        )}

        <div className="room-grid">
          {rooms.map((room) => (
            <div
              className="room-card"
              key={room._id}
            >
              <h3>{room.name}</h3>

              <p>
                Members: {room.members.length}
              </p>

              <p>
                Created by:{" "}
                {room.createdBy?.name}
              </p>

              <button
                onClick={() => openRoom(room)}
              >
                Open Room
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;*/

/*import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  // Check saved login
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid saved user:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Fetch rooms after login
  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  // Connect Socket.IO after login
  useEffect(() => {
    if (!user) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const socket = io("http://localhost:5000", {
      auth: {
        token: token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to TeamSync Socket:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("receiveMessage", (data) => {
      console.log("New real-time message:", data);

      setMessages((previousMessages) => {
        return [...previousMessages, data];
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // Join selected room
  useEffect(() => {
    if (!selectedRoom || !socketRef.current) {
      return;
    }

    socketRef.current.emit(
      "joinRoom",
      selectedRoom._id
    );

    console.log(
      "Joined room:",
      selectedRoom._id
    );
  }, [selectedRoom]);

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/rooms",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to fetch rooms"
        );
        return;
      }

      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Rooms error:", error);
      setMessage("Unable to fetch rooms.");
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Login failed"
        );

        setLoading(false);
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Unable to connect to server."
      );
    }

    setLoading(false);
  };

  // Open Room
  const openRoom = async (room) => {
    setSelectedRoom(room);
    setMessages([]);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/rooms/${room._id}/messages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to fetch messages"
        );
        return;
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error("Messages error:", error);

      setMessage(
        "Unable to fetch messages."
      );
    }
  };

  // Send Message
  const sendMessage = () => {
    const text = newMessage.trim();

    if (!text) {
      return;
    }

    if (!selectedRoom) {
      return;
    }

    if (!socketRef.current) {
      setMessage("Socket is not connected.");
      return;
    }

    socketRef.current.emit("sendMessage", {
      roomId: selectedRoom._id,
      text: text,
    });

    setNewMessage("");
  };

  // Logout
  const handleLogout = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setRooms([]);
    setSelectedRoom(null);
    setMessages([]);
    setNewMessage("");
    setEmail("");
    setPassword("");
  };

  // Login Page
  if (!user) {
    return (
      <div className="app">
        <div className="login-card">
          <div className="logo">
            <h1>TeamSync</h1>

            <p>
              Connect. Collaborate. Sync.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          <p className="signup-text">
            Don't have an account?{" "}
            <span>Sign Up</span>
          </p>
        </div>
      </div>
    );
  }

  // Chat Screen
  if (selectedRoom) {
    return (
      <div className="chat-page">
        <header className="chat-header">
          <div>
            <h1>{selectedRoom.name}</h1>

            <p>
              {selectedRoom.members.length} members
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedRoom(null);
              setMessages([]);
              setNewMessage("");
            }}
          >
            Back to Rooms
          </button>
        </header>

        <div className="chat-container">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="no-messages">
                <h3>No messages yet</h3>
                <p>
                  Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  className={
                    msg.sender?._id === user._id
                      ? "message-bubble own-message"
                      : "message-bubble"
                  }
                  key={msg._id}
                >
                  <strong>
                    {msg.sender?.name ||
                      "User"}
                  </strong>

                  <p>{msg.text}</p>

                  <small>
                    {new Date(
                      msg.createdAt
                    ).toLocaleTimeString()}
                  </small>
                </div>
              ))
            )}
          </div>

          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) =>
                setNewMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rooms Dashboard
  return (
    <div className="dashboard">
      <header className="navbar">
        <div>
          <h1>TeamSync</h1>

          <p>
            Welcome, {user.name}
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="rooms-container">
        <div className="rooms-header">
          <div>
            <h2>Your Rooms</h2>

            <p>
              Select a room to start chatting.
            </p>
          </div>

          <button onClick={fetchRooms}>
            Refresh
          </button>
        </div>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <div className="room-grid">
          {rooms.map((room) => (
            <div
              className="room-card"
              key={room._id}
            >
              <h3>{room.name}</h3>

              <p>
                Members:{" "}
                {room.members.length}
              </p>

              <p>
                Created by:{" "}
                {room.createdBy?.name}
              </p>

              <button
                onClick={() =>
                  openRoom(room)
                }
              >
                Open Room
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;*/

/*import { useEffect, useRef, useState } from "react";



import { io } from "socket.io-client";

const API_URL = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [error, setError] = useState("");

  const socketRef = useRef(null);

  // =========================
  // Check Login on Page Load
  // =========================

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setPage("rooms");
    }
  }, []);

  // =========================
  // Login
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      setPage("rooms");

      setEmail("");
      setPassword("");
    } catch (error) {
      setError("Unable to connect to server");
    }
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setToken("");
    setUser(null);
    setRooms([]);
    setSelectedRoom(null);
    setMessages([]);
    setPage("login");
  };

  // =========================
  // Fetch Rooms
  // =========================

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to fetch rooms");
        return;
      }

      setRooms(data.rooms || []);
    } catch (error) {
      setError("Unable to fetch rooms");
    }
  };

  // Fetch rooms when user enters rooms page
  useEffect(() => {
    if (page === "rooms" && token) {
      fetchRooms();
    }
  }, [page, token]);

  // =========================
  // Open Room
  // =========================

  const openRoom = async (room) => {
    setSelectedRoom(room);
    setMessages([]);
    setError("");
    setPage("chat");

    try {
      // Fetch old messages
      const response = await fetch(
        `${API_URL}/api/rooms/${room._id}/messages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages || []);
      } else {
        setError(data.message || "Unable to fetch messages");
      }
    } catch (error) {
      setError("Unable to fetch messages");
    }

    // Disconnect previous socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create new socket connection
    const socket = io(API_URL, {
      auth: {
        token: token,
      },
    });

    socketRef.current = socket;

    // Socket connected
    socket.on("connect", () => {
      console.log("Connected to TeamSync:", socket.id);

      // Join selected room
      socket.emit("joinRoom", room._id);

      console.log("Joined room:", room._id);
    });

    // Receive message
    socket.on("receiveMessage", (message) => {
      console.log("New message received:", message);

      // Add received message to screen
      setMessages((previousMessages) => {
        return [...previousMessages, message];
      });
    });

    // Socket error
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Disconnected from TeamSync");
    });
  };

  // =========================
  // Send Message
  // =========================

  const sendMessage = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    if (!selectedRoom) {
      return;
    }

    if (!socketRef.current) {
      setError("Socket is not connected");
      return;
    }

    // IMPORTANT:
    // Login response uses user.id
    // NOT user._id

    const messageData = {
      roomId: selectedRoom._id,
      sender: user.id,
      text: text.trim(),
    };

    console.log("Sending message:", messageData);

    socketRef.current.emit("sendMessage", messageData);

    // Clear input
    setText("");
  };

  // =========================
  // Back to Rooms
  // =========================

  const backToRooms = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setSelectedRoom(null);
    setMessages([]);
    setPage("rooms");
  };

  // =========================
  // Login Page
  // =========================

  if (page === "login") {
    return (
      <div style={styles.page}>
        <div style={styles.loginContainer}>
          <h1 style={styles.logo}>TeamSync</h1>

          <p style={styles.tagline}>Connect. Collaborate. Sync.</p>

          <form onSubmit={handleLogin}>
            <label style={styles.label}>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />

            <label style={styles.label}>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.primaryButton}>
              Login
            </button>
          </form>

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.signupText}>
            Don't have an account? <strong>Sign Up</strong>
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Rooms Page
  // =========================

  if (page === "rooms") {
    return (
      <div style={styles.app}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerLogo}>TeamSync</h1>

            <p style={styles.welcome}>
              Welcome, {user?.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </header>

        <main style={styles.main}>
          <div style={styles.roomsHeader}>
            <div>
              <h2 style={styles.pageTitle}>Your Rooms</h2>

              <p style={styles.subtitle}>
                Select a room to start chatting.
              </p>
            </div>

            <button
              onClick={fetchRooms}
              style={styles.refreshButton}
            >
              Refresh
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.roomGrid}>
            {rooms.length === 0 ? (
              <p>No rooms found.</p>
            ) : (
              rooms.map((room) => (
                <div key={room._id} style={styles.roomCard}>
                  <h3 style={styles.roomName}>{room.name}</h3>

                  <p style={styles.roomInfo}>
                    Members: {room.members?.length || 0}
                  </p>

                  <p style={styles.roomInfo}>
                    Created by:{" "}
                    {room.createdBy?.name || "Unknown"}
                  </p>

                  <button
                    onClick={() => openRoom(room)}
                    style={styles.openRoomButton}
                  >
                    Open Room
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // Chat Page
  // =========================

  if (page === "chat") {
    return (
      <div style={styles.chatPage}>
        <header style={styles.chatHeader}>
          <div>
            <h1 style={styles.chatTitle}>
              {selectedRoom?.name}
            </h1>

            <p style={styles.memberCount}>
              {selectedRoom?.members?.length || 0} members
            </p>
          </div>

          <button
            onClick={backToRooms}
            style={styles.backButton}
          >
            Back to Rooms
          </button>
        </header>

        <div style={styles.chatContainer}>
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <p style={styles.noMessages}>
                No messages yet. Start chatting!
              </p>
            ) : (
              messages.map((message) => {
                // IMPORTANT:
                // user.id is used here

                const senderId =
                  typeof message.sender === "object"
                    ? message.sender?._id
                    : message.sender;

                const isOwnMessage =
                  senderId === user?.id;

                return (
                  <div
                    key={message._id || `${message.createdAt}-${Math.random()}`}
                    style={{
                      ...styles.message,
                      ...(isOwnMessage
                        ? styles.myMessage
                        : styles.otherMessage),
                    }}
                  >
                    <strong style={styles.senderName}>
                      {message.sender?.name ||
                        (isOwnMessage
                          ? user?.name
                          : "User")}
                    </strong>

                    <p style={styles.messageText}>
                      {message.text}
                    </p>

                    <small style={styles.messageTime}>
                      {message.createdAt
                        ? new Date(
                            message.createdAt
                          ).toLocaleTimeString()
                        : ""}
                    </small>
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={sendMessage}
            style={styles.messageForm}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={styles.messageInput}
            />

            <button
              type="submit"
              style={styles.sendButton}
            >
              Send
            </button>
          </form>
        </div>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    );
  }

  return null;
}

// =========================
// Styles
// =========================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },

  loginContainer: {
    width: "400px",
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  logo: {
    textAlign: "center",
    fontSize: "42px",
    marginBottom: "5px",
  },

  tagline: {
    textAlign: "center",
    color: "#666",
    fontSize: "18px",
    marginBottom: "40px",
  },

  label: {
    display: "block",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
    marginTop: "20px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "10px",
  },

  primaryButton: {
    width: "100%",
    padding: "15px",
    marginTop: "25px",
    border: "none",
    borderRadius: "10px",
    background: "#222",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },

  signupText: {
    textAlign: "center",
    marginTop: "30px",
    color: "#666",
  },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: "15px",
  },

  app: {
    minHeight: "100vh",
    background: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    background: "white",
    padding: "20px 35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  headerLogo: {
    margin: 0,
    fontSize: "32px",
  },

  welcome: {
    margin: "5px 0 0",
    color: "#666",
    fontSize: "18px",
  },

  logoutButton: {
    background: "#222",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },

  main: {
    maxWidth: "1020px",
    margin: "0 auto",
    padding: "50px 30px",
  },

  roomsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "36px",
  },

  subtitle: {
    marginTop: "8px",
    color: "#666",
    fontSize: "18px",
  },

  refreshButton: {
    background: "#222",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },

  roomGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },

  roomCard: {
    background: "white",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },

  roomName: {
    fontSize: "24px",
    marginTop: 0,
  },

  roomInfo: {
    color: "#666",
    fontSize: "17px",
  },

  openRoomButton: {
    width: "100%",
    padding: "14px",
    marginTop: "20px",
    border: "none",
    borderRadius: "10px",
    background: "#222",
    color: "white",
    fontSize: "17px",
    cursor: "pointer",
  },

  chatPage: {
    minHeight: "100vh",
    background: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
  },

  chatHeader: {
    background: "white",
    padding: "20px 35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  chatTitle: {
    margin: 0,
    fontSize: "32px",
  },

  memberCount: {
    color: "#666",
    marginTop: "8px",
  },

  backButton: {
    background: "#222",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },

  chatContainer: {
    maxWidth: "1100px",
    height: "calc(100vh - 150px)",
    margin: "25px auto",
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  messagesContainer: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  noMessages: {
    color: "#777",
    textAlign: "center",
    marginTop: "50px",
  },

  message: {
    maxWidth: "65%",
    padding: "15px 20px",
    borderRadius: "15px",
  },

  myMessage: {
    alignSelf: "flex-end",
    background: "#222",
    color: "white",
  },

  otherMessage: {
    alignSelf: "flex-start",
    background: "#eeeeee",
    color: "#222",
  },

  senderName: {
    display: "block",
    marginBottom: "5px",
  },

  messageText: {
    margin: "5px 0",
    fontSize: "17px",
  },

  messageTime: {
    opacity: 0.6,
  },

  messageForm: {
    display: "flex",
    padding: "20px",
    borderTop: "1px solid #ddd",
    gap: "12px",
  },

  messageInput: {
    flex: 1,
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "16px",
  },

  sendButton: {
    padding: "15px 30px",
    border: "none",
    borderRadius: "10px",
    background: "#222",
    color: "white",
    fontSize: "17px",
    cursor: "pointer",
  },
};

export default App;*/

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Room from "./Room";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

const getInitials = (name = "User") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
};

function App() {
  // ========================================
  // USER
  // ========================================

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  // ========================================
  // ROOMS
  // ========================================

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ========================================
  // UNREAD MESSAGE COUNTS
  // ========================================

  const [unreadCounts, setUnreadCounts] = useState({});

  // ========================================
  // REFS
  // ========================================

  const selectedRoomRef = useRef(null);
  const socketRef = useRef(null);
  const roomsRef = useRef([]);

  // Keep selected room updated
  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  // Keep latest rooms available inside socket events
  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  // ========================================
  // LOGIN / SIGNUP
  // ========================================

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // BROWSER NOTIFICATION PERMISSION
  // ========================================

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      setEmail("");
      setPassword("");

      setSuccess("Login successful! 🎉");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SIGNUP
  // ========================================

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess(
        "Account created successfully! Please login."
      );

      setName("");
      setEmail("");
      setPassword("");

      setIsSignup(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // GET ROOMS
  // ========================================

  const fetchRooms = async () => {
    if (!token) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch rooms"
        );
      }

      const fetchedRooms = data.rooms || [];

      setRooms(fetchedRooms);
      roomsRef.current = fetchedRooms;

      // Join all rooms
      if (socketRef.current) {
        fetchedRooms.forEach((room) => {
          socketRef.current.emit("joinRoom", {
            roomId: room._id,
            userId: user?.id,
          });
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // ========================================
  // SOCKET CONNECTION
  // ========================================

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const socket = io(SOCKET_URL);

    socketRef.current = socket;

    // ========================================
    // CONNECT
    // ========================================

    socket.on("connect", () => {
      console.log(
        "App socket connected:",
        socket.id
      );

      // Join all rooms
      roomsRef.current.forEach((room) => {
        socket.emit("joinRoom", {
          roomId: room._id,
          userId: user.id,
        });
      });
    });

    // ========================================
    // RECEIVE MESSAGE
    // ========================================

    socket.on("receiveMessage", (data) => {
      const incomingMessage =
        data?.message || data;

      if (!incomingMessage) {
        return;
      }

      // ========================================
      // GET ROOM ID
      // ========================================

      const roomId =
        typeof incomingMessage.room === "object"
          ? incomingMessage.room?._id
          : incomingMessage.room;

      // ========================================
      // GET SENDER ID
      // ========================================

      const senderId =
        typeof incomingMessage.sender === "object"
          ? incomingMessage.sender?._id
          : incomingMessage.sender;

      if (!roomId) {
        return;
      }

      // ========================================
      // DON'T COUNT OUR OWN MESSAGE
      // ========================================

      if (senderId === user.id) {
        return;
      }

      // ========================================
      // CURRENT ROOM
      // ========================================

      if (
        selectedRoomRef.current?._id === roomId
      ) {
        return;
      }

      // ========================================
      // INCREASE UNREAD COUNT
      // ========================================

      setUnreadCounts((previousCounts) => ({
        ...previousCounts,
        [roomId]:
          (previousCounts[roomId] || 0) + 1,
      }));

      // ========================================
      // BROWSER NOTIFICATION
      // ========================================

      if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        const room = roomsRef.current.find(
          (item) => item._id === roomId
        );

        const senderName =
          typeof incomingMessage.sender === "object"
            ? incomingMessage.sender?.name ||
              "Someone"
            : "Someone";

        const roomName =
          room?.name || "TeamSync";

        const notification =
          new Notification(
            `New message in ${roomName}`,
            {
              body: `${senderName}: ${
                incomingMessage.text ||
                "New message"
              }`,
              icon: "/vite.svg",
            }
          );

        // ========================================
        // NOTIFICATION CLICK
        // ========================================

        notification.onclick = () => {
          window.focus();

          if (room) {
            setSelectedRoom(room);

            setUnreadCounts(
              (previousCounts) => ({
                ...previousCounts,
                [roomId]: 0,
              })
            );
          }

          notification.close();
        };
      }

      console.log(
        `Unread message in room: ${roomId}`
      );
    });

    // ========================================
    // SOCKET ERROR
    // ========================================

    socket.on("connect_error", (error) => {
      console.error(
        "App socket connection error:",
        error.message
      );
    });

    // ========================================
    // CLEANUP
    // ========================================

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, token]);

  // ========================================
  // FETCH ROOMS AFTER LOGIN
  // ========================================

  useEffect(() => {
    if (user && token) {
      fetchRooms();
    }
  }, [user, token]);

  // ========================================
  // JOIN NEWLY FETCHED ROOMS
  // ========================================

  useEffect(() => {
    if (!socketRef.current || !user) {
      return;
    }

    rooms.forEach((room) => {
      socketRef.current.emit("joinRoom", {
        roomId: room._id,
        userId: user.id,
      });
    });
  }, [rooms, user]);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
    setRooms([]);
    setSelectedRoom(null);
    setUnreadCounts({});

    roomsRef.current = [];

    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  // ========================================
  // OPEN ROOM
  // ========================================

  const openRoom = (room) => {
    setSelectedRoom(room);

    // Reset unread count
    setUnreadCounts((previousCounts) => ({
      ...previousCounts,
      [room._id]: 0,
    }));
  };

  // ========================================
  // BACK TO ROOMS
  // ========================================

  const backToRooms = () => {
    setSelectedRoom(null);
    fetchRooms();
  };

  // ========================================
  // CHAT SCREEN
  // ========================================

  if (user && token && selectedRoom) {
    return (
      <Room
        room={selectedRoom}
        user={user}
        token={token}
        onBack={backToRooms}
      />
    );
  }

  // ========================================
  // ROOMS SCREEN
  // ========================================

  if (user && token) {
    return (
      <div style={styles.app}>
        <header style={styles.header}>
          <div style={styles.brandArea}>
            <div style={styles.brandMark}>TS</div>
            <div>
              <h1 style={styles.headerLogo}>TeamSync</h1>
              <p style={styles.welcome}>Your workspace, connected.</p>
            </div>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.userChip}>
              <div style={styles.avatarSmall}>
                {getInitials(user.name)}
              </div>
              <span style={styles.userChipName}>{user.name}</span>
            </div>

            <button
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main style={styles.main}>
          <section style={styles.heroSection}>
            <div>
              <p style={styles.eyebrow}>WORKSPACE</p>
              <h2 style={styles.pageTitle}>Your Rooms</h2>
              <p style={styles.subtitle}>
                Choose a room and start collaborating with your team.
              </p>
            </div>

            <button
              style={styles.refreshButton}
              onClick={fetchRooms}
              disabled={loading}
            >
              ↻ &nbsp;Refresh
            </button>
          </section>

          {error && (
            <div style={styles.errorBanner}>
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <section style={styles.statsRow}>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>▦</span>
              <div>
                <strong style={styles.statNumber}>{rooms.length}</strong>
                <span style={styles.statLabel}>Rooms</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <span style={styles.statIcon}>●</span>
              <div>
                <strong style={styles.statNumber}>Live</strong>
                <span style={styles.statLabel}>Real-time sync</span>
              </div>
            </div>
          </section>

          <div style={styles.roomGrid}>
            {rooms.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>▦</div>
                <h3 style={styles.emptyTitle}>No rooms found</h3>
                <p style={styles.emptyText}>
                  There are no rooms available for your account yet.
                </p>
                <button
                  style={styles.refreshButton}
                  onClick={fetchRooms}
                >
                  Refresh rooms
                </button>
              </div>
            ) : (
              rooms.map((room) => {
                const unreadCount = unreadCounts[room._id] || 0;
                const roomInitials = getInitials(room.name);

                return (
                  <article
                    key={room._id}
                    style={styles.roomCard}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.transform = "translateY(-4px)";
                      event.currentTarget.style.boxShadow =
                        "0 18px 40px rgba(15, 23, 42, 0.12)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.transform = "translateY(0)";
                      event.currentTarget.style.boxShadow =
                        "0 10px 30px rgba(15, 23, 42, 0.06)";
                    }}
                  >
                    <div style={styles.roomTopRow}>
                      <div style={styles.roomAvatar}>{roomInitials}</div>

                      {unreadCount > 0 && (
                        <span style={styles.unreadBadge}>
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>

                    <h3 style={styles.roomName}>{room.name}</h3>

                    <div style={styles.roomDetails}>
                      <span style={styles.detailPill}>
                        👥 {room.members?.length || 0} members
                      </span>
                    </div>

                    <p style={styles.createdBy}>
                      Created by <strong>{room.createdBy?.name || "Unknown"}</strong>
                    </p>

                    <button
                      style={styles.openRoomButton}
                      onClick={() => openRoom(room)}
                    >
                      Open room <span style={styles.arrow}>→</span>
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </main>
      </div>
    );
  }

  // ========================================
  // LOGIN / SIGNUP SCREEN
  // ========================================

  return (
    <div style={styles.page}>
      <div style={styles.loginContainer}>
        <h1 style={styles.logo}>
          TeamSync
        </h1>

        <p style={styles.tagline}>
          Connect. Collaborate. Sync.
        </p>

        {isSignup ? (
          <form onSubmit={handleSignup}>
            <label style={styles.label}>
              Name
            </label>

            <input
              style={styles.input}
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

            <label style={styles.label}>
              Email
            </label>

            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <label style={styles.label}>
              Password
            </label>

            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

            <button
              style={styles.primaryButton}
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <label style={styles.label}>
              Email
            </label>

            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <label style={styles.label}>
              Password
            </label>

            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

            <button
              style={styles.primaryButton}
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>
        )}

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        {success && (
          <p style={styles.success}>
            {success}
          </p>
        )}

        <p style={styles.signupText}>
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            style={styles.linkButton}
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setSuccess("");
            }}
          >
            {isSignup ? " Login" : " Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ========================================
// STYLES
// ========================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 52%, #ecfeff 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  loginContainer: {
    width: "min(420px, 100%)",
    background: "rgba(255,255,255,0.96)",
    padding: "42px",
    borderRadius: "24px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.14)",
    border: "1px solid rgba(148,163,184,0.18)",
    boxSizing: "border-box",
  },

  logo: {
    textAlign: "center",
    fontSize: "44px",
    letterSpacing: "-1.5px",
    margin: "0 0 8px",
    color: "#0f172a",
  },

  tagline: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "16px",
    margin: "0 0 34px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "8px",
    marginTop: "18px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 15px",
    fontSize: "15px",
    color: "#0f172a",
    background: "#f8fafc",
    border: "1px solid #dbe3ee",
    borderRadius: "12px",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    padding: "14px 16px",
    marginTop: "24px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #111827, #334155)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(15,23,42,0.16)",
  },

  signupText: {
    textAlign: "center",
    marginTop: "26px",
    color: "#64748b",
    fontSize: "14px",
  },

  linkButton: {
    border: "none",
    background: "none",
    color: "#4f46e5",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    padding: "0 0 0 4px",
  },

  error: {
    color: "#dc2626",
    textAlign: "center",
    marginTop: "14px",
    fontSize: "14px",
  },

  success: {
    color: "#15803d",
    textAlign: "center",
    marginTop: "14px",
    fontSize: "14px",
  },

  app: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(14px)",
    padding: "16px 6vw",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 1px 0 rgba(148,163,184,0.2)",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  brandMark: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
    boxShadow: "0 8px 18px rgba(79,70,229,0.22)",
  },

  headerLogo: {
    margin: 0,
    fontSize: "21px",
    letterSpacing: "-0.5px",
  },

  welcome: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 10px 5px 6px",
    background: "#f1f5f9",
    borderRadius: "999px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
  },

  userChipName: {
    maxWidth: "140px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  avatarSmall: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e0e7ff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "900",
  },

  logoutButton: {
    background: "#0f172a",
    color: "white",
    border: "none",
    padding: "10px 17px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  main: {
    width: "min(1100px, 100% - 48px)",
    margin: "0 auto",
    padding: "48px 0 70px",
    boxSizing: "border-box",
  },

  heroSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "24px",
    marginBottom: "28px",
  },

  eyebrow: {
    margin: "0 0 8px",
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.6px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "40px",
    lineHeight: 1.1,
    letterSpacing: "-1.5px",
  },

  subtitle: {
    margin: "9px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },

  refreshButton: {
    background: "white",
    color: "#0f172a",
    border: "1px solid #dbe3ee",
    padding: "11px 17px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(15,23,42,0.05)",
    whiteSpace: "nowrap",
  },

  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "12px 15px",
    marginBottom: "20px",
    borderRadius: "12px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "13px",
  },

  statsRow: {
    display: "flex",
    gap: "14px",
    marginBottom: "26px",
  },

  statCard: {
    minWidth: "150px",
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "13px 16px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
  },

  statIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
  },

  statNumber: {
    display: "block",
    fontSize: "16px",
    color: "#0f172a",
  },

  statLabel: {
    display: "block",
    marginTop: "2px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  roomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "20px",
  },

  roomCard: {
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  roomTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "48px",
  },

  roomAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #eef2ff, #cffafe)",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "14px",
  },

  unreadBadge: {
    minWidth: "28px",
    height: "28px",
    padding: "0 7px",
    borderRadius: "999px",
    background: "#ef4444",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "11px",
    fontWeight: "900",
    boxSizing: "border-box",
  },

  roomName: {
    fontSize: "21px",
    margin: "22px 0 12px",
    letterSpacing: "-0.4px",
  },

  roomDetails: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  detailPill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 9px",
    borderRadius: "8px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
  },

  createdBy: {
    margin: "13px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  openRoomButton: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    marginTop: "21px",
    border: "none",
    borderRadius: "11px",
    background: "#0f172a",
    color: "white",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  arrow: {
    fontSize: "18px",
    lineHeight: 1,
  },

  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "65px 25px",
    background: "white",
    border: "1px dashed #cbd5e1",
    borderRadius: "20px",
  },

  emptyIcon: {
    width: "52px",
    height: "52px",
    margin: "0 auto 15px",
    borderRadius: "15px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "19px",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "13px",
    margin: "8px 0 20px",
  },
};

export default App;