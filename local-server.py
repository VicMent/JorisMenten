from __future__ import annotations

import io
import hashlib
import hmac
import json
import os
import posixpath
import re
import secrets
import shutil
import sys
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
CONTENT_FILE = ROOT / "data" / "site.json"
IMAGE_DIR = ROOT / "images"
UPLOAD_DIR = IMAGE_DIR / "uploads"
PRODUCT_TEMPLATE_FILE = ROOT / "product-template.html"
ADMIN_PASSWORD = "jorismenten"
SESSION_SECRET = os.getenv("CMS_SESSION_SECRET", "JorisMentenLocalCmsSession").encode("utf-8")
SESSION_COOKIE = "cms_admin"
SESSION_TOKEN = hmac.new(SESSION_SECRET, b"admin", hashlib.sha256).hexdigest()
CSRF_TOKEN = hmac.new(SESSION_SECRET, b"csrf", hashlib.sha256).hexdigest()


def read_json_file(path: Path) -> dict:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def write_json_file(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    tmp_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    tmp_path.replace(path)


def is_admin(cookie_header: str | None) -> bool:
    if not cookie_header:
        return False
    cookie = SimpleCookie()
    cookie.load(cookie_header)
    return cookie.get(SESSION_COOKIE) is not None and cookie[SESSION_COOKIE].value == SESSION_TOKEN


def set_path(data: dict, path: str, value):
    segments = [segment for segment in path.split(".") if segment]
    if not segments:
        return

    cursor = data
    for index, segment in enumerate(segments):
        if index == len(segments) - 1:
            cursor[segment] = value
            return
        next_segment = segments[index + 1]
        if segment not in cursor or not isinstance(cursor[segment], dict):
            cursor[segment] = [] if next_segment.isdigit() else {}
        cursor = cursor[segment]


def get_path(data: dict, path: str, default=None):
    segments = [segment for segment in path.split(".") if segment]
    cursor = data
    for segment in segments:
        if not isinstance(cursor, dict) or segment not in cursor:
            return default
        cursor = cursor[segment]
    return cursor


def parse_multipart_fields(body: bytes, content_type: str):
    boundary_match = re.search(r'boundary=(?P<boundary>"[^"]+"|[^;]+)', content_type)
    if not boundary_match:
        return {}

    boundary = boundary_match.group('boundary').strip('"')
    delimiter = f'--{boundary}'.encode('utf-8')
    fields = {}

    for raw_part in body.split(delimiter):
        raw_part = raw_part.strip(b'\r\n')
        if not raw_part or raw_part == b'--':
            continue
        if raw_part.endswith(b'--'):
            raw_part = raw_part[:-2]

        header_blob, separator, content = raw_part.partition(b'\r\n\r\n')
        if not separator:
            continue

        headers = {}
        for header_line in header_blob.decode('utf-8', errors='replace').split('\r\n'):
            if ':' in header_line:
                key, value = header_line.split(':', 1)
                headers[key.lower().strip()] = value.strip()

        disposition = headers.get('content-disposition', '')
        name_match = re.search(r'name="([^"]+)"', disposition)
        if not name_match:
            continue
        name = name_match.group(1)
        filename_match = re.search(r'filename="([^"]*)"', disposition)

        if filename_match and filename_match.group(1) != '':
            fields[name] = SimpleNamespace(
                name=name,
                filename=filename_match.group(1),
                file=io.BytesIO(content.rstrip(b'\r\n')),
            )
        else:
            fields[name] = content.decode('utf-8', errors='replace').rstrip('\r\n')

    return fields


def parse_request_fields(handler: SimpleHTTPRequestHandler):
    content_type = handler.headers.get_content_type()
    length = int(handler.headers.get("Content-Length", "0") or "0")
    body = handler.rfile.read(length) if length else b""

    if content_type == "multipart/form-data":
        return parse_multipart_fields(body, handler.headers.get("Content-Type", ""))

    parsed = parse_qs(body.decode("utf-8"))
    return {key: values[0] if len(values) == 1 else values for key, values in parsed.items()}


def parse_value(raw_value):
    if raw_value is None:
        return None
    if isinstance(raw_value, (dict, list, int, float, bool)):
        return raw_value
    if not isinstance(raw_value, str):
        return raw_value

    text = raw_value.strip()
    if text == "":
        return ""

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return raw_value


def list_images():
    images = []
    if not IMAGE_DIR.exists():
        return images
    for path in sorted(IMAGE_DIR.rglob("*")):
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}:
            images.append(path.relative_to(ROOT).as_posix())
    return images


