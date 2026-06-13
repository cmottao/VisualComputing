"""
Examen Final de Computación Visual - Ejercicio 1
Procesamiento visual e IA con OpenCV.

Pipeline secuencial de procesamiento de imagen:
    1. Cargar una entrada visual.
    2. Escala de grises.
    3. Otro espacio de color (HSV).
    4. Suavizado (Gaussiano).
    5. Detección de bordes (Canny).
    6. Segmentación / detección (Otsu + morfología + contornos).
    7. Guardar resultados comparativos.

Ejecución:
    python src/main.py                 # usa imagen de muestra de skimage
    python src/main.py ruta/imagen.jpg # usa tu propia imagen

Autor: Cristian Motta
"""

import os
import sys

import cv2
import numpy as np

# ---------------------------------------------------------------------------
# PARÁMETROS (declarados arriba para que sean fáciles de ajustar y justificar)
# ---------------------------------------------------------------------------
# Suavizado Gaussiano: un kernel 7x7 reduce ruido fino sin borrar bordes grandes.
GAUSS_KERNEL = (7, 7)
GAUSS_SIGMA = 0  # 0 => OpenCV calcula sigma a partir del tamaño del kernel.

# Detección de bordes Canny: umbrales 100/200 (relación ~1:2 recomendada por Canny).
CANNY_BAJO = 100
CANNY_ALTO = 200

# Segmentación: tamaño del kernel morfológico y área mínima de contorno (en px)
# para descartar ruido pequeño al dibujar las cajas detectadas.
MORPH_KERNEL = (5, 5)
AREA_MINIMA = 500

# Carpeta de salida (relativa a la raíz del ejercicio).
DIR_RESULTADOS = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "resultados"
)


def cargar_entrada(ruta_usuario=None):
    """Carga la imagen de entrada en formato BGR (el que usa OpenCV).

    Prioridad:
        1. Ruta pasada por el usuario.
        2. Imagen de muestra de scikit-image (astronaut).
        3. Imagen sintética generada con NumPy/OpenCV (respaldo sin dependencias
           externas, para que el script siempre produzca un resultado).
    """
    if ruta_usuario:
        img = cv2.imread(ruta_usuario)
        if img is None:
            raise FileNotFoundError(f"No se pudo leer la imagen: {ruta_usuario}")
        print(f"[entrada] Imagen del usuario: {ruta_usuario}")
        return img

    try:
        from skimage import data

        # skimage entrega RGB; OpenCV trabaja en BGR, por eso invertimos canales.
        rgb = data.astronaut()
        bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        print("[entrada] Imagen de muestra de skimage: astronaut()")
        return bgr
    except Exception as exc:  # noqa: BLE001 - respaldo intencional
        print(f"[entrada] skimage no disponible ({exc}). Genero imagen sintética.")
        return _imagen_sintetica()


def _imagen_sintetica(alto=512, ancho=512):
    """Genera una imagen sintética con formas y colores (respaldo reproducible)."""
    img = np.full((alto, ancho, 3), 30, dtype=np.uint8)  # fondo gris oscuro
    # Rectángulo azul, círculo verde y triángulo rojo: buenas regiones para segmentar.
    cv2.rectangle(img, (60, 60), (220, 220), (200, 120, 40), -1)
    cv2.circle(img, (360, 150), 80, (60, 200, 80), -1)
    pts = np.array([[256, 300], [160, 460], [352, 460]], dtype=np.int32)
    cv2.fillPoly(img, [pts], (40, 60, 220))
    return img


def guardar(nombre, imagen):
    """Guarda una imagen en la carpeta de resultados e informa la ruta."""
    ruta = os.path.join(DIR_RESULTADOS, nombre)
    cv2.imwrite(ruta, imagen)
    print(f"[guardado] {ruta}")
    return ruta


def a_bgr(imagen):
    """Convierte una imagen de 1 canal a 3 canales para poder apilarla en el mosaico."""
    if imagen.ndim == 2:
        return cv2.cvtColor(imagen, cv2.COLOR_GRAY2BGR)
    return imagen


