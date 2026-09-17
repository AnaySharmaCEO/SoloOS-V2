#!/usr/bin/env python3
"""Generate docs/uml_diagrams.pdf from UML diagram PNG files."""

from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "docs" / "diagram_images"
OUTPUT_PDF = ROOT / "docs" / "uml_diagrams.pdf"
MARGIN_POINTS = 54  # 0.75 inch
IMAGE_NAMES = [f"uml_{index:02d}.png" for index in range(1, 13)]


def generate_pdf() -> None:
    missing = [name for name in IMAGE_NAMES if not (IMAGES_DIR / name).exists()]
    if missing:
        raise FileNotFoundError(f"Missing UML diagram files: {', '.join(missing)}")

    pdf = canvas.Canvas(str(OUTPUT_PDF), pagesize=LETTER)
    page_width, page_height = LETTER

    max_width = page_width - (2 * MARGIN_POINTS)
    max_height = page_height - (2 * MARGIN_POINTS)

    for image_name in IMAGE_NAMES:
        image_path = IMAGES_DIR / image_name
        image = ImageReader(str(image_path))
        image_width, image_height = image.getSize()

        scale = min(max_width / image_width, max_height / image_height)
        draw_width = image_width * scale
        draw_height = image_height * scale

        x = (page_width - draw_width) / 2
        y = (page_height - draw_height) / 2

        pdf.drawImage(
            str(image_path),
            x,
            y,
            width=draw_width,
            height=draw_height,
            preserveAspectRatio=True,
            mask="auto",
        )
        pdf.showPage()

    pdf.save()


if __name__ == "__main__":
    generate_pdf()
