const fs = require('fs');
const path = require('path');

// CONFIGURATION: Set your website URL here
const BASE_URL = 'https://urbanshepherdresolution-stack.github.io'; 

// 1. Load the core HTML template
const templatePath = path.join(__dirname, 'template.html');
if (!fs.existsSync(templatePath)) {
    console.error("Error: template.html file not found in this directory.");
    process.exit(1);
}
const template = fs.readFileSync(templatePath, 'utf8');

// 2. Define the matrix vectors for ZapFormat
const sources = ['pdf', 'google-docs', 'word-document', 'email', 'website', 'kindle'];
const actions = ['remove-formatting', 'strip-line-breaks', 'convert-to-plain-text', 'clean-messy-spaces'];

let generatedPagesCount = 0;
let sitemapUrls = [];

// Add home page to the sitemap array first
sitemapUrls.push(`  <url>\n    <loc>${BASE_URL}/</loc>\n    <priority>1.0</priority>\n  </url>`);

console.log('🚀 Starting programmatic build sequence for ZapFormat...');

// 3. Build the combination loops
sources.forEach(source => {
    actions.forEach(action => {
        // Humanize strings for user-facing UI copy
        const readableSource = source.replace('-', ' ');
        const readableAction = action.replace('-', ' ');

        // Capitalization formulas for proper layout presentation
        const capSource = readableSource.replace(/\b\w/g, c => c.toUpperCase());
        const capAction = readableAction.replace(/\b\w/g, c => c.toUpperCase());

        // Construct unique page content variables
        const filename = `${action}-from-${source}.html`;
        const pageTitle = `${capAction} From ${capSource} Online | ZapFormat`;
        const mainHeading = `${capAction} From ${capSource}`;
        const description = `${readableAction} from your ${readableSource} clipping, leaving behind completely clean plain text ready to paste anywhere.`;

        // Inject content into template structural blocks
        let pageOutput = template
            .replace('{{PAGE_TITLE}}', pageTitle)
            .replace('{{MAIN_HEADING}}', mainHeading)
            .replace('{{DESCRIPTION}}', description);

        // Write individual static file out to filesystem
        fs.writeFileSync(path.join(__dirname, filename), pageOutput);
        
        // Append URL block into the sitemap collector array
        sitemapUrls.push(`  <url>\n    <loc>${BASE_URL}/${filename}</loc>\n    <priority>0.8</priority>\n  </url>`);
        
        generatedPagesCount++;
    });
});

// 4. Construct and compile the sitemap file dynamically
const sitemapOutput = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapOutput);

console.log(`\n✅ Production Compilation Successful!`);
console.log(`- Total unique tool versions created: ${generatedPagesCount}`);
console.log(`- Automated sitemap built: sitemap.xml containing ${sitemapUrls.length} index targets.`);