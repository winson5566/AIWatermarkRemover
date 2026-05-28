from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import cv2
import numpy as np

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Import remove_ai_watermarks submodules
# ---------------------------------------------------------------------------
_gemini_available = False
_metadata_available = False
_GeminiEngine: Any = None
_meta_has: Any = None
_meta_get: Any = None
_meta_remove: Any = None

try:
    from remove_ai_watermarks.gemini_engine import GeminiEngine as _GeminiEngine

    _gemini_available = True
    logger.info("gemini_engine loaded successfully")
except ImportError as exc:
    logger.warning("gemini_engine not available: %s", exc)

try:
    from remove_ai_watermarks.metadata import has_ai_metadata as _meta_has
    from remove_ai_watermarks.metadata import get_ai_metadata as _meta_get
    from remove_ai_watermarks.metadata import remove_ai_metadata as _meta_remove

    _metadata_available = True
    logger.info("metadata module loaded successfully")
except Exception as exc:
    logger.warning("metadata module not available: %s", exc)


class WatermarkService:
    def __init__(self):
        self._engine = _GeminiEngine() if _gemini_available else None

    def detect(self, image_path: Path) -> dict[str, Any]:
        """Detect watermarks on an image file."""
        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        has_visible = False
        confidence = 0.0
        watermark_type = None

        # --- Visible watermark detection via gemini_engine ---
        if self._engine is not None:
            try:
                img = cv2.imread(str(image_path))
                if img is not None:
                    result = self._engine.detect_watermark(img)
                    if result is not None:
                        has_visible = bool(getattr(result, "detected", False))
                        confidence = float(getattr(result, "confidence", 0.0))
                        if has_visible:
                            watermark_type = "gemini_sparkle"
                        logger.info(
                            "GeminiEngine detection: detected=%s confidence=%.2f",
                            has_visible,
                            confidence,
                        )
            except Exception as exc:
                logger.warning("gemini_engine detection failed: %s", exc)
        else:
            # Fallback to built-in sparkle detection
            has_visible, confidence, watermark_type = self._detect_sparkle_builtin(image_path)

        # --- Metadata detection ---
        has_metadata = False
        metadata_details: list[str] = []

        if _metadata_available:
            try:
                has_metadata = bool(_meta_has(image_path))
                if has_metadata:
                    details = _meta_get(image_path)
                    if isinstance(details, dict):
                        metadata_details = [f"{k}: {v}" for k, v in details.items() if v]
                    elif isinstance(details, list):
                        metadata_details = [str(d) for d in details if d]
                    elif isinstance(details, str):
                        metadata_details = [details]
                    else:
                        metadata_details = ["AI metadata found"]
                logger.info("Metadata detection: has_metadata=%s", has_metadata)
            except Exception as exc:
                logger.warning("metadata detection failed: %s", exc)

        if not has_metadata:
            has_metadata, builtin_details = self._check_metadata_builtin(image_path)
            metadata_details.extend(builtin_details)

        confidence = max(0.0, min(1.0, confidence))

        return {
            "has_visible_watermark": has_visible,
            "confidence": confidence,
            "has_metadata": has_metadata,
            "watermark_type": watermark_type,
            "metadata_details": list(dict.fromkeys(metadata_details)),  # deduplicate
        }

    def remove_visible(self, image_path: Path, output_path: Path) -> Path:
        """Remove visible watermarks. Returns output_path."""
        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        if self._engine is not None:
            try:
                img = cv2.imread(str(image_path))
                if img is not None:
                    clean = self._engine.remove_watermark(img)
                    if clean is not None:
                        cv2.imwrite(str(output_path), clean)
                        logger.info("gemini_engine removed visible watermark -> %s", output_path)
                        return output_path
            except Exception as exc:
                logger.warning("gemini_engine removal failed: %s", exc)

        # Fallback inpainting
        logger.info("Using built-in inpainting for %s", image_path)
        return self._inpaint_builtin(image_path, output_path)

    def remove_metadata(self, image_path: Path, output_path: Path) -> Path:
        """Strip AI-related metadata. Returns output_path."""
        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        if _metadata_available:
            try:
                _meta_remove(image_path, output_path)
                if output_path.is_file() and output_path.stat().st_size > 0:
                    logger.info("Library metadata removal -> %s", output_path)
                    return output_path
            except Exception as exc:
                logger.warning("metadata removal failed: %s", exc)

        logger.info("Using built-in metadata removal for %s", image_path)
        return self._remove_metadata_builtin(image_path, output_path)

    def process_quick(self, image_path: Path, output_path: Path) -> Path:
        """Full quick pipeline: remove visible watermark, then strip metadata."""
        self.remove_visible(image_path, output_path)
        if not output_path.is_file():
            import shutil
            shutil.copy2(image_path, output_path)
        self.remove_metadata(output_path, output_path)
        return output_path

    # ------------------------------------------------------------------
    # Built-in fallbacks
    # ------------------------------------------------------------------

    def _detect_sparkle_builtin(self, image_path: Path) -> tuple[bool, float, str | None]:
        """OpenCV-based Gemini sparkle detection in bottom-right quadrant."""
        img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        if img is None:
            return False, 0.0, None

        h, w = img.shape[:2]
        roi = img[3 * h // 4 :, 3 * w // 4 :]
        if roi.size == 0:
            return False, 0.0, None

        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        sparkle_candidates = 0
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if 10 < area < 500:
                x, y, cw, ch = cv2.boundingRect(cnt)
                aspect = cw / ch if ch > 0 else 0
                if 0.3 < aspect < 3.0:
                    sparkle_candidates += 1

        bright_pixels = np.sum(gray > 200)
        bright_ratio = bright_pixels / (gray.shape[0] * gray.shape[1])

        has_sparkle = sparkle_candidates >= 1 and bright_ratio > 0.001
        if has_sparkle:
            conf = min(0.95, 0.5 + sparkle_candidates * 0.1 + bright_ratio * 10)
        else:
            conf = max(0.0, 0.3 - sparkle_candidates * 0.05 - bright_ratio * 5)

        wt = "gemini_sparkle" if has_sparkle else None
        return has_sparkle, round(conf, 4), wt

    def _inpaint_builtin(self, image_path: Path, output_path: Path) -> Path:
        """Inpaint the detected sparkle region using Navier-Stokes."""
        img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        if img is None:
            return self._copy_image(image_path, output_path)

        h, w = img.shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)

        roi_y1, roi_x1 = 3 * h // 4, 3 * w // 4
        roi = img[roi_y1:, roi_x1:]
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray_roi, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        kernel = np.ones((3, 3), np.uint8)
        thresh = cv2.dilate(thresh, kernel, iterations=2)
        mask[roi_y1:, roi_x1:] = thresh

        if np.sum(mask) == 0:
            cv2.imwrite(str(output_path), img)
            return output_path

        inpainted = cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_NS)
        cv2.imwrite(str(output_path), inpainted)
        logger.info("Inpainted sparkle watermark -> %s", output_path)
        return output_path

    def _check_metadata_builtin(self, image_path: Path) -> tuple[bool, list[str]]:
        """Check for AI-related metadata using Pillow."""
        from PIL import Image

        details: list[str] = []
        try:
            img = Image.open(image_path)
            exif = img.getexif()
            if exif:
                for tag_id, value in exif.items():
                    val_str = str(value) if value else ""
                    for kw in ["AI", "Generate", "C2PA", "DigitalSourceType", "Midjourney", "DALL-E", "Stable Diffusion", "Gemini", "Imagen"]:
                        if kw.lower() in val_str.lower():
                            details.append(f"EXIF tag {tag_id}: {val_str[:120]}")
                            break

            if hasattr(img, "text") and img.text:
                for key, value in img.text.items():
                    text = f"{key}={value}"
                    for kw in ["AI", "Generate", "C2PA", "SynthID"]:
                        if kw.lower() in text.lower():
                            details.append(f"PNG chunk [{key}]: {str(value)[:120]}")
                            break
            img.close()
        except Exception as exc:
            logger.debug("Builtin metadata check error: %s", exc)

        seen = set()
        unique = [d for d in details if not (d in seen or seen.add(d))]
        return len(unique) > 0, unique

    def _remove_metadata_builtin(self, image_path: Path, output_path: Path) -> Path:
        """Strip all metadata from image."""
        from PIL import Image

        try:
            img = Image.open(image_path)
            mode = "RGBA" if img.mode in ("RGBA", "LA", "PA", "P") else "RGB"
            if img.mode == "P":
                img = img.convert("RGBA")
            data = list(img.getdata())
            clean = Image.new(mode, img.size)
            clean.putdata(data)
            clean.save(str(output_path), format="PNG")
            img.close()
            logger.info("Built-in metadata stripped -> %s", output_path)
        except Exception as exc:
            logger.warning("Built-in metadata stripping failed: %s", exc)
            return self._copy_image(image_path, output_path)
        return output_path

    def _copy_image(self, src: Path, dst: Path) -> Path:
        from shutil import copy2
        copy2(src, dst)
        return dst