def slugify(value: str) -> str:
    value = value.lower()
    allowed = []
    previous_dash = False
    for character in value:
        if character.isalnum():
            allowed.append(character)
            previous_dash = False
        else:
            if not previous_dash:
                allowed.append("-")
                previous_dash = True
    result = "".join(allowed).strip("-")
    return result or "image"


def store_uploaded_image(field) -> str:
    filename = Path(field.filename or "image").name
    extension = Path(filename).suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}:
        raise ValueError("Onjuist bestandsformaat.")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    base_name = slugify(Path(filename).stem)
    target_name = f"{base_name}-{secrets.token_hex(4)}{extension}"
    target_path = UPLOAD_DIR / target_name
    with target_path.open("wb") as handle:
        shutil.copyfileobj(field.file, handle)
    return (Path("images") / "uploads" / target_name).as_posix()


def slug_to_filename(slug: str) -> str:
    slug = slug.strip()
    if not slug:
        return ""
    safe = re.sub(r"[^a-z0-9_-]+", "-", slug, flags=re.IGNORECASE)
    safe = safe.strip("-")
    if not safe or safe == "index":
        return ""
    return f"{safe}.html"


def default_product_content(slug: str, name: str, nav_label: str = "") -> dict:
    if not nav_label:
        nav_label = name
    image = "images/garage.jpg"
    content = read_json_file(CONTENT_FILE)
    products = get_path(content, "shared.products", [])
    if isinstance(products, list):
        for product in products:
            if isinstance(product, dict) and product.get("slug") == slug and product.get("image"):
                image = product["image"]
                break

    return {
        "meta": {
            "title": f"{name} | Joris Menten bv",
            "description": f"{name} van Joris Menten bv: professionele plaatsing en een verzorgde afwerking voor woning en project.",
        },
        "hero": {
            "eyebrow": "Service detail · 15+ jaar ervaring",
            "title": f"{name} die comfort en kwaliteit combineren.",
            "lead": f"Bij Joris Menten bv staat {name.lower()} voor een oplossing die perfect aansluit bij jouw woning, wensen en levensstijl.",
            "ctas": [
                {"label": "Vraag advies", "href": "index.html#contact"},
                {"label": "Bekijk werk", "href": "projecten.html"},
            ],
            "chips": ["Kwaliteit", "Comfort", "Stijl"],
            "image": image,
        },
        "statement": {
            "image": "images/projecten/2.jpg",
            "title": "Een oplossing die de gevel optilt",
            "caption": "Veiligheid, stille werking en een afwerking die met eigen vertrouwen uitstraalt — onze kernspecialiteit.",
        },
        "benefitsSection": {
            "kicker": "Voordelen",
            "title": "Sterke punten in één oogopslag.",
            "lead": "De focus ligt op wat echt telt: betrouwbare werking, nette montage en een resultaat dat er gewoon goed uitziet.",
            "image": image,
        },
        "benefits": [
            "Stevige constructie voor veiligheid en duurzaamheid",
            "Eenvoudige en stille bediening voor dagelijks comfort",
            "Premium uitstraling zonder schreeuwerig te worden",
            "Professionele plaatsing met aandacht voor detail",
            "Duurzame materialen en een strakke gevelintegratie",
        ],
        "approach": {
            "kicker": "Aanpak",
            "title": "Alles draait om een stevige eerste indruk.",
            "lead": f"Een {name.lower()} is vaak een van de zichtbare onderdelen van de woning. Daarom moet de plaatsing niet alleen technisch juist zijn, maar ook visueel kloppen.",
            "bullets": [
                "Heldere communicatie van aanvraag tot oplevering",
                "Afwerking die meedraait in het totaalbeeld van de woning",
                "Oplossingen die zijn gemaakt voor comfort en gebruiksgemak",
            ],
            "image": "images/projecten/3.jpg",
        },
        "closing": {
            "kicker": "Klaar voor de volgende stap",
            "title": f"Op zoek naar een {name.lower()} die er even goed uitziet als hij werkt?",
            "lead": "Neem contact op voor advies of een offerte. Kort, duidelijk en zonder omwegen.",
            "ctas": [
                {"label": "Neem contact op", "href": "index.html#contact"},
                {"label": "Terug naar home", "href": "index.html"},
            ],
        },
        "footer": {
            "brandLine": name,
            "links": [
                {"label": "Producten", "href": "index.html#producten"},
                {"label": "Projecten", "href": "projecten.html"},
                {"label": "Contact", "href": "index.html#contact"},
            ],
        },
    }


