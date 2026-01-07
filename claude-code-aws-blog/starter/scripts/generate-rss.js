#!/usr/bin/env node

/**
 * RSS Feed Generator using Anthropic Claude API
 *
 * This script:
 * 1. Reads all blog posts from content/posts/
 * 2. Extracts metadata (title, date, author, category, excerpt)
 * 3. Uses Claude API to generate valid RSS 2.0 XML
 * 4. Saves output to public/rss.xml
 *
 * Usage: node scripts/generate-rss.js
 * Requires: ANTHROPIC_API_KEY environment variable
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import Anthropic from '@anthropic-ai/sdk';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const POSTS_DIR = path.join(__dirname, '../content/posts');
const OUTPUT_FILE = path.join(__dirname, '../public/rss.xml');
const BLOG_URL = process.env.BLOG_URL || 'https://aws-blog.example.com';
const BLOG_TITLE = 'AWS Claude Code Blog';
const BLOG_DESCRIPTION = 'Learn to build AI-powered applications with Claude Code on AWS';

/**
 * Read all blog post files from content/posts/
 */
function readBlogPosts() {
  console.log('📖 Reading blog posts from:', POSTS_DIR);

  if (!fs.existsSync(POSTS_DIR)) {
    throw new Error(`Posts directory not found: ${POSTS_DIR}`);
  }

  const files = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .filter(file => file !== '.gitkeep');

  console.log(`   Found ${files.length} blog post(s)\n`);

  const posts = [];

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    try {
      const parsed = matter(fileContent);
      const frontmatter = parsed.data;

      // Only include published posts
      if (frontmatter.published === false) {
        console.log(`   ⏭️  Skipping draft: ${file}`);
        continue;
      }

      // Extract metadata
      const post = {
        filename: file,
        title: frontmatter.title || 'Untitled',
        date: frontmatter.date,
        author: frontmatter.author || 'Unknown',
        category: frontmatter.category || 'Uncategorized',
        excerpt: frontmatter.excerpt || '',
        tags: frontmatter.tags || [],
        content: parsed.content,
        slug: file.replace(/\.(md|mdx)$/, '')
      };

      // Format date
      if (post.date instanceof Date) {
        post.date = post.date.toISOString().split('T')[0];
      }

      posts.push(post);
      console.log(`   ✅ ${post.title} (${post.date})`);

    } catch (error) {
      console.error(`   ❌ Error parsing ${file}:`, error.message);
    }
  }

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  console.log(`\n📊 Total published posts: ${posts.length}\n`);

  return posts;
}

/**
 * Use Claude to generate RSS 2.0 XML
 */
