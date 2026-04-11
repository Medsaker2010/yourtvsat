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
      } catch { 
        setUsernameStatus('notfound'); 
      }
    }, 600);
  }, []);

  const handleRegister = async () => {
    if (!newEmail || !newPassword) { toast.error('Remplissez tous les champs'); return; }
    if (newEmail === 'support@yourtvsat.com') { toast.error('Email reserve'); return; }
    setIsRegistering(true);
    try {
      const res = await fetch('/api/register', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email: newEmail, password: newPassword }) 
      });
      const data = await res.json();
      if (data.success && data.checkoutUrl) { 
        window.location.href = data.checkoutUrl; 
      } else { 
        toast.error(data.error || 'Erreur inscription'); 
      }
    } catch { 
      toast.error('Erreur de connexion'); 
    } finally { 
      setIsRegistering(false); 
    }
  };

  const handleCreateTest = async () => {
    if (!email) { toast.error('Veuillez entrer votre email'); return; }
    if (!selectedProduct) { toast.error('Veuillez selectionner un serveur'); return; }
    setIsLoading(true);
    try {
      let ip = '0.0.0.0';
      try { 
        const r = await fetch('https://ipify.org'); 
        const d = await r.json(); 
        ip = d.ip; 
      } catch { /* fallback */ }
      
      const res = await fetch('/api/create-test', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, server: selectedProduct.server, ip }) 
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

  const handleStripeCheckout = async () => {
    if (!email) { toast.error('Entrez votre email'); return; }
    if (!selectedProduct) { toast.error('Selectionnez un serveur'); return; }
    try {
      const res = await fetch('/api/create-checkout', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, productId: selectedProduct.id, duration: selectedDuration }) 
      });
      const data = await res.json();
      if (data.url) { 
        window.location.href = data.url; 
      } else { 
        toast.error('Erreur paiement'); 
      }
    } catch { 
      toast.error('Erreur de connexion'); 
    }
  };

  const filteredProducts = filterServer === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.server === filterServer);

  return (
    <div style={{ background: '#0B0C10', minHeight: '100vh', color: 'white', fontFamily: 'Montserrat, sans-serif', paddingBottom: '60px', overflowX: 'hidden' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1F2833', color: '#fff' } }} />
      
      {/* Barre de navigation dynamique (Ligne 175 réparée) */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.15)', position: 'sticky', top: 0, background: 'rgba(11,12,16,0.97)', backdropFilter: 'blur(20px)', zIndex: 1000 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ width: '48px', height: '48px', borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📡</motion.div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>YOUR TV SAT VIP</h1>
            <span style={{ fontSize: '0.8rem', color: '#C5C6C7' }}>Portail Premium</span>
          </div>
        </div>
      </motion.nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Onglets */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
          <button 
            onClick={() => setActiveTab('subscriber')}
            style={{ padding: '12px 30px', borderRadius: '30px', border: 'none', cursor: 'pointer', background: activeTab === 'subscriber' ? GOLD : 'rgba(255,255,255,0.05)', color: activeTab === 'subscriber' ? '#000' : '#fff', fontWeight: 'bold', transition: 'all 0.3s' }}
          >
            Déjà Abonné
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            style={{ padding: '12px 30px', borderRadius: '30px', border: 'none', cursor: 'pointer', background: activeTab === 'new' ? GOLD : 'rgba(255,255,255,0.05)', color: activeTab === 'new' ? '#000' : '#fff', fontWeight: 'bold', transition: 'all 0.3s' }}
          >
            Nouveau Client
          </button>
        </div>

        {/* Contenu dynamique par onglet */}
        <div style={{ ...glass, padding: '30px', marginBottom: '50px' }}>
          {activeTab === 'subscriber' ? (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '15px' }}>Vérifier le statut de mon compte</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
                <input 
                  type="text" 
                  placeholder="Entrez votre nom d'utilisateur" 
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  style={{ flex: 1, padding: '12px 20px', borderRadius: '10px', border: '1px solid #45A29E', background: '#1F2833', color: '#fff' }}
                />
              </div>
              <p style={{ marginTop: '10px', color: '#45A29E' }}>
                {usernameStatus === 'checking' && 'Recherche en cours...'}
                {usernameStatus === 'found' && '✅ Utilisateur trouvé !'}
                {usernameStatus === 'notfound' && '❌ Utilisateur non trouvé.'}
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '15px' }}>Créer un nouveau compte</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
                <input type="email" placeholder="Votre Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #45A29E', background: '#1F2833', color: '#fff' }} />
                <input type="password" placeholder="Mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #45A29E', background: '#1F2833', color: '#fff' }} />
                <button onClick={handleRegister} disabled={isRegistering} style={{ padding: '12px', borderRadius: '10px', border: 'none', background: GOLD, color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isRegistering ? 'Inscription...' : "S'inscrire"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filtre Serveur */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem' }}>Nos Offres Serveurs</h2>
          <select 
            value={filterServer}
            onChange={(e) => setFilterServer(e.target.value)}
            style={{ padding: '10px 20px', borderRadius: '10px', background: '#1F2833', color: '#fff', border: '1px solid #45A29E' }}
          >
            <option value="all">Tous les serveurs</option>
            <option value="eagle4k">Eagle 4K</option>
            <option value="strong8k">Strong 8K</option>
            <option value="dinovip">Dino VIP</option>
            <option value="nexon4k">Nexon 4K</option>
          </select>
        </div>

        {/* Grille de Produits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ scale: 1.03 }}
              style={{ ...glass, padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
            >
              {product.badge && (
                <div style={{ position: 'absolute', top: '15px', right: '-30px', background: GOLD, color: '#000', fontWeight: 'bold', fontSize: '0.7rem', padding: '5px 30px', transform: 'rotate(45deg)' }}>
                  {product.badge}
                </div>
              )}
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.icon}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{product.name}</h3>
                <p style={{ color: '#C5C6C7', fontSize: '0.9rem', marginBottom: '15px' }}>{product.description}</p>
                
                <ul style={{ paddingLeft: '20px', color: '#45A29E', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {product.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
                  {product.prices['12m']}€ <span style={{ fontSize: '0.9rem', color: '#C5C6C7' }}>/ an</span>
                </div>
                
                <button 
                  onClick={() => { setSelectedProduct(product); setShowSubscribeModal(true); }}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Sélectionner
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal d'Abonnement */}
      <AnimatePresence>
        {showSubscribeModal && selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ ...glass, background: '#0B0C10', padding: '40px', maxWidth: '500px', width: '90%', position: 'relative' }}
            >
              <button onClick={() => setShowSubscribeModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
              
              <h2 style={{ marginBottom: '10px' }}>S'abonner à {selectedProduct.name}</h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #45A29E', background: '#1F2833', color: '#fff' }} />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>Durée</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {(['1m', '3m', '6m', '12m'] as const).map((dur) => (
                    <button 
                      key={dur}
                      onClick={() => setSelectedDuration(dur)}
                      style={{ padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: selectedDuration === dur ? GOLD : '#1F2833', color: selectedDuration === dur ? '#000' : '#fff', fontWeight: 'bold' }}
                    >
                      {dur} ({selectedProduct.prices[dur]}€)
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={handleCreateTest} disabled={isLoading} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #45A29E', background: 'transparent', color: '#45A29E', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isLoading ? 'Génération...' : 'Tester 24H'}
                </button>
                <button onClick={handleStripeCheckout} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: GOLD, color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
                  Acheter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Résultat Test 24H */}
      <AnimatePresence>
        {showTestModal && testResult && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001 }}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} e
