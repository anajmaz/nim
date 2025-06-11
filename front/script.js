document.addEventListener('DOMContentLoaded', () => {
  let board = [1, 3, 5, 7];
  let selectedLine = null;
  let selectedSticks = [];
  let currentPlayer = 1;
  let lastPlayer = null;
  let againstBot = false; // define se o jogo é contra o bot

  const currentPlayerDiv = document.getElementById('currentPlayer');
  const confirmButton = document.getElementById('confirm-button');

  function updateCurrentPlayerText() {
    if (againstBot && currentPlayer === 2) {
      currentPlayerDiv.textContent = `Bot está jogando...`;
    } else {
      currentPlayerDiv.textContent = `Jogador ${currentPlayer}, sua vez`;
    }
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateCurrentPlayerText();
  }

  function renderBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = '';

    board.forEach((count, lineIndex) => {
      const line = document.createElement('div');
      line.className = 'sticks';
      line.dataset.line = lineIndex;

      for (let i = 0; i < count; i++) {
        const stick = document.createElement('div');
        stick.className = 'stick';
        stick.dataset.index = i;
        stick.dataset.line = lineIndex;

        stick.addEventListener('click', () => selectStick(lineIndex, i, stick));
        line.appendChild(stick);
      }

      boardContainer.appendChild(line);
    });
  }

  function selectStick(lineIndex, stickIndex, stickElement) {
    if (againstBot && currentPlayer === 2) return; // não deixa selecionar se for a vez do bot

    if (selectedLine !== null && selectedLine !== lineIndex) return;

    const key = `${lineIndex}-${stickIndex}`;
    const alreadySelected = selectedSticks.find(s => s.key === key);

    if (alreadySelected) {
      selectedSticks = selectedSticks.filter(s => s.key !== key);
      stickElement.classList.remove('selected');
      if (selectedSticks.length === 0) selectedLine = null;
    } else {
      selectedLine = lineIndex;
      selectedSticks.push({ key, element: stickElement });
      stickElement.classList.add('selected');
    }
  }

  function confirmMove() {
    if (selectedSticks.length === 0) return;

    const line = selectedLine;
    const sticksToRemove = selectedSticks.length;
    board[line] -= sticksToRemove;

    lastPlayer = currentPlayer;
    selectedLine = null;
    selectedSticks = [];

    renderBoard();

    if (checkGameOver()) {
      showGameOver();
    } else {
      switchPlayer();

      // se for contra o bot e for a vez dele, o bot joga
      if (againstBot && currentPlayer === 2) {
        setTimeout(botMove, 800);
      }
    }
  }

  function botMove() {
    // bot joga: remove 1 fósforo de uma pilha aleatória válida
    const nonEmptyPiles = board.map((count, index) => ({ count, index })).filter(p => p.count > 0);
    const chosen = nonEmptyPiles[Math.floor(Math.random() * nonEmptyPiles.length)];

    board[chosen.index] -= 1;
    lastPlayer = currentPlayer;
    renderBoard();

    if (checkGameOver()) {
      showGameOver();
    } else {
      switchPlayer();
    }
  }

  function checkGameOver() {
    const total = board.reduce((sum, n) => sum + n, 0);
    return total === 0;
  }

  function showGameOver() {
    const modal = document.getElementById('gameOverModal');
    modal.querySelector('p').textContent = `Fim de jogo! Jogador ${lastPlayer} perdeu.`;
    modal.classList.remove('hidden');
  }

  function restartGame() {
    board = [1, 3, 5, 7];
    selectedLine = null;
    selectedSticks = [];
    currentPlayer = 1;
    lastPlayer = null;
    updateCurrentPlayerText();
    renderBoard();
  }

  // Abrir seleção de modo no início
  const modeModal = document.getElementById('modeSelectModal');
  document.getElementById('vsPlayerBtn').addEventListener('click', () => {
    againstBot = false;
    modeModal.classList.add('hidden');
    updateCurrentPlayerText();
    renderBoard();
  });

  document.getElementById('vsBotBtn').addEventListener('click', () => {
    againstBot = true;
    modeModal.classList.add('hidden');
    updateCurrentPlayerText();
    renderBoard();
  });

  // Botões
  confirmButton.addEventListener('click', confirmMove);
  document.getElementById('restart-button').addEventListener('click', () => {
    modeModal.classList.remove('hidden');
    restartGame();
  });

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('gameOverModal').classList.add('hidden');
    modeModal.classList.remove('hidden');
    restartGame();
  });
});
