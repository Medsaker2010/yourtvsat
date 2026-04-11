'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

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

type Duration = '1m' | '3m' | '6m' | '12m';
type TabType = 'subscriber' | 'new';
type UsernameStatus = 'idle' | 'checking' | 'found' | 'notfound';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: 'eagle4k',      name: 'Eagle 4K',      icon: '🦅', server: 'eagle4k',  description: 'Serveur Ultra HD 4K Premium',          prices: { '1m': 12, '3m': 30, '6m': 55,  '12m': 95  }, features: ['4K Ultra HD', '10000+ Chaines', 'VOD 50K+', 'Anti-Freeze'],    badge: 'POPULAIRE' },
  { id: 'strong8k',     name: 'Strong 8K',     icon: '💪', server: 'strong8k', description: 'Qualité 8K Exceptionnelle',              prices: { '1m': 15, '3m': 38, '6m': 68,  '12m': 120 }, features: ['8K HDR', '12000+ Chaines', 'VOD 80K+', 'Multi-Screen'],         badge: 'PREMIUM'   },
  { id: 'dinovip',      name: 'Dino VIP',      icon: '🦕', server: 'dinovip',  description: 'Serveur VIP Stabilité Maximale',         prices: { '1m': 10, '3m': 25, '6m': 45,  '12m': 80  }, features: ['Full HD', '8000+ Chaines', 'VOD 40K+', 'Stable 99.9%']                      },
  { id: 'nexon4k',      name: 'Nexon 4K',      icon: '⚡', server: 'nexon4k',  description: 'Vitesse et Performance 4K',              prices: { '1m': 11, '3m': 28, '6m': 50,  '12m': 90  }, features: ['4K HDR', '9000+ Chaines', 'VOD 45K+', 'Ultra-Fast'],            badge: 'NOUVEAU'   },
  { id: 'fuego',        name: 'Fuego',         icon: '🔥', server: 'fuego',    description: 'Serveur Brûlant de Performance',         prices: { '1m': 10, '3m': 25, '6m': 45,  '12m': 80  }, features: ['4K', '7000+ Chaines', 'VOD 35K+', 'Rapide']                                 },
  { id: 'cobra',        name: 'Cobra',         icon: '🐍', server: 'cobra',    description: 'Précision et Fiabilité',                 prices: { '1m': 10, '3m': 25, '6m': 45,  '12m': 80  }, features: ['Full HD', '7500+ Chaines', 'VOD 38K+', 'Stable']                            },
  { id: 'foxx',         name: 'Foxx',          icon: '🦊', server: 'foxx',     description: 'Rusé et Performant',                     prices: { '1m': 9,  '3m': 22, '6m': 40,  '12m': 72  }, features: ['HD', '6000+ Chaines', 'VOD 30K+', 'Économique']                             },
  { id: 'pure',         name: 'Pure',          icon: '💎', server: 'pure',     description: 'Pureté du Signal',                       prices: { '1m': 12, '3m': 30, '6m': 55,  '12m': 95  }, features: ['4K Pure', '8500+ Chaines', 'VOD 42K+', 'Crystal Clear']                     },
  { id: 'trex',         name: 'T-Rex',         icon: '🦖', server: 'trex',     description: 'Puissance Dinosaure',                    prices: { '1m': 11, '3m': 28, '6m': 50,  '12m': 88  }, features: ['4K', '9500+ Chaines', 'VOD 48K+', 'Puissant']                               },
  { id: 'infinity',     name: 'Infinity',      icon: '♾️', server: 'infinity', description: 'Contenu Illimité',                       prices: { '1m': 13, '3m': 33, '6m': 60,  '12m': 105 }, features: ['4K+', '11000+ Chaines', 'VOD 60K+', 'Illimité'],                badge: 'VIP'       },
  { id: 'atlas',        name: 'Atlas Pro',     icon: '🌍', server: 'atlas',    description: 'Couverture Mondiale',                    prices: { '1m': 12, '3m': 30, '6m': 55,  '12m': 95  }, features: ['4K', '10000+ Chaines', 'Monde Entier', 'Multi-Lang']                         },
  { id: 'eagle4k_ar',   name: 'Eagle Arabic',  icon: '🌙', server: 'eagle4k',  description: 'Spécial Contenu Arabe',                  prices: { '1m': 10, '3m': 25, '6m': 45,  '12m': 80  }, features: ['HD/4K', '5000+ AR', 'Bein Sports', 'OSN+']                                  },
  { id: 'strong_fr',    name: 'Strong FR',     icon: '🇫🇷', server: 'strong8k', description: 'Spécial France Premium',                prices: { '1m': 11, '3m': 28, '6m': 50,  '12m': 88  }, features: ['4K', 'TF1/M6/Canal+', 'Foot FR', 'Séries FR']                               },
  { id: 'nexon_sport',  name: 'Nexon Sport',   icon: '⚽', server: 'nexon4k',  description: 'Sport 24/7 Ultra HD',                    prices: { '1m': 12, '3m': 30, '6m': 55,  '12m': 95  }, features: ['4K Sport', 'beIN/Sky', 'F1/MotoGP', 'Live Events'],             badge: 'SPORT'     },
];

