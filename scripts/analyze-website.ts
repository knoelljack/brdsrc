import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

interface ElementInfo {
  selector: string;
  count: number;
  sampleText: string;
  attributes: Record<string, string>;
}

class WebsiteAnalyzer {
  async analyze(url: string): Promise<void> {
    console.log(`🔍 Analyzing website structure: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      console.log('\n📋 Website Analysis Results:');
      console.log('='.repeat(50));

      // Look for potential product/listing containers
      console.log('\n🏷️  Potential Product Containers:');
      this.findPotentialContainers(document);

      // Look for price patterns
      console.log('\n💰 Potential Price Elements:');
      this.findPriceElements(document);

      // Look for image galleries
      console.log('\n🖼️  Potential Image Elements:');
      this.findImageElements(document);

      // Look for text content that might be titles/descriptions
      console.log('\n📝 Potential Text Content:');
      this.findTextElements(document);

      // Suggest a basic configuration
      console.log('\n⚙️  Suggested Configuration:');
      this.suggestConfiguration(document);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
    }
  }

  private findPotentialContainers(document: Document): void {
    const containerSelectors = [
      '.product',
      '.item',
      '.listing',
      '.card',
      '.board',
      '.surfboard',
      '.surf-board',
      '[class*="product"]',
      '[class*="item"]',
      '[class*="listing"]',
      '[class*="card"]',
    ];

    for (const selector of containerSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const first = elements[0];
        console.log(`  ${selector}: ${elements.length} found`);
        console.log(`    Sample classes: ${first.className}`);
        if (first.textContent && first.textContent.length > 0) {
          console.log(`    Sample text: ${first.textContent.slice(0, 100)}...`);
        }
      }
    }
  }

  private findPriceElements(document: Document): void {
    // Look for elements containing currency symbols
    const allElements = document.querySelectorAll('*');
    const priceElements: ElementInfo[] = [];

    for (const element of Array.from(allElements)) {
      const text = element.textContent?.trim() || '';
      if (text.match(/\$\d+/) && element.children.length === 0) {
        // Leaf nodes only
        priceElements.push({
          selector: this.generateSelector(element),
          count: 1,
          sampleText: text.slice(0, 50),
          attributes: this.getElementAttributes(element),
        });
      }
    }

    // Show unique selectors
    const uniqueSelectors = new Map<string, ElementInfo>();
    priceElements.forEach(info => {
      if (!uniqueSelectors.has(info.selector)) {
        uniqueSelectors.set(info.selector, info);
      } else {
        uniqueSelectors.get(info.selector)!.count++;
      }
    });

    for (const [selector, info] of uniqueSelectors) {
      if (info.count > 1) {
        // Only show if appears multiple times
        console.log(`  ${selector}: ${info.count} found`);
        console.log(`    Sample: "${info.sampleText}"`);
      }
    }
  }

  private findImageElements(document: Document): void {
    const images = document.querySelectorAll('img');
    const imageGroups = new Map<string, number>();

    for (const img of Array.from(images)) {
      const selector = this.generateSelector(img);
      const baseSelector = selector.replace(/\[\d+\]/, ''); // Remove array indices
      imageGroups.set(baseSelector, (imageGroups.get(baseSelector) || 0) + 1);
    }

    for (const [selector, count] of imageGroups) {
      if (count > 3) {
        // Only show if multiple images
        console.log(`  ${selector}: ${count} images found`);
      }
    }
  }

  private findTextElements(document: Document): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    console.log(`  Headings: ${headings.length} found`);

    if (headings.length > 0) {
      const first = headings[0];
      console.log(`    Sample h-tag: ${this.generateSelector(first)}`);
      console.log(`    Sample text: "${first.textContent?.slice(0, 50)}"`);
    }

    // Look for description-like content
    const descSelectors = [
      '.description',
      '.details',
      '.info',
      '[class*="desc"]',
    ];
    for (const selector of descSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`  ${selector}: ${elements.length} found`);
      }
    }
  }

  private suggestConfiguration(document: Document): void {
    console.log(`
{
  url: "${document.location?.href || 'WEBSITE_URL_HERE'}",
  selectors: {
    boardContainer: '.product, .item, .listing', // UPDATE THESE
    title: 'h3, h4, .title, .product-title',
    brand: '.brand, .manufacturer',
    length: '.length, .size, .dimensions',
    condition: '.condition, .grade',
    price: '.price, .cost, .amount',
    description: '.description, .details',
    location: '.location, .seller-location',
    images: 'img.product-image, .gallery img'
  }
}

⚠️  You'll need to customize these selectors based on the actual HTML structure.
Use browser dev tools to inspect the page and find the correct selectors.
    `);
  }

  private generateSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = element.className.toString().split(' ').filter(Boolean);
      if (classes.length > 0) {
        return `.${classes[0]}`;
      }
    }

    return element.tagName.toLowerCase();
  }

  private getElementAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    for (const attr of Array.from(element.attributes)) {
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }
}

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.log(`
🔍 Website Analyzer Usage:

npm run analyze -- <website-url>

Example:
npm run analyze -- "https://surf-shop.com/used-boards"

This will analyze the website structure and suggest CSS selectors
for scraping surfboard data.
    `);
    process.exit(0);
  }

  const analyzer = new WebsiteAnalyzer();
  await analyzer.analyze(url);
}

if (require.main === module) {
  main();
}

export { WebsiteAnalyzer };
