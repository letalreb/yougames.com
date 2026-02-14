import type { GameTemplate } from '@/types/game'

/**
 * ============================================
 * MATH QUIZ GAME TEMPLATE
 * Educational math quiz with fun visuals
 * ============================================
 */

export const mathQuizTemplate: GameTemplate = {
  category: 'math',
  name: 'Math Quiz',
  description: 'Risolvi problemi matematici divertenti!',
  icon: '➕',
  
  configurableParams: [
    'operation',
    'maxNumber',
    'questionCount',
    'backgroundColor',
    'characterSprite',
  ],
  
  defaultConfig: {
    player: {
      sprite: '🦊',
      speed: 0,
      size: 80,
      color: '#E67E22',
    },
    world: {
      backgroundColor: '#3498DB',
      width: 800,
      height: 600,
      theme: 'abstract',
    },
    mechanics: [
      { type: 'answer', params: { questionType: 'math' } },
    ],
    goal: {
      type: 'answer_questions',
      target: 10,
      description: 'Rispondi a 10 domande!',
    },
    difficulty: 'easy',
  },

  examplePrompts: [
    'quiz di matematica con addizioni',
    'gioco con moltiplicazioni facili',
    'problemi di matematica per bambini',
  ],

  baseCode: `
    return (function(context) {
      const { canvas, config } = context;
      const ctx = canvas.getContext('2d');
      
      const OPERATION = '{{OPERATION}}'; // 'add', 'subtract', 'multiply'
      const MAX_NUMBER = {{MAX_NUMBER}};
      const QUESTION_COUNT = {{QUESTION_COUNT}};
      const CHARACTER = '{{CHARACTER_SPRITE}}';
      
      let currentQuestion = null;
      let score = 0;
      let questionNumber = 0;
      let selectedAnswer = null;
      let feedback = null;
      let feedbackTimer = 0;
      let gameOver = false;
      
      // Generate question
      function generateQuestion() {
        questionNumber++;
        const a = Math.floor(Math.random() * MAX_NUMBER) + 1;
        const b = Math.floor(Math.random() * MAX_NUMBER) + 1;
        
        let question, correctAnswer;
        
        switch (OPERATION) {
          case 'add':
            question = a + ' + ' + b + ' = ?';
            correctAnswer = a + b;
            break;
          case 'subtract':
            const larger = Math.max(a, b);
            const smaller = Math.min(a, b);
            question = larger + ' - ' + smaller + ' = ?';
            correctAnswer = larger - smaller;
            break;
          case 'multiply':
            const smallA = Math.floor(Math.random() * 10) + 1;
            const smallB = Math.floor(Math.random() * 10) + 1;
            question = smallA + ' × ' + smallB + ' = ?';
            correctAnswer = smallA * smallB;
            break;
          default:
            question = a + ' + ' + b + ' = ?';
            correctAnswer = a + b;
        }
        
        // Generate wrong answers
        const answers = [correctAnswer];
        while (answers.length < 4) {
          const wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
          if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
          }
        }
        
        // Shuffle answers
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        
        currentQuestion = {
          text: question,
          answers: answers,
          correct: correctAnswer,
        };
        
        selectedAnswer = null;
        feedback = null;
      }
      
      // Click handler
      canvas.addEventListener('click', (e) => {
        if (gameOver || feedback !== null) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check answer buttons
        const buttonWidth = 150;
        const buttonHeight = 80;
        const buttonMargin = 20;
        const startY = 350;
        
        currentQuestion.answers.forEach((answer, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const buttonX = canvas.width / 2 - buttonWidth - buttonMargin / 2 + col * (buttonWidth + buttonMargin);
          const buttonY = startY + row * (buttonHeight + buttonMargin);
          
          if (x > buttonX && x < buttonX + buttonWidth &&
              y > buttonY && y < buttonY + buttonHeight) {
            checkAnswer(answer);
          }
        });
      });
      
      function checkAnswer(answer) {
        selectedAnswer = answer;
        
        if (answer === currentQuestion.correct) {
          feedback = 'correct';
          score++;
        } else {
          feedback = 'wrong';
        }
        
        feedbackTimer = 1.5; // Show feedback for 1.5 seconds
      }
      
      // Update
      function update(dt) {
        if (gameOver) return;
        
        if (feedbackTimer > 0) {
          feedbackTimer -= dt;
          if (feedbackTimer <= 0) {
            if (questionNumber >= QUESTION_COUNT) {
              gameOver = true;
              context.onGameOver(true, score);
            } else {
              generateQuestion();
            }
          }
        }
      }
      
      // Render
      function render() {
        // Background
        ctx.fillStyle = '{{BACKGROUND_COLOR}}';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Character
        ctx.font = '100px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(CHARACTER, canvas.width / 2, 120);
        
        // Question
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentQuestion.text, canvas.width / 2, 240);
        
        // Answer buttons
        const buttonWidth = 150;
        const buttonHeight = 80;
        const buttonMargin = 20;
        const startY = 350;
        
        currentQuestion.answers.forEach((answer, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = canvas.width / 2 - buttonWidth - buttonMargin / 2 + col * (buttonWidth + buttonMargin);
          const y = startY + row * (buttonHeight + buttonMargin);
          
          // Button background
          if (feedback && answer === selectedAnswer) {
            ctx.fillStyle = feedback === 'correct' ? '#2ECC71' : '#E74C3C';
          } else {
            ctx.fillStyle = 'white';
          }
          
          ctx.fillRect(x, y, buttonWidth, buttonHeight);
          
          // Button border
          ctx.strokeStyle = '#2C3E50';
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, buttonWidth, buttonHeight);
          
          // Answer text
          ctx.fillStyle = '#2C3E50';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(answer, x + buttonWidth / 2, y + buttonHeight / 2);
        });
        
        // Feedback
        if (feedback) {
          ctx.font = 'bold 40px Arial';
          ctx.textAlign = 'center';
          if (feedback === 'correct') {
            ctx.fillStyle = '#2ECC71';
            ctx.fillText('✓ CORRETTO! 🎉', canvas.width / 2, 290);
          } else {
            ctx.fillStyle = '#E74C3C';
            ctx.fillText('✗ Riprova!', canvas.width / 2, 290);
          }
        }
        
        // Score
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Punteggio: ' + score + ' / ' + questionNumber, 30, 40);
        ctx.textAlign = 'right';
        ctx.fillText('Domanda: ' + questionNumber + ' / ' + QUESTION_COUNT, canvas.width - 30, 40);
        
        // Game over
        if (gameOver) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const percentage = Math.round((score / QUESTION_COUNT) * 100);
          let emoji = '🌟';
          if (percentage === 100) emoji = '🏆';
          else if (percentage >= 80) emoji = '🎉';
          else if (percentage >= 60) emoji = '👍';
          
          ctx.fillStyle = '#F1C40F';
          ctx.font = 'bold 56px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(emoji + ' COMPLETATO! ' + emoji, canvas.width / 2, canvas.height / 2 - 50);
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 36px Arial';
          ctx.fillText('Punteggio: ' + score + ' / ' + QUESTION_COUNT + ' (' + percentage + '%)', canvas.width / 2, canvas.height / 2 + 20);
        }
      }
      
      // Game loop
      let running = true;
      let lastTime = performance.now();
      
      function gameLoop(currentTime) {
        if (!running) return;
        
        const dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        update(dt);
        render();
        requestAnimationFrame(gameLoop);
      }
      
      // Start
      generateQuestion();
      
      return {
        start: () => {
          running = true;
          lastTime = performance.now();
          requestAnimationFrame(gameLoop);
        },
        stop: () => {
          running = false;
        }
      };
    });
  `,
}
