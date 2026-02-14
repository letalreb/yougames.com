import type { GameTemplate } from '@/types/game'

/**
 * ============================================
 * RUNNER GAME TEMPLATE
 * Endless runner with obstacles and collectibles
 * More complex mechanics with lives and power-ups
 * ============================================
 */

export const runnerTemplate: GameTemplate = {
  category: 'runner',
  name: 'Endless Runner',
  description: 'Corri senza fermarti, evita ostacoli e raccogli punti!',
  icon: '🏃',
  
  configurableParams: [
    'playerSprite',
    'playerSpeed',
    'obstacleSprite',
    'collectibleSprite',
    'powerUpSprite',
    'backgroundColor',
    'scrollSpeed',
    'lives',
  ],
  
  defaultConfig: {
    player: {
      sprite: '🦊',
      speed: 8,
      size: 50,
      color: '#FF6B9D',
    },
    world: {
      backgroundColor: '#87CEEB',
      gravity: 1.2,
      width: 800,
      height: 600,
      theme: 'forest',
    },
    mechanics: [
      { type: 'run', params: { autoScroll: true } },
      { type: 'jump', params: {} },
      { type: 'avoid', params: { itemType: 'obstacle' } },
      { type: 'collect', params: { itemType: 'coin' } },
    ],
    goal: {
      type: 'reach_score',
      target: 100,
      description: 'Raggiungi 100 punti!',
    },
    difficulty: 'easy',
  },

  examplePrompts: [
    'una volpe che corre nella foresta evitando alberi',
    'un robot che corre nello spazio schivando asteroidi',
    'un dinosauro che corre nella preistoria',
  ],

  baseCode: `
    return (function(context) {
      const canvas = context.canvas;
      const ctx = canvas.getContext('2d');
      const customImages = context.customImages || {};
      
      // Game state
      let gameRunning = false;
      let gameOver = false;
      let score = 0;
      let lives = {{LIVES}};
      let distance = 0;
      let speedMultiplier = 1.0;
      let invincible = false;
      let invincibleTime = 0;
      
      // Player
      const player = {
        x: 150,
        y: canvas.height - 150,
        width: {{PLAYER_SIZE}},
        height: {{PLAYER_SIZE}},
        velocityY: 0,
        isJumping: false,
        sprite: '{{PLAYER_SPRITE}}',
        image: customImages.player || null,
      };
      
      const GRAVITY = {{GRAVITY}};
      const JUMP_POWER = -{{JUMP_POWER}};
      const GROUND_Y = canvas.height - 100;
      const BASE_SCROLL_SPEED = {{SCROLL_SPEED}};
      
      // Game objects
      let obstacles = [];
      let collectibles = [];
      let powerUps = [];
      let particles = [];
      
      // Spawn timers
      let obstacleTimer = 0;
      let collectibleTimer = 0;
      let powerUpTimer = 0;
      
      // Input
      let keys = {};
      window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && !player.isJumping && gameRunning) {
          player.velocityY = JUMP_POWER;
          player.isJumping = true;
        }
      });
      window.addEventListener('keyup', (e) => keys[e.key] = false);
      
      // Touch/Click support
      canvas.addEventListener('click', () => {
        if (!player.isJumping && gameRunning) {
          player.velocityY = JUMP_POWER;
          player.isJumping = true;
        }
      });
      
      // Initialize game
      function init() {
        gameRunning = true;
        gameOver = false;
        score = 0;
        lives = {{LIVES}};
        distance = 0;
        speedMultiplier = 1.0;
        obstacles = [];
        collectibles = [];
        powerUps = [];
        player.y = GROUND_Y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
      }
      
      // Spawn obstacle
      function spawnObstacle() {
        const types = ['normal', 'tall', 'wide'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let width, height;
        switch (type) {
          case 'tall':
            width = 30;
            height = 80 + Math.random() * 40;
            break;
          case 'wide':
            width = 60 + Math.random() * 40;
            height = 40;
            break;
          default:
            width = 40;
            height = 40;
        }
        
        obstacles.push({
          x: canvas.width + 50,
          y: GROUND_Y - height,
          width,
          height,
          type,
          sprite: '{{OBSTACLE_SPRITE}}',
          image: customImages.obstacle || null,
        });
      }
      
      // Spawn collectible
      function spawnCollectible() {
        const y = GROUND_Y - 50 - Math.random() * 200;
        collectibles.push({
          x: canvas.width + 50,
          y,
          width: 30,
          height: 30,
          value: 10,
          sprite: '{{COLLECTIBLE_SPRITE}}',
          image: customImages.collectible || null,
        });
      }
      
      // Spawn power-up
      function spawnPowerUp() {
        const types = ['shield', 'speedBoost', 'magnet'];
        const type = types[Math.floor(Math.random() * types.length)];
        const sprites = { shield: '🛡️', speedBoost: '⚡', magnet: '🧲' };
        
        powerUps.push({
          x: canvas.width + 50,
          y: GROUND_Y - 50 - Math.random() * 150,
          width: 35,
          height: 35,
          type,
          sprite: sprites[type],
          duration: 300, // frames
        });
      }
      
      // Create particle effect
      function createParticles(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 30,
            color,
            size: 3 + Math.random() * 4,
          });
        }
      }
      
      // Collision detection
      function checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
      }
      
      // Update game
      function update() {
        if (!gameRunning || gameOver) return;
        
        distance++;
        
        // Gradually increase difficulty
        speedMultiplier = 1 + Math.floor(distance / 1000) * 0.1;
        
        // Update invincibility
        if (invincible) {
          invincibleTime--;
          if (invincibleTime <= 0) {
            invincible = false;
          }
        }
        
        // Player physics
        player.velocityY += GRAVITY;
        player.y += player.velocityY;
        
        // Ground collision
        if (player.y >= GROUND_Y - player.height) {
          player.y = GROUND_Y - player.height;
          player.velocityY = 0;
          player.isJumping = false;
        }
        
        // Spawn obstacles
        obstacleTimer++;
        if (obstacleTimer > 90 / speedMultiplier) {
          spawnObstacle();
          obstacleTimer = 0;
        }
        
        // Spawn collectibles
        collectibleTimer++;
        if (collectibleTimer > 120) {
          spawnCollectible();
          collectibleTimer = 0;
        }
        
        // Spawn power-ups (rarely)
        powerUpTimer++;
        if (powerUpTimer > 600 && Math.random() < 0.01) {
          spawnPowerUp();
          powerUpTimer = 0;
        }
        
        const scrollSpeed = BASE_SCROLL_SPEED * speedMultiplier;
        
        // Update obstacles
        obstacles = obstacles.filter(obs => {
          obs.x -= scrollSpeed;
          
          // Check collision with player
          if (checkCollision(player, obs)) {
            if (!invincible) {
              lives--;
              createParticles(player.x + player.width / 2, player.y + player.height / 2, '#FF6B9D', 12);
              if (lives <= 0) {
                gameOver = true;
                context.onGameOver(false, score);
              } else {
                // Brief invincibility after hit
                invincible = true;
                invincibleTime = 60;
              }
            }
            return false;
          }
          
          return obs.x > -obs.width;
        });
        
        // Update collectibles
        collectibles = collectibles.filter(col => {
          col.x -= scrollSpeed;
          
          if (checkCollision(player, col)) {
            score += col.value;
            createParticles(col.x + col.width / 2, col.y + col.height / 2, '#FFD700', 6);
            return false;
          }
          
          return col.x > -col.width;
        });
        
        // Update power-ups
        powerUps = powerUps.filter(pw => {
          pw.x -= scrollSpeed;
          
          if (checkCollision(player, pw)) {
            createParticles(pw.x + pw.width / 2, pw.y + pw.height / 2, '#00FF00', 10);
            
            // Apply power-up effect
            if (pw.type === 'shield') {
              invincible = true;
              invincibleTime = pw.duration;
            } else if (pw.type === 'speedBoost') {
              speedMultiplier *= 1.5;
              setTimeout(() => speedMultiplier /= 1.5, pw.duration * 16);
            }
            
            return false;
          }
          
          return pw.x > -pw.width;
        });
        
        // Update particles
        particles = particles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.3; // gravity on particles
          p.life--;
          return p.life > 0;
        });
      }
      
      // Render game
      function render() {
        // Clear
        ctx.fillStyle = '{{BACKGROUND_COLOR}}';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Background image if provided
        if (customImages.background) {
          ctx.globalAlpha = 0.5;
          ctx.drawImage(customImages.background, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0;
        }
        
        // Ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
        
        // Moving ground lines (parallax effect)
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        for (let i = 0; i < 10; i++) {
          const x = ((distance * 2) % 100) + i * 100 - 100;
          ctx.beginPath();
          ctx.moveTo(x, GROUND_Y);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // Obstacles
        obstacles.forEach(obs => {
          if (obs.image) {
            ctx.drawImage(obs.image, obs.x, obs.y, obs.width, obs.height);
          } else {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            ctx.font = \`\${Math.min(obs.width, obs.height) * 0.8}px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(obs.sprite, obs.x + obs.width / 2, obs.y + obs.height / 2);
          }
        });
        
        // Collectibles
        collectibles.forEach(col => {
          // Rotation animation
          const rotation = (Date.now() / 10) % 360;
          ctx.save();
          ctx.translate(col.x + col.width / 2, col.y + col.height / 2);
          ctx.rotate(rotation * Math.PI / 180);
          
          if (col.image) {
            ctx.drawImage(col.image, -col.width / 2, -col.height / 2, col.width, col.height);
          } else {
            ctx.font = \`\${col.width}px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(col.sprite, 0, 0);
          }
          ctx.restore();
        });
        
        // Power-ups
        powerUps.forEach(pw => {
          // Pulsating effect
          const pulse = 1 + Math.sin(Date.now() / 100) * 0.2;
          const size = pw.width * pulse;
          
          ctx.save();
          ctx.translate(pw.x + pw.width / 2, pw.y + pw.height / 2);
          ctx.globalAlpha = 0.8 + Math.sin(Date.now() / 100) * 0.2;
          ctx.font = \`\${size}px Arial\`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(pw.sprite, 0, 0);
          ctx.restore();
        });
        
        // Particles
        particles.forEach(p => {
          ctx.globalAlpha = p.life / 30;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        });
        ctx.globalAlpha = 1.0;
        
        // Player
        if (invincible) {
          ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 50) * 0.5; // Flashing effect
        }
        
        if (player.image) {
          ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
        } else {
          ctx.fillStyle = '{{PLAYER_COLOR}}';
          ctx.fillRect(player.x, player.y, player.width, player.height);
          ctx.font = \`\${player.height * 0.9}px Arial\`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(player.sprite, player.x + player.width / 2, player.y + player.height / 2);
        }
        ctx.globalAlpha = 1.0;
        
        // UI
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(\`💰 Score: \${score}\`, 20, 40);
        ctx.fillText(\`❤️ \${'♥'.repeat(lives)}\`, 20, 75);
        ctx.fillText(\`📏 \${Math.floor(distance / 10)}m\`, 20, 110);
        
        if (invincible) {
          ctx.fillStyle = '#FFD700';
          ctx.fillText('🛡️ INVINCIBLE!', canvas.width / 2 - 80, 40);
        }
        
        // Game over screen
        if (gameOver) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 60);
          
          ctx.font = 'bold 32px Arial';
          ctx.fillText(\`Punteggio Finale: \${score}\`, canvas.width / 2, canvas.height / 2);
          ctx.fillText(\`Distanza: \${Math.floor(distance / 10)}m\`, canvas.width / 2, canvas.height / 2 + 50);
          
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#FFD700';
          ctx.fillText('Premi SPAZIO per ricominciare', canvas.width / 2, canvas.height / 2 + 120);
        }
      }
      
      // Game loop
      function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
      }
      
      // Restart on space when game over
      window.addEventListener('keydown', (e) => {
        if (e.key === ' ' && gameOver) {
          init();
        }
      });
      
      init();
      
      return {
        start: () => {
          gameLoop();
        },
        stop: () => {
          gameRunning = false;
        }
      };
    });
  `,
}
