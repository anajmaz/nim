document.addEventListener('DOMContentLoaded', () => {
  // Estado do jogo
  let board = [1, 3, 5, 7];
  let selectedLine = null;
  let selectedSticks = [];
  let currentPlayer = 1;
  let lastPlayer = null;

  const currentPlayerDiv = document.getElementById('currentPlayer');
  const modeModal = document.getElementById('modeSelectionModal');
  const confirmButton = document.getElementById('confirm-button');
  const restartButton = document.getElementById('restart-button');

  function updateCurrentPlayerText() {
    currentPlayerDiv.textContent = `Jogador ${currentPlayer}, sua vez`;
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateCurrentPlayerText();
  }

  function renderBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = '';

    board.forEach((count, lineIndex) => {
      const pileDiv = document.createElement('div');
      pileDiv.className = 'pile';
      pileDiv.id = `pile${lineIndex + 1}`;

      const pileName = document.createElement('div');
      pileName.className = 'pile-name';
      pileName.textContent = `Pilha ${String.fromCharCode(65 + lineIndex)}`;

      const sticksDiv = document.createElement('div');
      sticksDiv.className = 'sticks';

      for (let i = 0; i < count; i++) {
        const stick = document.createElement('div');
        stick.className = 'stick';
        stick.dataset.index = i;
        stick.dataset.line = lineIndex;

        stick.addEventListener('click', () => selectStick(lineIndex, i, stick));
        sticksDiv.appendChild(stick);
      }

      pileDiv.appendChild(pileName);
      pileDiv.appendChild(sticksDiv);
      boardContainer.appendChild(pileDiv);
    });
  }

  function selectStick(lineIndex, stickIndex, stickElement) {
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

    const sticksToRemove = selectedSticks.length;
    board[selectedLine] -= sticksToRemove;
    lastPlayer = currentPlayer;

    selectedLine = null;
    selectedSticks = [];

    renderBoard();

    if (checkGameOver()) {
      showGameOver();
    } else {
      switchPlayer();
    }
  }

  function checkGameOver() {
    return board.reduce((sum, n) => sum + n, 0) === 0;
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

  // Eventos
  confirmButton.addEventListener('click', confirmMove);
  restartButton.addEventListener('click', restartGame);
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('gameOverModal').classList.add('hidden');
    restartGame();
  });

  // Modal de seleção de modo (apenas visual)
  document.getElementById('playerVsPlayerBtn').addEventListener('click', () => {
    modeModal.classList.add('hidden');
    updateCurrentPlayerText();
    renderBoard();
  });

  document.getElementById('playerVsBotBtn').addEventListener('click', () => {
    modeModal.classList.add('hidden');
    updateCurrentPlayerText();
    renderBoard();
    // O jogo continua sendo entre 2 jogadores humanos mesmo que o jogador clique aqui
  });

  // Mostrar seleção de modo ao iniciar
  modeModal.classList.remove('hidden');
});
