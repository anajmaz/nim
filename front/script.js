document.addEventListener('DOMContentLoaded', () => {
  let board = [1, 3, 5, 7];
  let selectedLine = null;
  let selectedSticks = [];
  let currentPlayer = 1;
  let lastPlayer = null;
  let versusBot = false;
  let matchId = null; // Inicialmente sem partida

  const currentPlayerDiv = document.getElementById('currentPlayer');
  const modeModal = document.getElementById('modeSelectionModal');
  const confirmButton = document.getElementById('confirm-button');
  const restartButton = document.getElementById('restart-button');

  function updateCurrentPlayerText() {
    if (currentPlayer === 0 && versusBot) {
      currentPlayerDiv.textContent = `Vez da IA`;
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

  async function confirmMove() {
    if (selectedSticks.length === 0 || matchId === null) return;

    const sticksToRemove = selectedSticks.length;
    const line = selectedLine;

    try {
      const response = await fetch('http://localhost:5045/api/match/player-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          MatchId: matchId,
          PlayerId: currentPlayer,
          Line: line,
          SticksRemoved: sticksToRemove
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert('Erro: ' + errorText);
        return;
      }

      const match = await response.json();

      board = JSON.parse(match.gameState);
      lastPlayer = currentPlayer;
      selectedLine = null;
      selectedSticks = [];

      renderBoard();

      if (match.winnerId && match.winnerId !== 0) {
        showGameOver(match.winnerId);
        return;
      }

      currentPlayer = match.currentPlayerId === 0 ? 2 : match.currentPlayerId;
      updateCurrentPlayerText();

      if (match.currentPlayerId === 0 && versusBot) {
        await callAIMove();
      }
    } catch (error) {
      console.error("Erro ao enviar jogada:", error);
    }
  }

  async function callAIMove() {
    if (matchId === null) return;

    try {
      const response = await fetch('http://localhost:5045/api/match/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: matchId,
          playerId: 0 // playerId 0 é IA no backend
        })
      });

      if (!response.ok) {
        console.error("Erro ao buscar jogada da IA");
        return;
      }

      const match = await response.json();

      board = JSON.parse(match.gameState);
      lastPlayer = 2; // IA é jogador 2 no frontend
      renderBoard();

      if (match.winnerId && match.winnerId !== 0) {
        showGameOver(match.winnerId);
        return;
      }

      currentPlayer = match.currentPlayerId === 0 ? 2 : match.currentPlayerId;
      updateCurrentPlayerText();

    } catch (error) {
      console.error("Erro de rede:", error);
    }
  }

  function checkGameOver() {
    return board.reduce((sum, n) => sum + n, 0) === 0;
  }

  function showGameOver(winnerId) {
    const modal = document.getElementById('gameOverModal');
    const loser = winnerId === 1 ? 2 : 1;
    let message = '';

    if (versusBot && loser === 2) {
      message = 'Fim de jogo! Você venceu a IA!';
    } else if (versusBot && loser === 1) {
      message = 'Fim de jogo! A IA venceu você!';
    } else {
      message = `Fim de jogo! Jogador ${loser} perdeu.`;
    }

    modal.querySelector('p').textContent = message;
    modal.classList.remove('hidden');
  }

  async function restartGame() {
    board = [1, 3, 5, 7];
    selectedLine = null;
    selectedSticks = [];
    currentPlayer = 1;
    lastPlayer = null;
    matchId = null;

    updateCurrentPlayerText();
    renderBoard();

    modeModal.classList.remove('hidden');
  }

  confirmButton.addEventListener('click', confirmMove);
  restartButton.addEventListener('click', restartGame);

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('gameOverModal').classList.add('hidden');
    restartGame();
  });

  document.getElementById('playerVsPlayerBtn').addEventListener('click', async () => {
    versusBot = false;

    try {
      const response = await fetch('http://localhost:5045/api/match/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1Id: 1,
          player2Id: 2
        })
      });
      if (response.ok) {
        const match = await response.json();
        matchId = match.id;
        board = JSON.parse(match.gameState);
        currentPlayer = match.currentPlayerId;
        updateCurrentPlayerText();
        renderBoard();
      } else {
        console.error("Erro ao criar partida PvP.");
      }
    } catch (error) {
      console.error("Erro de rede ao criar partida:", error);
    }

    modeModal.classList.add('hidden');
  });

  document.getElementById('playerVsBotBtn').addEventListener('click', async () => {
    versusBot = true;

    try {
      const response = await fetch('http://localhost:5045/api/match/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1Id: 1,
          player2Id: 0 // IA tem playerId 0 no backend
        })
      });
      if (response.ok) {
        const match = await response.json();
        matchId = match.id;
        board = JSON.parse(match.gameState);
        currentPlayer = match.currentPlayerId;
        updateCurrentPlayerText();
        renderBoard();

        // Se IA começa, chama a jogada da IA
        if (currentPlayer === 0) {
          await callAIMove();
        }
      } else {
        console.error("Erro ao criar partida com IA.");
      }
    } catch (error) {
      console.error("Erro de rede ao criar partida:", error);
    }

    modeModal.classList.add('hidden');
  });

  updateCurrentPlayerText();
  modeModal.classList.remove('hidden');
});