def generate_product_page(slug: str, name: str, description: str, image: str) -> bool:
    if not PRODUCT_TEMPLATE_FILE.exists():
        return False
    template = PRODUCT_TEMPLATE_FILE.read_text(encoding="utf-8")
    html = template.replace("{{PRODUCT_SLUG}}", slug)
    html = html.replace("{{PRODUCT_NAME}}", name)
    html = html.replace("{{PRODUCT_TITLE}}", name)
    html = html.replace("{{PRODUCT_DESCRIPTION}}", description)
    html = html.replace("{{PRODUCT_LEAD}}", f"Bij Joris Menten bv vind je de perfecte {name.lower()} voor jouw woning — met premium kwaliteit en een strakke afwerking.")
    html = html.replace("{{PRODUCT_IMAGE}}", image)
    filename = slug_to_filename(slug)
    if not filename:
        return False
    target = ROOT / filename
    target.write_text(html, encoding="utf-8")
    return True


def delete_product_page(slug: str) -> bool:
    filename = slug_to_filename(slug)
    if not filename:
        return True
    target = ROOT / filename
    if not target.exists():
        return True
    try:
        target.unlink()
        return True
    except OSError:
        return False


class CmsHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = urlparse(path).path
        path = posixpath.normpath(path)
        parts = [part for part in path.split("/") if part and part not in (".", "..")] 
        resolved = ROOT
        for part in parts:
            resolved /= part
        return str(resolved)

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        route = parsed.path.lstrip("/")

        if route == "admin-api.php":
            self.handle_api_get(parse_qs(parsed.query))
            return

        if route == "projecten.php":
            self.send_response(HTTPStatus.FOUND)
            self.send_header("Location", "projecten.html" + ("?admin=1" if parse_qs(parsed.query).get("admin", [""])[0] == "1" else ""))
            self.end_headers()
            return

        if route == "info.php":
            self.send_response(HTTPStatus.FOUND)
            self.send_header("Location", "index.html")
            self.end_headers()
            return

        if route == "admin.php":
            self.serve_custom_file(ROOT / "admin.php", "text/html; charset=utf-8")
            return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        route = parsed.path.lstrip("/")
        if route == "admin-api.php":
            self.handle_api_post(parse_qs(parsed.query))
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not Found")

    def serve_custom_file(self, path: Path, content_type: str):
        if not path.exists():
            self.send_error(HTTPStatus.NOT_FOUND, "Not Found")
            return
        data = path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def send_json(self, payload: dict, status: int = 200, extra_headers: dict | None = None):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
        self.end_headers()
        self.wfile.write(data)

    def handle_api_get(self, query):
        action = query.get("action", ["content"])[0]
        content = read_json_file(CONTENT_FILE)

        if action == "session":
            self.send_json({"ok": True, "admin": is_admin(self.headers.get("Cookie")), "csrfToken": CSRF_TOKEN})
            return

        if action == "content":
            self.send_json({"ok": True, "content": content, "admin": is_admin(self.headers.get("Cookie")), "csrfToken": CSRF_TOKEN})
            return

        if action == "library":
            if not is_admin(self.headers.get("Cookie")):
                self.send_json({"ok": False, "error": "Niet geautoriseerd."}, 403)
                return
            self.send_json({"ok": True, "images": list_images()})
            return

        if action == "products":
            self.send_json({"ok": True, "products": get_path(content, "shared.products", [])})
            return

        self.send_json({"ok": False, "error": "Onbekende actie."}, 404)

    def handle_api_post(self, query):
        action = query.get("action", ["content"])[0]
        content = read_json_file(CONTENT_FILE)
        fields = parse_request_fields(self)
        admin_cookie = self.headers.get("Cookie")

        if action == "login":
            password = str(fields.get("password", ""))
            if not hmac.compare_digest(password, ADMIN_PASSWORD):
                self.send_json({"ok": False, "error": "Ongeldig wachtwoord."}, 401)
                return
            self.send_json(
                {"ok": True, "admin": True},
                200,
                {"Set-Cookie": f"{SESSION_COOKIE}={SESSION_TOKEN}; Path=/; HttpOnly; SameSite=Lax"},
            )
            return

        if action == "logout":
            if self.headers.get("X-CSRF-Token", "") != CSRF_TOKEN:
                self.send_json({"ok": False, "error": "Ongeldige sessie. Vernieuw de pagina en probeer opnieuw."}, 403)
                return
            self.send_json(
                {"ok": True, "admin": False},
                200,
                {"Set-Cookie": f"{SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"},
            )
            return

        if not is_admin(admin_cookie):
            self.send_json({"ok": False, "error": "Niet geautoriseerd."}, 403)
            return

        if self.headers.get("X-CSRF-Token", "") != CSRF_TOKEN:
            self.send_json({"ok": False, "error": "Ongeldige sessie. Vernieuw de pagina en probeer opnieuw."}, 403)
            return

        if action == "save-field":
            path = str(fields.get("path", "")).strip()
            if not path:
                self.send_json({"ok": False, "error": "Ontbrekende veldnaam."}, 400)
                return
            set_path(content, path, parse_value(fields.get("value", "")))
            write_json_file(CONTENT_FILE, content)
            self.send_json({"ok": True, "content": content})
            return

        if action == "set-collection-item":
            path = str(fields.get("path", "")).strip()
            index = int(fields.get("index", -1))
            field = str(fields.get("field", "")).strip()
            if not path or index < 0 or not field:
                self.send_json({"ok": False, "error": "Ontbrekende collectiegegevens."}, 400)
                return
            items = get_path(content, path, [])
            if not isinstance(items, list) or index >= len(items):
                self.send_json({"ok": False, "error": "Collectie-item niet gevonden."}, 404)
                return
            value = parse_value(fields.get("value", ""))
            if field == "payload":
                items[index] = value
            else:
                if not isinstance(items[index], dict):
                    items[index] = {}
                items[index][field] = value
            set_path(content, path, items)
            write_json_file(CONTENT_FILE, content)
            self.send_json({"ok": True, "content": content})
            return

        if action == "add-collection-item":
            path = str(fields.get("path", "")).strip()
            if not path:
                self.send_json({"ok": False, "error": "Ontbrekende collectienaam."}, 400)
                return
            items = get_path(content, path, [])
            if not isinstance(items, list):
                items = []
            item = parse_value(fields.get("item", []))
            index_value = fields.get("index", "")
            if index_value != "":
                insert_at = max(0, int(index_value))
                items.insert(insert_at, item)
            else:
                items.append(item)
            set_path(content, path, items)
            write_json_file(CONTENT_FILE, content)
            self.send_json({"ok": True, "content": content})
            return

        if action == "delete-collection-item":
            path = str(fields.get("path", "")).strip()
            index = int(fields.get("index", -1))
            if not path or index < 0:
                self.send_json({"ok": False, "error": "Ontbrekende collectiegegevens."}, 400)
                return
            items = get_path(content, path, [])
            if not isinstance(items, list) or index >= len(items):
                self.send_json({"ok": False, "error": "Collectie-item niet gevonden."}, 404)
                return
            items.pop(index)
            set_path(content, path, items)
            write_json_file(CONTENT_FILE, content)
            self.send_json({"ok": True, "content": content})
            return

        if action == "move-collection-item":
            path = str(fields.get("path", "")).strip()
            from_index = int(fields.get("from", -1))
            to_index = int(fields.get("to", -1))
            if not path or from_index < 0 or to_index < 0:
                self.send_json({"ok": False, "error": "Ontbrekende verplaatsingsgegevens."}, 400)
                return
            items = get_path(content, path, [])
            if not isinstance(items, list) or from_index >= len(items):
                self.send_json({"ok": False, "error": "Collectie-item niet gevonden."}, 404)
                return
            item = items.pop(from_index)
            to_index = max(0, min(to_index, len(items)))
            items.insert(to_index, item)
            set_path(content, path, items)
            write_json_file(CONTENT_FILE, content)
            self.send_json({"ok": True, "content": content})
            return

        if action == "upload-image":
            image_field = fields.get("image")
            if not image_field or not getattr(image_field, "filename", None):
                self.send_json({"ok": False, "error": "Geen afbeelding ontvangen."}, 400)
                return
            try:
                path = store_uploaded_image(image_field)
            except ValueError as error:
                self.send_json({"ok": False, "error": str(error)}, 400)
                return
            self.send_json({"ok": True, "path": path})
            return

        if action == "create-product":
            slug = str(fields.get("slug", "")).strip().lower()
            name = str(fields.get("name", "")).strip()
            nav_label = str(fields.get("navLabel", "")).strip()
            if not slug or not name:
                self.send_json({"ok": False, "error": "Product slug en naam zijn verplicht."}, 400)
                return
            if not re.match(r"^[a-z0-9_-]+$", slug):
                self.send_json({"ok": False, "error": "De slug mag alleen letters, cijfers, koppeltekens en underscores bevatten."}, 400)
                return
            filename = slug_to_filename(slug)
            if not filename or filename == "index.html":
                self.send_json({"ok": False, "error": "Ongeldige slug."}, 400)
                return
            if (ROOT / filename).exists():
                self.send_json({"ok": False, "error": "Een pagina met deze slug bestaat al.", "status": "conflict"}, 409)
                return
            products = get_path(content, "shared.products", [])
            if not isinstance(products, list):
                products = []
            if any(isinstance(p, dict) and p.get("slug") == slug for p in products):
                self.send_json({"ok": False, "error": "Een product met deze slug bestaat al.", "status": "conflict"}, 409)
                return
            image = get_path(content, "shared.brand.logo", "images/garage.jpg")
            product = {"slug": slug, "name": name, "navLabel": nav_label or name, "image": image}
            products.append(product)
            set_path(content, "shared.products", products)
            pages = content.setdefault("pages", {})
            pages[slug] = default_product_content(slug, name, nav_label or name)
            write_json_file(CONTENT_FILE, content)
            generate_product_page(slug, name, pages[slug]["meta"]["description"], image)
            self.send_json({"ok": True, "content": content})
            return

        if action == "delete-product":
            slug = str(fields.get("slug", "")).strip().lower()
            if not slug:
                self.send_json({"ok": False, "error": "Product slug is verplicht."}, 400)
                return
            products = get_path(content, "shared.products", [])
            if not isinstance(products, list):
                products = []
            found = False
            new_products = []
            for p in products:
                if isinstance(p, dict) and p.get("slug") == slug:
                    found = True
                else:
                    new_products.append(p)
            if not found:
                self.send_json({"ok": False, "error": "Product niet gevonden.", "status": "not_found"}, 404)
                return
            set_path(content, "shared.products", new_products)
            pages = content.get("pages", {})
            if slug in pages:
                del pages[slug]
            write_json_file(CONTENT_FILE, content)
            delete_product_page(slug)
            self.send_json({"ok": True, "content": content})
            return

        self.send_json({"ok": False, "error": "Onbekende actie."}, 404)


def main() -> int:
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", port), CmsHandler)
    print(f"Local CMS server running at http://127.0.0.1:{port}/admin.php")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())