async function generateRSSWithClaude(posts) {
  console.log('🤖 Asking Claude to generate RSS 2.0 XML...\n');

  // Prepare post data for Claude
  const postsData = posts.map(post => ({
    title: post.title,
    date: post.date,
    author: post.author,
    category: post.category,
    excerpt: post.excerpt,
    tags: post.tags,
    link: `${BLOG_URL}/posts/${post.slug}`
  }));

  const prompt = `Generate a valid RSS 2.0 XML feed for a blog.

Blog Information:
- Title: ${BLOG_TITLE}
- Description: ${BLOG_DESCRIPTION}
- Link: ${BLOG_URL}
- Language: en-us

Posts Data (${posts.length} posts):
${JSON.stringify(postsData, null, 2)}

Requirements:
1. Generate valid RSS 2.0 XML format
2. Include proper XML declaration and encoding
3. Use <channel> element with blog metadata
4. Create <item> elements for each post
5. Include title, link, description, pubDate, author, category, and guid for each item
6. Format pubDate in RFC 822 format (e.g., "Wed, 22 Oct 2025 00:00:00 GMT")
7. Properly escape XML special characters (&, <, >, ", ')
8. Include proper CDATA sections for HTML content in descriptions
9. Set guid to the post link with isPermaLink="true"
10. Add category tags for post categories

Return ONLY the XML content, no explanations or markdown code blocks.`;

  try {
    // Initialize Anthropic client
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.API_KEY,
    });

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract text from response
    let rssXml = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        rssXml += block.text;
      }
    }

    // Ensure it's a string
    rssXml = rssXml.trim();

    // Remove markdown code fence if present
    rssXml = rssXml.replace(/^```xml\s*\n/i, '');
    rssXml = rssXml.replace(/^```\s*\n/i, '');
    rssXml = rssXml.replace(/\n```\s*$/i, '');
    rssXml = rssXml.trim();

    // Validate it starts with XML declaration
    if (!rssXml.startsWith('<?xml')) {
      throw new Error('Generated content does not start with XML declaration');
    }

    console.log('✅ Claude generated RSS XML successfully\n');
    console.log('📄 Preview (first 500 characters):');
    console.log('─'.repeat(60));
    console.log(rssXml.substring(0, 500) + '...\n');

    return rssXml;

  } catch (error) {
    console.error('❌ Error generating RSS with Claude:', error.message);
    throw error;
  }
}

/**
 * Save RSS XML to file
 */
function saveRSSFile(rssXml) {
  console.log('💾 Saving RSS feed to:', OUTPUT_FILE);

  // Ensure public directory exists
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('   Created directory:', publicDir);
  }

  // Write RSS file
  fs.writeFileSync(OUTPUT_FILE, rssXml, 'utf8');

  const fileSize = fs.statSync(OUTPUT_FILE).size;
  console.log(`   ✅ Saved ${fileSize} bytes to ${path.basename(OUTPUT_FILE)}\n`);
}

/**
 * Validate RSS XML (basic check)
 */
function validateRSS(rssXml) {
  console.log('🔍 Validating RSS XML...');

  const checks = [
    { name: 'XML declaration', test: () => rssXml.includes('<?xml') },
    { name: 'RSS root element', test: () => rssXml.includes('<rss') },
    { name: 'Channel element', test: () => rssXml.includes('<channel>') },
    { name: 'Title element', test: () => rssXml.includes('<title>') },
    { name: 'Link element', test: () => rssXml.includes('<link>') },
    { name: 'Description element', test: () => rssXml.includes('<description>') },
    { name: 'Item elements', test: () => rssXml.includes('<item>') },
    { name: 'Closing tags', test: () => rssXml.includes('</rss>') }
  ];

  let allPassed = true;
  for (const check of checks) {
    const passed = check.test();
    const status = passed ? '✅' : '❌';
    console.log(`   ${status} ${check.name}`);
    if (!passed) allPassed = false;
  }

  console.log();

  if (!allPassed) {
    throw new Error('RSS validation failed - see errors above');
  }

  console.log('✅ RSS validation passed\n');
}

/**
 * Display summary
 */
function displaySummary(posts, outputFile) {
  console.log('═'.repeat(60));
  console.log('✅ RSS FEED GENERATION COMPLETE');
  console.log('═'.repeat(60));
  console.log(`📊 Posts processed: ${posts.length}`);
  console.log(`📁 Output file: ${outputFile}`);
  console.log(`🔗 Feed URL: ${BLOG_URL}/rss.xml`);
  console.log('═'.repeat(60));
  console.log();
  console.log('💡 Next steps:');
  console.log('   1. Review the generated RSS feed at:', outputFile);
  console.log('   2. Test the feed with an RSS validator:');
  console.log('      https://validator.w3.org/feed/');
  console.log('   3. Add <link rel="alternate" type="application/rss+xml"');
  console.log('      to your HTML <head> for RSS autodiscovery');
  console.log();
}

/**
 * Main execution
 */
async function main() {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('🚀 RSS FEED GENERATOR - Claude API');
  console.log('═'.repeat(60));
  console.log();

  try {
    // Step 1: Read blog posts
    const posts = readBlogPosts();

    if (posts.length === 0) {
      console.log('⚠️  No published posts found. Nothing to generate.');
      return;
    }

    // Step 2: Generate RSS with Claude
    const rssXml = await generateRSSWithClaude(posts);

    // Step 3: Validate RSS
    validateRSS(rssXml);

    // Step 4: Save to file
    saveRSSFile(rssXml);

    // Step 5: Display summary
    displaySummary(posts, OUTPUT_FILE);

  } catch (error) {
    console.error('\n❌ RSS generation failed:', error.message);
    console.error();

    if (error.message.includes('authentication') || error.message.includes('API key') || error.message.includes('401')) {
      console.log('💡 Authentication issue detected. Please:');
      console.log('   1. Set ANTHROPIC_API_KEY environment variable:');
      console.log('      export ANTHROPIC_API_KEY=sk-ant-api03-...');
      console.log('   2. Get your API key from: https://console.anthropic.com/');
      console.log('   3. Ensure the key has sufficient credits');
      console.log();
    }

    process.exit(1);
  }
}

// Run the script
main();

// Export functions for potential reuse
export { readBlogPosts, generateRSSWithClaude, saveRSSFile };