const UNIQUE_SERVERS = ['all', ...Array.from(new Set(PRODUCTS.map(p => p.server)))];

const DURATION_LABELS: Record<Duration, string> = {
  '1m': '1 Mois', '3m': '3 Mois', '6m': '6 Mois', '12m': '12 Mois',
};

// ─── Styles (shared objects) ──────────────────────────────────────────────────

const glassStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '24px',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (p: Product) => void;
}

function ProductCard({ product, selected, onSelect }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(product)}
      style={{
        ...glassStyle,
        padding: '20px',
        cursor: 'pointer',
        border: selected
          ? '2px solid rgba(212,175,55,0.8)'
          : '1px solid rgba(212,175,55,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {product.badge && (
        <span style={{
          position: 'absolute', top: 12, right: 12,
          background: 'linear-gradient(135deg, #D4AF37, #FF8C00)',
          color: '#000', fontSize: '10px', fontWeight: 700,
          padding: '3px 8px', borderRadius: '8px',
        }}>
          {product.badge}
        </span>
      )}
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{product.icon}</div>
      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600, color: '#D4AF37' }}>{product.name}</h3>
      <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{product.description}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {product.features.map(f => (
          <li key={f} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '3px' }}>
            ✓ {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

interface TestModalProps {
  result: TestResult;
  onClose: () => void;
}

function TestModal({ result, onClose }: TestModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ ...glassStyle, padding: '32px', maxWidth: '480px', width: '100%' }}
      >
        <h2 style={{ margin: '0 0 20px', color: '#D4AF37', fontSize: '22px' }}>
          🎉 Test 24H Activé !
        </h2>
        <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Identifiant', value: result.username },
            { label: 'Mot de passe', value: result.password },
            { label: 'Expire dans', value: result.expiresIn },
          ].map(({ label, value }) => (
            <div key={label} style={{ ...glassStyle, padding: '12px 16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>{value}</div>
            </div>
          ))}
          <div style={{ ...glassStyle, padding: '12px 16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Lien M3U</div>
            <div style={{ fontSize: '12px', color: '#D4AF37', wordBreak: 'break-all' }}>{result.m3u}</div>
          </div>
        </div>
        {result.qrCode && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={result.qrCode} alt="QR Code" style={{ width: 120, height: 120, borderRadius: '12px' }} />
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #D4AF37, #FF8C00)',
            border: 'none', borderRadius: '12px',
            color: '#000', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
          }}
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function YourTVSatVIP() {
  // — State —
  const [activeTab, setActiveTab] = useState<TabType>('subscriber');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<Duration>('12m');
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

  // — Handlers —

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

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async () => {
    if (!newEmail || !newPassword) { toast.error('Remplissez tous les champs'); return; }
    if (!validateEmail(newEmail)) { toast.error('Email invalide'); return; }
    if (newEmail.toLowerCase() === 'support@yourtvsat.com') { toast.error('Email réservé'); return; }
    if (newPassword.length < 6) { toast.error('Mot de passe trop court (6 caractères min)'); return; }

    setIsRegistering(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const data = await res.json();
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || 'Erreur lors de l\'inscription');
      }
    } catch {
      toast.error('Erreur de connexion. Réessayez.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCreateTest = async () => {
    if (!email) { toast.error('Veuillez entrer votre email'); return; }
    if (!validateEmail(email)) { toast.error('Email invalide'); return; }
    if (!selectedProduct) { toast.error('Veuillez sélectionner un serveur'); return; }

    setIsLoading(true);
    try {
      // NOTE: L'IP doit être récupérée côté serveur dans /api/create-test
      // via req.headers['x-forwarded-for'] ou req.socket.remoteAddress
      const res = await fetch('/api/create-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, server: selectedProduct.server }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(data);
        setShowTestModal(true);
        setShowSubscribeModal(false);
        toast.success('Test 24H activé !');
      } else {
        toast.error(data.error || 'Erreur API');
      }
    } catch {
      toast.error('Erreur de connexion. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (!email) { toast.error('Entrez votre email'); return; }
    if (!validateEmail(email)) { toast.error('Email invalide'); return; }
    if (!selectedProduct) { toast.error('Sélectionnez un serveur'); return; }

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          productId: selectedProduct.id,
          duration: selectedDuration,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Erreur paiement');
      }
    } catch {
      toast.error('Erreur de connexion. Réessayez.');
    }
  };

  // — Derived state —

  const filteredProducts = filterServer === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.server === filterServer);

  const currentPrice = selectedProduct
    ? selectedProduct.prices[selectedDuration]
    : null;

  // — Render —

  return (
    <div
      style={{
        background: '#0B0C10',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Montserrat, sans-serif',
        paddingBottom: '60px',
        overflowX: 'hidden',
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1b1f',
            color: '#fff',
            border: '1px solid rgba(212,175,55,0.3)',
          },
        }}
      />

      {/* ── Header ── */}
      <header
        style={{
          textAlign: 'center',
          padding: '60px 20px 40px',
          background: 'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, transparent 100%)',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #D4AF37, #FF8C00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px',
          }}
        >
          YourTV Sat VIP
        </motion.h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', margin: 0 }}>
          Accès Premium · Qualité Cinéma · Support 24/7
        </p>
      </header>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', padding: '0 20px' }}>
        {(['subscriber', 'new'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 28px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.25s',
              background: activeTab === tab
                ? 'linear-gradient(135deg, #D4AF37, #FF8C00)'
                : 'rgba(255,255,255,0.06)',
              color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.7)',
            }}
          >
            {tab === 'subscriber' ? '🔑 Déjà abonné' : '🚀 Nouveau client'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        <AnimatePresence mode="wait">

          {/* ── Tab: Abonné existant ── */}
          {activeTab === 'subscriber' && (
            <motion.div
              key="subscriber"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div style={{ ...glassStyle, padding: '32px', maxWidth: '480px', margin: '0 auto' }}>
                <h2 style={{ margin: '0 0 20px', fontSize: '20px', color: '#D4AF37' }}>
                  Gérer mon abonnement
                </h2>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                  Votre nom d'utilisateur
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={username}
                    onChange={e => handleUsernameChange(e.target.value)}
                    placeholder="ex: john_doe"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${
                        usernameStatus === 'found' ? '#4CAF50'
                          : usernameStatus === 'notfound' ? '#f44336'
                          : 'rgba(212,175,55,0.3)'
                      }`,
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                  />
                  {usernameStatus === 'checking' && (
                    <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#D4AF37', fontSize: '18px' }}>⏳</span>
                  )}
                  {usernameStatus === 'found' && (
                    <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#4CAF50', fontSize: '18px' }}>✅</span>
                  )}
                  {usernameStatus === 'notfound' && (
                    <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#f44336', fontSize: '18px' }}>❌</span>
                  )}
                </div>
                {usernameStatus === 'found' && (
                  <p style={{ color: '#4CAF50', fontSize: '13px', marginTop: '8px' }}>✓ Compte trouvé !</p>
                )}
                {usernameStatus === 'notfound' && (
                  <p style={{ color: '#f44336', fontSize: '13px', marginTop: '8px' }}>✗ Aucun compte trouvé.</p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Tab: Nouveau client ── */}
          {activeTab === 'new' && (
            <motion.div
              key="new"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Filtres serveur */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {UNIQUE_SERVERS.map(srv => (
                  <button
                    key={srv}
                    onClick={() => setFilterServer(srv)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid rgba(212,175,55,0.3)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500,
                      transition: 'all 0.2s',
                      background: filterServer === srv ? 'rgba(212,175,55,0.2)' : 'transparent',
                      color: filterServer === srv ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {srv === 'all' ? 'Tous' : srv}
                  </button>
                ))}
              </div>

              {/* Grille produits */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    selected={selectedProduct?.id === product.id}
                    onSelect={setSelectedProduct}
                  />
                ))}
              </div>

              {/* Panneau commande */}
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ ...glassStyle, padding: '32px', maxWidth: '600px', margin: '0 auto' }}
                >
                  <h2 style={{ margin: '0 0 8px', color: '#D4AF37', fontSize: '20px' }}>
                    {selectedProduct.icon} {selectedProduct.name}
                  </h2>
                  <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                    {selectedProduct.description}
                  </p>

                  {/* Sélecteur durée */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
                    {(Object.keys(DURATION_LABELS) as Duration[]).map(d => (
                      <button
                        key={d}
                        onClick={() => setSelectedDuration(d)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: `1px solid ${selectedDuration === d ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.2)'}`,
                          cursor: 'pointer',
                          background: selectedDuration === d ? 'rgba(212,175,55,0.15)' : 'transparent',
                          color: selectedDuration === d ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                          fontWeight: selectedDuration === d ? 600 : 400,
                          fontSize: '13px',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div>{DURATION_LABELS[d]}</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                          {selectedProduct.prices[d]}€
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Email */}
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: '16px',
                    }}
                  />

                  {/* Prix total */}
                  {currentPrice && (
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '16px',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.5)',
                    }}>
                      Total : <strong style={{ color: '#D4AF37', fontSize: '20px' }}>{currentPrice}€</strong>
                      {' '}pour {DURATION_LABELS[selectedDuration]}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      onClick={handleCreateTest}
                      disabled={isLoading}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(212,175,55,0.5)',
                        background: 'transparent',
                        color: '#D4AF37',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      {isLoading ? '⏳ Chargement...' : '🎁 Test 24H Gratuit'}
                    </button>

                    <button
                      onClick={handleStripeCheckout}
                      disabled={isLoading}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #D4AF37, #FF8C00)',
                        color: '#000',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      💳 S'abonner {currentPrice ? `${currentPrice}€` : ''}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Formulaire inscription (nouveau compte) */}
              <div style={{ ...glassStyle, padding: '32px', maxWidth: '600px', margin: '32px auto 0' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '18px', color: '#D4AF37' }}>Créer un compte</h2>
                <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                  Inscrivez-vous pour gérer vos abonnements
                </p>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Email"
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '12px', color: 'white', fontSize: '15px',
                    outline: 'none', boxSizing: 'border-box', marginBottom: '12px',
                  }}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mot de passe (6 caractères min)"
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '12px', color: 'white', fontSize: '15px',
                    outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
                  }}
                />
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg, #D4AF37, #FF8C00)',
                    border: 'none', borderRadius: '12px',
                    color: '#000', fontWeight: 700, fontSize: '15px',
                    cursor: isRegistering ? 'not-allowed' : 'pointer',
                    opacity: isRegistering ? 0.6 : 1,
                  }}
                >
                  {isRegistering ? '⏳ Inscription...' : '🚀 Créer mon compte'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showTestModal && testResult && (
          <TestModal
            result={testResult}
            onClose={() => setShowTestModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
