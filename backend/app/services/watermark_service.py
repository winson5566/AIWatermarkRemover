from __future__ import annotations

import logging
from io import BytesIO
from pathlib import Path
from typing import Any, Optional

import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Try importing the remove_ai_watermarks library's Python API
# ---------------------------------------------------------------------------
_RAW_LIBRARY_AVAILABLE = False
_RAW_LIBRARY_ERROR: Optional[str] = None
_raw_module: Any = None

try:
    import remove_ai_watermarks as _raw_module

    _RAW_LIBRARY_AVAILABLE = True
    logger.info("remove_ai_watermarks library loaded successfully")
except ImportError as exc:
    _RAW_LIBRARY_ERROR = str(exc)
    logger.warning(
        "remove_ai_watermarks library not available: %s. "
        "Falling back to built-in detection methods.",
        exc,
    )

# Try importing OpenCV for template matching
_OPENCV_AVAILABLE = False
try:
    import cv2

    _OPENCV_AVAILABLE = True
except ImportError:
    logger.warning("OpenCV (cv2) not available; template-matching detection disabled.")


# ---------------------------------------------------------------------------
# Metadata-detection keywords
# ---------------------------------------------------------------------------
_AI_METADATA_KEYWORDS: list[str] = [
    "AI",
    "Generate",
    "generated",
    "artificial",
    "Midjourney",
    "DALL-E",
    "Stable Diffusion",
    "Adobe Firefly",
    "C2PA",
    "DigitalSourceType",
    "compositeWithTrainedAlgorithmicMedia",
    "trainedAlgorithmicMedia",
    "CreatedByAI",
    "Gemini",
    "Imagen",
    "doubao",
    "豆包",
    "通义千问",  # Tongyi Qianwen
    "文心一言",  # ERNIE Bot
]


