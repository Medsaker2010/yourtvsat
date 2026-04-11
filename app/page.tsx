'use client';
import { useState } from 'react';

export default function Home() {
  const [tab, setTab] = useState('subscriber');
  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#D4AF37', textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>
        YourTVSat VIP
      </h1>
      <div style={{ maxWidth: '400px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', padding: '30px' }}>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          {['subscriber', 'new'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #D4AF37' : '2px solid transparent', color: tab === t ? '#D4AF37' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: tab === t ? 700 : 400 }}>
              {t === 'subscriber' ? '🔑 Deja Abonne' : '✨ Nouveau'}
            </button>
          ))}
        </div>
        <input placeholder="Username ou Email..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none', boxSizing: 'border-box', marginBottom: '15px' }} />
        <button style={{ width: '100%', background: 'linear-gradient(135deg, #D4AF37, #FF8C00)', color: '#000', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
          Acceder
        </button>
      </div>
    </div>
  );
}
