import type { GameTemplate } from '@/types/game'

/**
 * ============================================
 * MEMORY/MATCH GAME TEMPLATE
 * Classic memory card matching game
 * ============================================
 */

export const memoryTemplate: GameTemplate = {
  category: 'memory',
  name: 'Memory Match',
  description: 'Trova le coppie di carte uguali!',
  icon: '🧠',
  
  configurableParams: [
    'cardSprites',
    'numPairs',
    'backgroundColor',
    'cardBackColor',
  ],
  
  defaultConfig: {
    player: {
      sprite: '',
      speed: 0,
      size: 0,
      color: '#FFFFFF',
    },
    world: {
      backgroundColor: '#9B59B6',
      width: 800,
      height: 600,
      theme: 'abstract',
    },
    mechanics: [
      { type: 'match', params: { pairCount: 6 } },
    ],
    goal: {
      type: 'complete_level',
      target: 6,
      description: 'Trova tutte le coppie!',
    },
    difficulty: 'easy',
  },

  examplePrompts: [
    'un gioco di memoria con animali',
    'trova le coppie di frutta',
    'memory game con emoji divertenti',
  ],

  baseCode: `
    return (function(context) {
      const { canvas, config } = context;
      const ctx = canvas.getContext('2d');
      
      const CARD_SPRITES = {{CARD_SPRITES}};
      const NUM_PAIRS = {{NUM_PAIRS}};
      const CARD_WIDTH = 100;
      const CARD_HEIGHT = 120;
      const CARD_MARGIN = 10;
      
      let cards = [];
      let flippedCards = [];
      let matchedPairs = 0;
      let moves = 0;
      let canClick = true;
      let gameOver = false;
      
      // Initialize cards
      function init() {
        const sprites = CARD_SPRITES.slice(0, NUM_PAIRS);
        const cardData = [...sprites, ...sprites]; // Duplicate for pairs
        
        // Shuffle
        for (let i = cardData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cardData[i], cardData[j]] = [cardData[j], cardData[i]];
        }
        
        // Create card objects in grid
        const cols = 4;
        const rows = Math.ceil(cardData.length / cols);
        const offsetX = (canvas.width - (cols * (CARD_WIDTH + CARD_MARGIN))) / 2;
        const offsetY = (canvas.height - (rows * (CARD_HEIGHT + CARD_MARGIN))) / 2 + 50;
        
        cards = cardData.map((sprite, i) => ({
          sprite,
          x: offsetX + (i % cols) * (CARD_WIDTH + CARD_MARGIN),
          y: offsetY + Math.floor(i / cols) * (CARD_HEIGHT + CARD_MARGIN),
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          flipped: false,
          matched: false,
          id: i,
        }));
      }
      
      // Mouse click handler
      canvas.addEventListener('click', (e) => {
        if (!canClick || gameOver) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        cards.forEach(card => {
          if (!card.flipped && !card.matched &&
              x > card.x && x < card.x + card.width &&
              y > card.y && y < card.y + card.height) {
            flipCard(card);
          }
        });
      });
      
      function flipCard(card) {
        card.flipped = true;
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
          canClick = false;
          moves++;
          
          setTimeout(() => {
            checkMatch();
          }, 800);
        }
      }
      
      function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.sprite === card2.sprite) {
          // Match!
          card1.matched = true;
          card2.matched = true;
          matchedPairs++;
          
          if (matchedPairs === NUM_PAIRS) {
            gameOver = true;
            context.onGameOver(true, moves);
          }
        } else {
          // No match
          card1.flipped = false;
          card2.flipped = false;
        }
        
        flippedCards = [];
        canClick = true;
      }
      
      // Render
      function render() {
        // Background
        ctx.fillStyle = '{{BACKGROUND_COLOR}}';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🧠 Memory Match 🧠', canvas.width / 2, 40);
        
        // Cards
        cards.forEach(card => {
          if (card.matched) {
            // Matched cards - show faded
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(card.x, card.y, card.width, card.height);
            
            ctx.font = '60px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = 0.5;
            ctx.fillText(card.sprite, card.x + card.width / 2, card.y + card.height / 2);
            ctx.globalAlpha = 1;
          } else if (card.flipped) {
            // Flipped - show sprite
            ctx.fillStyle = 'white';
            ctx.fillRect(card.x, card.y, card.width, card.height);
            ctx.strokeStyle = '{{CARD_BACK_COLOR}}';
            ctx.lineWidth = 4;
            ctx.strokeRect(card.x, card.y, card.width, card.height);
            
            ctx.font = '60px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(card.sprite, card.x + card.width / 2, card.y + card.height / 2);
          } else {
            // Face down
            ctx.fillStyle = '{{CARD_BACK_COLOR}}';
            ctx.fillRect(card.x, card.y, card.width, card.height);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.strokeRect(card.x, card.y, card.width, card.height);
            
            // Question mark
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', card.x + card.width / 2, card.y + card.height / 2);
          }
        });
        
        // Stats
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Mosse: ' + moves, 20, canvas.height - 30);
        ctx.textAlign = 'right';
        ctx.fillText('Coppie: ' + matchedPairs + ' / ' + NUM_PAIRS, canvas.width - 20, canvas.height - 30);
        
        if (gameOver) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#F1C40F';
          ctx.font = 'bold 56px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🎉 COMPLIMENTI! 🎉', canvas.width / 2, canvas.height / 2 - 30);
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 32px Arial';
          ctx.fillText('Completato in ' + moves + ' mosse!', canvas.width / 2, canvas.height / 2 + 40);
        }
      }
      
      // Animation loop
      let running = true;
      function gameLoop() {
        if (!running) return;
        render();
        requestAnimationFrame(gameLoop);
      }
      
      init();
      
      return {
        start: () => {
          running = true;
          gameLoop();
        },
        stop: () => {
          running = false;
        }
      };
    });
  `,
}
