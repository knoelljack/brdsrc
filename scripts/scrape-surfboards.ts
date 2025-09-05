import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import path from 'path';
import { prisma } from '../app/lib/prisma';

// Types matching your database schema
interface ScrapedSurfboard {
  title: string;
  brand: string;
  length: string;
  condition: string;
  price: number;
  description: string;
  city: string;
  state: string;
  images: string[];
  latitude?: number;
  longitude?: number;
}

interface ScrapingConfig {
  url: string;
  selectors: {
    // Container for each surfboard listing
    boardContainer: string;
    // Individual field selectors within each board container
    title: string;
    brand?: string;
    length: string;
    condition?: string;
    price: string;
    description: string;
    location?: string;
    images?: string;
  };
  // Optional: pagination
  pagination?: {
    nextButton: string;
    maxPages?: number;
  };
  // Data processing options
  processing?: {
    // Function to clean/parse price
    priceParser?: (priceText: string) => number;
    // Function to extract length
    lengthParser?: (lengthText: string) => string;
    // Function to parse location
    locationParser?: (locationText: string) => { city: string; state: string };
    // Function to normalize condition
    conditionParser?: (conditionText: string) => string;
    // Function to extract brand from title if not separate
    brandParser?: (title: string) => { title: string; brand: string };
  };
}

class SurfboardScraper {
  private config: ScrapingConfig;
  private userId: string;

  constructor(config: ScrapingConfig, userId: string) {
    this.config = config;
    this.userId = userId;
  }

