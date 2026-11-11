"""Alinha o tempo das palavras do Whisper ao texto exato do roteiro e grava o palavras.ts do vídeo.

Uso:
    python tools/alinhar_roteiro.py "projetos/NNN. nome" <codigo> ["falado=>legenda" ...]

Lê:
    projetos/NNN. nome/transcricao/palavras.json   (lista de {"w", "s", "e"} do tools/transcrever.py)
    projetos/NNN. nome/audio/roteiro-falado.txt    (o texto que a voz leu)
Grava:
    src/videos/<codigo>/palavras.ts

Pares opcionais "falado=>legenda" trocam, na legenda, um trecho escrito para a voz pela grafia certa.
Ex.: "Píquis=>Pix"  "seis por um=>6x1". O tempo do trecho é dividido entre as palavras novas.

Como funciona (resumo): as duas listas de palavras são comparadas por programação dinâmica.
Uma palavra do roteiro pode casar com 1 a 3 palavras do Whisper ("6x1" com "6 por 1") e vice-versa.
Palavras do roteiro que a transcrição não tem ganham tempo por interpolação entre as vizinhas.
Só usa a biblioteca padrão do Python.
"""
import difflib
import json
import os
import re
import sys
import unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

NUMEROS = {
    "zero": "0", "um": "1", "uma": "1", "dois": "2", "duas": "2", "tres": "3", "quatro": "4", "cinco": "5",
    "seis": "6", "sete": "7", "oito": "8", "nove": "9", "dez": "10", "onze": "11", "doze": "12", "treze": "13",
    "quatorze": "14", "catorze": "14", "quinze": "15", "dezesseis": "16", "dezessete": "17", "dezoito": "18",
    "dezenove": "19", "vinte": "20", "trinta": "30", "quarenta": "40", "cinquenta": "50", "sessenta": "60",
    "setenta": "70", "oitenta": "80", "noventa": "90", "cem": "100", "cento": "100", "primeiro": "1o",
    "segundo": "2o", "terceiro": "3o", "reais": "", "real": "", "porcento": "%",
}


