# ✅ **CODE CORRIGÉ COMPLET - app/page.tsx**

```tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// ============================================
// TYPES
// ============================================
interface Product {
  id: string;
  name: string;
  icon: string;
  server: string;
  description: string;
  prices: {
    '1m': number;
    '3m': number;
    '6m': number;
    '12m': number;
  };
  features: string[];
  badge?: string;
}

interface TestResult {
  username: string;
  password: string;
  m3u: string;
  xtream: {
    url: string;
    username: string;
    password: string;
  };
  qrCode: string;
  expiresIn: string;
}

// ============================================
// CATALOGUE 14 PRODUITS
// ============================================
const PRODUCTS: Product[] = [
  {
    id: 'eagle4k',
    name: 'Eagle 4K',
    icon: '🦅',
    server: 'eagle4k',
    description: 'Serveur Ultra HD 4K Premium',
    prices: { '1m': 12, '3m': 30, '6m': 55, '12m': 95 },
    features: ['4K Ultra HD', '10000+ Chaînes', 'VOD 50K+', 'Anti-Freeze'],
    badge: 'POPULAIRE',
  },
  {
    id: 'strong8k',
    name: 'Strong 8K',
    icon: '💪',
    server: 'strong8k',
    description: 'Qualité 8K Exceptionnelle',
    prices: { '1m': 15, '3m': 38, '6m': 68, '12m': 120 },
    features: ['8K HDR', '12000+ Chaînes', 'VOD 80K+', 'Multi-Screen'],
    badge: 'PREMIUM',
  },
  {
    id: 'dinovip',
    name: 'Dino VIP',
    icon: '🦕',
    server: 'dinovip',
    description: 'Serveur VIP Stabilité Maximale',
    prices: { '1m': 10, '3m': 25, '6m': 45, '12m': 80 },
    features: ['Full HD', '8000+ Chaînes', 'VOD 40K+', 'Stable 99.9%'],
  },
  {
    id: 'nexon4k',
    name: 'Nexon 4K',
    icon: '⚡',
    server: 'nexon4k',
    description: 'Vitesse & Performance 4K',
    prices: { '1m': 11, '3m': 28, '6m': 50, '12m': 90 },
    features: ['4K HDR', '9000+ Chaînes', 'VOD 45K+', 'Ultra-Fast'],
    badge: 'NOUVEAU',
  },
  {
    id: 'fuego',
    name: 'Fuego',
    icon: '🔥',
    server: 'fuego',
    description: 'Serveur Brûlant de Performance',
    prices: { '1m': 10, '3m': 25, '6m': 45, '12m': 80 },
    features: ['4K', '7000+ Chaînes', 'VOD 35K+', 'Rapide'],
  },
  {
    id: 'cobra',
    name: 'Cobra',
    icon: '🐍',
    server: 'cobra',
    description: 'Précision & Fiabilité',
    prices: { '1m': 10, '3m': 25, '6m': 45, '12m': 80 },
    features: ['Full HD', '7500+ Chaînes', 'VOD 38K+', 'Stable'],
  },
  {
    id: 'foxx',
    name: 'Foxx',
    icon: '🦊',
    server: 'foxx',
    description: 'Rusé & Performant',
    prices: { '1m': 9, '3m': 22, '6m': 40, '12m': 72 },
    features: ['HD', '6000+ Chaînes', 'VOD 30K+', 'Économique'],
  },
  {
    id: 'pure',
    name: 'Pure',
    icon: '💎',
    server: 'pure',
    description: 'Pureté du Signal',
    prices: { '1m': 12, '3m': 30, '6m': 55, '12m': 95 },
    features: ['4K Pure', '8500+ Chaînes', 'VOD 42K+', 'Crystal Clear'],
  },
  {
    id: 'trex',
    name: 'T-Rex',
    icon: '🦖',
    server: 'trex',
    description: 'Puissance Dinosaure',
    prices: { '1m': 11, '3m': 28, '6m': 50, '12m': 88 },
    features: ['4K', '9500+ Chaînes', 'VOD 48K+', 'Puissant'],
  },
  {
    id: 'infinity',
    name: 'Infinity',
    icon: '♾️',
    server: 'infinity',
    description: 'Contenu Illimité',
    prices: { '1m': 13, '3m': 33, '6m': 60, '12m': 105 },
    features: ['4K+', '11000+ Chaînes', 'VOD 60K+', 'Illimité'],
    badge: 'VIP',
  },
  {
    id: 'atlas',
    name: 'Atlas Pro',
    icon: '🌍',
    server: 'atlas',
    description: 'Couverture Mondiale',
    prices: { '1m': 12, '3m': 30, '6m': 55, '12m': 95 },
    features: ['4K', '10000+ Chaînes', 'Monde Entier', 'Multi-Lang'],
  },
  {
    id: 'eagle4k_ar',
    name: 'Eagle Arabic',
    icon: '🌙',
    server: 'eagle4k',
    description: 'Spécial Contenu Arabe',
    prices: { '1m': 10, '3m': 25, '6m': 45, '12m': 80 },
    features: ['HD/4K', '5000+ AR', 'Bein Sports', 'OSN+'],
  },
  {
    id: 'strong_fr',
    name: 'Strong FR',
    icon: '🇫🇷',
    server: 'strong8k',
    description: 'Spécial France Premium',
    prices: { '1m': 11, '3m': 28, '6m': 50, '12m': 88 },
    features: ['4K', 'TF1/M6/Canal+', 'Foot FR', 'Séries FR'],
  },
  {
    id: 'nexon_sport',
    name: 'Nexon Sport',
    icon: '⚽',
    server: 'nexon4k',
    description: 'Sport 24/7 Ultra HD',
    prices: { '1m': 12, '3m': 30, '6m': 55, '12m': 95 },
    features: ['4K Sport', 'beIN/Sky', 'F1/MotoGP', 'Live Events'],
    badge: 'SPORT',
  },
];

// ============================================
// STYLES COMMUNS
// ============================================
const S = {
  glass: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '24px',
  } as React.CSSProperties,

  goldGradient: 'linear-gradient(135deg, #D4AF37, #FF8C00)',

  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '12px',
    padding: '15px 20px',
    color: 'white',
    fontSize: '1rem',
    fontFamily: "'Montserrat', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  btnPrimary: {
    background: 'linear-gradient(135deg, #FF8C00, #D4AF37)',
    color: '#000',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '50px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: "'Montserrat', sans-serif",
    width: '100%',
    transition: 'all 0.3s',
  } as React.CSSProperties,
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export default function YourTVSatVIP() {

  // ---- STATES ----
  const [activeTab, setActiveTab] = useState<'subscriber' | 'new'>('subscriber');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'found' | 'notfound'
  >('idle');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<'1m' | '3m' | '6m' | '12m'>('12m');
  const [showTestModal, setShowTestModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [filterServer, setFilterServer] = useState('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- DEBOUNCE USERNAME ----
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

  // ---- CRÉER TEST 24H ----
  const handleCreateTest = async () => {
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    if (!selectedProduct) {
      toast.error('Veuillez sélectionner un serveur');
      return;
    }
    setIsLoading(true);
    try {
      let ip = '0.0.0.0';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch {
        // IP fallback
      }

      const res = await fetch('/api/create-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          server: selectedProduct.server,
          ip,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTestResult(data);
        setShowTestModal(true);
        setShowSubscribeModal(false);
        toast.success('✅ Test 24H activé !');
      } else {
        toast.error(data.error || 'Erreur API');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // ---- FILTRES ----
  const filteredProducts =
    filterServer === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.server === filterServer);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{
      background: '#050505',
      minHeight: '100vh',
      color: 'white',
      fontFamily: "'Montserrat', sans-serif",
      paddingBottom: '60px',
      position: 'relative',
      overflowX: 'hidden',
    }}>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: 'white',
            border: '1px solid #D4AF37',
          },
        }}
      />

      {/* SATELLITE BG */}
      <div style={{
        position: 'fixed', top: '10%', right: '5%',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ===== HEADER ===== */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
          position: 'sticky',
          top: 0,
          background: 'rgba(5,5,5,0.97)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '45px', height: '45px',
              borderRadius: '50%',
              background: S.goldGradient,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px',
              boxShadow: '0 0 20px rgba(212,175,55,0.5)',
              flexShrink: 0,
            }}
          >
            📡
          </motion.div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize:
