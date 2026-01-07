# Scripts

Utility scripts for the AWS Claude Code Blog project.

## RSS Feed Generator

**File**: `generate-rss.js`

Generates an RSS 2.0 feed from blog posts using the Anthropic Claude API.

### Features

- 📖 Automatically reads all blog posts from `content/posts/`
- 🤖 Uses Claude AI to generate valid RSS 2.0 XML
- ✅ Validates RSS structure before saving
- 📝 Filters out draft posts (published: false)
- 🔤 Proper XML escaping and date formatting
- 📊 Sorts posts by date (newest first)

### Prerequisites

1. **Anthropic SDK installed** (already done - `@anthropic-ai/sdk@0.71.2`)
2. **API Key configured** - Set environment variable:

   ```bash
   # Set ANTHROPIC_API_KEY environment variable
   export ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```

   Or add to a `.env` file in the project root:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```

3. **Blog posts in content/posts/** with valid frontmatter

### Usage

```bash
# Run the script
node scripts/generate-rss.js

# Or make it executable and run directly
chmod +x scripts/generate-rss.js
./scripts/generate-rss.js
```

### Configuration

Edit these variables in the script if needed:

```javascript
const BLOG_URL = process.env.BLOG_URL || 'https://aws-blog.example.com';
const BLOG_TITLE = 'AWS Claude Code Blog';
const BLOG_DESCRIPTION = 'Learn to build AI-powered applications with Claude Code on AWS';
```

Or set via environment variable:

```bash
BLOG_URL=https://my-blog.com node scripts/generate-rss.js
```

### Output

The script generates `public/rss.xml` with:

- **Channel metadata**: Blog title, description, link
- **Item elements**: One per published post with:
  - Title, link, description (excerpt)
  - Publication date (RFC 822 format)
  - Author, category, tags
  - GUID (permalink)

### Example Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AWS Claude Code Blog</title>
    <description>Learn to build AI-powered applications with Claude Code on AWS</description>
    <link>https://aws-blog.example.com</link>
    <language>en-us</language>
    <lastBuildDate>Tue, 07 Jan 2026 00:00:00 GMT</lastBuildDate>

    <item>
      <title>Getting Started with Claude Code on AWS</title>
      <link>https://aws-blog.example.com/posts/getting-started-claude-code-aws</link>
      <description><![CDATA[Learn how to set up Claude Code with AWS Bedrock...]]></description>
      <pubDate>Wed, 22 Oct 2025 00:00:00 GMT</pubDate>
      <author>Sarah Chen</author>
      <category>Getting Started</category>
      <guid isPermaLink="true">https://aws-blog.example.com/posts/getting-started-claude-code-aws</guid>
    </item>

    <!-- More items... -->

  </channel>
</rss>
```

### Validation

The script includes built-in validation checks:

✅ XML declaration
✅ RSS root element
✅ Channel metadata
✅ Item elements
✅ Required fields
✅ Closing tags

For additional validation, use:

- [W3C Feed Validator](https://validator.w3.org/feed/)
- [RSS Validator](https://www.rssboard.org/rss-validator/)

### Adding RSS to Your Site

Add this to your `app/layout.tsx` in the `<head>` section:

```tsx
<link
  rel="alternate"
  type="application/rss+xml"
  title="AWS Claude Code Blog RSS Feed"
  href="/rss.xml"
/>
```

This enables RSS autodiscovery in browsers and feed readers.

### Troubleshooting

#### Error: "No API key found"

```bash
# Check if API key is set
echo $ANTHROPIC_API_KEY

# Or verify settings file exists
cat .claude/settings.local.json
```

#### Error: "Posts directory not found"

Make sure you're running from the project root:

```bash
cd /claude_code_project/claude-code-aws-blog/starter
node scripts/generate-rss.js
```

#### Error: "Generated content does not start with XML declaration"

Claude's response included markdown formatting. The script should remove this automatically, but if it persists:

1. Try running again (Claude may give a better response)
2. Check your API key is valid
3. Verify you have enough API credits

#### Generated RSS is invalid

1. Check blog post frontmatter is valid (required fields: title, date, author, category, tags)
2. Run the frontmatter validation hook: edit any post in `content/posts/`
3. Validate RSS at: https://validator.w3.org/feed/

### How It Works

1. **Read Posts**: Scans `content/posts/` for `.md` and `.mdx` files
2. **Parse Frontmatter**: Extracts metadata using `gray-matter`
3. **Filter Drafts**: Only includes posts with `published: true` (or published field not set)
4. **Sort by Date**: Orders posts chronologically (newest first)
5. **Ask Claude**: Sends post data to Claude with prompt for RSS generation
6. **Validate**: Checks generated XML has required RSS 2.0 elements
7. **Save**: Writes to `public/rss.xml`

### Cost Estimation

- Model: Claude Sonnet 4
- Input tokens: ~500-1000 (depending on number of posts)
- Output tokens: ~2000-4000 (depending on feed size)
- Estimated cost: ~$0.01-0.05 per generation

### CI/CD Integration

Add to your build process:

```json
{
  "scripts": {
    "build": "next build && node scripts/generate-rss.js",
    "generate:rss": "node scripts/generate-rss.js"
  }
}
```

Or create a GitHub Action:

```yaml
- name: Generate RSS Feed
  run: node scripts/generate-rss.js
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Future Enhancements

Ideas for extending the script:

- [ ] Generate Atom feed format
- [ ] Support podcast RSS extensions
- [ ] Add image enclosures
- [ ] Generate JSON Feed format
- [ ] Include full post content (not just excerpt)
- [ ] Generate category-specific feeds
- [ ] Add caching to avoid regenerating if posts unchanged

### Related Files

- **Blog posts**: `content/posts/*.mdx`
- **Output**: `public/rss.xml`
- **SDK examples**: `examples/claude-agent-sdk-auth.ts`
- **Dependencies**: `package.json`

---

Created as part of the AWS Claude Code Workshop - Exercise 014
