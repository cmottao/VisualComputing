# Examen Final de Computación Visual 2026-I

**Universidad Nacional de Colombia — Computación Visual**
**Estudiante:** Cristian Steven Motta Ojeda
**Modalidad:** Entrega individual

## Descripción general

Este repositorio contiene los dos ejercicios prácticos del examen final:

1. **Ejercicio 1 — Procesamiento visual e IA:** una aplicación en Python con
   OpenCV que ejecuta un pipeline de procesamiento de imágenes (carga, escala de
   grises, espacio de color HSV, suavizado, detección de bordes y segmentación
   clásica) y guarda los resultados para compararlos.
2. **Ejercicio 2 — Escena 3D interactiva:** una escena en Three.js con un **brazo
   robótico articulado** (tema: robótica/automatización) que recoge y traslada una
   pieza, con cámara interactiva, materiales PBR, iluminación, animación e
   interacción por sliders y teclado.

## Estructura del repositorio

```text
examen-final-computacion-visual-cristian-motta/
├── README.md                          # este archivo
├── .gitignore
├── ejercicio_1_procesamiento_visual/
│   ├── src/main.py                    # pipeline de OpenCV
│   ├── requirements.txt
│   ├── data/                          # entrada opcional del usuario
│   ├── resultados/                    # imágenes generadas
│   └── README.md
└── ejercicio_2_escena_3d_interactiva/
    ├── index.html
    ├── package.json
    ├── src/main.js                    # escena, cámara, luces, interacción
    ├── src/robot.js                   # brazo robótico jerárquico (PBR)
    ├── media/                         # capturas + demo.gif
    └── README.md
```

## Dependencias

- **Ejercicio 1:** Python 3, `opencv-python`, `numpy`, `scikit-image`.
- **Ejercicio 2:** Node.js 18+, `three`, `lil-gui`, `vite`.

## Instalación y ejecución

### Ejercicio 1

```bash
cd ejercicio_1_procesamiento_visual
pip install -r requirements.txt
python src/main.py                 # imagen de muestra
python src/main.py data/imagen.jpg # tu propia imagen
```

Genera las imágenes en `ejercicio_1_procesamiento_visual/resultados/`.

### Ejercicio 2

```bash
cd ejercicio_2_escena_3d_interactiva
npm install
npm run dev      # abre http://localhost:5173
```

## Evidencias

- **Ejercicio 1:** `ejercicio_1_procesamiento_visual/resultados/` — `original.png`,
  `grises.png`, `hsv_o_lab.png`, `suavizado.png`, `bordes.png`,
  `deteccion_o_segmentacion.png` y el mosaico `comparativo.png`.
- **Ejercicio 2:** `ejercicio_2_escena_3d_interactiva/media/` — `captura_1.png`,
  `captura_2.png` y `demo.gif`.

## Análisis técnico

- **Ejercicio 1** sigue el flujo clásico de visión por computador. Cada operación
  es una función corta y los parámetros (kernels, umbrales) están centralizados al
  inicio del script para facilitar su ajuste y justificación. La segmentación usa
  el umbral automático de Otsu + morfología + contornos, una técnica clásica
  robusta que no depende de modelos pesados.
- **Ejercicio 2** apoya la jerarquía de objetos en `THREE.Group` anidados, de modo
  que las transformaciones se propagan de padre a hijo (rotar el hombro mueve todo
  el brazo). La interacción entre elementos se resuelve **reparentando** la pieza a
  la pinza al agarrarla, lo que es coherente con el grafo de escena de Three.js.
  Se eligió Three.js + Vite por ser la opción más simple y reproducible desde la
  línea de comandos.

Detalles ampliados (parámetros, dificultades, decisiones) en el `README.md` de
cada ejercicio.