def normalizar(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    w = w.replace("%", "porcento").replace("$", "")
    return re.sub(r"[^a-z0-9]", "", w)


def canonico(w):
    n = normalizar(w)
    n = NUMEROS.get(n, n)
    return n.replace("por", "x")


def parecido(a, b):
    if a == b:
        return 1.0
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def alinhar(roteiro, falas):
    """Devolve lista de grupos (i0, i1, j0, j1, nota): roteiro[i0:i1] casado com falas[j0:j1]."""
    R = [canonico(w) for w in roteiro]
    F = [canonico(f["w"]) for f in falas]
    n, m = len(R), len(F)
    INF = float("inf")
    custo = [[INF] * (m + 1) for _ in range(n + 1)]
    volta = [[None] * (m + 1) for _ in range(n + 1)]
    custo[0][0] = 0.0
    for i in range(n + 1):
        for j in range(m + 1):
            c0 = custo[i][j]
            if c0 == INF:
                continue
            # palavra do roteiro sem fala correspondente
            if i < n and c0 + 1.0 < custo[i + 1][j]:
                custo[i + 1][j] = c0 + 1.0
                volta[i + 1][j] = (i, j, 0.0)
            # fala extra (o Whisper ouviu algo a mais)
            if j < m and c0 + 0.9 < custo[i][j + 1]:
                custo[i][j + 1] = c0 + 0.9
                volta[i][j + 1] = (i, j, 0.0)
            for a in range(1, 4):
                if i + a > n:
                    break
                ra = "".join(R[i:i + a])
                for b in range(1, 4):
                    if j + b > m:
                        break
                    if a > 1 and b > 1:
                        continue  # só 1:N ou N:1
                    fb = "".join(F[j:j + b])
                    s = parecido(ra, fb)
                    c = (1.0 - s) * (a + b) / 2.0 + 0.04 * (a + b - 2)
                    if c0 + c < custo[i + a][j + b]:
                        custo[i + a][j + b] = c0 + c
                        volta[i + a][j + b] = (i, j, s)
    grupos = []
    i, j = n, m
    while i > 0 or j > 0:
        pi, pj, s = volta[i][j]
        grupos.append((pi, i, pj, j, s))
        i, j = pi, pj
    grupos.reverse()
    return grupos


def tempos(roteiro, falas, grupos):
    s_ = [None] * len(roteiro)
    e_ = [None] * len(roteiro)
    avisos = []
    for i0, i1, j0, j1, nota in grupos:
        if i1 > i0 and j1 > j0:
            ini, fim = falas[j0]["s"], falas[j1 - 1]["e"]
            pesos = [max(1, len(normalizar(w))) for w in roteiro[i0:i1]]
            tot = float(sum(pesos))
            t = ini
            for k, i in enumerate(range(i0, i1)):
                d = (fim - ini) * pesos[k] / tot
                s_[i], e_[i] = t, t + d
                t += d
            if nota < 0.5:
                avisos.append('"%s" casou com "%s" (parecido %.0f%%)' % (" ".join(roteiro[i0:i1]), " ".join(f["w"] for f in falas[j0:j1]), nota * 100))
        elif i1 > i0:
            avisos.append('"%s" não foi achado na transcrição (tempo estimado)' % " ".join(roteiro[i0:i1]))
    # interpolação das palavras sem tempo
    n = len(roteiro)
    i = 0
    while i < n:
        if s_[i] is not None:
            i += 1
            continue
        k = i
        while k < n and s_[k] is None:
            k += 1
        antes = e_[i - 1] if i > 0 else (falas[0]["s"] if falas else 0.0)
        depois = s_[k] if k < n else (falas[-1]["e"] if falas else antes + 0.3 * (k - i))
        if depois - antes < 0.08 * (k - i):
            depois = antes + 0.08 * (k - i)
        pesos = [max(1, len(normalizar(w))) for w in roteiro[i:k]]
        tot = float(sum(pesos))
        t = antes
        for q, idx in enumerate(range(i, k)):
            d = (depois - antes) * pesos[q] / tot
            s_[idx], e_[idx] = t, t + d
            t += d
        i = k
    # nunca voltar no tempo
    for i in range(1, n):
        if s_[i] < s_[i - 1]:
            s_[i] = s_[i - 1]
        if e_[i] < s_[i]:
            e_[i] = s_[i]
    return [{"w": roteiro[i], "s": round(s_[i], 2), "e": round(e_[i], 2)} for i in range(n)], avisos


def aplicar_trocas(palavras, trocas):
    for falado, legenda in trocas:
        alvo = [normalizar(x) for x in falado.split()]
        novo = legenda.split()
        if not alvo or not novo:
            continue
        i = 0
        while i <= len(palavras) - len(alvo):
            if [normalizar(p["w"]) for p in palavras[i:i + len(alvo)]] == alvo:
                ini, fim = palavras[i]["s"], palavras[i + len(alvo) - 1]["e"]
                pont = re.search(r"[.,;:!?…]+$", palavras[i + len(alvo) - 1]["w"])
                ws = list(novo)
                if pont and not re.search(r"[.,;:!?…]$", ws[-1]):
                    ws[-1] += pont.group(0)
                d = (fim - ini) / len(ws)
                troca = [{"w": w, "s": round(ini + k * d, 2), "e": round(ini + (k + 1) * d, 2)} for k, w in enumerate(ws)]
                palavras[i:i + len(alvo)] = troca
                i += len(troca)
            else:
                i += 1
    return palavras


def main():
    args = sys.argv[1:]
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)
    pasta = args[0] if os.path.isabs(args[0]) else os.path.join(RAIZ, args[0])
    codigo = args[1]
    trocas = []
    for par in args[2:]:
        if "=>" not in par:
            sys.exit('Par inválido: %s (use "falado=>legenda")' % par)
        a, b = par.split("=>", 1)
        trocas.append((a.strip(), b.strip()))

    arq_json = os.path.join(pasta, "transcricao", "palavras.json")
    arq_rot = os.path.join(pasta, "audio", "roteiro-falado.txt")
    for a in (arq_json, arq_rot):
        if not os.path.exists(a):
            sys.exit("Arquivo não encontrado: %s" % a)
    with open(arq_json, encoding="utf-8") as f:
        falas = [p for p in json.load(f) if str(p.get("w", "")).strip()]
    with open(arq_rot, encoding="utf-8") as f:
        texto = f.read()
    roteiro = texto.split()
    if not roteiro:
        sys.exit("O roteiro está vazio.")

    grupos = alinhar(roteiro, falas)
    palavras, avisos = tempos(roteiro, falas, grupos)
    palavras = aplicar_trocas(palavras, trocas)

    destino = os.path.join(RAIZ, "src", "videos", codigo)
    os.makedirs(destino, exist_ok=True)
    saida = os.path.join(destino, "palavras.ts")
    with open(saida, "w", encoding="utf-8", newline="\n") as f:
        f.write("// Gerado por tools/alinhar_roteiro.py. Não editar à mão.\n")
        f.write("export const PALAVRAS: {w: string; s: number; e: number}[] = ")
        f.write(json.dumps(palavras, ensure_ascii=False))
        f.write(";\n")

    buracos = [(palavras[i - 1]["w"], palavras[i]["w"], palavras[i]["s"] - palavras[i - 1]["e"]) for i in range(1, len(palavras)) if palavras[i]["s"] - palavras[i - 1]["e"] > 1.5]
    print("Roteiro: %d palavras | Transcrição: %d palavras | palavras.ts: %d palavras" % (len(roteiro), len(falas), len(palavras)))
    print("Última palavra: \"%s\" termina em %.2f s" % (palavras[-1]["w"], palavras[-1]["e"]))
    if buracos:
        print("Pausas maiores que 1,5 s:")
        for a, b, d in buracos:
            print("  %.2f s entre \"%s\" e \"%s\"" % (d, a, b))
    if avisos:
        print("Avisos (%d):" % len(avisos))
        for a in avisos:
            print("  - " + a)
    print("Gravado:", os.path.relpath(saida, RAIZ))


if __name__ == "__main__":
    main()
