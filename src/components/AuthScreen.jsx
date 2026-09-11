import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import ChillingLogo from './ChillingLogo';
import { Sparkles, Check, Lock, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function AuthScreen() {
  const { authMode, setAuthMode, loginUser, signupUser } = useMovie();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('Premium 4K');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter a valid email and password.');
      return;
    }

    if (authMode === 'login') {
      loginUser(email, password);
    } else {
      if (!name) {
        setErrorMessage('Please enter your name.');
        return;
      }
      signupUser(name, email, password, plan);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.85) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/91005ba9-9917-470a-b86e-940733a71b07/a3539f04-8094-469b-81d3-9f5b084931a7/US-en-20240422-POP-sharesoffaint-perspective_alpha_website_medium.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#fff',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '24px 4%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <ChillingLogo size={38} />

        <button 
          className="btn-secondary"
          onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          style={{ padding: '6px 16px', fontSize: '14px' }}
        >
          {authMode === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
      </header>

      {/* Form Card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(16px)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '450px',
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(229, 9, 20, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '28px', color: '#fff' }}>
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </h1>

          {errorMessage && (
            <div style={{
              background: '#e50914',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {authMode === 'signup' && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#333',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '14px 16px 14px 42px',
                    fontSize: '15px'
                  }}
                  required
                />
                <UserIcon size={18} style={{ position: 'absolute', left: 14, top: 16, color: '#aaa' }} />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: '#333',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '14px 16px 14px 42px',
                  fontSize: '15px'
                }}
                required
              />
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 16, color: '#aaa' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: '#333',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '14px 16px 14px 42px',
                  fontSize: '15px'
                }}
                required
              />
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 16, color: '#aaa' }} />
            </div>

            {/* Plan selection for Signup */}
            {authMode === 'signup' && (
              <div style={{ marginTop: '8px' }}>
                <label style={{ fontSize: '13px', color: '#aaa', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Choose Your Chilling Plan:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Mobile $2.99', 'Standard $9.99', 'Premium 4K $15.99'].map((p) => {
                    const planName = p.split(' ')[0];
                    const isSelected = plan.includes(planName);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlan(p)}
                        style={{
                          flex: 1,
                          padding: '10px 4px',
                          borderRadius: '6px',
                          border: isSelected ? '2px solid #e50914' : '1px solid #444',
                          background: isSelected ? 'rgba(229, 9, 20, 0.2)' : '#222',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#e50914',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '12px',
                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)',
                transition: 'transform 0.2s'
              }}
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {authMode === 'login' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#b3b3b3', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#e50914' }}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#help" style={{ color: '#b3b3b3', textDecoration: 'none' }}>Need help?</a>
              </div>
            )}
          </form>

          <div style={{ marginTop: '36px', fontSize: '15px', color: '#737373' }}>
            {authMode === 'login' ? (
              <>
                New to Chilling?{' '}
                <span
                  onClick={() => setAuthMode('signup')}
                  style={{ color: '#fff', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign up now.
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setAuthMode('login')}
                  style={{ color: '#fff', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign in now.
                </span>
              </>
            )}
          </div>

          <div style={{ marginTop: '16px', fontSize: '12px', color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#46d369" />
            <span>Protected by reCAPTCHA & Chilling Match AI Privacy.</span>
          </div>
        </div>
      </div>

      <footer style={{ padding: '20px 4%', fontSize: '12px', color: '#757575', background: 'rgba(0,0,0,0.85)' }}>
        Chilling Match AI Account Access • Terms of Use & Privacy Statement
      </footer>
    </div>
  );
}