  async scrape(): Promise<ScrapedSurfboard[]> {
    console.log(`🔍 Starting scrape of ${this.config.url}`);

    // Check if this is a single product page
    if (
      this.config.url.includes('ridershack.com') &&
      this.config.url.includes('-117')
    ) {
      console.log('🎯 Detected single Rider Shack product page');
      return await this.scrapeSingleProduct();
    }

    // Check if this is the Rider Shack used surfboards listing page
    if (
      this.config.url.includes('ridershack.com') &&
      this.config.url.includes('used-surfboards.html')
    ) {
      console.log('🏄‍♂️ Detected Rider Shack used surfboards listing page');
      return await this.scrapeRiderShackListingPage();
    }

    // Check if this is the main Rider Shack surfboards page
    if (
      this.config.url.includes('ridershack.com') &&
      this.config.url.includes('surfboards.html')
    ) {
      console.log('🏄‍♂️ Detected Rider Shack main surfboards listing page');
      return await this.scrapeRiderShackMainPage();
    }

    const allBoards: ScrapedSurfboard[] = [];
    let currentUrl: string | null = this.config.url;
    let pageCount = 0;
    const maxPages = this.config.pagination?.maxPages || 10;

    while (currentUrl && pageCount < maxPages) {
      console.log(`📄 Scraping page ${pageCount + 1}: ${currentUrl}`);

      try {
        const response = await fetch(currentUrl, {
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

        // Extract boards from current page
        const boards = await this.extractBoardsFromPage(document);
        allBoards.push(...boards);
        console.log(
          `✅ Found ${boards.length} boards on page ${pageCount + 1}`
        );

        // Check for next page
        if (this.config.pagination?.nextButton) {
          const nextButton = document.querySelector(
            this.config.pagination.nextButton
          ) as HTMLAnchorElement | null;
          currentUrl = nextButton?.href || null;

          if (currentUrl && !currentUrl.startsWith('http')) {
            // Handle relative URLs
            const baseUrl = new URL(this.config.url);
            currentUrl = new URL(currentUrl, baseUrl.origin).href;
          }
        } else {
          currentUrl = null; // No pagination
        }

        pageCount++;

        // Be respectful - wait between requests
        await this.delay(1000);
      } catch (error) {
        console.error(`❌ Error scraping page ${pageCount + 1}:`, error);
        break;
      }
    }

    console.log(
      `🎉 Scraping complete! Found ${allBoards.length} total surfboards`
    );
    return allBoards;
  }

  private async scrapeSingleProduct(): Promise<ScrapedSurfboard[]> {
    try {
      const response = await fetch(this.config.url, {
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

      const board = await this.extractSingleProductData(document);
      if (this.isValidBoard(board)) {
        return [board];
      }
    } catch (error) {
      console.error(`❌ Error scraping single product:`, error);
    }

    return [];
  }

  private async scrapeRiderShackMainPage(): Promise<ScrapedSurfboard[]> {
    console.log('🔍 Scraping Rider Shack main surfboards page...');

    try {
      const response = await fetch(this.config.url, {
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

      // Extract all product URLs from the main surfboards page
      const productUrls = this.extractMainPageProductUrls(document);
      console.log(`🔗 Found ${productUrls.length} product URLs to scrape`);

      if (productUrls.length === 0) {
        console.log('⚠️  No product URLs found on main surfboards page');
        return [];
      }

      // Scrape each individual product page
      const allBoards: ScrapedSurfboard[] = [];
      let successCount = 0;
      let errorCount = 0;

      console.log(`🔍 Preparing to scrape ${productUrls.length} surfboards...`);

      for (let i = 0; i < productUrls.length; i++) {
        const productUrl = productUrls[i];
        console.log(
          `📄 Scraping board ${i + 1}/${productUrls.length}: ${productUrl}`
        );

        try {
          // Create a temporary config for this product URL
          const productConfig = { ...this.config, url: productUrl };
          const tempScraper = new SurfboardScraper(productConfig, this.userId);

          // Scrape the individual product
          const boards = await tempScraper.scrapeSingleProduct();
          if (boards.length > 0) {
            allBoards.push(...boards);
            successCount++;
            console.log(`✅ Successfully scraped: ${boards[0].title}`);
          } else {
            console.log(`⚠️  No valid data extracted from: ${productUrl}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Failed to scrape ${productUrl}:`, error);
          errorCount++;
        }

        // Be respectful - wait between requests
        await this.delay(2000); // 2 second delay between requests
      }

      console.log(`🎉 Main page scraping complete!`);
      console.log(`✅ Successfully scraped: ${successCount} boards`);
      if (errorCount > 0) {
        console.log(`⚠️  Failed to scrape: ${errorCount} boards`);
      }

      return allBoards;
    } catch (error) {
      console.error(`❌ Error scraping main surfboards page:`, error);
      return [];
    }
  }

  private async scrapeRiderShackListingPage(): Promise<ScrapedSurfboard[]> {
    console.log('🔍 Scraping Rider Shack used surfboards listing page...');

    try {
      const response = await fetch(this.config.url, {
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

      // Extract all product URLs from the listing page
      const productUrls = this.extractProductUrls(document);
      console.log(`🔗 Found ${productUrls.length} product URLs to scrape`);

      if (productUrls.length === 0) {
        console.log('⚠️  No product URLs found on listing page');
        return [];
      }

      // Scrape each individual product page
      const allBoards: ScrapedSurfboard[] = [];
      let successCount = 0;
      let errorCount = 0;

      // Scrape all boards (safety limit removed)
      const urlsToScrape = productUrls;
      console.log(
        `🔍 Preparing to scrape all ${productUrls.length} surfboards...`
      );

      for (let i = 0; i < urlsToScrape.length; i++) {
        const productUrl = urlsToScrape[i];
        console.log(
          `📄 Scraping board ${i + 1}/${urlsToScrape.length}: ${productUrl}`
        );

        try {
          // Create a temporary config for this product URL
          const productConfig = { ...this.config, url: productUrl };
          const tempScraper = new SurfboardScraper(productConfig, this.userId);

          // Scrape the individual product
          const boards = await tempScraper.scrapeSingleProduct();
          if (boards.length > 0) {
            allBoards.push(...boards);
            successCount++;
            console.log(`✅ Successfully scraped: ${boards[0].title}`);
          } else {
            console.log(`⚠️  No valid data extracted from: ${productUrl}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Failed to scrape ${productUrl}:`, error);
          errorCount++;
        }

        // Be respectful - wait between requests
        await this.delay(2000); // 2 second delay between requests
      }

      console.log(`🎉 Listing page scraping complete!`);
      console.log(`✅ Successfully scraped: ${successCount} boards`);
      if (errorCount > 0) {
        console.log(`⚠️  Failed to scrape: ${errorCount} boards`);
      }

      return allBoards;
    } catch (error) {
      console.error(`❌ Error scraping listing page:`, error);
      return [];
    }
  }

  private extractMainPageProductUrls(document: Document): string[] {
    const productUrls: string[] = [];

    // Look for product links in the main Rider Shack surfboards page
    // Based on the HTML structure from the analysis
    const linkSelectors = [
      '.product-item-link',
      '.product a',
      'a[href*="surfboard"]',
      'a[href*=".html"]',
      '.item.product a',
    ];

    for (const selector of linkSelectors) {
      const links = document.querySelectorAll(selector);
      for (const link of Array.from(links)) {
        const href =
          (link as HTMLAnchorElement).href || link.getAttribute('href');
        if (href) {
          let fullUrl = href;

          // Handle relative URLs
          if (!fullUrl.startsWith('http')) {
            fullUrl = `https://www.ridershack.com${href.startsWith('/') ? '' : '/'}${href}`;
          }

          // Only add unique URLs that look like product pages
          // Exclude category pages, cart, account, etc.
          if (
            fullUrl.includes('ridershack.com') &&
            fullUrl.includes('.html') &&
            !fullUrl.includes('surfboards.html') && // Exclude the main listing page
            !fullUrl.includes('used-surfboards.html') && // Exclude used listing page
            !fullUrl.includes('checkout') &&
            !fullUrl.includes('customer') &&
            !fullUrl.includes('catalogsearch') &&
            !productUrls.includes(fullUrl)
          ) {
            productUrls.push(fullUrl);
          }
        }
      }
    }

    // Remove duplicates and filter out non-product URLs
    const uniqueUrls = [...new Set(productUrls)].filter(
      url =>
        // Must be a product page (contains product name patterns)
        url.match(/[a-z]+-[0-9]+-[a-z]/) ||
        url.match(/[a-z]+-surfboard/) ||
        url.match(/surfboard-[0-9]/)
    );

    return uniqueUrls;
  }

  private extractProductUrls(document: Document): string[] {
    const productUrls: string[] = [];

    // Look for product links in the Rider Shack listing page
    // Based on the HTML structure, look for links to individual product pages
    const linkSelectors = [
      'a[href*="used-"][href*="-surfboard-"]', // Links containing "used-" and "-surfboard-"
      '.product-item-link',
      '.product-name a',
      'h2 a[href*="surfboard"]',
      'a[href*="ridershack.com"][href*="surfboard"]',
    ];

    for (const selector of linkSelectors) {
      const links = document.querySelectorAll(selector);
      for (const link of Array.from(links)) {
        const href =
          (link as HTMLAnchorElement).href || link.getAttribute('href');
        if (href) {
          let fullUrl = href;

          // Handle relative URLs
          if (!fullUrl.startsWith('http')) {
            fullUrl = `https://www.ridershack.com${href.startsWith('/') ? '' : '/'}${href}`;
          }

          // Only add unique URLs that look like product pages
          if (
            fullUrl.includes('surfboard') &&
            fullUrl.includes('ridershack.com') &&
            !productUrls.includes(fullUrl)
          ) {
            productUrls.push(fullUrl);
          }
        }
      }
    }

    // Remove duplicates and filter out non-product URLs
    const uniqueUrls = [...new Set(productUrls)].filter(
      url => url.includes('-surfboard-') && url.match(/\d{5,}/) // Contains a product ID (5+ digits)
    );

    return uniqueUrls;
  }

  private async extractSingleProductData(
    document: Document
  ): Promise<ScrapedSurfboard> {
    // For Rider Shack single product pages, extract data differently
    const title =
      document.querySelector('h1.page-title')?.textContent?.trim() ||
      document.querySelector('.product-name')?.textContent?.trim() ||
      '';

    const priceText =
      document.querySelector('.price')?.textContent?.trim() ||
      document.querySelector('.regular-price .price')?.textContent?.trim() ||
      '';

    // Get dimensions from the product details - look for the dimensions text specifically
    let dimensionsText = '';

    // First, try to extract from the title itself (e.g., "Used 9'0 Walden...")
    const titleDimension = title.match(/\b(\d+'?\d*"?)\b/);
    if (titleDimension) {
      dimensionsText = titleDimension[1];
    }

    // If not found in title, look in table cells
    if (!dimensionsText) {
      const allTds = document.querySelectorAll('td');
      for (const td of Array.from(allTds)) {
        const text = td.textContent?.trim() || '';
        if (text.includes("'") && text.includes('x') && text.length < 50) {
          // Limit length to avoid shipping text
          dimensionsText = text;
          break;
        }
      }
    }

    // Get description from product info - target the correct HTML structure
    let description = '';

    // Target multiple possible description locations with more specific selectors
    const descriptionSelectors = [
      'article.product-description', // From your HTML screenshot
      '.product-description',
      '.product-description p',
      '#description .value',
      '#description',
      '.product-info-main .description',
      '.product-collateral .box-description .std',
      '.tab-content .product-description',
      '[role="tabpanel"] .product-description',
      '.additional-attributes-wrapper .product-description',
      // Additional selectors for boards with minimal descriptions
      '.product-info-main p',
      '.product-info-main .value',
      '.additional-attributes .value',
      '.product-attribute-specs-table td',
      '.short-description .std',
    ];

    let rawDescription = '';
    for (const selector of descriptionSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        rawDescription = element.textContent?.trim() || '';
        if (rawDescription.length > 50) {
          break;
        }
      }
    }

    // Clean up the description text by removing extra whitespace and spec noise
    const cleanDescription = (text: string) => {
      return text
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/More Information.*?Construction/gi, '') // Remove spec table noise
        .replace(/Brand.*?Fin System.*?Fin Setup.*?/gi, '') // Remove spec details
        .replace(/Length.*?Width.*?Thickness.*?Volume.*?/gi, '') // Remove dimensions
        .replace(/STOCK DIMENSIONS.*$/gi, '') // Remove stock dimensions section
        .replace(/Add accessories.*$/gi, '') // Remove add accessories text
        .replace(/^\s*"\s*/, '') // Remove leading quote
        .replace(/\s*"\s*$/, '') // Remove trailing quote
        .trim();
    };

    if (rawDescription && rawDescription.length > 50) {
      const cleaned = cleanDescription(rawDescription);
      if (cleaned.length > 50) {
        description = cleaned.slice(0, 500);
      }
    }

    // If we still don't have a description, use a simple fallback
    if (!description || description.length < 50) {
      const isUsed = title.toLowerCase().includes('used');
      description = `${isUsed ? 'Used' : 'New'} ${title} available at Rider Shack in Los Angeles, CA.`;
    }

    // Get images - prioritize main surfboard image only
    const images: string[] = [];

    // First try to get the main product image (usually the first/primary image)
    const mainImageSelectors = [
      '.product-image-main img',
      '.product-image-photo',
      '.gallery-image:first-child img',
      '.fotorama__stage .fotorama__img:first-child',
      'img[src*="surfboard"]:first-of-type',
    ];

    for (const selector of mainImageSelectors) {
      const img = document.querySelector(selector);
      if (img) {
        const src =
          (img as HTMLImageElement).src ||
          (img as HTMLElement).getAttribute('data-src');
        if (
          src &&
          src.startsWith('http') &&
          !src.includes('fin') &&
          !src.includes('leash')
        ) {
          images.push(src);
          break; // Only take the first main image
        }
      }
    }

    // If no main image found, fall back to any surfboard image (but filter out accessories)
    if (images.length === 0) {
      const fallbackImages = document.querySelectorAll('img[src*="surfboard"]');
      for (const img of Array.from(fallbackImages)) {
        const src =
          (img as HTMLImageElement).src ||
          (img as HTMLElement).getAttribute('data-src');
        if (
          src &&
          src.startsWith('http') &&
          !src.includes('fin') &&
          !src.includes('leash') &&
          !src.includes('wax') &&
          !src.includes('traction')
        ) {
          images.push(src);
          break; // Only take one image
        }
      }
    }

    // Apply processing functions
    const processing = this.config.processing;

    let brand = '';
    let cleanTitle = title;
    if (processing?.brandParser) {
      const parsed = processing.brandParser(title);
      cleanTitle = parsed.title;
      brand = parsed.brand;
    }

    const price = processing?.priceParser
      ? processing.priceParser(priceText)
      : this.defaultPriceParser(priceText);

    const length = processing?.lengthParser
      ? processing.lengthParser(dimensionsText)
      : this.defaultLengthParser(dimensionsText);

    // Determine condition based on whether the title contains "Used" or "USED"
    let condition = 'Good'; // Default condition

    if (processing?.conditionParser) {
      // Check if this is a used board or new board
      const isUsedBoard = title.toLowerCase().includes('used');
      if (isUsedBoard) {
        condition = processing.conditionParser('4'); // Default to 4-star for used boards
      } else {
        condition = 'New'; // Set to "New" for non-used boards
      }
    } else {
      // Fallback logic without processing function
      const isUsedBoard = title.toLowerCase().includes('used');
      condition = isUsedBoard ? 'Good' : 'New';
    }

    const location = processing?.locationParser
      ? processing.locationParser('')
      : { city: 'Los Angeles', state: 'CA' };

    return {
      title: cleanTitle || 'Unknown Surfboard',
      brand: brand || 'Unknown',
      length,
      condition,
      price,
      description: description.slice(0, 500) + '...', // Truncate long descriptions
      city: location.city,
      state: location.state,
      images: images.slice(0, 5), // Limit to 5 images
    };
  }

  private async extractBoardsFromPage(
    document: Document
  ): Promise<ScrapedSurfboard[]> {
    const boards: ScrapedSurfboard[] = [];
    const boardElements = document.querySelectorAll(
      this.config.selectors.boardContainer
    );

    for (const boardElement of Array.from(boardElements)) {
      try {
        const board = await this.extractBoardData(boardElement);
        if (this.isValidBoard(board)) {
          boards.push(board);
        }
      } catch (error) {
        console.warn('⚠️  Failed to extract board data:', error);
      }
    }

    return boards;
  }

  private async extractBoardData(element: Element): Promise<ScrapedSurfboard> {
    const getText = (selector: string): string => {
      const el = element.querySelector(selector);
      return el?.textContent?.trim() || '';
    };

    const getImages = (selector: string): string[] => {
      if (!selector) return [];
      const imgElements = element.querySelectorAll(selector);
      return Array.from(imgElements)
        .map(
          img =>
            (img as HTMLImageElement).src ||
            (img as HTMLElement).getAttribute('data-src')
        )
        .filter(Boolean) as string[];
    };

    // Extract raw data
    let title = getText(this.config.selectors.title);
    let brand = this.config.selectors.brand
      ? getText(this.config.selectors.brand)
      : '';
    let length = getText(this.config.selectors.length);
    let condition = this.config.selectors.condition
      ? getText(this.config.selectors.condition)
      : 'Good';
    const priceText = getText(this.config.selectors.price);
    const description = getText(this.config.selectors.description);
    const locationText = this.config.selectors.location
      ? getText(this.config.selectors.location)
      : '';
    const images = this.config.selectors.images
      ? getImages(this.config.selectors.images)
      : [];

    // Apply processing functions if provided
    const processing = this.config.processing;

    if (processing?.brandParser && !brand) {
      const parsed = processing.brandParser(title);
      title = parsed.title;
      brand = parsed.brand;
    }

    const price = processing?.priceParser
      ? processing.priceParser(priceText)
      : this.defaultPriceParser(priceText);

    length = processing?.lengthParser
      ? processing.lengthParser(length)
      : this.defaultLengthParser(length);

    condition = processing?.conditionParser
      ? processing.conditionParser(condition)
      : this.defaultConditionParser(condition);

    const location = processing?.locationParser
      ? processing.locationParser(locationText)
      : this.defaultLocationParser(locationText);

    return {
      title: title || 'Unknown Surfboard',
      brand: brand || 'Unknown',
      length,
      condition,
      price,
      description: description || 'No description available',
      city: location.city,
      state: location.state,
      images: images.filter(img => img.startsWith('http')), // Only valid URLs
    };
  }

  private defaultPriceParser(priceText: string): number {
    // Extract numbers from price text
    const match = priceText.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
  }

  private defaultLengthParser(lengthText: string): string {
    // Extract length like "9'2\"" or "9.2ft" etc.
    const match = lengthText.match(/(\d+(?:\.\d+)?)['\s]*(\d+)?/);
    if (match) {
      const feet = parseInt(match[1]);
      const inches = match[2] ? parseInt(match[2]) : 0;
      return `${feet}'${inches}"`;
    }
    return lengthText || '0\'0"';
  }

  private defaultConditionParser(conditionText: string): string {
    const text = conditionText.toLowerCase();
    if (text.includes('new')) return 'New';
    if (text.includes('like new') || text.includes('excellent'))
      return 'Like New';
    if (text.includes('good') || text.includes('very good')) return 'Good';
    if (text.includes('fair') || text.includes('used')) return 'Fair';
    if (text.includes('poor') || text.includes('damaged')) return 'Poor';
    return 'Good'; // Default
  }

  private defaultLocationParser(locationText: string): {
    city: string;
    state: string;
  } {
    // Try to parse "City, State" format
    const parts = locationText.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1].length === 2 ? parts[1] : 'CA', // Default to CA if not abbreviated
      };
    }
    return { city: 'Unknown', state: 'CA' };
  }

  private isValidBoard(board: ScrapedSurfboard): boolean {
    return !!(
      board.title &&
      board.brand &&
      board.length &&
      board.price > 0 &&
      board.city &&
      board.state
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveToDatabaseBatch(boards: ScrapedSurfboard[]): Promise<void> {
    console.log(`💾 Saving ${boards.length} boards to database...`);

    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    for (const board of boards) {
      try {
        // Check if this board already exists (comprehensive duplicate check)
        const existingBoard = await prisma.surfboard.findFirst({
          where: {
            title: board.title,
            brand: board.brand,
            length: board.length,
            userId: this.userId,
            // Also check price to differentiate boards with same title/brand/length
            price: board.price,
          },
        });

        if (existingBoard) {
          console.log(
            `⚠️  Skipping duplicate: ${board.title} (already exists)`
          );
          duplicateCount++;
          continue;
        }

        await prisma.surfboard.create({
          data: {
            title: board.title,
            brand: board.brand,
            length: board.length,
            condition: board.condition,
            price: board.price,
            description: board.description,
            location: `${board.city}, ${board.state}`,
            city: board.city,
            state: board.state,
            latitude: board.latitude || null,
            longitude: board.longitude || null,
            images: board.images,
            status: 'active',
            userId: this.userId,
          },
        });
        successCount++;
        console.log(`✅ Added: ${board.title}`);
      } catch (error) {
        console.error(`❌ Failed to save board "${board.title}":`, error);
        errorCount++;
      }
    }

    console.log(`✅ Successfully saved ${successCount} new boards`);
    if (duplicateCount > 0) {
      console.log(`⚠️  Skipped ${duplicateCount} duplicate boards`);
    }
    if (errorCount > 0) {
      console.log(`❌ Failed to save ${errorCount} boards`);
    }
  }

  async saveToJsonFile(
    boards: ScrapedSurfboard[],
    filename: string
  ): Promise<void> {
    const outputPath = path.join(
      process.cwd(),
      'scripts',
      'scraped-data',
      filename
    );
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(boards, null, 2));
    console.log(`💾 Saved ${boards.length} boards to ${outputPath}`);
  }
}

// Example configurations for common surf shop websites
const EXAMPLE_CONFIGS: Record<string, ScrapingConfig> = {
  // Configuration for Rider Shack surf shop
  riderShack: {
    url: 'https://www.ridershack.com/used-surfboards',
    selectors: {
      boardContainer: '.product-item, .item.product',
      title: 'h1.page-title, .product-name, .product-item-name',
      brand: '.brand, .manufacturer',
      length: '.dimensions, .surfboard-length',
      condition: '.condition, .rating, .star-rating',
      price: '.price, .regular-price, .special-price',
      description:
        '.product-info-main .description, .short-description, .product-attribute-specs-table',
      location: '.store-location, .seller-location',
      images: '.product-image-photo, .gallery-image img, .fotorama__img',
    },
    processing: {
      brandParser: (title: string) => {
        // For Rider Shack, brand often appears after "Used" in title
        // e.g., "Used 9'0 Walden Magic Model Longboard Surfboard"
        const match = title.match(/Used\s+\d+'?\d*"?\s+([A-Za-z]+)/i);
        if (match) {
          return {
            brand: match[1],
            title: title.replace(/^Used\s+/i, '').trim(),
          };
        }

        // Fallback: first word after "Used"
        const words = title.replace(/^Used\s+/i, '').split(' ');
        if (words.length > 1) {
          return {
            brand: words[0],
            title: words.slice(1).join(' '),
          };
        }
        return { brand: 'Unknown', title };
      },
      priceParser: (priceText: string) => {
        // Handle "$799.00" format
        const match = priceText.match(/\$?([\d,]+\.?\d*)/);
        if (match) {
          return parseFloat(match[1].replace(/,/g, ''));
        }
        return 0;
      },
      lengthParser: (lengthText: string) => {
        // Handle "9'0 x 22 1/4'' x 3''" format from dimensions
        const match = lengthText.match(/(\d+)'(\d*)/);
        if (match) {
          const feet = match[1];
          const inches = match[2] || '0';
          // Handle inches properly - keep 10, 11 but limit others to single digit
          let cleanInches = inches;
          if (inches.length > 2) {
            cleanInches = inches[0]; // Take first digit if more than 2 digits
          } else if (inches.length === 2 && parseInt(inches) > 11) {
            cleanInches = inches[0]; // Take first digit if > 11 (invalid inches)
          }
          return `${feet}'${cleanInches}"`;
        }

        // Try to extract from full dimensions text like "9'0 x 22 1/4'' x 3''"
        const dimensionMatch = lengthText.match(/(\d+)'(\d*)\s*x/);
        if (dimensionMatch) {
          const feet = dimensionMatch[1];
          const inches = dimensionMatch[2] || '0';
          // Handle inches properly - keep 10, 11 but limit others to single digit
          let cleanInches = inches;
          if (inches.length > 2) {
            cleanInches = inches[0]; // Take first digit if more than 2 digits
          } else if (inches.length === 2 && parseInt(inches) > 11) {
            cleanInches = inches[0]; // Take first digit if > 11 (invalid inches)
          }
          return `${feet}'${cleanInches}"`;
        }

        // Handle simple number formats
        const numberMatch = lengthText.match(/^\d+$/);
        if (numberMatch) {
          const num = parseInt(numberMatch[0]);
          if (num >= 40 && num <= 120) {
            // Assume it's in format like "90" meaning 9'0"
            const feet = Math.floor(num / 10);
            const inches = num % 10;
            return `${feet}'${inches}"`;
          }
        }

        return lengthText || '0\'0"';
      },
      conditionParser: (conditionText: string) => {
        // Rider Shack uses star ratings - convert to condition
        if (
          conditionText.includes('5') ||
          conditionText.toLowerCase().includes('nearly new')
        )
          return 'New';
        if (
          conditionText.includes('4') ||
          conditionText.toLowerCase().includes('lightly used')
        )
          return 'Like New';
        if (
          conditionText.includes('3') ||
          conditionText.toLowerCase().includes('used')
        )
          return 'Good';
        if (
          conditionText.includes('2') ||
          conditionText.toLowerCase().includes('worn')
        )
          return 'Fair';
        if (
          conditionText.includes('1') ||
          conditionText.toLowerCase().includes('heavily worn')
        )
          return 'Poor';
        return 'Good'; // Default for used boards
      },
      locationParser: () => {
        // Rider Shack is in Los Angeles, CA
        return {
          city: 'Los Angeles',
          state: 'CA',
        };
      },
    },
  },
  // Example for a typical surf shop website
  genericSurfShop: {
    url: 'https://example-surf-shop.com/used-surfboards',
    selectors: {
      boardContainer: '.product-item, .surfboard-listing, .board-card',
      title: '.product-title, .board-title, h3, h4',
      brand: '.brand, .manufacturer',
      length: '.length, .dimensions, .size',
      condition: '.condition, .grade',
      price: '.price, .cost, .amount',
      description: '.description, .details, .product-description',
      location: '.location, .seller-location',
      images: 'img.product-image, .gallery img, .board-image',
    },
    processing: {
      brandParser: (title: string) => {
        // Extract brand from title if it's the first word
        const words = title.split(' ');
        if (words.length > 1) {
          return {
            brand: words[0],
            title: words.slice(1).join(' '),
          };
        }
        return { brand: 'Unknown', title };
      },
    },
  },
};

// Main execution function
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🏄‍♂️ Surfboard Scraper Usage:

Basic usage:
npm run scrape -- <website-url> <user-email>

Advanced usage with custom selectors:
npm run scrape -- <website-url> <user-email> --config custom-config.json

Examples:
npm run scrape -- "https://surf-shop.com/boards" "your@email.com"
npm run scrape -- "https://surf-shop.com/boards" "your@email.com" --save-only

Options:
--save-only    Save to JSON file only (don't insert to database)
--config       Use custom configuration file
--help         Show this help message

The script will attempt to auto-detect common surfboard listing patterns,
but you may need to customize the selectors for specific websites.
    `);
    process.exit(0);
  }

  const websiteUrl = args[0];
  const userEmail = args[1];
  const saveOnly = args.includes('--save-only');

  if (!websiteUrl || !userEmail) {
    console.error('❌ Please provide website URL and user email');
    process.exit(1);
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, name: true },
    });

    if (!user) {
      console.error(`❌ User with email ${userEmail} not found`);
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.name} (${userEmail})`);

    // Auto-detect configuration based on URL
    let configTemplate = EXAMPLE_CONFIGS.genericSurfShop;

    if (websiteUrl.includes('ridershack.com')) {
      configTemplate = EXAMPLE_CONFIGS.riderShack;
      console.log('🏄‍♂️ Detected Rider Shack - using specialized configuration');
    }

    // Use detected or generic config as starting point
    const config: ScrapingConfig = {
      url: websiteUrl,
      selectors: configTemplate.selectors,
      processing: configTemplate.processing,
    };

    const scraper = new SurfboardScraper(config, user.id);
    const boards = await scraper.scrape();

    if (boards.length === 0) {
      console.log(
        '⚠️  No boards found. You may need to customize the selectors for this website.'
      );
      console.log(
        'Check the HTML structure and update the selectors in the script.'
      );
      process.exit(0);
    }

    // Save to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `surfboards-${timestamp}.json`;
    await scraper.saveToJsonFile(boards, filename);

    // Optionally save to database
    if (!saveOnly) {
      await scraper.saveToDatabaseBatch(boards);
    } else {
      console.log('💾 Data saved to JSON file only (--save-only flag used)');
    }

    console.log('🎉 Scraping complete!');
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { SurfboardScraper };
export type { ScrapingConfig };
