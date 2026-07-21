"""Découpe le collage en panneaux transparents alignés sur ses déchirures réelles.

Les lignes de contrôle suivent grossièrement les coutures. Un tracé magnétique les
recale ensuite, à la résolution source, sur les pixels clairs et contrastés du papier
déchiré. Chaque frontière est calculée une seule fois puis partagée par les deux
panneaux voisins : il ne peut donc pas y avoir de polygones contradictoires.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


CONTROL_LINES = {
    "top-left-split": [
        (320, 0), (318, 30), (310, 60), (300, 90), (293, 120), (286, 150),
        (275, 180), (267, 210), (258, 240), (251, 270), (240, 295), (233, 307),
    ],
    "top-right-split": [
        (822, 0), (819, 30), (821, 60), (823, 90), (816, 120), (812, 150),
        (816, 180), (815, 210), (812, 240), (807, 270), (793, 306),
    ],
    "upper-left": [
        (0, 339), (40, 334), (80, 349), (120, 337), (160, 326), (190, 307), (219, 296),
    ],
    "upper-center": [
        (219, 298), (281, 269), (344, 211), (406, 161), (469, 106), (500, 117),
        (531, 167), (594, 202), (656, 241), (719, 261), (750, 300), (813, 287),
    ],
    "upper-right": [
        (813, 287), (850, 297), (900, 318), (950, 324), (1000, 330),
    ],
    "center-left": [
        (240, 307), (255, 315), (270, 328), (286, 343), (302, 360),
        (320, 378), (338, 396), (355, 413), (370, 430), (385, 445),
        (395, 460),
    ],
    "middle-left-bottom": [
        (0, 660), (60, 650), (120, 665), (180, 650), (230, 632),
        (280, 600), (330, 560), (365, 520), (382, 488), (395, 460),
    ],
    "center-right": [
        (791, 306), (791, 330), (775, 352), (750, 385), (725, 420),
        (705, 445), (690, 470), (680, 495), (678, 520), (676, 545),
        (674, 570), (672, 588), (670, 600),
    ],
    "middle-right-bottom": [
        (670, 600), (690, 603), (715, 612), (760, 620), (800, 615),
        (826, 610), (900, 620), (1000, 625),
    ],
    "lower-left": [
        (0, 695), (40, 702), (80, 696), (120, 688), (155, 677),
        (185, 665), (205, 652), (235, 654), (270, 660), (305, 667),
        (340, 677), (370, 692), (400, 707),
    ],
    "center-bottom": [
        (472, 780), (490, 782), (510, 778), (540, 732),
        (580, 680), (612, 644), (650, 610),
    ],
    "lower-middle-right": [
        (634, 609), (672, 617), (710, 642), (760, 653), (800, 648), (826, 642),
    ],
    "lower-right": [
        (826, 642), (900, 658), (1000, 667),
    ],
    "bottom-left-split": [
        (400, 707), (430, 720), (445, 738), (455, 756), (472, 780), (486, 804),
        (478, 828), (472, 854), (477, 878), (472, 902), (469, 926), (465, 952),
        (454, 976), (448, 1000),
    ],
    "bottom-center-left": [
        (472, 780), (486, 804), (478, 828), (472, 854),
        (477, 878), (472, 902), (469, 926), (465, 952), (454, 976),
        (448, 1000),
    ],
    "bottom-right-split": [
        (826, 642), (799, 678), (796, 704), (788, 731), (781, 757), (776, 785),
        (772, 811), (768, 839), (771, 865), (772, 893), (769, 919), (769, 946),
        (759, 972), (755, 1000),
    ],
}

PIECE_NAMES = (
    "top-left",
    "top-center",
    "top-right",
    "middle-left",
    "middle-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
)


def scale_controls(points: list[tuple[int, int]], size: tuple[int, int]) -> list[tuple[float, float]]:
    width, height = size
    return [(x * width / 1000, y * height / 1000) for x, y in points]


def resample_polyline(points: list[tuple[float, float]], step: float) -> list[tuple[float, float]]:
    result = [points[0]]
    for start, end in zip(points, points[1:]):
        dx, dy = end[0] - start[0], end[1] - start[1]
        distance = math.hypot(dx, dy)
        count = max(1, math.ceil(distance / step))
        for index in range(1, count + 1):
            amount = index / count
            result.append((start[0] + dx * amount, start[1] + dy * amount))
    return result


def simplify_path(points: list[tuple[float, float]], tolerance: float) -> list[tuple[int, int]]:
    if len(points) <= 2:
        return [(round(x), round(y)) for x, y in points]

    start = np.asarray(points[0], dtype=np.float32)
    end = np.asarray(points[-1], dtype=np.float32)
    segment = end - start
    length = float(np.linalg.norm(segment))

    if length == 0:
        distances = [math.hypot(x - start[0], y - start[1]) for x, y in points]
    else:
        distances = []
        for point in points:
            delta = np.asarray(point, dtype=np.float32) - start
            cross = float(segment[0] * delta[1] - segment[1] * delta[0])
            distances.append(abs(cross) / length)

    split_index = int(np.argmax(distances))
    if distances[split_index] <= tolerance:
        return [(round(points[0][0]), round(points[0][1])), (round(points[-1][0]), round(points[-1][1]))]

    left = simplify_path(points[: split_index + 1], tolerance)
    right = simplify_path(points[split_index:], tolerance)
    return left[:-1] + right


def magnetic_path(
    score: np.ndarray,
    controls: list[tuple[float, float]],
    sample_step: float,
    band: int,
) -> list[tuple[int, int]]:
    base = resample_polyline(controls, sample_step)
    height, width = score.shape
    offsets = np.arange(-band, band + 1, 2, dtype=np.float32)
    candidate_scores = np.full((len(base), len(offsets)), -1e6, dtype=np.float32)
    candidates: list[list[tuple[int, int]]] = []

    for index, point in enumerate(base):
        before = base[max(0, index - 2)]
        after = base[min(len(base) - 1, index + 2)]
        tangent_x, tangent_y = after[0] - before[0], after[1] - before[1]
        tangent_length = max(1e-6, math.hypot(tangent_x, tangent_y))
        normal_x, normal_y = -tangent_y / tangent_length, tangent_x / tangent_length
        row: list[tuple[int, int]] = []

        for offset_index, offset in enumerate(offsets):
            x = round(point[0] + normal_x * float(offset))
            y = round(point[1] + normal_y * float(offset))
            x = min(width - 1, max(0, x))
            y = min(height - 1, max(0, y))
            row.append((x, y))
            candidate_scores[index, offset_index] = score[y, x] - abs(float(offset)) * 0.55

        candidates.append(row)

    center = int(np.argmin(np.abs(offsets)))
    previous = np.full(len(offsets), -1e9, dtype=np.float32)
    previous[center] = candidate_scores[0, center]
    parents = np.zeros((len(base), len(offsets)), dtype=np.int16)
    max_index_shift = 4

    for row_index in range(1, len(base)):
        current = np.full(len(offsets), -1e9, dtype=np.float32)
        for offset_index in range(len(offsets)):
            low = max(0, offset_index - max_index_shift)
            high = min(len(offsets), offset_index + max_index_shift + 1)
            prior_indexes = np.arange(low, high)
            transition = previous[low:high] - np.abs(offsets[prior_indexes] - offsets[offset_index]) * 1.25
            best_relative = int(np.argmax(transition))
            best_index = low + best_relative
            current[offset_index] = transition[best_relative] + candidate_scores[row_index, offset_index]
            parents[row_index, offset_index] = best_index
        previous = current

    selected = center
    selected_indexes = [selected]
    for row_index in range(len(base) - 1, 0, -1):
        selected = int(parents[row_index, selected])
        selected_indexes.append(selected)
    selected_indexes.reverse()

    snapped = [candidates[index][offset_index] for index, offset_index in enumerate(selected_indexes)]
    snapped[0] = (round(controls[0][0]), round(controls[0][1]))
    snapped[-1] = (round(controls[-1][0]), round(controls[-1][1]))
    return simplify_path(snapped, tolerance=max(2.0, sample_step * 0.55))


def join_paths(*paths: list[tuple[int, int]]) -> list[tuple[int, int]]:
    result: list[tuple[int, int]] = []
    for path in paths:
        for point in path:
            if not result or point != result[-1]:
                result.append(point)
    return result


def build_piece_polygons(lines: dict[str, list[tuple[int, int]]], size: tuple[int, int]) -> dict[str, list[tuple[int, int]]]:
    width, height = size
    tls = lines["top-left-split"]
    trs = lines["top-right-split"]
    ul = lines["upper-left"]
    uc = lines["upper-center"]
    ur = lines["upper-right"]
    cl = lines["center-left"]
    mlb = lines["middle-left-bottom"]
    cr = lines["center-right"]
    mrb = lines["middle-right-bottom"]
    ll = lines["lower-left"]
    cb = lines["center-bottom"]
    lmr = lines["lower-middle-right"]
    lr = lines["lower-right"]
    bls = lines["bottom-left-split"]
    bcl = lines["bottom-center-left"]
    brs = lines["bottom-right-split"]

    return {
        "top-left": join_paths([(0, 0)], tls, list(reversed(ul))),
        "top-center": join_paths([tls[0], trs[0]], trs, list(reversed(uc)), list(reversed(tls))),
        "top-right": join_paths([trs[0], (width, 0), (width, ur[-1][1])], list(reversed(ur)), list(reversed(trs))),
        "middle-left": join_paths(ul, cl, list(reversed(mlb))),
        "middle-right": join_paths(ur, [(width, mrb[-1][1])], list(reversed(mrb)), list(reversed(cr))),
        "bottom-left": join_paths(ll, bls, [(0, height)]),
        "bottom-center": join_paths(cb, lmr, brs, [bcl[-1]], list(reversed(bcl))),
        "bottom-right": join_paths(lr, [(width, height), brs[-1]], list(reversed(brs))),
    }


def trace_boundaries(source: Image.Image) -> dict[str, list[tuple[int, int]]]:
    rgb = source.convert("RGB")
    blurred = rgb.filter(ImageFilter.GaussianBlur(radius=max(2, source.width / 1600)))
    broad_blur = rgb.filter(ImageFilter.GaussianBlur(radius=max(8, source.width / 320)))
    pixels = np.asarray(blurred, dtype=np.float32)
    broad_pixels = np.asarray(broad_blur, dtype=np.float32)
    luminance = pixels[..., 0] * 0.2126 + pixels[..., 1] * 0.7152 + pixels[..., 2] * 0.0722
    broad_luminance = (
        broad_pixels[..., 0] * 0.2126
        + broad_pixels[..., 1] * 0.7152
        + broad_pixels[..., 2] * 0.0722
    )
    chroma = pixels.max(axis=2) - pixels.min(axis=2)
    gradient_y, gradient_x = np.gradient(luminance)
    edge = np.hypot(gradient_x, gradient_y)
    white_ridge = np.clip(luminance - broad_luminance, -20, 60)
    score = luminance - chroma * 0.75 + white_ridge * 2.2 + np.clip(edge, 0, 90) * 0.18

    sample_step = max(3.5, source.width / 920)
    default_band = max(24, round(source.width * 0.012))
    tight_band = max(14, round(source.width * 0.0045))
    tight_lines = {
        "center-left",
        "middle-left-bottom",
        "center-right",
        "middle-right-bottom",
        "lower-left",
        "center-bottom",
        "lower-middle-right",
        "lower-right",
        "bottom-left-split",
        "bottom-center-left",
        "bottom-right-split",
    }
    return {
        name: magnetic_path(
            score,
            scale_controls(points, source.size),
            sample_step,
            tight_band if name in tight_lines else default_band,
        )
        for name, points in CONTROL_LINES.items()
    }


def save_debug_overlay(source: Image.Image, lines: dict[str, list[tuple[int, int]]], destination: Path) -> None:
    width = min(1920, source.width)
    height = round(source.height * width / source.width)
    preview = source.convert("RGB").resize((width, height), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(preview)
    colors = [
        "#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#00c7be", "#32ade6",
        "#007aff", "#5856d6", "#af52de", "#ff2d55", "#a2845e", "#ffffff",
    ]
    for (name, path), color in zip(lines.items(), colors):
        scaled = [(round(x * width / source.width), round(y * height / source.height)) for x, y in path]
        draw.line(scaled, fill=color, width=3)
        if scaled:
            draw.text((scaled[0][0] + 5, scaled[0][1] + 5), name, fill=color)
    destination.parent.mkdir(parents=True, exist_ok=True)
    preview.save(destination)


def slice_collage(
    source_path: Path,
    output_dir: Path,
    widths: tuple[int, ...],
    only: set[str] | None = None,
    debug_overlay: Path | None = None,
) -> None:
    source = Image.open(source_path).convert("RGBA")
    lines = trace_boundaries(source)
    polygons = build_piece_polygons(lines, source.size)
    output_dir.mkdir(parents=True, exist_ok=True)

    if debug_overlay:
        save_debug_overlay(source, lines, debug_overlay)

    for name, points in polygons.items():
        if only and name not in only:
            continue

        mask = Image.new("L", source.size, 0)
        ImageDraw.Draw(mask).polygon(points, fill=255)
        layer = source.copy()
        layer.putalpha(mask)

        for width in widths:
            height = round(source.height * width / source.width)
            resized = layer.resize((width, height), Image.Resampling.LANCZOS)
            destination = output_dir / f"hero-{name}-{width}.webp"
            resized.save(destination, "WEBP", quality=90, method=6, exact=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Chemin vers le collage PNG source")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("assets/fragments"),
        help="Dossier de sortie",
    )
    parser.add_argument("--widths", type=int, nargs="+", default=(960, 1600, 2400))
    parser.add_argument("--only", choices=PIECE_NAMES, nargs="+", help="Ne régénérer que certains panneaux")
    parser.add_argument("--debug-overlay", type=Path, help="Écrit un aperçu des lignes recalées")
    args = parser.parse_args()
    slice_collage(
        args.source,
        args.output_dir,
        tuple(args.widths),
        set(args.only) if args.only else None,
        args.debug_overlay,
    )


if __name__ == "__main__":
    main()
