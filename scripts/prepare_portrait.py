"""Prépare les formats WebP responsives du portrait propre."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def export_portrait(source_path: Path, output_dir: Path, widths: tuple[int, ...]) -> None:
    source = Image.open(source_path).convert("RGB")
    output_dir.mkdir(parents=True, exist_ok=True)

    for width in widths:
        height = round(source.height * width / source.width)
        resized = source.resize((width, height), Image.Resampling.LANCZOS)
        destination = output_dir / f"portrait-clean-{width}.webp"
        resized.save(destination, "WEBP", quality=90, method=6)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Chemin vers le portrait PNG source")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("public/assets"),
        help="Dossier de sortie",
    )
    parser.add_argument("--widths", type=int, nargs="+", default=(960, 1600, 2400))
    args = parser.parse_args()
    export_portrait(args.source, args.output_dir, tuple(args.widths))


if __name__ == "__main__":
    main()
