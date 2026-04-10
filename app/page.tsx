'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
// CATALOGUE 14 PRODUITS RÉELS
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
// COMPOSANT PRINCIPAL
// ============================================
export default function YourTVSatVIP() {
  // States
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
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounce username detection
  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    setUsernameStatus('idle');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) return;
    setUsernameStatus('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-user?username=${value}`);
        const data = await res.json();
        setUsernameStatus(data.found ? 'found' : 'notfound');
      } catch {
        setUsernameStatus('notfound');
      }
    }, 600);
  }, []);

  // Générer Test 24H
  const handleCreateTest = async () => {
    if (!email || !selectedProduct) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    setIsLoading(true);
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipRes.json();
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
        toast.success('Test 24H activé !');
      } else {
        toast.error(data.error || 'Erreur API');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = filterServer === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.server === filterServer);

  return (
    <div style={{
      background: '#050505',
      minHeight: '100vh',
      color: 'white',
      fontFamily: "'Montserrat', sans-serif",
      paddingBottom: '50px',
    }}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a1a', color: 'white', border: '1px solid #D4AF37' }
      }} />

      {/* ===== SATELLITE BACKGROUND ===== */}
      <div style={{
        position: 'fixed', top: '10%', right: '5%',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite',
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
          position: 'sticky', top: 0,
          background: 'rgba(5,5,5,0.95)',
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
              background: 'linear-gradient(135deg, #D4AF37, #FF8C00)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px',
              boxShadow: '0 0 20px rgba(212,175,55,0.5)',
            }}
          >
            📡
          </motion.div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.6rem',
            background: 'linear-gradient(135deg, #D4AF37, #FF8C00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}>
            YourTVSat VIP
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {['Catalogue', 'Test 24H', 'Support'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.3s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => setActiveTab('subscriber')}
            style={{
              background: 'linear-gradient(135deg, #FF8C00, #D4AF37)',
              color: '#000', border: 'none',
              padding: '10px 25px', borderRadius: '50px',
              fontWeight: 700, cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Mon Compte
          </button>
        </nav>
      </motion.header>

      {/* ===== AUTH SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          maxWidth: '500px', margin: '40px auto',
          padding: '0 20px', position: 'relative', zIndex: 1,
        }}
