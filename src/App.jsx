import React, { useState, useEffect, useCallback } from 'react';

const PHRASES = [
  "YOU ARE CUTE!",
  "LOVE YOU!",
  "STAY SWEET!",
  "MY HEART!",
  "KISS!",
  "SO ADORABLE!",
  "BE MINE!",
  "SWEETY!",
  "XOXO",
  "HUGS!",
  "PIXEL LOVE!",
  "YOU ROCK!"
];

// Retro sound generator
const playSound = (type) => {
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
};

const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

const Heart = ({ id, x, speed, onRemove }) => {
  return (
    <div
      className="heart-container falling"
      style={{
        left: `${x}%`,
        animationDuration: `${speed}s`,
      }}
      onClick={(e) => onRemove(id, e.clientX, e.clientY)}
    >
      <div className="heart" />
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

function App() {
  const [hearts, setHearts] = useState([]);
  const [activePhrases, setActivePhrases] = useState([]);
  const [score, setScore] = useState(0);
  const [hasCat, setHasCat] = useState(false);
  const [catX, setCatX] = useState(50);
  const [catFlip, setCatFlip] = useState(1); // 1 = right, -1 = left
  const [isCatCatching, setIsCatCatching] = useState(false);

  // Upgrades state
  const [spawnLevel, setSpawnLevel] = useState(0);
  const [speedLevel, setSpeedLevel] = useState(0);

  // Cat skin state
  const [ownedSkins, setOwnedSkins] = useState(['ginger']);
  const [currentSkin, setCurrentSkin] = useState('ginger');

  const SKINS = [
    { id: 'ginger', name: 'GINGER', cost: 0, class: '' },
    { id: 'black', name: 'BLACK', cost: 100, class: 'cat-black' },
    { id: 'white', name: 'WHITE', cost: 150, class: 'cat-white' },
    { id: 'gray', name: 'GRAY', cost: 200, class: 'cat-gray' }
  ];

  const spawnInterval = Math.max(200, 1000 - spawnLevel * 200);
  const baseSpeed = 4 - speedLevel * 0.5;

  const spawnHeart = useCallback(() => {
    const id = Math.random().toString(36).substr(2, 9);
    const x = 5 + Math.random() * 85; // Fixed range to avoid edge clipping
    const speed = baseSpeed + Math.random() * 3;

    setHearts((prev) => [...prev, { id, x, speed, startTime: Date.now() }]);
  }, [baseSpeed]);

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

  const handleHeartClick = (id, x, y) => {
    setScore((prev) => prev + 1);
    setHearts((prev) => prev.filter((h) => h.id !== id));
    const text = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    addPhrase(text, x, y);
    playSound('catch');
    triggerHaptic();
  };

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

        // Catch logic - adjusted to catch higher (0.80)
        if (elapsed > target.speed * 0.80) {
          if (Math.random() > 0.4) {
            setScore(s => s + 1);
            // addPhrase("CAT CATCH!", (target.x / 100) * (window.innerWidth - 60), window.innerHeight - 100);
            playSound('catch');
            triggerHaptic();
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
    const cleanup = setInterval(() => {
      const now = Date.now();
      setHearts((prev) => prev.filter(h => (now - h.startTime) / 1000 < h.speed + 0.2));
    }, 200);
    return () => clearInterval(cleanup);
  }, []);

  const buyCat = () => {
    if (score >= 50 && !hasCat) {
      setScore(score - 50);
      setHasCat(true);
      playSound('buy');
      triggerHaptic();
    }
  };

  const buySpawn = () => {
    const cost = (spawnLevel + 1) * 50;
    if (score >= cost && spawnLevel < 4) {
      setScore(score - cost);
      setSpawnLevel(spawnLevel + 1);
      playSound('buy');
      triggerHaptic();
    }
  };

  const buySpeed = () => {
    const cost = (speedLevel + 1) * 75;
    if (score >= cost && speedLevel < 4) {
      setScore(score - cost);
      setSpeedLevel(speedLevel + 1);
      playSound('buy');
      triggerHaptic();
    }
  };

  const buySkin = (skin) => {
    if (ownedSkins.includes(skin.id)) {
      setCurrentSkin(skin.id);
      return;
    }
    if (score >= skin.cost) {
      setScore(score - skin.cost);
      setOwnedSkins([...ownedSkins, skin.id]);
      setCurrentSkin(skin.id);
      playSound('buy');
      triggerHaptic();
    }
  };

  return (
    <div className="game-container">
      <div className="ui-panel">
        <h1 style={{ fontSize: '12px', marginBottom: '8px' }}>HEART DROP</h1>
        <p style={{ fontSize: '10px', marginBottom: '10px' }}>SCORE: {score}</p>

        <div className="shop-list">
          {!hasCat ? (
            <button className="shop-btn" onClick={buyCat} disabled={score < 50}>
              ADOPT CAT (50)
            </button>
          ) : (
            <p className="status-text">CAT ACTIVE (60% Luck)</p>
          )}

          <button className="shop-btn" onClick={buySpawn} disabled={score < (spawnLevel + 1) * 50 || spawnLevel >= 4}>
            MORE HEARTS ({(spawnLevel + 1) * 50})
          </button>

          <button className="shop-btn" onClick={buySpeed} disabled={score < (speedLevel + 1) * 75 || speedLevel >= 4}>
            FASTER! ({(speedLevel + 1) * 75})
          </button>

          <div className="skin-shop">
            <p style={{ fontSize: '8px', margin: '5px 0' }}>CAT SKINS:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              {SKINS.map(skin => (
                <button
                  key={skin.id}
                  className={`shop-btn ${currentSkin === skin.id ? 'active' : ''}`}
                  onClick={() => buySkin(skin)}
                  disabled={!ownedSkins.includes(skin.id) && score < skin.cost}
                  style={{ fontSize: '7px' }}
                >
                  {skin.name} {ownedSkins.includes(skin.id) ? '' : `(${skin.cost})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          className="admin-btn"
          onClick={() => setScore(s => s + 100)}
        >
          DEBUG: +100
        </button>
      </div>

      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          {...heart}
          onRemove={handleHeartClick}
        />
      ))}

      {activePhrases.map((phrase) => (
        <Phrase key={phrase.id} {...phrase} />
      ))}

      {hasCat && (
        <div
          className={`cat-container ${isCatCatching ? 'cat-running' : ''} ${SKINS.find(s => s.id === currentSkin)?.class || ''}`}
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
