import React from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/Button';
import useStore from '../store';
import { motion } from 'framer-motion';
import ProfileDropdown from '../components/ProfileDropdown';

import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !user) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          preferences: { theme: 'light', language: 'en' },
          displayName: firebaseUser.displayName || '',
        });
      } else if (!firebaseUser && user) {
        setUser(null);
      }
    });
    return () => unsub();
  }, [user, setUser]);

  return (
    <div className="homepage-root">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-3 bg-black bg-opacity-90 sticky top-0 z-50 shadow-sm" style={{ minHeight: '64px' }}>
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <span className="logo-icon text-3xl" style={{ color: '#e879f9', fontWeight: 800, display: 'inline-block', verticalAlign: 'middle' }}>🧠</span>
            <span className="logo-text font-extrabold text-3xl ml-2" style={{ color: '#e879f9', lineHeight: '1', verticalAlign: 'middle', fontWeight: 800 }}>StudyAI</span>
          </span>
        </div>
        <div className="hidden md:flex space-x-10">
          <a href="#features" className="text-gray-300 hover:text-pink-400 transition-colors text-base font-medium">Features</a>
          <a href="#how" className="text-gray-300 hover:text-pink-400 transition-colors text-base font-medium">How It Works</a>
          <a href="#testimonials" className="text-gray-300 hover:text-pink-400 transition-colors text-base font-medium">Testimonials</a>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-gray-300 hover:text-white px-4 py-1 rounded transition-colors text-base" onClick={() => navigate('/login')}>Log in</button>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold text-base transition-colors shadow" onClick={() => navigate('/signup')}>Sign up</button>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="homepage-hero">
        <div className="hero-badge">⚡ Revolutionize Your Learning Experience</div>
        <h1 className="hero-title">Your AI-Powered Study Companion</h1>
        <p className="hero-desc">
          Unlock your academic potential with cutting-edge AI tools designed to help you learn faster, understand deeper, and achieve more in your studies.
        </p>
        <div className="hero-cta-row">
          <button
  className="hero-cta"
  onClick={() => {
    if (user && user.id) {
      navigate('/home');
    } else {
      navigate('/signup');
    }
  }}
>
  Get Started Free <span className="arrow">→</span>
</button>
          <button
            className="explore-btn"
            onClick={() => {
              const el = document.getElementById('features');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore Features
          </button>
        </div>
      </section>
      {/* How It Works */}
      <section className="homepage-how" id="how">
        <div className="how-badge">⚡ Simple Process</div>
        <h2 className="how-title">How StudyAI Works</h2>
        <p className="how-desc">Get started in minutes and transform your learning experience with our intuitive platform.</p>
        <div className="how-cards">
          <div className="how-card">
            <div className="how-step">1</div>
            <div className="how-card-content">
              <div className="how-card-title">Create Your Account</div>
              <div className="how-card-desc">Sign up in seconds and set up your academic profile with your subjects, goals, and preferences.</div>
            </div>
          </div>
          <div className="how-card">
            <div className="how-step">2</div>
            <div className="how-card-content">
              <div className="how-card-title">Choose Your Tools</div>
              <div className="how-card-desc">Select from our suite of AI-powered learning tools based on your specific academic needs.</div>
            </div>
          </div>
          <div className="how-card">
            <div className="how-step">3</div>
            <div className="how-card-content">
              <div className="how-card-title">Excel in Your Studies</div>
              <div className="how-card-desc">Watch your academic performance improve as our AI tools help you study smarter, not harder.</div>
            </div>
          </div>
        </div>
        <button className="how-cta">Start Your Journey →</button>
      </section>
      {/* AI Tools Section */}
      <section className="homepage-tools" id="features">
        <div className="tools-badge">⚡ Powerful AI Tools</div>
        <h2 className="tools-title">Supercharge Your Learning</h2>
        <p className="tools-desc">Our platform combines cutting-edge AI with intuitive design to transform how you study and learn.</p>
        <div className="tools-cards" style={{ display: 'flex', flexDirection: 'row', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="tools-card">
            <div className="tools-icon">📊</div>
            <div>
              <div className="tools-card-title">Exam Readiness Analyzer</div>
              <div className="tools-card-desc">Get personalized feedback on your exam preparedness. Upload your syllabus or past papers and let AI highlight weak areas, suggest targeted practice, and track your progress.</div>
            </div>
          </div>
          <div className="tools-card">
            <div className="tools-icon">📅</div>
            <div>
              <div className="tools-card-title">AI Study Planner</div>
              <div className="tools-card-desc">Generate a personalized, day-by-day study plan with AI. Enter your goals, topics, and exam date to get a smart, actionable schedule.</div>
            </div>
          </div>
          <div className="tools-card">
            <div className="tools-icon">🤖</div>
            <div>
              <div className="tools-card-title">Personal Tutor</div>
              <div className="tools-card-desc">Your ultimate academic companion. Ask general questions, unravel complex concepts, solve and understand difficult questions.</div>
            </div>
          </div>
          <div className="tools-card">
            <div className="tools-icon">📝</div>
            <div>
              <div className="tools-card-title">Lecture Summarizer</div>
              <div className="tools-card-desc">Master lecture material effortlessly. Your key to comprehensive understanding. Get detailed insights saving you time while ensuring you grasp the essentials.</div>
            </div>
          </div>
          <div className="tools-card">
            <div className="tools-icon">✍️</div>
            <div>
              <div className="tools-card-title">Writer</div>
              <div className="tools-card-desc">Generate essays, papers, and other written content with proper structure and citations. Perfect for academic writing assistance.</div>
            </div>
          </div>
          <div className="tools-card">
            <div className="tools-icon">❓</div>
            <div>
              <div className="tools-card-title">Questions Generator</div>
              <div className="tools-card-desc">Create practice questions from your study materials. Test your knowledge and prepare for exams with customized quizzes.</div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="homepage-testimonials" id="testimonials">
        <div className="testimonials-badge">⚡ Success Stories</div>
        <h2 className="testimonials-title">What Our Users Say</h2>
        <p className="testimonials-desc">Join thousands of students who have transformed their academic journey with StudyAI.</p>
        <div className="testimonials-cards">
          <div className="testimonial-card">
            <div className="testimonial-avatar">JD</div>
            <div className="testimonial-info">
              <div className="testimonial-name">Jamie Davis</div>
              <div className="testimonial-role">Computer Science Student</div>
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">“StudyAI’s personalized study plans helped me ace my finals. The AI tutor explained complex algorithms in a way I could finally understand.”</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-avatar">SR</div>
            <div className="testimonial-info">
              <div className="testimonial-name">Sarah Rodriguez</div>
              <div className="testimonial-role">Medical Student</div>
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">“The lecture summarizer is a game-changer. I can review hours of lectures in minutes, and the practice questions helped me prepare for my board exams.”</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-avatar">MJ</div>
            <div className="testimonial-info">
              <div className="testimonial-name">Michael Johnson</div>
              <div className="testimonial-role">History Major</div>
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">“The writing assistant helped me structure my thesis and find relevant sources. I’ve improved my grades significantly since using StudyAI.”</div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="homepage-cta">
        <div className="cta-box">
          <div className="cta-title">Ready to Transform Your Learning?</div>
          <div className="cta-desc">Join thousands of students who are already excelling with StudyAI’s powerful AI tools.</div>
          <button className="cta-btn" onClick={() => navigate('/home')}>Get Started Free <span className="arrow">→</span></button>
        </div>
      </section>

      <footer className="homepage-footer">
        &copy; Siddhesh Waghmare
      </footer>
    </div>
  );
};

// Dark mode toggle button (copied from Header)
type DarkModeToggleProps = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

function DarkModeToggle({ theme, setTheme }: DarkModeToggleProps) {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
      className="glass-btn"
      style={{ marginLeft: 10 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-accent" />
        ) : (
          <Sun className="h-5 w-5 text-accent" />
        )}
      </motion.div>
    </Button>
  );
}

export default LandingPage;
