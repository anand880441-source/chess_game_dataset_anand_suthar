// generate-sitemap.js
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const baseUrl = 'https://chess-match-analytics-api.onrender.com';

const routes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/dashboard', priority: 0.9, changefreq: 'daily' },
    { path: '/players', priority: 0.8, changefreq: 'daily' },
    { path: '/matches', priority: 0.8, changefreq: 'daily' },
    { path: '/openings', priority: 0.8, changefreq: 'daily' },
    { path: '/analytics', priority: 0.7, changefreq: 'daily' },
    { path: '/compare', priority: 0.6, changefreq: 'weekly' },
    { path: '/login', priority: 0.5, changefreq: 'monthly' },
    { path: '/register', priority: 0.5, changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
    <url>
        <loc>${baseUrl}${route.path}</loc>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>
`).join('')}
</urlset>`;

writeFileSync(resolve(process.cwd(), 'public', 'sitemap.xml'), sitemap);
console.log('✅ Sitemap generated successfully!');
