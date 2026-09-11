import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4 style={{ color: '#fff', marginBottom: '12px' }}>Questions?</h4>
          <p className="footer-link">Call 000-800-919-1694</p>
        </div>

        <div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><a href="#faq" className="footer-link">FAQ</a></li>
            <li><a href="#investor" className="footer-link">Investor Relations</a></li>
            <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
            <li><a href="#speed" className="footer-link">Speed Test</a></li>
          </ul>
        </div>

        <div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><a href="#help" className="footer-link">Help Centre</a></li>
            <li><a href="#jobs" className="footer-link">Jobs</a></li>
            <li><a href="#cookies" className="footer-link">Cookie Preferences</a></li>
            <li><a href="#legal" className="footer-link">Legal Notices</a></li>
          </ul>
        </div>

        <div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><a href="#account" className="footer-link">Account</a></li>
            <li><a href="#ways" className="footer-link">Ways to Watch</a></li>
            <li><a href="#corporate" className="footer-link">Corporate Information</a></li>
            <li><a href="#only" className="footer-link">Only on Chilling</a></li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Chilling Match AI © 2026. Designed for ultimate movie discovery & personalized recommendations.
      </div>
    </footer>
  );
}
