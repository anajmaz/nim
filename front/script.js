document.addEventListener('DOMContentLoaded', () => {
  // Estado do jogo
  let board = [1, 3, 5, 7];
  let selectedLine = null;
  let selectedSticks = [];
  let currentPlayer = 1; // Começa com o Jogador 1

  // Elemento que mostra qual jogador está na vez
  const currentPlayerDiv = document.getElementById('currentPlayer');

  // Atualiza o texto que mostra o jogador atual
  function updateCurrentPlayerText() {
    currentPlayerDiv.textContent = `Jogador ${currentPlayer}, sua vez`;
  }

  // Alterna o jogador entre 1 e 2
  function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateCurrentPlayerText();
  }

  // Renderiza o tabuleiro com as pilhas e fósforos
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

  // Seleciona ou desseleciona um fósforo
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

  // Confirma a jogada, remove os fósforos selecionados, atualiza o tabuleiro e troca jogador
  function confirmMove() {
    if (selectedSticks.length === 0) return;

    const line = selectedLine;
    const sticksToRemove = selectedSticks.length;
    board[line] -= sticksToRemove;

    selectedLine = null;
    selectedSticks = [];

    renderBoard();
    checkGameOver();

    // Troca o jogador após a jogada confirmada
    switchPlayer();
  }

  // Reinicia o jogo e volta para o jogador 1
  function restartGame() {
    board = [1, 3, 5, 7];
    selectedLine = null;
    selectedSticks = [];
    currentPlayer = 1;
    updateCurrentPlayerText();
    renderBoard();
  }

  // Checa se o jogo terminou
  function checkGameOver() {
    const total = board.reduce((sum, n) => sum + n, 0);
    if (total === 0) {
      const modal = document.getElementById('gameOverModal');
      modal.classList.remove('hidden');
    }
  }

  // Fecha o modal de fim de jogo e reinicia o jogo
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    const modal = document.getElementById('gameOverModal');
    modal.classList.add('hidden');
    restartGame();
  });

  // Eventos dos botões
  document.getElementById('confirm-button').addEventListener('click', confirmMove);
  document.getElementById('restart-button').addEventListener('click', restartGame);

  // Inicializa a tela
  updateCurrentPlayerText();
  renderBoard();
});
