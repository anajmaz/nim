import random
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

def calcular_jogada_bot(pilhas):
    # Estratégia simples: remove 1 palito da maior pilha disponível
    max_pilha = max(enumerate(pilhas), key=lambda x: x[1])
    indice, qtd = max_pilha
    if qtd == 0:
        return None
    return {"linha": indice, "quantidade": 1}

@app.route('/api/bot-move', methods=['POST'])
def bot_move():
    dados = request.json
    estado = json.loads(dados['estado'])  # Ex: [1, 3, 5, 7]

    jogada = calcular_jogada_bot(estado)

    if jogada:
        estado[jogada["linha"]] -= jogada["quantidade"]
        return jsonify({
            "nova_estado": estado,
            "jogada_bot": jogada
        })
    else:
        return jsonify({"erro": "Nenhuma jogada possível"}), 400

if __name__ == '__main__':
    app.run(debug=True)
