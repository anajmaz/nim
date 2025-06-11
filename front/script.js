document.addEventListener('DOMContentLoaded', () => {
  let board = [1, 3, 5, 7];
  let selectedLine = null;
  let selectedSticks = [];
  let currentPlayer = 1;  // jogador que está na vez
  let lastPlayer = null;  // jogador que fez a última jogada

  const currentPlayerDiv = document.getElementById('currentPlayer');

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

    // Guarda o jogador que fez a última jogada
    lastPlayer = currentPlayer;

    selectedLine = null;
    selectedSticks = [];

    renderBoard();

    if (checkGameOver()) {
      // mostra no modal quem perdeu
      const modal = document.getElementById('gameOverModal');
      modal.querySelector('p').textContent = `Fim de jogo! Jogador ${lastPlayer} perdeu.`;
      modal.classList.remove('hidden');
    } else {
      switchPlayer();
    }
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

  function checkGameOver() {
    const total = board.reduce((sum, n) => sum + n, 0);
    return total === 0;
  }

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    const modal = document.getElementById('gameOverModal');
    modal.classList.add('hidden');
    restartGame();
  });

  document.getElementById('confirm-button').addEventListener('click', confirmMove);
  document.getElementById('restart-button').addEventListener('click', restartGame);

  updateCurrentPlayerText();
  renderBoard();
});
