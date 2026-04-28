import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(70, prev - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-gray-900/40 rounded-3xl border border-white/10 backdrop-blur-xl shadow-neon-purple">
      <div className="flex justify-between w-full px-4 items-center">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-white/50 font-mono">Score</span>
          <span className="text-3xl font-display font-bold text-glow-blue text-neon-blue">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-white/50 font-mono">Best</span>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-neon-pink" />
            <span className="text-2xl font-display font-bold text-glow-pink text-neon-pink">{highScore}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-black rounded-lg overflow-hidden border-2 border-neon-purple shadow-neon-purple/20"
        style={{ 
          width: 'min(80vw, 400px)', 
          height: 'min(80vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake Body */}
        {snake.map((p, i) => (
          <div
            key={`${p.x}-${p.y}-${i}`}
            className={`rounded-sm ${i === 0 ? 'bg-neon-blue' : 'bg-white/80'}`}
            style={{
              gridColumnStart: p.x + 1,
              gridRowStart: p.y + 1,
              boxShadow: i === 0 ? '0 0 10px #00ffff' : 'none'
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-neon-pink rounded-full"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            boxShadow: '0 0 15px #ff00ff'
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-display font-bold text-neon-pink text-glow-pink mb-4">GAME OVER</h2>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-pink/20 border border-neon-pink text-neon-pink rounded-full hover:bg-neon-pink hover:text-white transition-all group active:scale-95"
                  >
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Try Again</span>
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-display font-bold text-neon-blue text-glow-blue mb-8 tracking-tighter">SNAKE RHYTHM</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-8 py-4 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-full hover:bg-neon-blue hover:text-white transition-all group active:scale-95"
                  >
                    <Play size={24} fill="currentColor" />
                    <span className="font-bold uppercase tracking-wider">Start Game</span>
                  </button>
                  <p className="mt-8 text-white/40 text-xs font-mono uppercase tracking-[0.2em]">Use Arrow Keys to Move</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
          <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono">Speed</span>
          <span className="text-sm font-mono text-neon-green">{Math.round(1000 / speed)} UPS</span>
        </div>
        <div className="flex flex-col items-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
          <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono">Status</span>
          <span className={`text-sm font-mono ${isGameOver ? 'text-neon-pink' : 'text-neon-blue'}`}>
            {isGameOver ? 'HALTED' : isPaused ? 'IDLE' : 'ACTIVE'}
          </span>
        </div>
      </div>
    </div>
  );
}
