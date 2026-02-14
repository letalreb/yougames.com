import type { GameTemplate } from '@/types/game'

/**
 * ============================================
 * PLATFORMER GAME TEMPLATE
 * Classic jump-and-collect platformer
 * ============================================
 */

export const platformerTemplate: GameTemplate = {
  category: 'platformer',
  name: 'Platformer',
  description: 'Salta tra piattaforme e raccogli oggetti!',
  icon: '🏃',
  
  configurableParams: [
    'playerSprite',
    'playerSpeed',
    'jumpPower',
    'gravity',
    'platformColor',
    'collectibleSprite',
    'backgroundColor',
    'targetScore',
  ],
  
  defaultConfig: {
    player: {
      sprite: '🐱',
      speed: 5,
      jumpPower: 15,
      size: 40,
      color: '#FF6B9D',
    },
    world: {
      backgroundColor: '#87CEEB',
      gravity: 0.8,
      width: 800,
      height: 600,
      theme: 'sky',
    },
    mechanics: [
      { type: 'jump', params: {} },
      { type: 'collect', params: { itemType: 'coin' } },
    ],
    goal: {
      type: 'reach_score',
      target: 10,
      description: 'Raccogli 10 oggetti!',
    },
    difficulty: 'easy',
  },

  examplePrompts: [
    'un gatto che salta tra le nuvole',
    'un dinosauro che raccoglie stelle',
    'un robot che salta sui pianeti',
  ],

  // Template code with placeholders
  baseCode: `
    return (function(context) {
      const { canvas, config } = context;
      const ctx = canvas.getContext('2d');
      
      // Game state
      let player = {
        x: 100,
        y: 100,
        width: {{PLAYER_SIZE}},
        height: {{PLAYER_SIZE}},
        vx: 0,
        vy: 0,
        onGround: false,
        sprite: '{{PLAYER_SPRITE}}',
      };
      
      let platforms = [];
      let collectibles = [];
      let score = 0;
      let targetScore = {{TARGET_SCORE}};
      let gameOver = false;
      let won = false;
      
      const GRAVITY = {{GRAVITY}};
      const JUMP_POWER = {{JUMP_POWER}};
      const MOVE_SPEED = {{PLAYER_SPEED}};
      
      // Input
      let keys = {};
      window.addEventListener('keydown', (e) => keys[e.key] = true);
      window.addEventListener('keyup', (e) => keys[e.key] = false);
      
      // Initialize game
      function init() {
        // Create platforms
        platforms = [
          { x: 0, y: canvas.height - 40, width: canvas.width, height: 40 }, // Ground
          { x: 200, y: 400, width: 150, height: 20 },
          { x: 450, y: 300, width: 150, height: 20 },
          { x: 100, y: 200, width: 150, height: 20 },
          { x: 500, y: 150, width: 150, height: 20 },
        ];
        
        // Create collectibles
        for (let i = 0; i < 15; i++) {
          collectibles.push({
            x: Math.random() * (canvas.width - 30) + 15,
            y: Math.random() * (canvas.height - 200) + 50,
            width: 30,
            height: 30,
            sprite: '{{COLLECTIBLE_SPRITE}}',
            active: true,
          });
        }
      }
      
      // Update
      function update() {
        if (gameOver) return;
        
        // Input handling
        if (keys['ArrowLeft'] || keys['a']) player.vx = -MOVE_SPEED;
        else if (keys['ArrowRight'] || keys['d']) player.vx = MOVE_SPEED;
        else player.vx = 0;
        
        if ((keys['ArrowUp'] || keys[' '] || keys['w']) && player.onGround) {
          player.vy = -JUMP_POWER;
          player.onGround = false;
        }
        
        // Apply physics
        player.vy += GRAVITY;
        player.x += player.vx;
        player.y += player.vy;
        
        // Boundary check
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        
        // Fall off bottom = lose
        if (player.y > canvas.height) {
          gameOver = true;
          context.onGameOver(false, score);
        }
        
        // Platform collision
        player.onGround = false;
        platforms.forEach(platform => {
          if (checkCollision(player, platform)) {
            if (player.vy > 0) { // Falling
              player.y = platform.y - player.height;
              player.vy = 0;
              player.onGround = true;
            }
          }
        });
        
        // Collectible collision
        collectibles.forEach(item => {
          if (item.active && checkCollision(player, item)) {
            item.active = false;
            score++;
            
            if (score >= targetScore) {
              gameOver = true;
              won = true;
              context.onGameOver(true, score);
            }
          }
        });
      }
      
      // Render
      function render() {
        // Clear
        ctx.fillStyle = '{{BACKGROUND_COLOR}}';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw platforms
        ctx.fillStyle = '{{PLATFORM_COLOR}}';
        platforms.forEach(platform => {
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // Draw collectibles
        collectibles.forEach(item => {
          if (item.active) {
            ctx.font = item.height + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.sprite, item.x + item.width / 2, item.y + item.height / 2);
          }
        });
        
        // Draw player
        ctx.font = player.height + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.sprite, player.x + player.width / 2, player.y + player.height / 2);
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score + ' / ' + targetScore, 20, 40);
        
        if (gameOver) {
          ctx.fillStyle = won ? '#2ECC71' : '#E74C3C';
          ctx.font = 'bold 48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(won ? '🎉 HAI VINTO! 🎉' : '😢 Game Over!', canvas.width / 2, canvas.height / 2);
        }
      }
      
      // Collision detection
      function checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
      }
      
      // Game loop
      let running = true;
      function gameLoop() {
        if (!running) return;
        update();
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
