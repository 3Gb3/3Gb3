from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Gabriel_Conci.pdf"
SITE_COPY = ROOT / "files" / "Gabriel_Conci.pdf"

NAVY = colors.HexColor("#07101F")
PANEL = colors.HexColor("#0E1A2C")
ACCENT = colors.HexColor("#31D6B0")
INK = colors.HexColor("#172033")
MUTED = colors.HexColor("#566178")
PALE = colors.HexColor("#EEF3F7")
WHITE = colors.white


def register_fonts():
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    pdfmetrics.registerFont(TTFont("Resume", str(regular)))
    pdfmetrics.registerFont(TTFont("Resume-Bold", str(bold)))


def paragraph(c, text, style, x, y_top, width):
    item = Paragraph(text, style)
    _, height = item.wrap(width, A4[1])
    item.drawOn(c, x, y_top - height)
    return y_top - height


def section_title(c, text, x, y, width, dark=False):
    color = ACCENT if dark else NAVY
    c.setFillColor(color)
    c.setFont("Resume-Bold", 9.5)
    c.drawString(x, y, text.upper())
    c.setStrokeColor(ACCENT if dark else colors.HexColor("#CBD6E2"))
    c.setLineWidth(0.7)
    c.line(x, y - 2.5 * mm, x + width, y - 2.5 * mm)
    return y - 6.5 * mm


def bullet_list(c, items, style, x, y, width, gap=1.5):
    for item in items:
        y = paragraph(c, f"- {item}", style, x, y, width) - gap
    return y


