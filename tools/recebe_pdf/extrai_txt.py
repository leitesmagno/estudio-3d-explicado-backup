import sys, os, logging
logging.disable(logging.WARNING)
from pypdf import PdfReader
p = sys.argv[1]
pgs = PdfReader(p).pages
t = "\n\f".join((pg.extract_text(extraction_mode="layout") or "") for pg in pgs)
if len(t.strip()) < 200:   # página girada: modo layout volta vazio
    t = "\n\f".join((pg.extract_text() or "") for pg in pgs)
open(os.path.splitext(p)[0] + ".txt", "w", encoding="utf-8").write(t)
