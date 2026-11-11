"""Gera os efeitos sonoros do Estúdio 3D Explicado (projetos/_estudio/sons/*.wav).

Sons sintetizados aqui mesmo (sem arquivo de terceiros): suaves, curtos, sem estalo.
Uso:  python tools/gerar_sons.py
Só precisa da biblioteca padrão do Python.
"""
import math
import os
import random
import struct
import wave

TAXA = 48000
PICO = 0.5  # cerca de -6 dBFS
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "projetos", "_estudio", "sons")


def envelope(i, n, ataque=0.004, cauda=4.0):
    t = i / TAXA
    a = min(1.0, t / ataque) if ataque > 0 else 1.0
    fim = min(1.0, (n - i) / (TAXA * 0.01))  # 10 ms de saída: nunca estala
    return a * math.exp(-cauda * t) * fim


def salvar(nome, amostras):
    m = max(1e-9, max(abs(x) for x in amostras))
    k = PICO / m
    os.makedirs(SAIDA, exist_ok=True)
    with wave.open(os.path.join(SAIDA, nome + ".wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(TAXA)
        quadros = bytearray()
        for x in amostras:
            v = int(max(-1.0, min(1.0, x * k)) * 32767)
            quadros += struct.pack("<hh", v, v)
        w.writeframes(bytes(quadros))


def varredura(f0, f1, dur, cauda, harm=0.0):
    n = int(TAXA * dur)
    fase = 0.0
    out = []
    for i in range(n):
        p = i / n
        f = f0 + (f1 - f0) * p
        fase += 2 * math.pi * f / TAXA
        s = math.sin(fase) + harm * math.sin(2 * fase)
        out.append(s * envelope(i, n, cauda=cauda))
    return out


def ruido(dur, suavizar, forma):
    random.seed(7)
    n = int(TAXA * dur)
    out, acc = [], 0.0
    for i in range(n):
        acc += (random.uniform(-1, 1) - acc) * suavizar
        out.append(acc * forma(i / n) * min(1.0, (n - i) / (TAXA * 0.01)))
    return out


def somar(a, b, kb=1.0):
    n = max(len(a), len(b))
    return [(a[i] if i < len(a) else 0) + kb * (b[i] if i < len(b) else 0) for i in range(n)]


def main():
    salvar("pop", varredura(520, 880, 0.12, 28, 0.2))
    salvar("tique", varredura(1800, 1600, 0.05, 70))
    salvar("bip", varredura(980, 980, 0.14, 12, 0.1))
    salvar("ding", somar(varredura(1318, 1318, 1.2, 3.2), varredura(2636, 2636, 1.2, 5.0), 0.25))
    salvar("baque", varredura(110, 48, 0.35, 11))
    salvar("subida", varredura(320, 900, 0.6, 2.5, 0.15))
    salvar("whoosh", ruido(0.5, 0.06, lambda p: math.sin(math.pi * p) ** 2))
    salvar("impacto", somar(varredura(90, 40, 0.6, 6), ruido(0.4, 0.15, lambda p: (1 - p) ** 3), 0.5))
    print("Sons gravados em", SAIDA)


if __name__ == "__main__":
    main()
