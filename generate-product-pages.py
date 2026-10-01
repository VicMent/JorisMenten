#!/usr/bin/env python
"""Generate product HTML pages from the product template."""
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(ROOT, 'product-template.html')
CONTENT = os.path.join(ROOT, 'data', 'site.json')
NAV_FILE = os.path.join(ROOT, 'inc', 'nav.html')
SITE_URL = 'https://jorismenten.be/'

with open(TEMPLATE, 'r', encoding='utf-8') as f:
    template = f.read()

with open(CONTENT, 'r', encoding='utf-8') as f:
    data = json.load(f)

with open(NAV_FILE, 'r', encoding='utf-8') as f:
    nav_html = f.read()

products = data.get('shared', {}).get('products', [])
pages = data.get('pages', {})

for product in products:
    slug = product['slug']
    name = product['name']
    page_content = pages.get(slug, {})
    meta = page_content.get('meta', {})
    desc = meta.get('description', f'{name} van Joris Menten bv: professionele plaatsing en een verzorgde afwerking voor woning en project.')
    title = meta.get('title', f'{name} | Joris Menten bv')
    hero = page_content.get('hero', {})
    lead = hero.get('lead', f'Bij Joris Menten bv vind je de perfecte {name.lower()} voor jouw woning.')
    image = hero.get('image') or product.get('image', 'images/garage.jpg')

    html = template.replace('{{PRODUCT_SLUG}}', slug)
    html = html.replace('{{PRODUCT_NAME}}', name)
    html = html.replace('{{PRODUCT_NAME_RAW_JSON}}', json.dumps(name, ensure_ascii=False))
    html = html.replace('{{PRODUCT_TITLE}}', title)
    html = html.replace('{{PRODUCT_DESCRIPTION}}', desc)
    html = html.replace('{{PRODUCT_LEAD}}', lead)
    html = html.replace('{{PRODUCT_IMAGE}}', image)
    html = html.replace('{{PRODUCT_CANONICAL}}', SITE_URL + slug + '.html')
    html = html.replace('{{NAVIGATION}}', nav_html)

    output = os.path.join(ROOT, f'{slug}.html')
    with open(output, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Generated: {output}')

print('\nDone!')
