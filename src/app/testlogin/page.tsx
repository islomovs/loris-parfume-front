"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      setIsLoggedIn(true);
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      navigator.sendBeacon(
        "/clear-session",
        JSON.stringify({ token: sessionToken })
      );
      localStorage.removeItem("sessionToken");
      event.returnValue = "";
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.removeItem("sessionToken");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://147.45.107.174:3005/auth/login",
        {
          login,
          password,
        }
      );

      if (response.status === 200 && response.data.success) {
        localStorage.setItem("sessionToken", response.data.data.token);
        setIsLoggedIn(true);
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div>
        <h2>Welcome!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Login:</label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
