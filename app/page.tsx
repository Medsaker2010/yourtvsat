'use client';
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  icon: string;
  server: string;
  description: string;
  prices: { '1m': number; '3m': number; '6m': number; '12m': number };
  features: string[];
  badge?: string;
}

interface TestResult {
  username: string;
  password: string;
  m3u: string;
  xtream: { url: string; username: string; password: string };
  qrCode: string;
  expiresIn: string;
}

const PRODUCTS: Product[] = [
  { id: 'eagle4k', name: 'Eagle 4K', icon: '🦅', server: 'eagle4k', description: 'Serveur Ultra HD 4K Premium', prices: { '1m': 12, '3m': 30, '6m': 55, '12m': 95 }, features: ['4K Ultra HD', '10000+ Chaines', 'VOD 50K+', 'Anti-Freeze'], badge: 'POPULAIRE' },
  { id: 'strong8k', name: 'Strong 8K', icon: '💪', server: 'strong8k', description: 'Qualite 8K Exceptionnelle', prices: { '1m': 15, '3m': 38, '6m': 68, '12m': 120 }, features: ['8K HDR', '12000+ Chaines', 'VOD 80K+', 'Multi-Screen'], badge: 'PREMIUM' },
  { id: 'dinovip', name: 'Dino VIP', icon: '🦕', server: 'dinovip', description: 'Serveur VIP Stabilite Maximale', prices: { '1m': 10, '3m': 25, '6m': 45, '12m': 80 }, features: ['Full HD', '8000+ Chaines', 'VOD 40K+', 'Stable 99.9%'] },
  { id: 'nexon4k', name: 'Nexon 4K', icon: '⚡', server: 'nexon4k', description: 'Vitesse et Performance 4K', prices: { '1m': 11, '3m': 28, '6m': 50, '12m': 90 }, features: ['4K HDR', '9000+ Chaines', 'VOD 45K+', 'Ultra-Fast'], badge: 'NOUVEAU' },
  { id: 'fuego', name: 'Fuego', icon: '🔥', server: 'fuego', description: 'Serveur Brulant de Performance', prices: { '1m': 10, '3m': 25, '6m': 45, '12m': 80 }, features: ['4K', '7000+ Chaines', 'VOD 35K+', 'Rapide'] },
  { id: 'cobra', name: 'Cobra', icon: '🐍', server: 'cobra', description: 'Precision et Fiabilite', prices: { '1m': 10, '3m': 25, '6m': 45, '12m': 80 }, features: ['Full HD', '7500+ Chaines', 'VOD 38K+', 'Stable'] },
  { id: 'foxx', name: 'Foxx', icon: '🦊', server: 'foxx', description: 'Ruse et Performant', prices: { '1m': 9, '3m': 22, '6m': 40, '12m': 72 }, features: ['HD', '6000+ Chaines', 'VOD 30K+', 'Economique'] },
  { id: 'pure', name: 'Pure', icon: '💎', server: 'pure', description: 'Purete du Signal', prices: { '1m': 12, '3m': 30, '6m': 55, '12m': 95 }, features: ['4K Pure', '8500+ Chaines', 'VOD 42K+', 'Crystal Clear'] },
  { id: 'trex', name: 'T-Rex', icon: '🦖', server: 'trex', description: 'Puissance Dinosaure', prices: { '1m': 11, '3m': 28, '6m': 50, '12m': 88 }, features: ['4K', '9500+ Chaines', 'VOD 48K+', 'Puissant'] },
  { id: 'infinity', name: 'Infinity', icon: '♾️', server: 'infinity', description: 'Contenu Illimite', prices: { '1m': 13, '3m': 33, '6m': 60, '12m': 105 }, features: ['4K+', '11000+ Chaines', 'VOD 60K+', 'Illimite'], badge: 'VIP' },
  { id: 'atlas', name: 'Atlas Pro', icon: '🌍', server: 'atlas', description: 'Couverture Mondiale', prices: { '1m': 12, '3m': 30, '6m': 55, '12m': 95 }, features: ['4K', '10000+ Chaines', 'Monde Entier', 'Multi-Lang'] },
  { id: 'eagle4k_ar', name: 'Eagle Arabic', icon: '🌙', server: 'eagle4k', description: 'Special Contenu Arabe', prices: { '1m': 10, '3m': 25, '6m': 45, '12m': 80 }, features: ['HD/4K', '5000+ AR', 'Bein Sports', 'OSN+'] },
  { id: 'strong_fr', name: 'Strong FR', icon: '🇫🇷', server: 'strong8k', description: 'Special France Premium', prices: { '1m': 11, '3m': 28, '6m': 50, '12m': 88 }, features: ['4K', 'TF1/M6/Canal+', 'Foot FR', 'Series FR'] },
  { id: 'nexon_sport', name: 'Nexon Sport', icon: '⚽', server: 'nexon4k', description: 'Sport 24/7 Ultra HD', prices: { '1m': 12, '3m': 30, '6m': 55, '12m': 95 }, features: ['4K Sport', 'beIN/Sky', 'F1/MotoGP', 'Live Events'], badge: 'SPORT' },
];

