"""Render OG share image + app icons for pixelvantastudio."""
import random, sys
from PIL import Image, ImageDraw, ImageFont

FONTS = "./fonts"  # TTF files: brico700.ttf, brico500.ttf, mono500.ttf
OUT = sys.argv[1]
VANTA, FOG, COBALT, COBALT_L, CORAL, MUTED_D = "#0E0F13", "#F1F2F5", "#3A4BFF", "#8C97FF", "#FF6A3D", "#9EA3B3"
P_CELLS = [(0,0),(1,0),(2,0),(3,0),(0,1),(4,1),(0,2),(1,2),(2,2),(3,2),(0,3),(0,4)]

def mark(size, bg=VANTA, fg=FOG, radius_ratio=6/32):
    s = 4  # supersample
    img = Image.new("RGBA", (size*s, size*s), (0,0,0,0))
    d = ImageDraw.Draw(img)
    u = size*s/32
    if bg: d.rounded_rectangle([0,0,size*s-1,size*s-1], radius=int(radius_ratio*size*s), fill=bg)
    px = lambda x,y,c: d.rectangle([ (7+x*4)*u, (6+y*4)*u if False else (7+y*4)*u, (7+x*4+3.6)*u, (7+y*4+3.6)*u ], fill=c)
    for x,y in P_CELLS: px(x,y,fg)
    px(1,1,COBALT); px(4,4,CORAL)
    return img.resize((size,size), Image.LANCZOS)

def og():
    W,H = 1200,630
    img = Image.new("RGB",(W,H),VANTA)
    d = ImageDraw.Draw(img)
    rnd = random.Random(7)
    for y in range(12, H, 24):
        for x in range(12, W, 24):
            d.rectangle([x-1,y-1,x+1,y+1], fill="#1C1F27")
    # a few lit pixels around the big mark, like the hero field
    for _ in range(46):
        x = rnd.randrange(860, 1188, 24) + 12 - 12; y = rnd.randrange(60, 600, 24)
        a = rnd.random()
        c = CORAL if rnd.random() < .15 else COBALT
        z = int(4 + a*6)
        d.rectangle([x-z//2, y-z//2, x+z//2, y+z//2], fill=c if a > .55 else "#262B48")
    big = mark(330)
    img.paste(big, (858, 150), big)
    small = mark(52)
    img.paste(small, (72, 64), small)
    f_word = ImageFont.truetype(f"{FONTS}/brico700.ttf", 34)
    f_word2 = ImageFont.truetype(f"{FONTS}/brico500.ttf", 34)
    d.text((138, 72), "pixelvanta", font=f_word, fill=FOG)
    wv = d.textlength("pixelvanta", font=f_word)
    d.text((138+wv, 72), "studio", font=f_word2, fill=COBALT_L)
    f_h = ImageFont.truetype(f"{FONTS}/brico700.ttf", 84)
    y = 196
    for line, col in [("Thoughtful design.", FOG), ("Digital experiences", COBALT_L), ("built with purpose.", FOG)]:
        d.text((68, y), line, font=f_h, fill=col)
        y += 92
    f_m = ImageFont.truetype(f"{FONTS}/mono500.ttf", 20)
    d.text((72, 520), "WEBSITES · APPS · GAMES · EXPERIMENTS · PHOTOGRAPHY", font=f_m, fill=MUTED_D)
    d.rectangle([72, 562, 82, 572], fill=CORAL)
    d.text((96, 556), "pixelvantastudio.vercel.app  ·  Independent developer studio by Aditya", font=f_m, fill=MUTED_D)
    img.save(f"{OUT}/og-image.png", optimize=True)

def icons():
    # full-bleed squares for platforms that round corners themselves
    for size, name in [(180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
        m = mark(size, radius_ratio=0)
        m.save(f"{OUT}/{name}", optimize=True)

og(); icons(); print("done")
