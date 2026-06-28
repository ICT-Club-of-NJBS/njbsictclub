import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://njbsictclub.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://njbsictclub.vercel.app/events',
      lastModified: new Date(),
      changeFrequency: 'daily', // Good for active clubs updating upcoming tech events
      priority: 0.9,
    },
  ]
}