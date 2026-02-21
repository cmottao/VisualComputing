import subprocess
import sys
import re
import tempfile
import os

MAX_WIDTH = 960
FPS = 8
MAX_COLORS = 96


def detect_crop_from_video(video_file):
    print("Detectando crop desde el video...")

    cmd = [
        "ffmpeg",
        "-i", video_file,
        "-vf", "cropdetect=24:16:0",
        "-frames:v", "120",
        "-f", "null",
        "-"
    ]

    result = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    crops = re.findall(r"crop=\d+:\d+:\d+:\d+", result.stderr)

    if not crops:
        print("No se pudo detectar crop.")
        return None

    crop_value = crops[-1]
    print("Crop detectado:", crop_value)
    return crop_value


def make_gif(video_file, gif_output, crop):
    palette_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False).name

    filter_base = (
        f"{crop},"
        f"fps={FPS},"
        f"scale={MAX_WIDTH}:-1:flags=lanczos,"
        f"mpdecimate"
    )

    subprocess.run([
        "ffmpeg",
        "-i", video_file,
        "-vf", f"{filter_base},palettegen=max_colors={MAX_COLORS}",
        "-y",
        palette_file
    ])

    subprocess.run([
        "ffmpeg",
        "-i", video_file,
        "-i", palette_file,
        "-lavfi",
        f"{filter_base}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4",
        "-loop", "0",
        "-y",
        gif_output
    ])

    os.remove(palette_file)


def process_image(image_file, image_output, crop):
    subprocess.run([
        "ffmpeg",
        "-i", image_file,
        "-vf", f"{crop},scale={MAX_WIDTH}:-1:flags=lanczos",
        "-y",
        image_output
    ])


if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Uso:")
        print("python process_media.py video.mov imagen.png salida.gif salida.png")
        sys.exit(1)

    video = sys.argv[1]
    image = sys.argv[2]
    gif_out = sys.argv[3]
    image_out = sys.argv[4]

    crop = detect_crop_from_video(video)

    if crop:
        make_gif(video, gif_out, crop)
        process_image(image, image_out, crop)
        print("✅ GIF e imagen procesados correctamente")