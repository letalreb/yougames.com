/**
 * ============================================
 * GAME ENGINE CORE
 * Simple 2D canvas game engine for kids' games
 * ============================================
 */

export interface GameObject {
  x: number
  y: number
  width: number
  height: number
  vx?: number // velocity x
  vy?: number // velocity y
  color?: string
  sprite?: string // emoji or shape
  active: boolean
  type: string
}

export interface GameState {
  score: number
  lives: number
  level: number
  gameOver: boolean
  won: boolean
  paused: boolean
  time: number // elapsed time in seconds
}

export interface InputState {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  space: boolean
  mouse: { x: number; y: number; down: boolean }
}

export class GameEngine {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  
  // Game state
  state: GameState
  objects: GameObject[]
  input: InputState
  
  // Game loop
  running: boolean
  lastFrameTime: number
  fps: number
  targetFPS: number = 60
  
  // Callbacks
  onUpdate?: (dt: number) => void
  onRender?: () => void
  onGameOver?: (won: boolean) => void

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.width = canvas.width
    this.height = canvas.height
    
    // Initialize state
    this.state = {
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      won: false,
      paused: false,
      time: 0,
    }
    
    this.objects = []
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
      mouse: { x: 0, y: 0, down: false },
    }
    
    this.running = false
    this.lastFrameTime = 0
    this.fps = 60
    
    // Setup input handlers
    this.setupInput()
  }

  /**
   * Setup keyboard and mouse input
   */
  private setupInput() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.handleKeyDown(e.key)
      // Prevent default for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
    })

    window.addEventListener('keyup', (e) => {
      this.handleKeyUp(e.key)
    })

    // Mouse
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect()
      this.input.mouse.x = e.clientX - rect.left
      this.input.mouse.y = e.clientY - rect.top
    })

    this.canvas.addEventListener('mousedown', () => {
      this.input.mouse.down = true
    })

    this.canvas.addEventListener('mouseup', () => {
      this.input.mouse.down = false
    })

    // Touch support for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      const rect = this.canvas.getBoundingClientRect()
      const touch = e.touches[0]
      this.input.mouse.x = touch.clientX - rect.left
      this.input.mouse.y = touch.clientY - rect.top
      this.input.mouse.down = true
    })

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      const rect = this.canvas.getBoundingClientRect()
      const touch = e.touches[0]
      this.input.mouse.x = touch.clientX - rect.left
      this.input.mouse.y = touch.clientY - rect.top
    })

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault()
      this.input.mouse.down = false
    })
  }

  private handleKeyDown(key: string) {
    switch (key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.input.left = true
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.input.right = true
        break
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.input.up = true
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        this.input.down = true
        break
      case ' ':
        this.input.space = true
        break
    }
  }

  private handleKeyUp(key: string) {
    switch (key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.input.left = false
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.input.right = false
        break
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.input.up = false
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        this.input.down = false
        break
      case ' ':
        this.input.space = false
        break
    }
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.running) return
    this.running = true
    this.lastFrameTime = performance.now()
    this.gameLoop(this.lastFrameTime)
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.running = false
  }

  /**
   * Pause/unpause the game
   */
  togglePause() {
    this.state.paused = !this.state.paused
  }

  /**
   * Main game loop
   */
  private gameLoop(currentTime: number) {
    if (!this.running) return

    // Calculate delta time
    const dt = (currentTime - this.lastFrameTime) / 1000 // in seconds
    this.lastFrameTime = currentTime
    this.fps = 1 / dt

    // Update and render
    if (!this.state.paused && !this.state.gameOver) {
      this.update(dt)
      this.render()
    }

    // Continue loop
    requestAnimationFrame((time) => this.gameLoop(time))
  }

  /**
   * Update game logic
   */
  private update(dt: number) {
    // Update time
    this.state.time += dt

    // Call custom update callback
    if (this.onUpdate) {
      this.onUpdate(dt)
    }

    // Check game over condition
    if (this.state.lives <= 0) {
      this.endGame(false)
    }
  }

  /**
   * Render game
   */
  private render() {
    // Clear canvas
    this.clear()

    // Call custom render callback
    if (this.onRender) {
      this.onRender()
    }
  }

  /**
   * Clear the canvas
   */
  clear(color: string = '#87CEEB') {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  /**
   * Draw a game object
   */
  drawObject(obj: GameObject) {
    if (!obj.active) return

    if (obj.sprite) {
      // Draw as emoji/text
      this.ctx.font = `${obj.height}px Arial`
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText(obj.sprite, obj.x + obj.width / 2, obj.y + obj.height / 2)
    } else {
      // Draw as rectangle
      this.ctx.fillStyle = obj.color || '#000000'
      this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
    }
  }

  /**
   * Check collision between two objects (AABB)
   */
  checkCollision(a: GameObject, b: GameObject): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    )
  }

  /**
   * Add score
   */
  addScore(points: number) {
    this.state.score += points
  }

  /**
   * Remove life
   */
  loseLife() {
    this.state.lives -= 1
  }

  /**
   * End the game
   */
  endGame(won: boolean) {
    this.state.gameOver = true
    this.state.won = won
    if (this.onGameOver) {
      this.onGameOver(won)
    }
  }

  /**
   * Draw text on canvas
   */
  drawText(text: string, x: number, y: number, size: number = 24, color: string = '#000000') {
    this.ctx.font = `bold ${size}px Arial`
    this.ctx.fillStyle = color
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'top'
    this.ctx.fillText(text, x, y)
  }

  /**
   * Draw centered text
   */
  drawTextCentered(text: string, y: number, size: number = 24, color: string = '#000000') {
    this.ctx.font = `bold ${size}px Arial`
    this.ctx.fillStyle = color
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(text, this.width / 2, y)
  }

  /**
   * Create a game object
   */
  createObject(
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    config: Partial<GameObject> = {}
  ): GameObject {
    const obj: GameObject = {
      type,
      x,
      y,
      width,
      height,
      vx: 0,
      vy: 0,
      active: true,
      ...config,
    }
    this.objects.push(obj)
    return obj
  }

  /**
   * Remove inactive objects
   */
  cleanupObjects() {
    this.objects = this.objects.filter((obj) => obj.active)
  }

  /**
   * Reset game state
   */
  reset() {
    this.state = {
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      won: false,
      paused: false,
      time: 0,
    }
    this.objects = []
  }
}
