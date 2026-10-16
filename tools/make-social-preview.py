#!/usr/bin/env python3
"""Generate social-preview.png (1200x630) for the Livemark docs site.

Reproduces the site's own branding: the 3x3 grid of rounded blue squares
(the project's actual logo mark) on a light background, with the real
tagline from the site's meta description. No machine-specific paths; fonts
resolve via LIVEMARK_FONT_DIR -> ./fonts -> ~/.fonts -> system font dirs.
"""
import os
from PIL import Image, ImageDraw, ImageFont
Image.MAX_IMAGE_PIXELS = None

W, H = 1200, 630
HERE = os.path.dirname(os.path.abspath(__file__))

# Livemark logo palette (from .livemark/public/logo.svg)
BLUE_LIGHT = (147, 197, 253)   # #93c5fd
BLUE_MID   = (78, 148, 248)    # #4e94f8
BLUE_DARK  = (37, 99, 235)     # #2563eb
TEXT_DARK  = (15, 23, 42)      # slate-900
TEXT_MUTED = (100, 116, 139)   # slate-500


def find_font(name, size):
    env_dir = os.environ.get("LIVEMARK_FONT_DIR")
    candidates = []
    if env_dir:
        candidates.append(os.path.join(env_dir, name))
    candidates += [
        os.path.join("fonts", name),
        os.path.join(os.path.expanduser("~"), ".fonts", name),
        os.path.join("/usr/share/fonts/truetype/dejavu", name),
        os.path.join("/usr/share/fonts/truetype/liberation", name),
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()


def draw_logo_grid(draw, cx, cy, size):
    """Reproduce the 3x3 grid of rounded squares from the site's logo.svg."""
    # The logo is a 3x3 grid of rounded squares, blue shades from light (top)
    # to dark (bottom). Reproduce the layout: 3 columns x 3 rows.
    colors = [
        [BLUE_LIGHT, BLUE_LIGHT, BLUE_LIGHT],
        [BLUE_MID,   BLUE_MID,   BLUE_MID],
        [BLUE_DARK,  BLUE_DARK,  BLUE_DARK],
    ]
    gap = size * 0.12
    cell = (size - 2 * gap) / 3.0
    radius = cell * 0.12
    x0 = cx - size / 2.0
    y0 = cy - size / 2.0
    for r in range(3):
        for c in range(3):
            x = x0 + c * (cell + gap)
            y = y0 + r * (cell + gap)
            draw.rounded_rectangle(
                [x, y, x + cell, y + cell], radius=radius, fill=colors[r][c]
            )


def main():
    img = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(img, "RGBA")

    # soft top accent band in the site's blue
    draw.rectangle([0, 0, W, 8], fill=BLUE_DARK)

    # logo grid centered upper area
    draw_logo_grid(draw, W / 2, 200, 300)

    # wordmark
    f_word = find_font("DejaVuSans-Bold.ttf", 64)
    word = "Livemark"
    ww = draw.textlength(word, font=f_word)
    draw.text(((W - ww) / 2, 360), word, font=f_word, fill=TEXT_DARK)

    # tagline from the site's meta description
    f_tag = find_font("DejaVuSans.ttf", 30)
    tag = "Markdown site generator"
    tw = draw.textlength(tag, font=f_tag)
    draw.text(((W - tw) / 2, 452), tag, font=f_tag, fill=TEXT_MUTED)

    # domain in muted grey (plain text, not a button)
    f_dom = find_font("DejaVuSans.ttf", 24)
    dom = "livemark.dev"
    dw = draw.textlength(dom, font=f_dom)
    draw.text(((W - dw) / 2, 512), dom, font=f_dom, fill=(148, 163, 184))

    out = os.path.join(HERE, "social-preview.png")
    img.save(out, optimize=True)
    print("wrote", out, img.size)


if __name__ == "__main__":
    main()
