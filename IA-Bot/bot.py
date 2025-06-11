def nim_bot_move(board):
    """
    Recebe o estado atual do tabuleiro (lista com a quantidade de palitos em cada pilha)
    Retorna uma tupla (linha, sticks_to_remove) indicando a jogada do bot.
    """
    nim_sum = 0
    for pile in board:
        nim_sum ^= pile

    if nim_sum == 0:
        # Nenhuma jogada vantajosa, remove 1 da primeira pilha que tiver palitos
        for i, pile in enumerate(board):
            if pile > 0:
                return i, 1
    else:
        # Encontra uma pilha para deixar o nim sum = 0 após a jogada
        for i, pile in enumerate(board):
            target = pile ^ nim_sum
            if target < pile:
                sticks_to_remove = pile - target
                return i, sticks_to_remove

    # Caso nenhuma jogada encontrada (não deveria acontecer)
    return None, 0


# Exemplo de uso:
if __name__ == "__main__":
    board = [1, 3, 5, 7]
    linha, palitos = nim_bot_move(board)
    print(f"Bot remove {palitos} palito(s) da pilha {chr(65 + linha)}")
