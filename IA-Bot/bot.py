import random

def exibir_tabuleiro(pilhas):
    print("\nEstado atual:")
    for i, palitos in enumerate(pilhas):
        print(f"Linha {i + 1}: {'| ' * palitos}({palitos})")
    print()

def jogada_jogador(pilhas):
    while True:
        try:
            linha = int(input("Escolha a linha (1 a 4): ")) - 1
            if linha < 0 or linha >= len(pilhas) or pilhas[linha] == 0:
                print("Linha inválida ou vazia.")
                continue
            qtd = int(input("Quantos palitos remover? "))
            if qtd <= 0 or qtd > pilhas[linha]:
                print("Quantidade inválida.")
                continue
            pilhas[linha] -= qtd
            break
        except ValueError:
            print("Digite um número válido.")

def jogada_bot(pilhas):
    print("🤖 Bot está pensando...")

    xor_total = 0
    for p in pilhas:
        xor_total ^= p

    if xor_total == 0:
        # Situação desfavorável, remove 1 de qualquer linha não vazia
        for i, p in enumerate(pilhas):
            if p > 0:
                pilhas[i] -= 1
                print(f"Bot removeu 1 palito da linha {i + 1}")
                return
    else:
        # Jogada ótima
        for i, p in enumerate(pilhas):
            alvo = p ^ xor_total
            if alvo < p:
                qtd = p - alvo
                pilhas[i] -= qtd
                print(f"Bot removeu {qtd} palito(s) da linha {i + 1}")
                return

def jogo_nim():
    print("🎮 Bem-vindo ao Jogo de Palitos (Nim) - Você vs Bot IA")
    pilhas = [1, 3, 5, 7]
    jogador_da_vez = "jogador" if random.choice([True, False]) else "bot"

    while any(p > 0 for p in pilhas):
        exibir_tabuleiro(pilhas)
        if jogador_da_vez == "jogador":
            jogada_jogador(pilhas)
            jogador_da_vez = "bot"
        else:
            jogada_bot(pilhas)
            jogador_da_vez = "jogador"

    exibir_tabuleiro(pilhas)
    if jogador_da_vez == "jogador":
        print("🤖 O Bot venceu! Boa tentativa.")
    else:
        print("🎉 Parabéns! Você venceu o Bot.")

if __name__ == "__main__":
    jogo_nim()