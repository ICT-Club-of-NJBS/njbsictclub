export const dynamic = 'force-dynamic';

export async function GET() {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://njbsictclub.vercel.app/</loc>
      <lastmod>2026-06-28</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://njbsictclub.vercel.app/events</loc>
      <lastmod>2026-06-28</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
  </urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}