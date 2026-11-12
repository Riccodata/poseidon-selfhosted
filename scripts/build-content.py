"""Build the storefront's static content from the archived Wix site.

    python scripts/build-content.py

Reads:
  D:/hello/Poseidon's Eden Pages/blog/posts.py        the original journal source (structured)
  D:/hello/_migration/site_content/{faq,terms,privacy}.md   pages captured from the Wix preview
Writes src/content/{journal,faq,terms,privacy}.json and copies journal covers into public/media/journal.

The FAQ keeps only answers that are finished: an answer still carrying a template placeholder such as
"[year]" or "[flat rate]" is left out (it is listed in faq-pending.json so nothing is lost).
"""
import importlib.util
import json
import os
import re

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "content")
CAPTURE = "D:/hello/_migration/site_content"
POSTS_PY = "D:/hello/Poseidon's Eden Pages/blog/posts.py"
os.makedirs(OUT, exist_ok=True)


def write(name, data):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


def blocks_from_lines(lines):
    """## h2, ### h3, - li, else paragraph. Inline [text](/path) and **bold** stay as-is for the renderer."""
    blocks = []
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        if line.startswith("### "):
            blocks.append({"type": "h3", "text": line[4:]})
        elif line.startswith("## "):
            blocks.append({"type": "h2", "text": line[3:]})
        elif line.startswith("- "):
            if blocks and blocks[-1]["type"] == "ul":
                blocks[-1]["items"].append(line[2:])
            else:
                blocks.append({"type": "ul", "items": [line[2:]]})
        else:
            blocks.append({"type": "p", "text": line})
    return blocks


# ---- journal -------------------------------------------------------------------------------------
spec = importlib.util.spec_from_file_location("posts", POSTS_PY)
posts_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(posts_mod)
cover_dir = os.path.join(ROOT, "public", "media", "journal")
os.makedirs(cover_dir, exist_ok=True)
journal = []
for p in posts_mod.POSTS:
    ext = os.path.splitext(p["cover"])[1].split("~")[0] or ".png"
    cover_file = f"{p['slug']}{ext if ext in ('.png', '.jpg', '.jpeg') else '.png'}"
    path = os.path.join(cover_dir, cover_file)
    if not os.path.exists(path):
        r = requests.get("https://static.wixstatic.com/media/" + p["cover"], timeout=60)
        r.raise_for_status()
        open(path, "wb").write(r.content)
    body = blocks_from_lines(p["body"].strip().splitlines())
    words = sum(len((b.get("text") or " ".join(b.get("items", []))).split()) for b in body)
    journal.append({
        "slug": p["slug"],
        "title": p["title"],
        "seoTitle": p["seo_title"],
        "seoDescription": p["seo_desc"],
        "excerpt": p["excerpt"],
        "tags": p.get("hashtags", []),
        "cover": f"/media/journal/{cover_file}",
        "coverAlt": p.get("cover_alt", ""),
        "author": "Ricco Laroso",
        "date": "2026-10-22",
        "minutes": max(2, round(words / 220)),
        "body": body,
    })
write("journal.json", journal)
print("journal", len(journal))

# ---- FAQ -----------------------------------------------------------------------------------------
faq_md = open(os.path.join(CAPTURE, "faq.md"), encoding="utf-8").read()
faq_md = faq_md.split("## All categories, questions and answers", 1)[1]
faq_md = faq_md.split("## Images (Wix media ids)", 1)[0]
cats, pending = [], []
for chunk in re.split(r"^### ", faq_md, flags=re.M)[1:]:
    name, rest = chunk.split("\n", 1)
    qas = []
    for m in re.finditer(r"\*\*(.+?)\*\*\n\n(.*?)(?=\n\*\*|\Z)", rest, flags=re.S):
        q, a = m.group(1).strip(), m.group(2).strip()
        if not a:
            continue
        if re.search(r"\[[^\]]+\]", a) and not re.search(r"\[[^\]]+\]\(", a):
            pending.append({"category": name.strip(), "question": q, "answer": a})
            continue
        qas.append({"q": q, "a": [s.strip() for s in a.split("\n\n") if s.strip()]})
    if qas:
        cats.append({"name": name.strip(), "items": qas})
write("faq.json", cats)
write("faq-pending.json", pending)
print("faq", sum(len(c["items"]) for c in cats), "kept,", len(pending), "held back (unfilled placeholders)")


# ---- Terms and Privacy ---------------------------------------------------------------------------
def legal(name, heading_re):
    text = open(os.path.join(CAPTURE, f"{name}.md"), encoding="utf-8").read()
    text = text.split("## Images (Wix media ids)", 1)[0]
    start = text.index("Last updated")
    body = text[start:]
    body = body.split("\nYour Own Piece of the Ocean", 1)[0]
    raw = [l.strip() for l in body.splitlines()]
    updated = raw[0].replace("Last updated:", "").strip()
    # Wix separates privacy sections with a zero-width-space line; a short line right after one,
    # not ending like a sentence, is that section's title.
    lines, after_break = [], False
    for l in raw[1:]:
        if l == "\u200b":
            after_break = True
            continue
        if not l:
            continue
        lines.append((l, after_break and len(l) < 80 and not l.endswith((".", ":", ";"))))
        after_break = False
    sections, cur = [], None
    for l, soft_heading in lines:
        if re.match(heading_re, l) or (name == "privacy" and soft_heading):
            cur = {"heading": l, "paras": []}
            sections.append(cur)
        else:
            if cur is None:
                cur = {"heading": "", "paras": []}
                sections.append(cur)
            cur["paras"].append(l)
    write(f"{name}.json", {"updated": updated, "sections": sections})
    print(name, len(sections), "sections")


legal("terms", r"^(OVERVIEW|SECTION \d+ - .+)$")
legal("privacy", r"^([A-Z0-9][A-Z0-9 ,&'()/-]{5,})$")
