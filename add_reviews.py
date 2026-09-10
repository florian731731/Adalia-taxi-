import json, io

path = "index.html"
with open(path, encoding="utf-8") as f:
    html = f.read()

anchor = '"reviewBody": "Super taxi ! Florian est très fiable, ponctuel et sympa. Il m\'a dépanné 2 fois, et pour de longs trajets. Grande disponibilité, conduite très agréable."}</script>'
assert html.count(anchor) == 1, f"anchor found {html.count(anchor)} times"

def review_block(name, body):
    data = {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {"@type": "TaxiService", "name": "Adalia Taxi"},
        "author": {"@type": "Person", "name": name},
        "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
        "reviewBody": body,
    }
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + "</script>"

new_blocks = (
    review_block("Math Blr", "Je fais souvent appel à ce taxi pour des petites courses, et il trouve toujours une solution, même à la dernière minute ! Fiable, ponctuel et super arrangeant. Un vrai service de proximité comme on en voit rarement. Je recommande à 100% !")
    + review_block("Amandine MYLA", "Taxi au top à Moûtiers ! Ponctuel, souriant et très professionnel. Le trajet s'est passé dans les meilleures conditions, je referai appel sans hésiter.")
)

html2 = html.replace(anchor, anchor + new_blocks)
assert html2 != html

with open(path, "w", encoding="utf-8") as f:
    f.write(html2)

print("OK, nouvelle taille:", len(html2), "ancienne:", len(html))