def build():
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SITE_COPY.parent.mkdir(parents=True, exist_ok=True)

    page_w, page_h = A4
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("Currículo - Gabriel Schwingel Conci")
    c.setAuthor("Gabriel Schwingel Conci")
    c.setSubject("Desenvolvimento Full-Stack, automação e inteligência artificial")

    header_h = 45 * mm
    sidebar_w = 59 * mm
    c.setFillColor(NAVY)
    c.rect(0, page_h - header_h, page_w, header_h, stroke=0, fill=1)
    c.setFillColor(PANEL)
    c.rect(0, 0, sidebar_w, page_h - header_h, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.rect(0, page_h - header_h, 4 * mm, header_h, stroke=0, fill=1)

    c.setFillColor(WHITE)
    c.setFont("Resume-Bold", 23)
    c.drawString(13 * mm, page_h - 19 * mm, "GABRIEL SCHWINGEL CONCI")
    c.setFillColor(ACCENT)
    c.setFont("Resume-Bold", 11)
    c.drawString(13 * mm, page_h - 28 * mm, "DESENVOLVEDOR FULL-STACK | AUTOMAÇÃO E IA")
    c.setFillColor(colors.HexColor("#C7D2E2"))
    c.setFont("Resume", 8.6)
    c.drawString(13 * mm, page_h - 36 * mm, "Business Tech + QQTech  |  APIs, chatbots, integrações e produtos digitais")

    body = ParagraphStyle("body", fontName="Resume", fontSize=8.4, leading=11.2, textColor=INK)
    body_white = ParagraphStyle("body-white", fontName="Resume", fontSize=8.1, leading=11, textColor=colors.HexColor("#D7E0EC"))
    bullet = ParagraphStyle("bullet", parent=body, leftIndent=9, firstLineIndent=-7, bulletIndent=0, spaceAfter=0)
    small = ParagraphStyle("small", parent=body, fontSize=7.7, leading=10.1, textColor=MUTED)
    role = ParagraphStyle("role", parent=body, fontName="Resume-Bold", fontSize=9.7, leading=12, textColor=NAVY)
    company = ParagraphStyle("company", parent=small, fontName="Resume-Bold", textColor=colors.HexColor("#217E6C"))
    tag = ParagraphStyle("tag", parent=body_white, fontSize=7.8, leading=10.7)

    sx = 9 * mm
    sw = sidebar_w - 18 * mm
    sy = page_h - header_h - 11 * mm

    sy = section_title(c, "Contato", sx, sy, sw, dark=True)
    contact_items = [
        "(51) 99446-4827",
        "gabrielsconci@gmail.com",
        "3gb3.github.io/3Gb3/",
        "linkedin.com/in/gabriel-schwingel-conci-a0528a344/",
        "github.com/3Gb3",
    ]
    for item in contact_items:
        sy = paragraph(c, item, body_white, sx, sy, sw) - 2.4 * mm

    sy -= 2 * mm
    sy = section_title(c, "Tecnologias", sx, sy, sw, dark=True)
    groups = [
        ("BACK-END", "Python, FastAPI, Flask, Node.js"),
        ("IA E AUTOMAÇÃO", "ChatGraph, OpenRouter, Ollama, Whisper"),
        ("INTEGRAÇÕES E DADOS", "RabbitMQ, PostgreSQL, Firebase, DBeaver"),
        ("FRONT-END", "JavaScript, HTML5, CSS3, Three.js"),
        ("AMBIENTE E ENTREGA", "Docker Desktop, WSL, WinSCP, Git, GitHub"),
    ]
    for label, values in groups:
        c.setFillColor(ACCENT)
        c.setFont("Resume-Bold", 7.4)
        c.drawString(sx, sy, label)
        sy -= 3.5 * mm
        sy = paragraph(c, values, tag, sx, sy, sw) - 3.1 * mm

    sy -= 1 * mm
    sy = section_title(c, "Idiomas", sx, sy, sw, dark=True)
    sy = paragraph(c, "<b>Português</b> - nativo", body_white, sx, sy, sw) - 2.2 * mm
    sy = paragraph(c, "<b>Inglês</b> - leitura e escrita B2; conversação B1", body_white, sx, sy, sw)

    mx = sidebar_w + 10 * mm
    mw = page_w - mx - 11 * mm
    my = page_h - header_h - 10 * mm

    my = section_title(c, "Perfil profissional", mx, my, mw)
    summary = (
        "Desenvolvedor full-stack com experiência em automações, chatbots, APIs e integrações "
        "com inteligência artificial. Atuo conectando clientes e empresas por meio de fluxos "
        "conversacionais, mensageria e serviços em Python/FastAPI, com visão de qualidade herdada "
        "da atuação anterior em QA de chatbots."
    )
    my = paragraph(c, summary, body, mx, my, mw) - 5 * mm

    my = section_title(c, "Experiência profissional", mx, my, mw)
    my = paragraph(c, "Business Tech + QQTech", role, mx, my, mw)
    my = paragraph(c, "Quero-Quero  |  05/2026 - Presente", company, mx, my - 0.5 * mm, mw) - 2 * mm
    my = bullet_list(c, [
        "Desenvolvimento de automações, chatbots e atendimentos personalizados com IA.",
        "Integração de fluxos e mensageria com ChatGraph, RabbitMQ e OpenRouter.",
        "Criação de serviços e APIs com Python e FastAPI, com dados em PostgreSQL.",
        "Rotina técnica com DBeaver, WSL, WinSCP e Docker Desktop.",
    ], bullet, mx, my, mw)

    my -= 2.3 * mm
    my = paragraph(c, "Analista de QA - Foco em Chatbot", role, mx, my, mw)
    my = paragraph(c, "Quero-Quero  |  11/2025 - 05/2026", company, mx, my - 0.5 * mm, mw) - 2 * mm
    my = bullet_list(c, [
        "Validação de fluxos conversacionais, cenários funcionais e jornadas de atendimento.",
        "Registro de evidências, documentação de falhas e acompanhamento de correções.",
        "Colaboração com desenvolvimento para elevar estabilidade, clareza e experiência do usuário.",
    ], bullet, mx, my, mw)

    my -= 4 * mm
    my = section_title(c, "Projetos selecionados", mx, my, mw)
    projects = [
        ("Code Logic", "Plataforma educacional em Flask e Firebase com análise inteligente de respostas."),
        ("Ventude Planner", "Planejador pessoal responsivo com organização de rotina, metas e tarefas."),
        ("Nosso Universo", "Experiência web interativa sobre astronomia com visualização 3D em Three.js."),
        ("Projeto BNCC", "Aplicação desktop em Python e Tkinter para consulta de códigos em documentos PDF."),
    ]
    for title, description in projects:
        my = paragraph(c, f"<b>{title}</b> - {description}", small, mx, my, mw) - 2 * mm

    my -= 2 * mm
    my = section_title(c, "Formação complementar", mx, my, mw)
    my = paragraph(c, "Python do Básico ao Avançado - Udemy, em andamento", small, mx, my, mw) - 1.8 * mm
    paragraph(c, "Lógica da Programação em VisualG e Python - Udemy, 2025", small, mx, my, mw)

    c.setStrokeColor(PALE)
    c.setLineWidth(0.5)
    c.line(mx, 10 * mm, page_w - 11 * mm, 10 * mm)
    c.setFillColor(MUTED)
    c.setFont("Resume", 7)
    c.drawRightString(page_w - 11 * mm, 6.5 * mm, "Atualizado em julho de 2026")

    c.save()
    SITE_COPY.write_bytes(OUTPUT.read_bytes())


if __name__ == "__main__":
    build()
