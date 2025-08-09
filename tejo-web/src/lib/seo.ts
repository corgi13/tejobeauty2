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

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({ '@type': 'ListItem', position: idx + 1, name: it.name, item: it.url })),
  };
}

export function organizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tejo-Beauty',
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
  };
}

export function websiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleJsonLd(post: any, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.image ? [post.image] : undefined,
    author: { '@type': 'Organization', name: 'Tejo-Beauty' },
    publisher: { '@type': 'Organization', name: 'Tejo-Beauty', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.ico` } },
    datePublished: post.createdAt || new Date().toISOString(),
    dateModified: post.updatedAt || post.createdAt || new Date().toISOString(),
  };
}


