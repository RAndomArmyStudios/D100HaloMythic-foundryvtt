from __future__ import annotations

import argparse
from pathlib import Path

from pypdf import PdfReader


def extract_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    chunks: list[str] = []

    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        chunks.append(f"===== PAGE {index} =====\n{text.strip()}\n")

    text = "\n".join(chunks).strip() + "\n"
    return text.encode("utf-8", errors="replace").decode("utf-8")


def sanitize_output_name(base_dir: Path, pdf_path: Path) -> str:
    relative = pdf_path.relative_to(base_dir)
    stem = "__".join(relative.with_suffix("").parts)
    return f"{stem}.txt"


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract Mythic source PDFs into searchable text files.")
    parser.add_argument("--force", action="store_true", help="Re-extract even when the output text file is newer than the PDF.")
    args = parser.parse_args()

    root_dir = Path(__file__).resolve().parents[1]
    source_dir = root_dir.parent
    output_dir = root_dir / "reference" / "extracted"
    output_dir.mkdir(parents=True, exist_ok=True)

    pdf_paths = sorted(source_dir.rglob("*.pdf"))
    if not pdf_paths:
      print("No PDFs found.")
      return 0

    extracted = 0
    skipped = 0

    for pdf_path in pdf_paths:
        output_path = output_dir / sanitize_output_name(source_dir, pdf_path)
        if (not args.force) and output_path.exists() and output_path.stat().st_mtime >= pdf_path.stat().st_mtime:
            skipped += 1
            continue

        text = extract_text(pdf_path)
        output_path.write_text(text, encoding="utf-8")
        extracted += 1
        print(f"Extracted {pdf_path.relative_to(source_dir)} -> {output_path.relative_to(root_dir)}")

    print(f"Done. Extracted {extracted} file(s), skipped {skipped}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
