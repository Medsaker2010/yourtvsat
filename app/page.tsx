'use client';
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
interface Product { id: string; name: string; icon: string; server: string; description: string; prices: { '1m': number; '3m': number; '6m': number; '12m': number }; features: string[]; badge?: string; }
interface TestResult { username: string; password: string; m3u: string; xtream: { url: string; username: string; password: string }; qrCode: string; expiresIn: string; }
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
const [isRegistering, setIsRegistering] = useState(false);
const [email, setEmail] = useState('');
const [newEmail, setNewEmail] = useState('');
const [newPassword, setNewPassword] = useState('');
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
const res = await fetch('/api/check-user?username=' + encodeURIComponent(value));
const data = await res.json();
setUsernameStatus(data.found ? 'found' : 'notfound');
} catch { setUsernameStatus('notfound'); }
}, 600);
}, []);
const handleRegister = async () => {
if (!newEmail || !newPassword) { toast.error('Remplissez tous les champs'); return; }
if (newEmail === 'support@yourtvsat.com') { toast.error('Email reserve'); return; }
setIsRegistering(true);
try {
const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newEmail, password: newPassword }) });
const data = await res.json();
if (data.success && data.checkoutUrl) { window.location.href = data.checkoutUrl; }
else { toast.error(data.error || 'Erreur inscription'); }
} catch { toast.error('Erreur de connexion'); }
finally { setIsRegistering(false); }
};
const handleCreateTest = async () => {
if (!email) { toast.error('Veuillez entrer votre email'); return; }
if (!selectedProduct) { toast.error('Veuillez selectionner un serveur'); return; }
setIsLoading(true);
try {
let ip = '0.0.0.0';
try { const r = await fetch('https://api.ipify.org?format=json'); const d = await r.json(); ip = d.ip; } catch { /* fallback */ }
const res = await fetch('/api/create-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, server: selectedProduct.server, ip }) });
const data = await res.json();
if (data.success) { setTestResult(data); setShowTestModal(true); setShowSubscribeModal(false); toast.success('Test 24H active !'); }
else { toast.error(data.error || 'Erreur API'); }
} catch { toast.error('Erreur de connexion'); }
finally { setIsLoading(false); }
};
const handleStripeCheckout = async () => {
if (!email) { toast.error('Entrez votre email'); return; }
if (!selectedProduct) { toast.error('Selectionnez un serveur'); return; }
try {
const res = await fetch('/api/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, productId: selectedProduct.id, duration: selectedDuration }) });
const data = await res.json();
if (data.url) { window.location.href = data.url; }
else { toast.error('Erreur paiement'); }
} catch { toast.error('Erreur de connexion'); }
};
const filteredProducts = filterServer === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.server === filterServer);
return (
<div style={{ background: '#0B0C10', minHeight: '100vh', color: 'white', fontFamily: 'Montserrat, sans-serif', paddingBottom: '60px', overflowX: 'hidden' }}>
<Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: 'white', border: '1px solid #D4AF37' } }} />
<style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(212,175,55,0.3); } 50% { box-shadow: 0 0 40px rgba(212,175,55,0.8); } } @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } } input::placeholder { color: rgba(255,255,255,0.3); } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0B0C10; } ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 3px; }`}</style>
<div style={{ position: 'fixed', top: '20%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'float 6s ease-in-out infinite' }} />
<motion.header initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.15)', position: 'sticky', top: 0, background: 'rgba(11,12,16,0.97)', backdropFilter: 'blur(20px)', zIndex: 1000 }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
<motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ width: '48px', height: '48px', borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📡</motion.div>
<div>
<span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700, display: 'block' }}>YourTVSat VIP</span>
<span style={{ fontSize: '0.7rem', color: 'rgba(212,175,55,0.6)', letterSpacing: '3px' }}>PREMIUM IPTV</span>
</div>
</div>
<nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
{['Catalogue', 'Test 24H', 'Support'].map(item => (<a key={item} href={'#' + item.toLowerCase()} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>{item}</a>))}
<button onClick={() => setActiveTab('subscriber')} style={{ background: GOLD, color: '#000', border: 'none', padding: '10px 25px', borderRadius: '50px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Mon Compte</button>
</nav>
</motion.header>
<motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 1 }}><div style={{ ...glass, padding: '35px' }}>
<div style={{ display: 'flex', marginBottom: '25px', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
{[{ key: 'subscriber', label: '🔑 Deja Abonne' }, { key: 'new', label: '✨ Nouveau Client' }].map(tab => (
<button key={tab.key} onClick={() => setActiveTab(tab.key as 'subscriber' | 'new')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: activeTab === tab.key ? '2px solid #D4AF37' : '2px solid transparent', color: activeTab === tab.key ? '#D4AF37' : 'rgba(255,255,255,0.5)', fontWeight: activeTab === tab.key ? 700 : 400, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>{tab.label}</button>
))}
</div>
{activeTab === 'subscriber' ? (
<div>
<div style={{ position: 'relative', marginBottom: '15px' }}>
<input value={username} onChange={e => handleUsernameChange(e.target.value)} placeholder="Votre nom utilisateur..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + (usernameStatus === 'found' ? '#00ff41' : usernameStatus === 'notfound' ? '#ff4444' : 'rgba(212,175,55,0.3)'), borderRadius: '12px', padding: '15px 50px 15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const }} />
<span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>{usernameStatus === 'checking' ? '⏳' : usernameStatus === 'found' ? '✅' : usernameStatus === 'notfound' ? '❌' : '🔍'}</span>
</div>
{usernameStatus === 'found' && (<button style={{ width: '100%', background: GOLD, color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', marginBottom: '15px' }}>🔓 Acceder a mon espace</button>)}
<div style={{ textAlign: 'center', margin: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>— ou continuer avec —</div>
<div style={{ display: 'flex', gap: '12px' }}>
<button style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
Google
</button>
<button style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
Apple
</button>
</div>
</div>
) : (
<div>
<input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Votre email..." type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '12px' }} />
<input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mot de passe..." type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '15px' }} />
<button onClick={handleRegister} disabled={isRegistering} style={{ width: '100%', background: isRegistering ? 'rgba(212,175,55,0.3)' : GOLD, color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, cursor: isRegistering ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', marginBottom: '12px' }}>{isRegistering ? 'Redirection Stripe...' : 'Creer mon compte'}</button>
<p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Paiement securise via Stripe.</p>
</div>
)}
</div>
</motion.section>
<motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
<h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px', lineHeight: 1.2 }}>Bienvenue sur YourTVSat VIP</h1>
<p style={{ fontSize: '1.1rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto 50px' }}>Plateforme Premium IPTV - 14 Serveurs - 4K/8K - Test 24H Gratuit</p>
<div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
{[{ n: '14', l: 'Serveurs' }, { n: '50K+', l: 'Chaines' }, { n: '99.9%', l: 'Uptime' }, { n: '24/7', l: 'Support' }].map(s => (
<div key={s.l} style={{ textAlign: 'center' }}>
<div style={{ fontSize: '2.5rem', fontWeight: 900, background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
<div style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '5px', letterSpacing: '2px' }}>{s.l}</div>
</div>
))}
</div>
</motion.section>
<section id="catalogue" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
<h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', marginBottom: '10px' }}>Notre Catalogue</h2>
<p style={{ textAlign: 'center', opacity: 0.5, marginBottom: '30px', fontSize: '0.9rem' }}>14 serveurs premium disponibles</p>
<div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
{[{ v: 'all', l: 'Tous' }, { v: 'eagle4k', l: '🦅 Eagle' }, { v: 'strong8k', l: '💪 Strong' }, { v: 'dinovip', l: '🦕 Dino' }, { v: 'nexon4k', l: '⚡ Nexon' }].map(f => (
<button key={f.v} onClick={() => setFilterServer(f.v)} style={{ padding: '8px 20px', borderRadius: '50px', border: '1px solid ' + (filterServer === f.v ? '#D4AF37' : 'rgba(212,175,55,0.3)'), background: filterServer === f.v ? 'rgba(212,175,55,0.15)' : 'transparent', color: filterServer === f.v ? '#D4AF37' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', fontWeight: filterServer === f.v ? 700 : 400 }}>{f.l}</button>
))}
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
{filteredProducts.map((product, i) => (
<motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ ...glass, padding: '25px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,140,0,0.6)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(212,175,55,0.1)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,175,55,0.2)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
{product.badge && (<span style={{ position: 'absolute', top: '15px', right: '15px', background: GOLD, color: '#000', padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px' }}>{product.badge}</span>)}
<div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{product.icon}</div>
<h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>{product.name}</h3>
<p style={{ fontSize: '0.82rem', opacity: 0.5, marginBottom: '15px', lineHeight: 1.5 }}>{product.description}</p>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px' }}>
{product.features.map(f => (<span key={f} style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '50px', color: '#D4AF37' }}>{f}</span>))}
</div>
<div style={{ display: 'grid', grid<div style={{ ...glass, padding: '35px' }}>
<div style={{ display: 'flex', marginBottom: '25px', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
{[{ key: 'subscriber', label: '🔑 Deja Abonne' }, { key: 'new', label: '✨ Nouveau Client' }].map(tab => (
<button key={tab.key} onClick={() => setActiveTab(tab.key as 'subscriber' | 'new')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: activeTab === tab.key ? '2px solid #D4AF37' : '2px solid transparent', color: activeTab === tab.key ? '#D4AF37' : 'rgba(255,255,255,0.5)', fontWeight: activeTab === tab.key ? 700 : 400, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>{tab.label}</button>
))}
</div>
{activeTab === 'subscriber' ? (
<div>
<div style={{ position: 'relative', marginBottom: '15px' }}>
<input value={username} onChange={e => handleUsernameChange(e.target.value)} placeholder="Votre nom utilisateur..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + (usernameStatus === 'found' ? '#00ff41' : usernameStatus === 'notfound' ? '#ff4444' : 'rgba(212,175,55,0.3)'), borderRadius: '12px', padding: '15px 50px 15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const }} />
<span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>{usernameStatus === 'checking' ? '⏳' : usernameStatus === 'found' ? '✅' : usernameStatus === 'notfound' ? '❌' : '🔍'}</span>
</div>
{usernameStatus === 'found' && (<button style={{ width: '100%', background: GOLD, color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', marginBottom: '15px' }}>🔓 Acceder a mon espace</button>)}
<div style={{ textAlign: 'center', margin: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>— ou continuer avec —</div>
<div style={{ display: 'flex', gap: '12px' }}>
<button style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
Google
</button>
<button style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
Apple
</button>
</div>
</div>
) : (
<div>
<input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Votre email..." type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '12px' }} />
<input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mot de passe..." type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '15px 20px', color: 'white', fontSize: '1rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '15px' }} />
<button onClick={handleRegister} disabled={isRegistering} style={{ width: '100%', background: isRegistering ? 'rgba(212,175,55,0.3)' : GOLD, color: '#000', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, cursor: isRegistering ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', marginBottom: '12px' }}>{isRegistering ? 'Redirection Stripe...' : 'Creer mon compte'}</button>
<p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Paiement securise via Stripe.</p>
</div>
)}
</div>
</motion.section>
<motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
<h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px', lineHeight: 1.2 }}>Bienvenue sur YourTVSat VIP</h1>
<p style={{ fontSize: '1.1rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto 50px' }}>Plateforme Premium IPTV - 14 Serveurs - 4K/8K - Test 24H Gratuit</p>
<div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
{[{ n: '14', l: 'Serveurs' }, { n: '50K+', l: 'Chaines' }, { n: '99.9%', l: 'Uptime' }, { n: '24/7', l: 'Support' }].map(s => (
<div key={s.l} style={{ textAlign: 'center' }}>
<div style={{ fontSize: '2.5rem', fontWeight: 900, background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
<div style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '5px', letterSpacing: '2px' }}>{s.l}</div>
</div>
))}
</div>
</motion.section>
<section id="catalogue" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
<h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', marginBottom: '10px' }}>Notre Catalogue</h2>
<p style={{ textAlign: 'center', opacity: 0.5, marginBottom: '30px', fontSize: '0.9rem' }}>14 serveurs premium disponibles</p>
<div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
{[{ v: 'all', l: 'Tous' }, { v: 'eagle4k', l: '🦅 Eagle' }, { v: 'strong8k', l: '💪 Strong' }, { v: 'dinovip', l: '🦕 Dino' }, { v: 'nexon4k', l: '⚡ Nexon' }].map(f => (
<button key={f.v} onClick={() => setFilterServer(f.v)} style={{ padding: '8px 20px', borderRadius: '50px', border: '1px solid ' + (filterServer === f.v ? '#D4AF37' : 'rgba(212,175,55,0.3)'), background: filterServer === f.v ? 'rgba(212,175,55,0.15)' : 'transparent', color: filterServer === f.v ? '#D4AF37' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', fontWeight: filterServer === f.v ? 700 : 400 }}>{f.l}</button>
))}
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
{filteredProducts.map((product, i) => (
<motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ ...glass, padding: '25px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,140,0,0.6)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(212,175,55,0.1)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,175,55,0.2)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
{product.badge && (<span style={{ position: 'absolute', top: '15px', right: '15px', background: GOLD, color: '#000', padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px' }}>{product.badge}</span>)}
<div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{product.icon}</div>
<h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>{product.name}</h3>
<p style={{ fontSize: '0.82rem', opacity: 0.5, marginBottom: '15px', lineHeight: 1.5 }}>{product.description}</p>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px' }}>
{product.features.map(f => (<span key={f} style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '50px', color: '#D4AF37' }}>{f}</span>))}
</div>
<div style={{ display: 'grid', grid