def construir_comparativo(etapas, alto_celda=256):
    """Arma un mosaico 2x3 con las etapas del pipeline (con etiquetas de texto)."""
    celdas = []
    for titulo, img in etapas:
        img = a_bgr(img)
        # Redimensionamos a un alto común manteniendo proporción aproximada.
        escala = alto_celda / img.shape[0]
        celda = cv2.resize(img, (int(img.shape[1] * escala), alto_celda))
        # Recortamos/ajustamos a un ancho fijo para que el grid quede alineado.
        ancho_celda = int(alto_celda * 1.0)
        celda = cv2.resize(celda, (ancho_celda, alto_celda))
        cv2.rectangle(celda, (0, 0), (ancho_celda, 24), (0, 0, 0), -1)
        cv2.putText(
            celda, titulo, (6, 17), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1,
            cv2.LINE_AA,
        )
        celdas.append(celda)

    # Rellenamos hasta 6 celdas (grid 2x3).
    while len(celdas) < 6:
        celdas.append(np.zeros_like(celdas[0]))

    fila1 = np.hstack(celdas[0:3])
    fila2 = np.hstack(celdas[3:6])
    return np.vstack([fila1, fila2])


def main():
    os.makedirs(DIR_RESULTADOS, exist_ok=True)
    ruta_usuario = sys.argv[1] if len(sys.argv) > 1 else None

    # 1. Cargar entrada -----------------------------------------------------
    original = cargar_entrada(ruta_usuario)
    guardar("original.png", original)

    # 2. Escala de grises ---------------------------------------------------
    grises = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
    guardar("grises.png", grises)

    # 3. Otro espacio de color: HSV ----------------------------------------
    hsv = cv2.cvtColor(original, cv2.COLOR_BGR2HSV)
    # Guardamos el HSV "tal cual" (interpretado como BGR) para ver la separación de canales.
    guardar("hsv_o_lab.png", hsv)

    # 4. Suavizado Gaussiano ------------------------------------------------
    suavizado = cv2.GaussianBlur(original, GAUSS_KERNEL, GAUSS_SIGMA)
    guardar("suavizado.png", suavizado)

    # 5. Detección de bordes Canny (sobre la versión suavizada en grises) ---
    grises_suave = cv2.cvtColor(suavizado, cv2.COLOR_BGR2GRAY)
    bordes = cv2.Canny(grises_suave, CANNY_BAJO, CANNY_ALTO)
    guardar("bordes.png", bordes)

    # 6. Segmentación / detección (técnica clásica) ------------------------
    # Umbral automático de Otsu: separa objeto/fondo sin fijar el umbral a mano.
    _, binaria = cv2.threshold(
        grises_suave, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )
    # Apertura morfológica: elimina puntos de ruido antes de buscar contornos.
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, MORPH_KERNEL)
    limpia = cv2.morphologyEx(binaria, cv2.MORPH_OPEN, kernel, iterations=2)

    contornos, _ = cv2.findContours(
        limpia, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    deteccion = original.copy()
    n_objetos = 0
    for c in contornos:
        if cv2.contourArea(c) < AREA_MINIMA:
            continue  # descartamos contornos demasiado pequeños (ruido)
        x, y, w, h = cv2.boundingRect(c)
        cv2.rectangle(deteccion, (x, y), (x + w, y + h), (0, 255, 0), 2)
        n_objetos += 1
    cv2.putText(
        deteccion, f"Objetos: {n_objetos}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX,
        0.9, (0, 255, 0), 2, cv2.LINE_AA,
    )
    guardar("deteccion_o_segmentacion.png", deteccion)
    print(f"[segmentacion] Objetos detectados: {n_objetos}")

    # 7. Comparativo --------------------------------------------------------
    etapas = [
        ("1. Original", original),
        ("2. Grises", grises),
        ("3. HSV", hsv),
        ("4. Suavizado", suavizado),
        ("5. Bordes", bordes),
        ("6. Deteccion", deteccion),
    ]
    comparativo = construir_comparativo(etapas)
    guardar("comparativo.png", comparativo)

    print("\n[OK] Pipeline completado. Revisa la carpeta 'resultados/'.")


if __name__ == "__main__":
    main()
