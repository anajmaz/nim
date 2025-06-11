document.addEventListener('DOMContentLoaded', () => {
  // Tudo dentro daqui é executado depois que o HTML foi carregado

  let board = [1, 3, 5, 7];
  let selectedLine = null;
  let selectedSticks = [];

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

    selectedLine = null;
    selectedSticks = [];

    renderBoard();
    checkGameOver();
  }

  function restartGame() {
    board = [1, 3, 5, 7];
    selectedLine = null;
    selectedSticks = [];
    renderBoard();
  }

  function checkGameOver() {
    const total = board.reduce((sum, n) => sum + n, 0);
    if (total === 0) {
      alert('Fim de jogo! Todos os fósforos foram removidos.');
    }
  }

  document.getElementById('confirm-button').addEventListener('click', confirmMove);
  document.getElementById('restart-button').addEventListener('click', restartGame);

  renderBoard(); // chama pela primeira vez
});



function selectStick(lineIndex, stickIndex, stickElement) {
  if (selectedLine !== null && selectedLine !== lineIndex) return;

  const key = `${lineIndex}-${stickIndex}`;
  const alreadySelected = selectedSticks.find(s => s.key === key);

  if (alreadySelected) {
    // Deselecionar
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

  selectedLine = null;
  selectedSticks = [];

  renderBoard();
  checkGameOver();
}

function checkGameOver() {
  const total = board.reduce((sum, n) => sum + n, 0);
  if (total === 0) {
    alert('Fim de jogo! Todos os fósforos foram removidos.');
  }
}

function restartGame() {
  board = [1, 3, 5, 7];       // Reconfigura o jogo inicial
  selectedLine = null;
  selectedSticks = [];
  renderBoard();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderBoard();
  document.getElementById('confirm-button').addEventListener('click', confirmMove);
});