const glass: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '24px' };
const GOLD = 'linear-gradient(135deg, #D4AF37, #FF8C00)';

export default function YourTVSatVIP() {
  const [activeTab, setActiveTab] = useState<'subscriber' | 'new'>('subscriber');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'found' | 'notfound'>('idle');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<'1m' | '3m' | '6m' | '12m'>('12m');
  const [showTestModal, setShowTestModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [filterServer, setFilterServer] = useState('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    setUsernameStatus('idle');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) return;
    setUsernameStatus('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-user?username=${encodeURIComponent(value)}`);
        const data = await res.json();
        setUsernameStatus(data.found ? 'found' : 'notfound');
      } catch {
        setUsernameStatus('notfound');
      }
    }, 600);
  }, []);

  const handleCreateTest = async () => {
    if (!email) { toast.error('Veuillez entrer votre email'); return; }
    if (!selectedProduct) { toast.error('Veuillez selectionner un serveur'); return; }
    setIsLoading(true);
    try {
      let ip = '0.0.0.0';
      try {
        const r = await fetch('https://api.ipify.org?format=json');
        const d = await r.json();
        ip = d.ip;
      } catch { /* fallback */ }
      const res = await fetch('/api/create-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, server: selectedProduct.server, ip }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(data);
        setShowTestModal(true);
        setShowSubscribeModal(false);
        toast.success('Test 24H active !');
      } else {
        toast.error(data.error || 'Erreur API');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredProducts = filterServer === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.server === filterServer);

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: 'white', fontFamily: 'Montserrat, sans-serif', paddingBottom: '60px', overflowX: 'hidden' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: 'white', border: '1px solid #D4AF37' } }} />

      {/* HEADER */}
      <motion.header initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.15)', position: 'sticky', top: 0, background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(20px)', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ width: '45px', height: '45px', borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 0 20px rgba(212,175,55,0.5)' }}>📡</motion.div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>YourTVSat VIP</span>
        </div>
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {['Catalogue', 'Test 24H', 'Support'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>{item}</a>
          ))}
          <button onClick={() => setActiveTab('subscriber')} style={{ background: GOLD, color: '#000', border: 'none', padding: '10px 25px', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }}>Mon Compte</button>
        </nav>
      </motion.header>

      {/* AUTH */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ ...glass, padding: '30px' }}>
          <div style={{ display: 'flex', marginBottom: '25px', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
            {[{ key: 'subscriber', label: 'Deja Abonne' }, { key: 'new', label: 'Nouveau Client' }].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as 'subscriber' | 'new')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: activeTab === tab.key ? '2px solid #D4AF37' : '2px solid transparent', color: activeTab === tab.key ? '#D4AF37' : 'rgba(255,255,255,0.5)', fontWeight: activeTab === tab.key ? 700 : 400, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>{tab.label}</button>
            ))}
          </div>
          {activeTab === 'subscriber' ? (
            <div>
              <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input value={username} onChange={e => handleUsernameChange(e.target.value)} placeholder="Votre nom utilisateur..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${usernameStatus === 'found' ? '#00ff41' : usernameStatus === 'notfound' ? '#ff4444' : 'rgba(212,175,55,0.3)'}`, borderRadius: '12px', padding: '15px 50px 15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const }} />
                <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}>{usernameStatus === 'checking' ? '⏳' : usernameStatus === 'found' ? '✅' : usernameStatus === 'notfound' ? '❌' : ''}</span>
              </div>
              {usernameStatus === 'found' && (
                              <button style={{ width: '100%', background: GOLD, color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', marginBottom: '15px' }}>Acceder a mon espace</button>
              )}
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <button style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Google</button>
                <button style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Apple</button>
              </div>
            </div>
          ) : (
            <div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email..." type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '15px' }} />
              <button style={{ width: '100%', background: GOLD, color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem' }}>Creer mon compte</button>
            </div>
          )}
        </div>
      </motion.section>

      {/* HERO */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px', lineHeight: 1.2 }}>Bienvenue sur YourTVSat VIP</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto 40px' }}>Plateforme Premium IPTV - 14 Serveurs - 4K/8K - Test 24H Gratuit</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          {[{ n: '14', l: 'Serveurs' }, { n: '50K+', l: 'Chaines' }, { n: '99.9%', l: 'Uptime' }, { n: '24/7', l: 'Support' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#D4AF37' }}>{s.n}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CATALOGUE */}
      <section id="catalogue" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#D4AF37', textAlign: 'center', marginBottom: '20px' }}>Notre Catalogue</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[{ v: 'all', l: 'Tous' }, { v: 'eagle4k', l: 'Eagle' }, { v: 'strong8k', l: 'Strong' }, { v: 'dinovip', l: 'Dino' }, { v: 'nexon4k', l: 'Nexon' }].map(f => (
            <button key={f.v} onClick={() => setFilterServer(f.v)} style={{ padding: '8px 20px', borderRadius: '50px', border: `1px solid ${filterServer === f.v ? '#D4AF37' : 'rgba(212,175,55,0.3)'}`, background: filterServer === f.v ? 'rgba(212,175,55,0.15)' : 'transparent', color: filterServer === f.v ? '#D4AF37' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', fontWeight: filterServer === f.v ? 700 : 400 }}>{f.l}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredProducts.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ ...glass, padding: '25px', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,140,0,0.5)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,175,55,0.2)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              {product.badge && (<span style={{ position: 'absolute', top: '15px', right: '15px', background: GOLD, color: '#000', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700 }}>{product.badge}</span>)}
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#D4AF37', marginBottom: '8px' }}>{product.name}</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '15px' }}>{product.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
                {product.features.map(f => (<span key={f} style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '50px', color: '#D4AF37' }}>{f}</span>))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '15px' }}>
                {(['1m', '3m', '6m', '12m'] as const).map(d => (
                  <button key={d} onClick={() => { setSelectedProduct(product); setSelectedDuration(d); setShowSubscribeModal(true); }} style={{ padding: '8px', background: selectedProduct?.id === product.id && selectedDuration === d ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedProduct?.id === product.id && selectedDuration === d ? '#FF8C00' : 'rgba(212,175,55,0.2)'}`, borderRadius: '8px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{d === '1m' ? '1 Mois' : d === '3m' ? '3 Mois' : d === '6m' ? '6 Mois' : '12 Mois'}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FF8C00' }}>{product.prices[d]}€</div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setSelectedProduct(product); setShowSubscribeModal(true); }} style={{ flex: 2, padding: '12px', background: GOLD, color: '#000', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>Abonner</button>
                <button onClick={() => { setSelectedProduct(product); setShowTestModal(false); }} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(0,255,65,0.4)', borderRadius: '12px', color: '#00ff41', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem' }}>Test 24H</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEST 24H */}
      <section id="test-section" style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ ...glass, padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#00ff41', marginBottom: '10px' }}>Test 24H Gratuit</h2>
          <p style={{ opacity: 0.7, marginBottom: '25px' }}>1 test gratuit par IP/Email tous les 15 jours</p>
          {selectedProduct && (<div style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}><span style={{ color: '#00ff41' }}>Serveur: {selectedProduct.icon} {selectedProduct.name}</span></div>)}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email..." type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '15px' }} />
          <button onClick={handleCreateTest} disabled={isLoading} style={{ width: '100%', background: isLoading ? 'rgba(0,255,65,0.3)' : 'linear-gradient(135deg, #00ff41, #00cc33)', color: '#000', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem' }}>
            {isLoading ? 'Generation...' : 'Activer Test 24H'}
          </button>
        </div>
      </section>

      {/* MODAL TEST */}
      <AnimatePresence>
        {showTestModal && testResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} style={{ ...glass, padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', border: '1px solid rgba(0,255,65,0.3)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#00ff41', marginBottom: '20px' }}>Test 24H Active !</h2>
              <div style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
                {[{ label: 'Username', value: testResult.username }, { label: 'Password', value: testResult.password }, { label: 'M3U URL', value: testResult.m3u }, { label: 'Xtream URL', value: testResult.xtream?.url }].map(item => (
                  <div key={item.label} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {testResult.qrCode && (<img src={testResult.qrCode} alt="QR" style={{ width: '150px', height: '150px', borderRadius: '12px', marginBottom: '20px' }} />)}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { navigator.clipboard.writeText(`Username: ${testResult.username}\nPassword: ${testResult.password}\nURL: ${testResult.m3u}`); toast.success('Copie !'); }} style={{ flex: 1, padding: '12px', background: 'rgba(0,255
                          <button style={{ width: '100%', background: GOLD, color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', marginBottom: '15px' }}>Acceder a mon espace</button>
              )}
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <button style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Google</button>
                <button style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Apple</button>
              </div>
            </div>
          ) : (
            <div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email..." type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '15px' }} />
              <button style={{ width: '100%', background: GOLD, color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem' }}>Creer mon compte</button>
            </div>
          )}
        </div>
      </motion.section>

      {/* HERO */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px', lineHeight: 1.2 }}>Bienvenue sur YourTVSat VIP</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto 40px' }}>Plateforme Premium IPTV - 14 Serveurs - 4K/8K - Test 24H Gratuit</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          {[{ n: '14', l: 'Serveurs' }, { n: '50K+', l: 'Chaines' }, { n: '99.9%', l: 'Uptime' }, { n: '24/7', l: 'Support' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#D4AF37' }}>{s.n}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CATALOGUE */}
      <section id="catalogue" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#D4AF37', textAlign: 'center', marginBottom: '20px' }}>Notre Catalogue</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[{ v: 'all', l: 'Tous' }, { v: 'eagle4k', l: 'Eagle' }, { v: 'strong8k', l: 'Strong' }, { v: 'dinovip', l: 'Dino' }, { v: 'nexon4k', l: 'Nexon' }].map(f => (
            <button key={f.v} onClick={() => setFilterServer(f.v)} style={{ padding: '8px 20px', borderRadius: '50px', border: `1px solid ${filterServer === f.v ? '#D4AF37' : 'rgba(212,175,55,0.3)'}`, background: filterServer === f.v ? 'rgba(212,175,55,0.15)' : 'transparent', color: filterServer === f.v ? '#D4AF37' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', fontWeight: filterServer === f.v ? 700 : 400 }}>{f.l}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredProducts.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ ...glass, padding: '25px', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,140,0,0.5)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,175,55,0.2)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              {product.badge && (<span style={{ position: 'absolute', top: '15px', right: '15px', background: GOLD, color: '#000', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700 }}>{product.badge}</span>)}
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#D4AF37', marginBottom: '8px' }}>{product.name}</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '15px' }}>{product.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
                {product.features.map(f => (<span key={f} style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '50px', color: '#D4AF37' }}>{f}</span>))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '15px' }}>
                {(['1m', '3m', '6m', '12m'] as const).map(d => (
                  <button key={d} onClick={() => { setSelectedProduct(product); setSelectedDuration(d); setShowSubscribeModal(true); }} style={{ padding: '8px', background: selectedProduct?.id === product.id && selectedDuration === d ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedProduct?.id === product.id && selectedDuration === d ? '#FF8C00' : 'rgba(212,175,55,0.2)'}`, borderRadius: '8px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{d === '1m' ? '1 Mois' : d === '3m' ? '3 Mois' : d === '6m' ? '6 Mois' : '12 Mois'}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FF8C00' }}>{product.prices[d]}€</div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setSelectedProduct(product); setShowSubscribeModal(true); }} style={{ flex: 2, padding: '12px', background: GOLD, color: '#000', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>Abonner</button>
                <button onClick={() => { setSelectedProduct(product); setShowTestModal(false); }} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(0,255,65,0.4)', borderRadius: '12px', color: '#00ff41', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem' }}>Test 24H</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEST 24H */}
      <section id="test-section" style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ ...glass, padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#00ff41', marginBottom: '10px' }}>Test 24H Gratuit</h2>
          <p style={{ opacity: 0.7, marginBottom: '25px' }}>1 test gratuit par IP/Email tous les 15 jours</p>
          {selectedProduct && (<div style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}><span style={{ color: '#00ff41' }}>Serveur: {selectedProduct.icon} {selectedProduct.name}</span></div>)}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email..." type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '15px' }} />
          <button onClick={handleCreateTest} disabled={isLoading} style={{ width: '100%', background: isLoading ? 'rgba(0,255,65,0.3)' : 'linear-gradient(135deg, #00ff41, #00cc33)', color: '#000', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem' }}>
            {isLoading ? 'Generation...' : 'Activer Test 24H'}
          </button>
        </div>
      </section>

      {/* MODAL TEST */}
      <AnimatePresence>
        {showTestModal && testResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} style={{ ...glass, padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', border: '1px solid rgba(0,255,65,0.3)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#00ff41', marginBottom: '20px' }}>Test 24H Active !</h2>
              <div style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
                {[{ label: 'Username', value: testResult.username }, { label: 'Password', value: testResult.password }, { label: 'M3U URL', value: testResult.m3u }, { label: 'Xtream URL', value: testResult.xtream?.url }].map(item => (
                  <div key={item.label} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {testResult.qrCode && (<img src={testResult.qrCode} alt="QR" style={{ width: '150px', height: '150px', borderRadius: '12px', marginBottom: '20px' }} />)}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { navigator.clipboard.writeText(`Username: ${testResult.username}\nPassword: ${testResult.password}\nURL: ${testResult.m3u}`); toast.success('Copie !'); }} style={{ flex: 1, padding: '12px', background: 'rgba(0,255
            ,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '12px', color: '#00ff41', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Copier</button>
                <button onClick={() => setShowTestModal(false)} style={{ flex: 1, padding: '12px', background: GOLD, border: 'none', borderRadius: '12px', color: '#000', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Fermer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL SUBSCRIBE */}
      <AnimatePresence>
        {showSubscribeModal && selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} style={{ ...glass, padding: '40px', maxWidth: '500px', width: '100%' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#D4AF37', marginBottom: '5px' }}>{selectedProduct.icon} {selectedProduct.name}</h2>
              <p style={{ opacity: 0.6, marginBottom: '25px', fontSize: '0.9rem' }}>{selectedProduct.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '25px' }}>
                {(['1m', '3m', '6m', '12m'] as const).map(d => (
                  <button key={d} onClick={() => setSelectedDuration(d)} style={{ padding: '15px', background: selectedDuration === d ? 'rgba(255,140,0,0.15)' : 'rgba(255,255,255,0.03)', border: `2px solid ${selectedDuration === d ? '#FF8C00' : 'rgba(212,175,55,0.2)'}`, borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{d === '1m' ? '1 Mois' : d === '3m' ? '3 Mois' : d === '6m' ? '6 Mois' : '12 Mois'}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FF8C00' }}>{selectedProduct.prices[d]}€</div>
                  </button>
                ))}
              </div>
              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.7 }}>Abonnement {selectedDuration}</span>
                  <span style={{ color: '#FF8C00', fontWeight: 700 }}>{selectedProduct.prices[selectedDuration]}€</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.7 }}>Frais activation</span>
                  <span style={{ color: '#FF8C00', fontWeight: 700 }}>5.55€</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: '1.2rem' }}>{(selectedProduct.prices[selectedDuration] + 5.55).toFixed(2)}€</span>
                </div>
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email pour recevoir vos acces..." type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '15px' }} />
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button style={{ flex: 1, padding: '15px', background: GOLD, border: 'none', borderRadius: '12px', color: '#000', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Stripe</button>
                <button style={{ flex: 1, padding: '15px', background: 'rgba(255,140,0,0.1)', border: '1px solid #FF8C00', borderRadius: '12px', color: '#FF8C00', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Crypto</button>
              </div>
              <button onClick={() => { setShowSubscribeModal(false); setSelectedProduct(null); }} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Annuler</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LED BANNER */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '32px', background: '#000', borderTop: '1px solid #00ff41', zIndex: 999999, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div animate={{ x: [0, -2000] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 700, color: '#00ff41', lineHeight: '32px', paddingLeft: '100vw', textShadow: '0 0 5px #00ff41' }}>
          Test non disponible uniquement des abonnements Originaux &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Test non disponible uniquement des abonnements Originaux &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Test non disponible uniquement des abonnements Originaux
        </motion.div>
      </div>

    </div>
  );
                                                                                    }
