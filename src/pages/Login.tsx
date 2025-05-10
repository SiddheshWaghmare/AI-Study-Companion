import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../authHelpers";
import "./Landing.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real email/password login if needed
    setError("This demo only supports Google login. Use Google button below.");
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  return (
    <>
      <nav className="w-full flex items-center px-8 py-3 bg-black bg-opacity-90 sticky top-0 z-50 shadow-sm" style={{ minHeight: '64px' }}>
        <div className="flex items-center space-x-3">
          <span
          className="flex items-center font-bold text-2xl cursor-pointer"
          style={{ color: '#e26aff' }}
          onClick={() => navigate('/')}
        >
          🧠 <span className="ml-2">StudyAI</span>
        </span>
        </div>
      </nav>
      <div className="login-container">
        <h2 className="login-title">Welcome Back</h2>
      <div className="login-subtitle">Log in to continue your learning journey</div>
      <form className="login-form" onSubmit={handleLogin}>
        <label className="login-label">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <div className="login-label-row">
          <label className="login-label">Password</label>
          <span className="login-forgot" onClick={() => {}} style={{cursor:'pointer'}}>Forgot password?</span>
        </div>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <div className="login-remember-row">
          <input type="checkbox" id="remember" className="login-checkbox" />
          <label htmlFor="remember" className="login-remember-label">Remember me for 30 days</label>
        </div>
        {error && <div className="login-error">{error}</div>}
        <button className="login-btn" type="submit">Log In <span className="login-arrow">→</span></button>
      </form>
      <div className="login-divider"><span>OR CONTINUE WITH</span></div>
      <div className="login-social-row">
        <button className="login-social-btn" aria-label="Login with Google" type="button" onClick={handleGoogleLogin}>
          <span className="login-social-icon">
            {/* Google SVG */}
            <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.6 0 5 .9 6.9 2.4l6.5-6.5C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8.6 19.7-19.7 0-1.3-.1-2.3-.3-3.3z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.6 0 5 .9 6.9 2.4l6.5-6.5C34.5 6.5 29.5 4 24 4c-7.1 0-13.1 3.7-16.7 9.3z"/><path fill="#FBBC05" d="M24 44c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.3C29.2 35.7 26.7 36.5 24 36.5c-5.2 0-9.6-3.6-11.2-8.5l-6.6 5.1C7.2 40.3 14.9 44 24 44z"/><path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.1-4.2 5.5-7.3 6.2l6.4 5.3C38.8 41.8 43.7 37.9 46 32.4c-2.2-3.6-5.6-6.3-9.4-7.9z"/></g></svg>
          </span>
        </button>
        <button className="login-social-btn" aria-label="Login with Facebook">
          <span className="login-social-icon">
            {/* Facebook SVG */}
            <svg width="22" height="22" viewBox="0 0 48 48"><path fill="#1877F3" d="M44 24c0-11-9-20-20-20S4 13 4 24c0 10 7.5 18.2 17 19.8V31h-5v-7h5v-5c0-5 3-8 8-8 2.3 0 4 .2 4 .2v5h-2.8C30.1 16.2 30 17 30 18v3h6l-1 7h-5v12.8C36.5 42.2 44 34 44 24z"/><path fill="#fff" d="M31 25l1-7h-6v-4c0-1 .3-2 2-2h4v-7h-5c-5 0-7 3-7 7v4h-5v7h5v12.8c1.2.2 2.5.2 3.8.2s2.6-.1 3.8-.2V25h5z"/></svg>
          </span>
        </button>
      </div>
      <div className="login-footer">
        Don't have an account? <span className="login-link" onClick={() => navigate('/signup')}>Sign up</span>
      </div>
    </div>
    </>
  );
};

export default Login;
