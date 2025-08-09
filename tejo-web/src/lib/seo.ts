export function productJsonLd(p: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: p.images,
    description: p.description,
    brand: p.brand,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: Number(p.rating || 0), reviewCount: Number(p.numReviews || 0) },
    offers: { '@type': 'Offer', price: Number(p.price), priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
  };
}


