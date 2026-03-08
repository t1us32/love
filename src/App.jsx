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

const HEART_TYPES = {
  NORMAL: { id: 'normal', color: '#ff1493', xp: 10, bonus: 0, weight: 70, class: 'heart-normal' },
  GOLD: { id: 'gold', color: '#ffd700', xp: 50, bonus: 10, weight: 20, class: 'heart-gold' },
  BLACK: { id: 'black', color: '#333', xp: 5, bonus: -5, weight: 7, class: 'heart-black' },
  STAR: { id: 'star', color: '#00ffff', xp: 100, bonus: 5, weight: 3, class: 'heart-star' }
};

const THEMES = [
  { id: 'default', name: 'РОЗОВЫЙ', cost: 0, gradient: 'linear-gradient(135deg, #ffc1e3 0%, #ff85a2 100%)' },
  { id: 'night', name: 'НОЧЬ', cost: 200, gradient: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)' },
  { id: 'forest', name: 'ЛЕС', cost: 300, gradient: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)' },
  { id: 'cosmos', name: 'КОСМОС', cost: 500, gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }
];

const GALLERY = [
  { id: 'cat_garden', name: 'Сад котиков', cost: 75, src: '/gallery/cat_garden.png' },
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
      className={`heart-container falling ${type.class} ${isPaused ? 'paused' : ''}`}
      style={{
        left: `${x}%`,
        animationDuration: `${speed}s`,
      }}
      onClick={(e) => !isPaused && onRemove(id, e.clientX, e.clientY, type)}
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
      setSpawnLevel(data.spawnLevel || 0);
      setSpeedLevel(data.speedLevel || 0);
      setClickLevel(data.clickLevel || 0);
      setCatEarnLevel(data.catEarnLevel || 0);
      setUnlockedPhotos(data.unlockedPhotos || []);
      setUnlockedThemes(data.unlockedThemes || ['default']);
      setCurrentTheme(data.currentTheme || 'default');
    }
  }, []);

  // Save Game
  useEffect(() => {
    const data = {
      score,
      xp,
      level,
      hasCat,
      spawnLevel,
      speedLevel,
      clickLevel,
      catEarnLevel,
      unlockedPhotos,
      unlockedThemes,
      currentTheme
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [score, xp, level, hasCat, spawnLevel, speedLevel, clickLevel, catEarnLevel, unlockedPhotos, unlockedThemes, currentTheme]);

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

  const spawnInterval = Math.max(100, 1000 - spawnLevel * 220);
  const baseSpeed = 6 - speedLevel * 0.5;

  const spawnHeart = useCallback(() => {
    // Determine type
    const roll = Math.random() * 100;
    let accumulated = 0;
    let type = HEART_TYPES.NORMAL;

    for (const key in HEART_TYPES) {
      accumulated += HEART_TYPES[key].weight;
      if (roll <= accumulated) {
        type = HEART_TYPES[key];
        break;
      }
    }

    const id = Math.random().toString(36).substr(2, 9);
    const x = 5 + Math.random() * 85;
    let speed = baseSpeed + Math.random() * 3;

    if (frenzyTimer > 0) speed *= 0.5;

    setHearts((prev) => [...prev, { id, x, type, speed, startTime: Date.now() }]);
  }, [baseSpeed, frenzyTimer]);

  useEffect(() => {
    if (isMenuVisible) return;
    const interval = setInterval(spawnHeart, spawnInterval);
    return () => clearInterval(interval);
  }, [spawnHeart, spawnInterval, isMenuVisible]);

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
    const bonus = frenzyTimer > 0 ? 2 : 1;
    const scoreGain = (type.bonus + (type.id === 'normal' ? clickLevel : 0)) * bonus;
    setScore((prev) => Math.max(0, prev + scoreGain + (type.id === 'normal' ? 1 : 0)));

    // XP Logic
    setXp((prev) => {
      const nextXp = prev + type.xp;
      const xpToLevel = level * 100;
      if (nextXp >= xpToLevel) {
        setLevel(l => l + 1);
        addPhrase("LEVEL UP!", x, y);
        playSound('buy');
        return nextXp - xpToLevel;
      }
      return nextXp;
    });

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
    if (!hasCat || isMenuVisible) return;

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

        // Catch logic - adjusted to catch higher (0.80)
        if (elapsed > target.speed * 0.80) {
          if (Math.random() > 0.4) {
            setScore(s => s + (1 + catEarnLevel));
            // addPhrase("CAT CATCH!", (target.x / 100) * (window.innerWidth - 60), window.innerHeight - 100);
            playSound('catch');
            triggerHapticFeedback();
            return prev.filter(h => h.id !== target.id);
          } else {
            // addPhrase("OOF!", (target.x / 100) * (window.innerWidth - 60), window.innerHeight - 80);
            playSound('miss');
            return prev.filter(h => h.id !== target.id);
          }
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [hasCat, addPhrase]);

  // Clean up hearts that fall completely (safety net)
  useEffect(() => {
    if (isMenuVisible) return;
    const cleanup = setInterval(() => {
      const now = Date.now();
      setHearts((prev) => prev.filter(h => (now - h.startTime) / 1000 < h.speed + 0.2));
    }, 200);
    return () => clearInterval(cleanup);
  }, [isMenuVisible]);

  const buyCat = () => {
    if (score >= 30 && !hasCat) {
      setScore(score - 30);
      setHasCat(true);
      playSound('buy');
      triggerHapticFeedback();
    }
  };

  const buySpawn = () => {
    const cost = (spawnLevel + 1) * 35;
    if (score >= cost && spawnLevel < 4) {
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

  const currentThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];


  return (
    <div className={`game-container theme-${currentTheme} ${isMenuVisible ? 'game-paused' : ''}`} style={{ background: currentThemeData.gradient }}>
      {frenzyTimer > 0 && <div className="frenzy-overlay" />}

      {/* HUD Bar - Always Visible */}
      <div className="hud-bar">
        <div className="hud-stat">❤️ {score}</div>
        <div className="hud-stat">⭐ {level}</div>
        <button className="menu-open-btn" onClick={() => setIsMenuVisible(true)}>MENU</button>
      </div>

      <div className={`ui-panel-overlay ${isMenuVisible ? 'visible' : ''}`}>
        <div className="ui-panel">
          <div className="panel-header">
            <h1 style={{ fontSize: '14px', margin: 0 }}>PAUSED</h1>
            <button className="close-panel-btn" onClick={() => setIsMenuVisible(false)}>RESUME</button>
          </div>
          <div className="tab-buttons" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            <button className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>SHOP</button>
            <button className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>LEADER</button>
            <button className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>ACHIEV</button>
          </div>

          <div className="level-box" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', marginBottom: '4px' }}>
              <span>LVL {level}</span>
              <span>{xp}/{level * 100} XP</span>
            </div>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${(xp / (level * 100)) * 100}%` }} />
            </div>
          </div>

          {showSettings ? (
            <div className="settings-panel" style={{ padding: '10px 0' }}>
              <p style={{ fontSize: '10px', marginBottom: '10px' }}>НАСТРОЙКИ</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="shop-btn" onClick={() => setIsMusicEnabled(!isMusicEnabled)}>
                  МУЗЫКА: {isMusicEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
                <button className="shop-btn" onClick={() => setIsSoundEnabled(!isSoundEnabled)}>
                  ЗВУКИ: {isSoundEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
                <div className="credits-section" style={{ marginTop: '20px', borderTop: '1px dashed #ff1493', paddingTop: '10px' }}>
                  <p style={{ fontSize: '8px', color: '#ff1493' }}>моей любимой дашуне ❤️</p>
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
                КОЛЛЕКЦИОНЕР: Соберите 3 фото {unlockedPhotos.length >= 3 ? '✅' : '❌'}
              </div>
              <div className="shop-btn active" style={{ fontSize: '8px', textAlign: 'left', marginTop: '5px' }}>
                БОГАТЕЙ: 1000 очков {score >= 1000 ? '✅' : '❌'}
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '10px', margin: '10px 0' }}>SCORE: {score}</p>

              <div className="shop-list">
                {!hasCat ? (
                  <button className="shop-btn" onClick={buyCat} disabled={score < 30}>
                    ADOPT CAT (30)
                  </button>
                ) : (
                  <p className="status-text">CAT ACTIVE (60% Luck)</p>
                )}

                <button className="shop-btn" onClick={buySpawn} disabled={score < (spawnLevel + 1) * 35 || spawnLevel >= 4}>
                  MORE HEARTS ({(spawnLevel + 1) * 35})
                </button>

                <button className="shop-btn" onClick={buySpeed} disabled={score < (speedLevel + 1) * 50 || speedLevel >= 4}>
                  FASTER! ({(speedLevel + 1) * 50})
                </button>

                <button className="shop-btn" onClick={buyClickBonus} disabled={score < (clickLevel + 1) * 70 || clickLevel >= 5}>
                  CLICK POWER ({(clickLevel + 1) * 70})
                </button>

                <button className="shop-btn" onClick={buyCatBonus} disabled={score < (catEarnLevel + 1) * 100 || catEarnLevel >= 5}>
                  CAT REWARD ({(catEarnLevel + 1) * 100})
                </button>

                <div className="themes-shop">
                  <p style={{ fontSize: '8px', margin: '15px 0 5px' }}>ТЕМЫ:</p>
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

                <div className="gallery-shop">
                  <p style={{ fontSize: '8px', margin: '15px 0 5px' }}>ГАЛЕРЕЯ (Скролл ↓):</p>
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
                </div>
              </div>
            </>
          )}
          <button className="settings-btn-alt" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? 'BACK' : 'SETTINGS ⚙️'}
          </button>
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
          className={`cat-container ${isCatCatching ? 'cat-running' : ''}`}
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

      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        fontSize: '8px',
        color: 'rgba(255,255,255,0.5)',
        zIndex: 10
      }}>
        TAP HEARTS!
      </div>
    </div>
  );
}

export default App;
