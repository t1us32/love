import React, { useState, useEffect, useCallback } from 'react';

const PHRASES = [
  "Люблю тебя!",
  "Ты мое солнышко!",
  "Ты самая лучшая!",
  "самая красивая!",
  "милашка!",
  "красивые глазки!",
  "лучик света!",
  "сладкая!",
  "обнимашки!",
  "целовашки!",
  "люблю тебя!",
  "ты самая лучшая!"
];

const Atmosphere = () => {
  return (
    <div className="atmosphere">
      {/* Background Clouds */}
      <div className="cloud" style={{ top: '5%', left: '-10%', '--drift-dur': '45s' }}>
        <svg viewBox="0 0 32 16" width="100%" height="100%"><path d="M8 4h16v8H8V4zm-4 4h4v4H4V8zm24 0h4v4h-4V8z" fill="#fff" opacity="0.3" /></svg>
      </div>
      <div className="cloud" style={{ top: '15%', left: '20%', '--drift-dur': '65s' }}>
        <svg viewBox="0 0 48 24" width="100%" height="100%"><path d="M12 4h24v12H12V4zm-8 8h8v8H4v-8zm36 0h8v8h-8v-8z" fill="#fff" opacity="0.2" /></svg>
      </div>
      <div className="cloud" style={{ top: '8%', left: '70%', '--drift-dur': '50s' }}>
        <svg viewBox="0 0 32 16" width="100%" height="100%"><path d="M8 4h16v8H8V4zm-4 4h4v4H4V8zm24 0h4v4h-4V8z" fill="#fff" opacity="0.4" /></svg>
      </div>

      {/* Floating Cupids */}
      <div className="cupid" style={{ top: '12%', left: '15%', '--float-dur': '7s' }}>
        <svg viewBox="0 0 16 16" width="100%" height="100%">
          <path d="M6 6h4v4H6V6z" fill="#ffdbac" /> {/* Skin */}
          <path d="M6 5h4v1H6V5z" fill="#ffd700" /> {/* Hair */}
          <path d="M4 6h2v2H4V6zm6 0h2v2h-2V6z" fill="#fff" /> {/* Wings */}
          <path d="M10 8h4v1h-4V8zm2-1h1v3h-1V7z" fill="#835c3b" /> {/* Bow */}
        </svg>
      </div>
      <div className="cupid" style={{ top: '10%', right: '20%', '--float-dur': '9s', transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 16 16" width="100%" height="100%">
          <path d="M6 6h4v4H6V6z" fill="#ffdbac" />
          <path d="M6 5h4v1H6V5z" fill="#ffd700" />
          <path d="M4 6h2v2H4V6zm6 0h2v2h-2V6z" fill="#fff" />
          <path d="M10 8h4v1h-4V8zm2-1h1v3h-1V7z" fill="#835c3b" />
        </svg>
      </div>
    </div>
  );
};

const HEART_TYPES = {
  NORMAL: { id: 'normal', color: '#ff1493', xp: 10, bonus: 0, weight: 70, class: 'heart-normal' },
  GOLD: { id: 'gold', color: '#ffd700', xp: 50, bonus: 10, weight: 20, class: 'heart-gold' },
  BLACK: { id: 'black', color: '#333', xp: 5, bonus: -5, weight: 7, class: 'heart-black' },
  STAR: { id: 'star', color: '#00ffff', xp: 100, bonus: 5, weight: 3, class: 'heart-star' }
};

const CAT_TIERS = [
  { id: 'standard', name: 'ЗВИЧАЙНИЙ КІТ', luck: 0.6, cost: 30, color: '#fbc02d', class: 'cat-yellow', idleRate: 1, icon: '🐈' },
  { id: 'ginger', name: 'РУДИЙ КІТ', luck: 0.8, cost: 150, color: '#e67e22', class: 'cat-ginger', idleRate: 5, icon: '🍊' },
  { id: 'void', name: 'ЧОРНИЙ КІТ', luck: 0.95, cost: 500, color: '#2c3e50', class: 'cat-void', idleRate: 15, icon: '🐈‍⬛' },
  { id: 'cosmic', name: 'КОСМІЧНИЙ КІТ', luck: 1.1, cost: 1500, color: '#9b59b6', class: 'cat-cosmic', idleRate: 50, icon: '🌌' },
  { id: 'angel', name: 'АНГЕЛЬСЬКИЙ КІТ', luck: 1.3, cost: 5000, color: '#fff', class: 'cat-angel', idleRate: 150, icon: '👼' },
  { id: 'devil', name: 'ДЕМОНІЧНИЙ КІТ', luck: 1.6, cost: 15000, color: '#ff0000', class: 'cat-devil', idleRate: 500, icon: '😈' },
  { id: 'hacker', name: 'ХАКЕРСЬКИЙ КІТ', luck: 2.0, cost: 50000, color: '#00ff00', class: 'cat-hacker', idleRate: 2000, icon: '💻' },
  { id: 'god', name: 'БОЖЕСТВЕННИЙ КІТ', luck: 5.0, cost: 200000, color: '#ffd700', class: 'cat-god', idleRate: 10000, icon: '👑' }
];

const THEMES = [
  { id: 'default', name: 'РОЖЕВИЙ', cost: 0, gradient: 'linear-gradient(135deg, #ffc1e3 0%, #ff85a2 100%)' },
  { id: 'night', name: 'НІЧ', cost: 200, gradient: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)' },
  { id: 'forest', name: 'ЛІС', cost: 300, gradient: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)' },
  { id: 'cosmos', name: 'КОСМОС', cost: 500, gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }
];

const GALLERY = [
  { id: 'cat_garden', name: 'Сад котиків', cost: 75, src: '/gallery/cat_garden.png' },
  { id: 'photo_1', name: 'Фото 1', cost: 120, src: '/gallery/photo_1_2026-03-08_00-28-38.jpg' },
  { id: 'photo_2', name: 'Фото 2', cost: 160, src: '/gallery/photo_2_2026-03-08_00-29-27.jpg' },
  { id: 'photo_3', name: 'Фото 3', cost: 200, src: '/gallery/photo_3_2026-03-08_00-29-27.jpg' },
  { id: 'photo_4', name: 'Фото 4', cost: 240, src: '/gallery/photo_4_2026-03-08_00-29-27.jpg' },
  { id: 'photo_5', name: 'Фото 5', cost: 280, src: '/gallery/photo_5_2026-03-08_00-29-27.jpg' },
  { id: 'photo_6', name: 'Фото 6', cost: 320, src: '/gallery/photo_6_2026-03-08_00-29-27.jpg' },
  { id: 'photo_7', name: 'Фото 7', cost: 360, src: '/gallery/photo_7_2026-03-08_00-29-27.jpg' },
  { id: 'photo_8', name: 'Фото 8', cost: 400, src: '/gallery/photo_8_2026-03-08_00-29-27.jpg' },
  { id: 'photo_9', name: 'Фото 9', cost: 440, src: '/gallery/photo_9_2026-03-08_00-29-27.jpg' },
];

// Retro sound generator
const triggerHaptic = (enabled) => {
  if (enabled && navigator.vibrate) {
    navigator.vibrate(50);
  }
};

const Heart = ({ id, x, type, speed, onRemove, isPaused }) => {
  return (
    <div
      className={`heart-container falling ${type.class}`}
      style={{
        left: `${x}%`,
        animationDuration: `${speed}s`,
      }}
      onClick={(e) => onRemove(id, e.clientX, e.clientY, type)}
    >
      <div className="heart" style={{ filter: type.id === 'black' ? 'grayscale(1) brightness(0.5)' : (type.id === 'gold' ? 'hue-rotate(45deg) brightness(1.5)' : (type.id === 'star' ? 'hue-rotate(180deg) brightness(1.2)' : 'none')) }} />
    </div>
  );
};

const Phrase = ({ text, x, y }) => {
  return (
    <div
      className="phrase"
      style={{
        left: x,
        top: y,
      }}
    >
      {text}
    </div>
  );
};

// Music Engine (Arpeggio loop)
let bgmInterval = null;
const playBGM = (ctx, enabled) => {
  if (!enabled) {
    if (bgmInterval) clearInterval(bgmInterval);
    return;
  }
  if (bgmInterval) return;

  const notes = [261.63, 293.66, 329.63, 392.00, 440.00]; // C4 D4 E4 G4 A4
  let step = 0;

  bgmInterval = setInterval(() => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    step++;
  }, 250);
};

function App() {
  const [hearts, setHearts] = useState([]);
  const [activePhrases, setActivePhrases] = useState([]);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [hasCat, setHasCat] = useState(false);
  const [catTier, setCatTier] = useState(0);
  const [catX, setCatX] = useState(50);
  const [catFlip, setCatFlip] = useState(1); // 1 = right, -1 = left
  const [isCatCatching, setIsCatCatching] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'gallery', 'leaderboard', 'achievements'
  const [currentTheme, setCurrentTheme] = useState('default');
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [frenzyTimer, setFrenzyTimer] = useState(0);
  const [offlineReward, setOfflineReward] = useState(null);

  // Telegram User
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const username = tgUser?.username || tgUser?.first_name || 'Player';

  // Persistence Key
  const SAVE_KEY = `heart_drop_save_${tgUser?.id || 'guest'}`;

  // Upgrades state
  const [spawnLevel, setSpawnLevel] = useState(0);
  const [speedLevel, setSpeedLevel] = useState(0);
  const [clickLevel, setClickLevel] = useState(0);
  const [catEarnLevel, setCatEarnLevel] = useState(0);
  const [luckLevel, setLuckLevel] = useState(0);
  const [doubleLevel, setDoubleLevel] = useState(0);
  const [critLevel, setCritLevel] = useState(0);

  // Gameplay state
  const [combo, setCombo] = useState(0);
  const [lastCatchTime, setLastCatchTime] = useState(0);
  const [scorePopups, setScorePopups] = useState([]);

  // Shop state
  const [shopCategory, setShopCategory] = useState('boosts'); // 'boosts', 'cats', 'locales', 'gallery'

  // Gallery state
  const [unlockedPhotos, setUnlockedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Load Game
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setScore(data.score || 0);
      setXp(data.xp || 0);
      setLevel(data.level || 1);
      setHasCat(data.hasCat || false);
      setCatTier(data.catTier || 0);
      setSpawnLevel(data.spawnLevel || 0);
      setSpeedLevel(data.speedLevel || 0);
      setClickLevel(data.clickLevel || 0);
      setCatEarnLevel(data.catEarnLevel || 0);
      setLuckLevel(data.luckLevel || 0);
      setDoubleLevel(data.doubleLevel || 0);
      setCritLevel(data.critLevel || 0);
      setUnlockedPhotos(data.unlockedPhotos || []);
      setUnlockedThemes(data.unlockedThemes || ['default']);
      setCurrentTheme(data.currentTheme || 'default');

      // Idle Rewards Logic
      if (data.lastSaveTime && data.hasCat) {
        const secondsAway = Math.floor((Date.now() - data.lastSaveTime) / 1000);
        if (secondsAway > 60) { // More than 1 minute
          const currentCat = CAT_TIERS[data.catTier || 0];
          const rate = currentCat.idleRate * (1 + (data.catEarnLevel || 0) * 0.5);
          const earned = Math.min(1000000, Math.floor(secondsAway * rate / 60)); // Max 1M hearts, earned per minute
          if (earned > 0) {
            setOfflineReward(earned);
            setScore(prev => prev + earned);
          }
        }
      }
    }
  }, []);

  // Save Game
  useEffect(() => {
    const data = {
      score,
      xp,
      level,
      hasCat,
      catTier,
      spawnLevel,
      speedLevel,
      clickLevel,
      catEarnLevel,
      luckLevel,
      doubleLevel,
      critLevel,
      unlockedPhotos,
      unlockedThemes,
      currentTheme,
      lastSaveTime: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [score, xp, level, hasCat, catTier, spawnLevel, speedLevel, clickLevel, catEarnLevel, luckLevel, doubleLevel, critLevel, unlockedPhotos, unlockedThemes, currentTheme]);

  // Audio Context Ref
  const audioCtxRef = React.useRef(null);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    if (frenzyTimer > 0) {
      const timer = setInterval(() => setFrenzyTimer(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [frenzyTimer]);

  const spawnInterval = Math.max(40, 1000 - spawnLevel * 100);
  const baseSpeed = 6 - speedLevel * 0.7;

  const spawnHeart = useCallback(() => {
    const doSpawn = (offsetX = 0) => {
      // Determine type with luck
      const luckBonus = luckLevel * 2;
      const roll = Math.random() * 100;
      let accumulated = 0;
      let type = HEART_TYPES.NORMAL;

      // Temporary copy to adjust weights for luck
      const weights = {
        NORMAL: Math.max(10, HEART_TYPES.NORMAL.weight - luckBonus * 2),
        GOLD: HEART_TYPES.GOLD.weight + luckBonus,
        BLACK: Math.max(0, HEART_TYPES.BLACK.weight - luckBonus * 0.5),
        STAR: HEART_TYPES.STAR.weight + luckBonus * 0.5
      };

      const totalWeight = weights.NORMAL + weights.GOLD + weights.BLACK + weights.STAR;
      const scaledRoll = (roll / 100) * totalWeight;

      if (scaledRoll <= weights.NORMAL) type = HEART_TYPES.NORMAL;
      else if (scaledRoll <= weights.NORMAL + weights.GOLD) type = HEART_TYPES.GOLD;
      else if (scaledRoll <= weights.NORMAL + weights.GOLD + weights.BLACK) type = HEART_TYPES.BLACK;
      else type = HEART_TYPES.STAR;

      const id = Math.random().toString(36).substr(2, 9);
      const x = Math.max(5, Math.min(95, 5 + Math.random() * 85 + offsetX));
      let speed = baseSpeed + Math.random() * 3;
      if (frenzyTimer > 0) speed *= 0.5;

      setHearts((prev) => [...prev, { id, x, type, speed, startTime: Date.now() }]);
    };

    doSpawn();
    if (Math.random() < doubleLevel * 0.1) {
      setTimeout(() => doSpawn(Math.random() > 0.5 ? 10 : -10), 100);
    }
  }, [baseSpeed, frenzyTimer, luckLevel, doubleLevel]);

  useEffect(() => {
    const interval = setInterval(spawnHeart, spawnInterval);
    return () => clearInterval(interval);
  }, [spawnHeart, spawnInterval]);

  const addPhrase = useCallback((text, x, y) => {
    const phraseId = Math.random().toString(36).substr(2, 9);
    setActivePhrases((prev) => [...prev, { id: phraseId, text, x: x - 40, y: y - 20 }]);
    setTimeout(() => {
      setActivePhrases((prev) => prev.filter((p) => p.id !== phraseId));
    }, 1500);
  }, []);

  // Audio Logic
  const playSound = useCallback((type) => {
    if (!isSoundEnabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'catch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'miss') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'buy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  }, [isSoundEnabled]);

  const triggerHapticFeedback = useCallback(() => {
    if (isSoundEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [isSoundEnabled]);
  const handleHeartClick = useCallback((id, x, y, type) => {
    const now = Date.now();
    const isCrit = Math.random() < critLevel * 0.05;
    const frenzyMult = frenzyTimer > 0 ? 2 : 1;
    const comboMult = 1 + Math.floor(combo / 5) * 0.2;

    // Update combo
    if (now - lastCatchTime < 2000) {
      setCombo(c => c + 1);
    } else {
      setCombo(1);
    }
    setLastCatchTime(now);

    const baseReward = (type.bonus + (type.id === 'normal' ? clickLevel : 0) + 1);
    const totalReward = Math.floor(baseReward * frenzyMult * (isCrit ? 5 : 1));

    setScore((prev) => Math.max(0, prev + totalReward));

    // XP Logic
    setXp((prev) => {
      const nextXp = prev + Math.floor(type.xp * comboMult);
      const xpToLevel = level * 100;
      if (nextXp >= xpToLevel) {
        setLevel(l => l + 1);
        addPhrase("LEVEL UP!", x, y);
        playSound('buy');
        return nextXp - xpToLevel;
      }
      return nextXp;
    });

    if (isCrit) addPhrase("CRITICAL! x5", x, y);
    if (combo > 5 && combo % 5 === 0) addPhrase(`COMBO x${combo}!`, x, y);

    if (type.id === 'star') {
      setFrenzyTimer(10);
      addPhrase("FRENZY!", x, y);
    }

    setHearts((prev) => prev.filter((h) => h.id !== id));
    const text = type.id === 'black' ? "OOPS!" : PHRASES[Math.floor(Math.random() * PHRASES.length)];
    addPhrase(text, x, y);
    playSound(type.id === 'black' ? 'miss' : 'catch');
    triggerHapticFeedback();
  }, [clickLevel, addPhrase, playSound, triggerHapticFeedback, level, frenzyTimer]);

  // Constant tracking for the cat
  useEffect(() => {
    if (!hasCat) return;

    const interval = setInterval(() => {
      setHearts((prev) => {
        if (prev.length === 0) {
          setIsCatCatching(false);
          return prev;
        }

        // Find the heart that's closest to the bottom
        const now = Date.now();
        const sorted = [...prev].sort((a, b) => {
          const aElapsed = (now - a.startTime) / a.speed;
          const bElapsed = (now - b.startTime) / b.speed;
          return bElapsed - aElapsed;
        });

        const target = sorted[0];
        const elapsed = (now - target.startTime) / 1000;

        // Move towards target
        setCatX(prevX => {
          if (Math.abs(prevX - target.x) > 1) {
            setCatFlip(target.x > prevX ? 1 : -1);
            setIsCatCatching(true); // Treat "running" as a state for animation
            return target.x;
          } else {
            setIsCatCatching(false);
            return prevX;
          }
        });

        // Catch logic
        const currentCat = CAT_TIERS[catTier];
        // 0.72 ensures it's caught slightly above the head
        if (elapsed > target.speed * 0.72) {
          if (Math.random() <= currentCat.luck) {
            setScore(s => s + (1 + catEarnLevel));
            // Bonus XP for cat catch
            setXp(x => x + 2);
            playSound('catch');
            triggerHapticFeedback();
            return prev.filter(h => h.id !== target.id);
          } else {
            playSound('miss');
            return prev.filter(h => h.id !== target.id);
          }
        }
        return prev;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [hasCat, addPhrase]);

  // Clean up hearts that fall completely (safety net)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setHearts((prev) => prev.filter(h => (now - h.startTime) / 1000 < h.speed + 0.2));
    }, 200);
    return () => clearInterval(cleanup);
  }, []);

  const buyCat = () => {
    const nextTier = hasCat ? catTier + 1 : 0;
    if (nextTier >= CAT_TIERS.length) return;

    const tierData = CAT_TIERS[nextTier];
    if (score >= tierData.cost) {
      setScore(score - tierData.cost);
      if (!hasCat) setHasCat(true);
      else setCatTier(nextTier);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buySpawn = () => {
    const cost = (spawnLevel + 1) * 35;
    if (score >= cost && spawnLevel < 10) {
      setScore(score - cost);
      setSpawnLevel(spawnLevel + 1);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buySpeed = () => {
    const cost = (speedLevel + 1) * 50;
    if (score >= cost && speedLevel < 4) {
      setScore(score - cost);
      setSpeedLevel(speedLevel + 1);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buyClickBonus = () => {
    const cost = (clickLevel + 1) * 70;
    if (score >= cost && clickLevel < 5) {
      setScore(score - cost);
      setClickLevel(clickLevel + 1);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buyCatBonus = () => {
    const cost = (catEarnLevel + 1) * 100;
    if (score >= cost && catEarnLevel < 5) {
      setScore(score - cost);
      setCatEarnLevel(catEarnLevel + 1);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buyLuck = () => {
    const cost = (luckLevel + 1) * 120;
    if (score >= cost && luckLevel < 10) {
      setScore(score - cost);
      setLuckLevel(luckLevel + 1);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buyDouble = () => {
    const cost = (doubleLevel + 1) * 200;
    if (score >= cost && doubleLevel < 5) {
      setScore(score - cost);
      setDoubleLevel(doubleLevel + 1);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buyCrit = () => {
    const cost = (critLevel + 1) * 150;
    if (score >= cost && critLevel < 10) {
      setScore(score - cost);
      setCritLevel(critLevel + 1);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const Leaderboard = () => {
    const players = [
      { name: 'Дарси', score: 999999, isSpecial: true },
      { name: username, score: score, isSelf: true }
    ].sort((a, b) => b.score - a.score);

    return (
      <div className="leaderboard-list" style={{ marginTop: '10px' }}>
        <p style={{ fontSize: '10px', marginBottom: '15px' }}>ТАБЛИЦА ЛИДЕРОВ</p>
        {players.map((p, i) => (
          <div key={i} className={`leader-row ${p.isSpecial ? 'special' : ''} ${p.isSelf ? 'self' : ''}`} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '5px',
            fontSize: '8px',
            background: p.isSpecial ? 'gold' : (p.isSelf ? 'rgba(255,20,147,0.2)' : 'none'),
            color: p.isSpecial ? '#000' : '#fff'
          }}>
            <span>{i + 1}. {p.name}</span>
            <span>{p.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  const buyTheme = (theme) => {
    if (score >= theme.cost && !unlockedThemes.includes(theme.id)) {
      setScore(score - theme.cost);
      setUnlockedThemes([...unlockedThemes, theme.id]);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buyPhoto = (photo) => {
    if (score >= photo.cost && !unlockedPhotos.includes(photo.id)) {
      setScore(score - photo.cost);
      setUnlockedPhotos([...unlockedPhotos, photo.id]);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const currentThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];


  return (
    <div className={`game-container theme-${currentTheme} ${isMenuVisible ? 'menu-open' : ''}`} style={{ background: currentThemeData.gradient }}>
      <Atmosphere />
      {frenzyTimer > 0 && <div className="frenzy-overlay" />}

      {/* HUD Bar - Moved to Bottom */}
      <div className="hud-bar bottom">
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="hud-stat">❤️ {score}</div>
          <div className="hud-stat">⭐ {level}</div>
        </div>
        {combo > 1 && <div className="combo-badge">COMBO: {combo}</div>}
        <button className="menu-open-btn" onClick={() => setIsMenuVisible(true)}>MENU</button>
      </div>

      {offlineReward !== null && (
        <div className="ui-panel-overlay visible" onClick={() => setOfflineReward(null)}>
          <div className="ui-panel" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '12px' }}>З ПОВЕРНЕННЯМ!</h2>
            <div style={{ margin: '20px 0', fontSize: '10px' }}>
              Твій котик назбирав <br />
              <span style={{ fontSize: '18px', color: '#ff1493' }}>❤️ {offlineReward}</span> <br />
              поки тебе не було!
            </div>
            <button className="shop-btn active" onClick={() => setOfflineReward(null)}>ДЯКУЮ!</button>
          </div>
        </div>
      )}

      <div className={`ui-panel-overlay ${isMenuVisible ? 'visible' : ''}`} onClick={() => setIsMenuVisible(false)}>
        <div className="ui-panel" onClick={e => e.stopPropagation()}>
          <div className="panel-header">
            <h1 style={{ fontSize: '14px', margin: 0 }}>МЕНЮ</h1>
            <button className="close-panel-btn" onClick={() => setIsMenuVisible(false)}>ГРАТИ</button>
          </div>
          <div className="tab-buttons" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            <button className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>🛒 КРАМНИЦЯ</button>
            <button className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>🏆 ЛІДЕРИ</button>
            <button className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>✨ ДОСЯГН.</button>
          </div>

          <div className="menu-content">
            <div className="level-box" style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', marginBottom: '4px' }}>
                <span>РІВЕНЬ {level}</span>
                <span>{xp}/{level * 100} ДОСВІД</span>
              </div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${(xp / (level * 100)) * 100}%` }} />
              </div>
            </div>

            {showSettings ? (
              <div className="settings-panel" style={{ padding: '10px 0' }}>
                <p style={{ fontSize: '10px', marginBottom: '10px' }}>НАЛАШТУВАННЯ</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="shop-btn" onClick={() => setIsMusicEnabled(!isMusicEnabled)}>
                    МУЗИКА: {isMusicEnabled ? 'ВКЛ' : 'ВИКЛ'}
                  </button>
                  <button className="shop-btn" onClick={() => setIsSoundEnabled(!isSoundEnabled)}>
                    ЗВУКИ: {isSoundEnabled ? 'ВКЛ' : 'ВИКЛ'}
                  </button>
                  <div className="credits-section" style={{ marginTop: '20px', borderTop: '1px dashed #ff1493', paddingTop: '10px' }}>
                    <p style={{ fontSize: '8px', color: '#ff1493' }}>моїй коханій дашуні ❤️</p>
                  </div>
                  <button className="shop-btn" onClick={() => setShowSettings(false)} style={{ marginTop: '10px' }}>
                    НАЗАД
                  </button>
                </div>
              </div>
            ) : activeTab === 'leaderboard' ? (
              <Leaderboard />
            ) : activeTab === 'achievements' ? (
              <div className="achievements-list" style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '10px', marginBottom: '15px' }}>ДОСТИЖЕНИЯ</p>
                <div className="shop-btn active" style={{ fontSize: '8px', textAlign: 'left' }}>
                  НОВИЧОК: Достигните 5 уровня {level >= 5 ? '✅' : '❌'}
                </div>
                <div className="shop-btn active" style={{ fontSize: '8px', textAlign: 'left', marginTop: '5px' }}>
                  МАЙСТЕР КОМБО: 20 поспіль {combo >= 20 ? '✅' : '❌'}
                </div>
                <div className="shop-btn active" style={{ fontSize: '8px', textAlign: 'left', marginTop: '5px' }}>
                  КОЛЕКЦІОНЕР: Зберіть 3 фото {unlockedPhotos.length >= 3 ? '✅' : '❌'}
                </div>
                <div className="shop-btn active" style={{ fontSize: '8px', textAlign: 'left', marginTop: '5px' }}>
                  БАГАТІЙ: 1000 очок {score >= 1000 ? '✅' : '❌'}
                </div>
              </div>
            ) : (
              <div className="shop-container">
                <div className="tab-buttons inner" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <button className={`tab-btn-small ${shopCategory === 'boosts' ? 'active' : ''}`} onClick={() => setShopCategory('boosts')}>🆙</button>
                  <button className={`tab-btn-small ${shopCategory === 'cats' ? 'active' : ''}`} onClick={() => setShopCategory('cats')}>🐱</button>
                  <button className={`tab-btn-small ${shopCategory === 'locales' ? 'active' : ''}`} onClick={() => setShopCategory('locales')}>🎨</button>
                  <button className={`tab-btn-small ${shopCategory === 'gallery' ? 'active' : ''}`} onClick={() => setShopCategory('gallery')}>🖼️</button>
                </div>

                <div className="shop-content">
                  {shopCategory === 'boosts' && (
                    <div className="shop-grid">
                      <button className="square-btn" onClick={buySpawn} disabled={score < (spawnLevel + 1) * 35 || spawnLevel >= 10}>
                        <div className="btn-icon">
                          <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                            <path d="M4 2h8v1h1v1h1v1h1v4h-1v1h-1v1h-1v1h-2v1h-1v-2h2v-1h1v-1h1V5h-1V4h-1V3H5v1H4v1H3v4h1v1h1v1h2v1H5v1H3v-1H2v-1H1V5h1V4h1V3h1V2zm7 7h2v2h-2V9zm-5 0h2v2H6V9z" />
                            <path d="M11 12h2v2h-2v-2zm-2 2h2v2H9v-2zm-2-2h2v2H7v-2z" fill="#ff1493" opacity="0.3" />
                            <path d="M12 4h1v1h-1V4zm-8 0h1v1H4V4z" fill="white" />
                            <path d="M7 6h2v5H7V6zm-2 2h6v2H5V8z" fill="#4caf50" /> {/* Plus sign */}
                          </svg>
                        </div>
                        <span className="btn-label">ПОЯВА</span>
                        <span className="btn-cost">{(spawnLevel + 1) * 35}</span>
                      </button>
                      <button className="square-btn" onClick={buySpeed} disabled={score < (speedLevel + 1) * 50 || speedLevel >= 4}>
                        <div className="btn-icon">
                          <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                            <path d="M2 3h2v10H2V3zm3 0h2v10H5V3zm3 0h2v10H8V3zm3 2h2v6h-2V5zm3 2h1v2h-1V7z" opacity="0.4" />
                            <path d="M4 4l8 4-8 4V4zm6 0l5 4-5 4V4z" />
                          </svg>
                        </div>
                        <span className="btn-label">ШВИДКІСТЬ</span>
                        <span className="btn-cost">{(speedLevel + 1) * 50}</span>
                      </button>
                      <button className="square-btn" onClick={buyClickBonus} disabled={score < (clickLevel + 1) * 70 || clickLevel >= 5}>
                        <div className="btn-icon">
                          <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                            <path d="M7 1h2v2H7V1zm0 13h2v2H7v-2zm-4-7h2v2H3V7zm10 0h2v2h-2V7z" opacity="0.3" />
                            <path d="M8 2l4 4H9v8H7V6H4l4-4z" />
                            <path d="M9 7h2v2H9V7zM5 7h2v2H5V7z" fill="white" opacity="0.5" />
                          </svg>
                        </div>
                        <span className="btn-label">КЛІК</span>
                        <span className="btn-cost">{(clickLevel + 1) * 70}</span>
                      </button>
                      <button className="square-btn" onClick={buyLuck} disabled={score < (luckLevel + 1) * 120 || luckLevel >= 10}>
                        <div className="btn-icon">
                          <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                            <path d="M7 2h2v3H7V2zm0 9h2v3H7v-3zm-5-4h3v2H2V7zm9 0h3v2h-3V7z" opacity="0.2" />
                            <path d="M5 5h2v2H5V5zm4 0h2v2H9V5zm0 4h2v2H9V9zm-4 0h2v2H5V9z" />
                            <path d="M7 7h2v2H7V7z" fill="white" />
                          </svg>
                        </div>
                        <span className="btn-label">УДАЧА</span>
                        <span className="btn-cost">{(luckLevel + 1) * 120}</span>
                      </button>
                      <button className="square-btn" onClick={buyDouble} disabled={score < (doubleLevel + 1) * 200 || doubleLevel >= 5}>
                        <div className="btn-icon">
                          <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                            <path d="M1 4h4v1h1v1h1v1h1v-1h1v-1h4v1h1v1h1v4h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-1h-1v1h-1v1h-1v1H3v-1H2v-1H1V5h1V4z" />
                            <path d="M3 6h2v1h1v2H3V6zm8 0h2v1h1v2h-3V6z" fill="white" opacity="0.4" />
                          </svg>
                        </div>
                        <span className="btn-label">ДУБЛЬ</span>
                        <span className="btn-cost">{(doubleLevel + 1) * 200}</span>
                      </button>
                      <button className="square-btn" onClick={buyCrit} disabled={score < (critLevel + 1) * 150 || critLevel >= 10}>
                        <div className="btn-icon">
                          <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                            <path d="M7 0h2v16H7V0zm-7 7h16v2H0V7z" opacity="0.2" />
                            <path d="M4 4h8v1h1v1h1v4h-1v1h-1v1H4v-1H3v-1H2V6h1V5h1V4zm4 2h2v2H8V6z" />
                            <path d="M6 8h2v2H6V8z" fill="#ff1493" />
                          </svg>
                        </div>
                        <span className="btn-label">КРИТ</span>
                        <span className="btn-cost">{(critLevel + 1) * 150}</span>
                      </button>
                    </div>
                  )}

                  {shopCategory === 'cats' && (
                    <div className="shop-list">
                      {catTier < CAT_TIERS.length - 1 ? (
                        <button className="shop-btn" onClick={buyCat} disabled={score < CAT_TIERS[hasCat ? catTier + 1 : 0].cost} style={{ padding: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px' }}>{CAT_TIERS[hasCat ? catTier + 1 : 0].icon}</span>
                            <div style={{ textAlign: 'left' }}>
                              <div style={{ fontSize: '10px' }}>{CAT_TIERS[hasCat ? catTier + 1 : 0].name}</div>
                              <div style={{ fontSize: '10px', color: '#ff1493' }}>❤️ {CAT_TIERS[hasCat ? catTier + 1 : 0].cost}</div>
                            </div>
                          </div>
                          <div style={{ marginTop: '5px', display: 'flex', gap: '10px', fontSize: '6px', opacity: 0.8 }}>
                            <span>🍀 +{(CAT_TIERS[hasCat ? catTier + 1 : 0].luck * 100).toFixed(0)}%</span>
                            <span>💤 {CAT_TIERS[hasCat ? catTier + 1 : 0].idleRate}❤️/хв</span>
                          </div>
                        </button>
                      ) : (
                        <p className="status-text">🏆 MAX LEVEL!</p>
                      )}

                      <button className="shop-btn" style={{ marginTop: '10px' }} onClick={buyCatBonus} disabled={score < (catEarnLevel + 1) * 100 || catEarnLevel >= 5}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>🥗 КОРМ</span>
                          <span>❤️ {(catEarnLevel + 1) * 100}</span>
                        </div>
                      </button>

                      {hasCat && (
                        <div style={{ marginTop: '10px', background: '#fff0f5', padding: '10px', borderRadius: '8px', border: '2px solid #ff1493' }}>
                          <p style={{ fontSize: '7px', textAlign: 'center', margin: 0 }}>
                            ПОТОЧНИЙ: {CAT_TIERS[catTier].icon} {CAT_TIERS[catTier].name} <br />
                            💰 ДОХІД: {Math.floor(CAT_TIERS[catTier].idleRate * (1 + catEarnLevel * 0.5))} ❤️/хв
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {shopCategory === 'locales' && (
                    <div className="shop-list">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                        {THEMES.map(theme => (
                          <button
                            key={theme.id}
                            className={`shop-btn ${currentTheme === theme.id ? 'active' : ''}`}
                            onClick={() => unlockedThemes.includes(theme.id) ? setCurrentTheme(theme.id) : buyTheme(theme)}
                            disabled={!unlockedThemes.includes(theme.id) && score < theme.cost}
                            style={{ fontSize: '6px', padding: '5px', margin: 0 }}
                          >
                            {theme.name} {unlockedThemes.includes(theme.id) ? '' : `(${theme.cost})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {shopCategory === 'gallery' && (
                    <div className="gallery-scroll">
                      <div className="gallery-grid">
                        {GALLERY.map(photo => (
                          <div
                            key={photo.id}
                            className={`gallery-item ${unlockedPhotos.includes(photo.id) ? 'unlocked' : 'locked'}`}
                            onClick={() => unlockedPhotos.includes(photo.id) ? setSelectedPhoto(photo) : buyPhoto(photo)}
                          >
                            {unlockedPhotos.includes(photo.id) ? (
                              <div className="thumbnail-container">
                                <img src={photo.src} alt={photo.name} />
                              </div>
                            ) : (
                              <div className="lock-overlay">🔒 {photo.cost}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <button className="settings-btn-alt" onClick={() => setShowSettings(!showSettings)}>
              {showSettings ? 'BACK' : 'SETTINGS ⚙️'}
            </button>
          </div>
        </div>
      </div>

      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto.src} alt={selectedPhoto.name} />
            <button className="shop-btn" style={{ marginTop: '15px' }} onClick={() => setSelectedPhoto(null)}>
              ЗАКРЫТЬ
            </button>
          </div>
        </div>
      )}

      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          {...heart}
          isPaused={isMenuVisible}
          onRemove={handleHeartClick}
        />
      ))}

      {activePhrases.map((phrase) => (
        <Phrase key={phrase.id} {...phrase} />
      ))}

      {hasCat && (
        <div
          className={`cat-container ${isCatCatching ? 'cat-running' : ''} ${CAT_TIERS[catTier].class}`}
          style={{
            left: `${catX}%`,
            transform: `scaleX(${catFlip})`
          }}
        >
          <div className="cat-tail" />
          <div className="cat-pixel" />
          <div className="cat-paw left" />
          <div className="cat-paw right" />
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '8px', color: 'rgba(255,255,255,0.5)', zIndex: 10 }}>
        DASHULA ❤️ CATS
      </div>
    </div>
  );
}

export default App;
