import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signInWithGoogle } from "../authHelpers";
import "./Landing.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signUp(email, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3 px-8 py-3 bg-black bg-opacity-90 sticky top-0 z-50 shadow-sm" style={{ minHeight: '64px' }}>
        <span
          className="flex items-center font-bold text-2xl cursor-pointer"
          style={{ color: '#e26aff' }}
          onClick={() => navigate('/')}
        >
          🧠 <span className="ml-2">StudyAI</span>
        </span>
      </div>
      <div className="signup-container">
        <h2 className="signup-title">Create Your Account</h2>
        <div className="signup-subtitle">Join StudyAI and unlock your academic potential</div>

        <form className="signup-form" onSubmit={handleSignup}>
          <label className="signup-label">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="signup-input"
            required
          />
          <label className="signup-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="signup-input"
            required
          />
          <label className="signup-label">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="signup-input"
            required
          />
          <label className="signup-label">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="signup-input"
            required
          />
          {error && <div className="signup-error">{error}</div>}
          <button className="signup-btn" type="submit">Create Account <span className="signup-arrow">→</span></button>
        </form>
        <div className="signup-legal">
          By signing up, you agree to our <span className="signup-link" style={{textDecoration: 'underline', cursor: 'pointer'}}>Terms of Service</span> and <span className="signup-link" style={{textDecoration: 'underline', cursor: 'pointer'}}>Privacy Policy</span>.
        </div>
        <div className="signup-footer">
          Already have an account? <span className="signup-link" onClick={() => navigate('/login')}>Log in</span>
        </div>
        <div style={{ textAlign: 'center', margin: '16px 0', color: '#e879f9', fontWeight: 600 }}>OR CONTINUE WITH</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: 24 }}>
          <button type="button" onClick={handleGoogleLogin} style={{ background: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{ width: 24, height: 24, verticalAlign: 'middle' }} />
          </button>
          {/* Facebook button placeholder, not implemented */}
          <button type="button" disabled style={{ background: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'not-allowed' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style={{ width: 24, height: 24, verticalAlign: 'middle' }} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