# ---------------------------------------------------------------------------
# WatermarkService
# ---------------------------------------------------------------------------
class WatermarkService:
    """Detect and remove AI watermarks using the remove_ai_watermarks library
    with fallback implementations for when the library is not available.
    """

    def detect(self, image_path: Path) -> dict[str, Any]:
        """Detect watermarks on an image file.

        Returns a dict with keys:
          - has_visible_watermark: bool
          - confidence: float (0.0 – 1.0)
          - has_metadata: bool
          - watermark_type: str | None
          - metadata_details: list[str]
        """
        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        # Attempt library-based detection first, then fall back
        if _RAW_LIBRARY_AVAILABLE and _raw_module is not None:
            try:
                result = self._detect_via_library(image_path)
                if result is not None:
                    return result
            except Exception as exc:
                logger.warning("Library detection failed: %s. Falling back.", exc)

        logger.info("Using built-in detection for %s", image_path)
        return self._detect_builtin(image_path)

    def remove_visible(self, image_path: Path, output_path: Path) -> Path:
        """Remove visible watermarks. Returns output_path."""
        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        # Try library first
        if _RAW_LIBRARY_AVAILABLE and _raw_module is not None:
            try:
                result = self._remove_visible_via_library(image_path, output_path)
                if result is not None:
                    return result
            except Exception as exc:
                logger.warning("Library visible-removal failed: %s. Falling back.", exc)

        logger.info("Using built-in visible-removal for %s", image_path)
        return self._remove_visible_builtin(image_path, output_path)

    def remove_metadata(self, image_path: Path, output_path: Path) -> Path:
        """Strip AI-related metadata. Returns output_path."""
        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        # Try library first
        if _RAW_LIBRARY_AVAILABLE and _raw_module is not None:
            try:
                result = self._remove_metadata_via_library(image_path, output_path)
                if result is not None:
                    return result
            except Exception as exc:
                logger.warning("Library metadata-removal failed: %s. Falling back.", exc)

        logger.info("Using built-in metadata-removal for %s", image_path)
        return self._remove_metadata_builtin(image_path, output_path)

    def process_quick(self, image_path: Path, output_path: Path) -> Path:
        """Full quick pipeline: remove visible watermark, then strip metadata.
        Returns output_path.
        """
        # Work in a temporary copy to preserve the original
        img = Image.open(image_path)
        # Ensure we process in RGB(A)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA")
        # Save a temporary intermediate
        intermediate = output_path.with_suffix(".tmp_intermediate.png")
        img.save(str(intermediate), format="PNG")

        try:
            self.remove_visible(intermediate, output_path)
            # If the visible removal didn't write to output_path, copy forward
            if not output_path.is_file():
                intermediate.rename(output_path)
            # Now strip metadata from the output
            stripped = self.remove_metadata(output_path, output_path)
            return stripped
        finally:
            if intermediate.is_file():
                intermediate.unlink(missing_ok=True)

    # ------------------------------------------------------------------
    # Library-based implementations
    # ------------------------------------------------------------------

    def _detect_via_library(self, image_path: Path) -> Optional[dict[str, Any]]:
        """Try to use the remove_ai_watermarks library for detection."""
        assert _raw_module is not None

        has_visible = False
        confidence = 0.0
        watermark_type: Optional[str] = None
        has_metadata = False
        metadata_details: list[str] = []
        has_metadata_detected = False

        # The library may expose different function names. Try common patterns.
        identify_funcs = [
            getattr(_raw_module, "identify", None),
            getattr(_raw_module, "detect", None),
            getattr(_raw_module, "analyze", None),
            getattr(_raw_module, "scan", None),
        ]
        identify_func = next((f for f in identify_funcs if f is not None), None)

        if identify_func and callable(identify_func):
            try:
                report = identify_func(str(image_path))
                if isinstance(report, dict):
                    has_visible = bool(report.get("has_watermark") or report.get("visible") or report.get("has_visible", False))
                    confidence = float(report.get("confidence", report.get("score", 0.0)))
                    watermark_type = report.get("watermark_type") or report.get("type")
                    has_metadata = bool(report.get("has_metadata", False))
                    metadata_details = report.get("metadata_details", report.get("metadata", []))
                    if isinstance(metadata_details, str):
                        metadata_details = [metadata_details]
                    has_metadata_detected = True
            except Exception as exc:
                logger.debug("Library identify() failed: %s", exc)

        # If visible detection wasn't conclusive, try a dedicated "visible" check
        if not has_visible:
            visible_funcs = [
                getattr(_raw_module, "check_visible", None),
                getattr(_raw_module, "has_visible", None),
            ]
            for vf in visible_funcs:
                if vf and callable(vf):
                    try:
                        result = vf(str(image_path))
                        if isinstance(result, bool):
                            has_visible = result
                            confidence = 0.8 if has_visible else 0.2
                        elif isinstance(result, dict):
                            has_visible = bool(result.get("has_watermark", result.get("visible", False)))
                            confidence = float(result.get("confidence", result.get("score", 0.5)))
                        break
                    except Exception as exc:
                        logger.debug("Library visible check failed: %s", exc)

        # Try dedicated metadata check
        if not has_metadata_detected:
            meta_funcs = [
                getattr(_raw_module, "check_metadata", None),
                getattr(_raw_module, "metadata", None),
                getattr(_raw_module, "has_metadata", None),
            ]
            for mf in meta_funcs:
                if mf and callable(mf):
                    try:
                        result = mf(str(image_path))
                        if isinstance(result, bool):
                            has_metadata = result
                            if has_metadata:
                                metadata_details = ["AI metadata detected via library"]
                        elif isinstance(result, dict):
                            has_metadata = bool(result.get("has_metadata", result.get("found", False)))
                            metadata_details = result.get("details", result.get("metadata", []))
                            if isinstance(metadata_details, str):
                                metadata_details = [metadata_details]
                        break
                    except Exception as exc:
                        logger.debug("Library metadata check failed: %s", exc)

        # Clamp confidence
        confidence = max(0.0, min(1.0, confidence))

        # If we didn't detect any metadata via library, use builtin check
        if not has_metadata_detected:
            has_metadata_builtin, meta_details_builtin = self._check_metadata_builtin(image_path)
            has_metadata = has_metadata or has_metadata_builtin
            metadata_details = list(set(metadata_details + meta_details_builtin))

        logger.info(
            "Library detection: visible=%s confidence=%.2f metadata=%s type=%s",
            has_visible,
            confidence,
            has_metadata,
            watermark_type,
        )
        return {
            "has_visible_watermark": has_visible,
            "confidence": confidence,
            "has_metadata": has_metadata,
            "watermark_type": watermark_type,
            "metadata_details": metadata_details,
        }

    def _remove_visible_via_library(self, image_path: Path, output_path: Path) -> Optional[Path]:
        """Try library-based visible watermark removal."""
        assert _raw_module is not None

        funcs = [
            getattr(_raw_module, "erase", None),
            getattr(_raw_module, "remove_visible", None),
            getattr(_raw_module, "visible", None),
            getattr(_raw_module, "clean", None),
        ]
        for func in funcs:
            if func and callable(func):
                try:
                    func(str(image_path), str(output_path))
                    if output_path.is_file() and output_path.stat().st_size > 0:
                        logger.info("Library erased visible watermark -> %s", output_path)
                        return output_path
                except Exception as exc:
                    logger.debug("Library erase(%s) failed: %s", func.__name__, exc)

        return None

    def _remove_metadata_via_library(self, image_path: Path, output_path: Path) -> Optional[Path]:
        """Try library-based metadata removal."""
        assert _raw_module is not None

        funcs = [
            getattr(_raw_module, "remove_metadata", None),
            getattr(_raw_module, "invisible", None),
            getattr(_raw_module, "strip_metadata", None),
            getattr(_raw_module, "metadata_clean", None),
        ]
        for func in funcs:
            if func and callable(func):
                try:
                    func(str(image_path), str(output_path))
                    if output_path.is_file() and output_path.stat().st_size > 0:
                        logger.info("Library stripped metadata -> %s", output_path)
                        return output_path
                except Exception as exc:
                    logger.debug("Library remove_metadata(%s) failed: %s", func.__name__, exc)

        return None

    # ------------------------------------------------------------------
    # Built-in implementations (fallbacks)
    # ------------------------------------------------------------------

    def _detect_builtin(self, image_path: Path) -> dict[str, Any]:
        """Built-in watermark detection using Pillow and optional OpenCV."""
        has_visible = False
        confidence = 0.0
        watermark_type: Optional[str] = None

        # OpenCV-based Gemini sparkle detection
        if _OPENCV_AVAILABLE:
            has_visible, confidence, watermark_type = self._detect_sparkle_opencv(image_path)
        else:
            has_visible, confidence, watermark_type = self._detect_sparkle_heuristic(image_path)

        # Metadata detection (always use builtin)
        has_metadata, metadata_details = self._check_metadata_builtin(image_path)

        logger.info(
            "Built-in detection: visible=%s confidence=%.2f metadata=%s type=%s",
            has_visible, confidence, has_metadata, watermark_type,
        )
        return {
            "has_visible_watermark": has_visible,
            "confidence": confidence,
            "has_metadata": has_metadata,
            "watermark_type": watermark_type,
            "metadata_details": metadata_details,
        }

    def _detect_sparkle_opencv(self, image_path: Path) -> tuple[bool, float, Optional[str]]:
        """Use OpenCV to detect the Gemini sparkle watermark (4-pointed star)."""
        import cv2

        img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        if img is None:
            logger.warning("OpenCV could not read %s", image_path)
            return False, 0.0, None

        h, w = img.shape[:2]
        # Focus on the bottom-right quadrant
        roi = img[3 * h // 4 :, 3 * w // 4 :]
        if roi.size == 0:
            return False, 0.0, None

        roi_h, roi_w = roi.shape[:2]

        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        # The Gemini sparkle is typically a small bright region
        # Use adaptive thresholding to find high-contrast spots
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        # Find contours in the thresholded image
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        sparkle_candidates = 0
        for cnt in contours:
            area = cv2.contourArea(cnt)
            # Filter by area — sparkle is small but not a single pixel
            if 10 < area < 500:
                # Check for star-like shape using convexity defects or aspect ratio
                x, y, cw, ch = cv2.boundingRect(cnt)
                aspect = cw / ch if ch > 0 else 0
                # Sparkle is roughly square-ish
                if 0.3 < aspect < 3.0:
                    sparkle_candidates += 1

        # Also check for bright outlier pixels (sparkle is usually near-white)
        mean_brightness = float(np.mean(gray))
        bright_pixels = np.sum(gray > 200)  # near-white threshold
        bright_ratio = bright_pixels / (roi_h * roi_w) if roi_h * roi_w > 0 else 0

        # Heuristic: Gemini sparkle produces a small cluster of very bright pixels
        # in an otherwise normal region
        has_sparkle = sparkle_candidates >= 1 and bright_ratio > 0.001 and mean_brightness > 20

        # Confidence scaled by the number of sparkle-like contours and bright ratio
        if has_sparkle:
            conf = min(0.95, 0.5 + sparkle_candidates * 0.1 + bright_ratio * 10)
        else:
            conf = max(0.0, 0.3 - sparkle_candidates * 0.05 - bright_ratio * 5)

        wt = "gemini_sparkle" if has_sparkle else None
        return has_sparkle, round(conf, 4), wt

    def _detect_sparkle_heuristic(self, image_path: Path) -> tuple[bool, float, Optional[str]]:
        """Heuristic-based sparkle detection without OpenCV (Pillow only)."""
        try:
            img = Image.open(image_path).convert("L")  # grayscale
            w, h = img.size
            # Bottom-right quadrant
            roi = img.crop((3 * w // 4, 3 * h // 4, w, h))
            pixels = list(roi.getdata())
            if not pixels:
                return False, 0.0, None

            arr = np.array(pixels, dtype=np.float32)
            mean = float(np.mean(arr))
            std = float(np.std(arr))

            bright_count = int(np.sum(arr > 220))
            total = len(pixels)
            bright_ratio = bright_count / total if total > 0 else 0

            # High brightness variance + small bright cluster suggests a sparkle
            has_sparkle = std > 40 and bright_ratio > 0.0005 and mean > 15
            conf = min(0.85, 0.3 + std / 200 + bright_ratio * 15) if has_sparkle else max(0.0, 0.2 - std / 200)

            wt = "gemini_sparkle" if has_sparkle else None
            return has_sparkle, round(conf, 4), wt
        except Exception as exc:
            logger.warning("Heuristic sparkle detection failed: %s", exc)
            return False, 0.0, None

    def _check_metadata_builtin(self, image_path: Path) -> tuple[bool, list[str]]:
        """Check for AI-related metadata using Pillow."""
        details: list[str] = []
        try:
            img = Image.open(image_path)

            # EXIF data
            exif_data = img.getexif()
            if exif_data:
                for tag_id, value in exif_data.items():
                    tag_name = exif_data.get_ifd(tag_id) if hasattr(exif_data, 'get_ifd') else None
                    value_str = str(value) if value else ""
                    for kw in _AI_METADATA_KEYWORDS:
                        if kw.lower() in value_str.lower():
                            details.append(f"EXIF[{tag_id}]: {value_str[:120]}")
                            break

            # PNG text chunks (tEXt, iTXt, zTXt)
            if hasattr(img, "text") and img.text:
                for key, value in img.text.items():
                    text = f"{key}={value}"
                    for kw in _AI_METADATA_KEYWORDS:
                        if kw.lower() in text.lower():
                            details.append(f"PNG chunk[{key}]: {str(value)[:120]}")
                            break

            # Check info dict for comments / C2PA-like markers
            info = img.info if hasattr(img, "info") else {}
            for k, v in info.items():
                if k in ("exif", "icc_profile", "dpi"):
                    continue  # skip binary blobs
                v_str = str(v) if v else ""
                for kw in _AI_METADATA_KEYWORDS:
                    if kw.lower() in v_str.lower():
                        details.append(f"Info[{k}]: {v_str[:120]}")
                        break

            img.close()
        except Exception as exc:
            logger.debug("Metadata check error for %s: %s", image_path, exc)

        # Deduplicate while preserving order
        seen = set()
        unique_details = []
        for d in details:
            if d not in seen:
                seen.add(d)
                unique_details.append(d)

        return len(unique_details) > 0, unique_details

    def _remove_visible_builtin(self, image_path: Path, output_path: Path) -> Path:
        """Built-in visible watermark removal.

        This applies a simple inpainting approach for the Gemini sparkle:
        detect the sparkle region in the bottom-right corner and fill it with
        surrounding pixel colours.
        """
        if _OPENCV_AVAILABLE:
            return self._inpaint_sparkle_opencv(image_path, output_path)

        # Fallback: copy the image as-is (we cannot do meaningful inpainting
        # without OpenCV, but we still strip metadata downstream)
        img = Image.open(image_path)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA")
        img.save(str(output_path), format="PNG")
        logger.info("Visible removal (no-op): saved copy to %s", output_path)
        return output_path

    def _inpaint_sparkle_opencv(self, image_path: Path, output_path: Path) -> Path:
        """Detect and inpaint the Gemini sparkle region using OpenCV."""
        import cv2

        img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        if img is None:
            logger.warning("OpenCV could not read %s for inpainting", image_path)
            return self._copy_image(image_path, output_path)

        h, w = img.shape[:2]
        # Create a mask for the sparkle region
        mask = np.zeros((h, w), dtype=np.uint8)

        # Focus on bottom-right quadrant
        roi_y1, roi_x1 = 3 * h // 4, 3 * w // 4
        roi = img[roi_y1:, roi_x1:]
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray_roi, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        # Dilate the sparkle mask slightly for better inpainting coverage
        kernel = np.ones((3, 3), np.uint8)
        thresh = cv2.dilate(thresh, kernel, iterations=2)

        # Map back to full-image coordinates
        mask[roi_y1:, roi_x1:] = thresh

        # Check if we found anything to inpaint
        if np.sum(mask) == 0:
            logger.info("No sparkle region found for inpainting in %s", image_path)
            cv2.imwrite(str(output_path), img)
            return output_path

        # Inpaint using Navier-Stokes algorithm
        inpainted = cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_NS)
        cv2.imwrite(str(output_path), inpainted)
        logger.info("Inpainted sparkle watermark -> %s (mask pixels: %d)", output_path, int(np.sum(mask) / 255))
        return output_path

    def _remove_metadata_builtin(self, image_path: Path, output_path: Path) -> Path:
        """Strip all metadata from an image using Pillow."""
        try:
            img = Image.open(image_path)

            # Extract pixel data (strip away all metadata)
            if img.mode in ("RGBA", "LA", "PA"):
                data = list(img.getdata())
                mode = img.mode
            elif img.mode == "P":
                img = img.convert("RGBA")
                data = list(img.getdata())
                mode = "RGBA"
            else:
                data = list(img.getdata())
                mode = "RGB" if img.mode not in ("RGB", "RGBA") else img.mode

            # Create a clean image with no metadata
            clean = Image.new(mode, img.size)
            clean.putdata(data)

            # Explicitly pass an empty info dict to suppress metadata
            clean.save(str(output_path), format="PNG", pnginfo=None)

            img.close()
            logger.info("Stripped metadata -> %s", output_path)
        except Exception as exc:
            logger.warning("Metadata stripping failed for %s: %s", image_path, exc)
            return self._copy_image(image_path, output_path)

        return output_path

    def _copy_image(self, image_path: Path, output_path: Path) -> Path:
        """Fallback: simply copy the image."""
        img = Image.open(image_path)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA")
        img.save(str(output_path), format="PNG")
        return output_path
