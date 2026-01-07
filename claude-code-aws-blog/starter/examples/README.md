# Claude Agent SDK Examples

This directory contains examples for using the Claude Agent SDK in your projects.

## Quick Start

### 1. Install Dependencies

Already done! The SDK is installed in this project:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### 2. Set Up Authentication

Choose one of these methods:

#### Option A: Environment Variable (Recommended)

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

#### Option B: Claude Settings File

Create or edit `.claude/settings.local.json`:

```json
{
  "apiKey": "sk-ant-api03-your-key-here"
}
```

#### Option C: User Settings (Global)

Edit `~/.claude/settings.json`:

```json
{
  "apiKey": "sk-ant-api03-your-key-here",
  "model": "claude-sonnet-4"
}
```

### 3. Get Your API Key

1. Visit: https://console.anthropic.com/
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new key
5. Copy the key (starts with `sk-ant-api03-...`)

### 4. Test Your Setup

Run the test script:

```bash
node examples/test-claude-sdk.js
```

If successful, you should see:

```
🔧 Testing Claude Agent SDK Authentication...

Test 1: Simple query with ANTHROPIC_API_KEY from environment
────────────────────────────────────────────────────────────
✅ Success! Response:
Hello from Claude Agent SDK! I am Claude Sonnet 4.5...

🎉 All tests passed! Your Claude Agent SDK is configured correctly.
```

## Example Files

### `claude-agent-sdk-auth.ts`

Comprehensive TypeScript examples showing all authentication methods:

- Environment variable authentication
- Explicit API key in options
- API key sources (user, project, org)
- Settings sources (configuration files)
- Full configuration with all options
- AWS Bedrock authentication
- Error handling

### `test-claude-sdk.js`

Quick test script to verify your authentication is working.

## Common Use Cases

### Query Claude for Code Analysis

```javascript
const { query } = require("@anthropic-ai/claude-agent-sdk");

const result = await query({
  prompt: "Explain this code:\n" + myCodeSnippet,
  options: {
    model: 'claude-sonnet-4',
    maxTokens: 2000
  }
});

console.log(result);
```

### Generate Documentation

```javascript
const result = await query({
  prompt: "Generate JSDoc comments for this function:\n" + functionCode,
  options: {
    temperature: 0.3,  // Lower temperature for more focused output
    maxBudgetUsd: 1.00
  }
});
```

### AWS Bedrock Integration

```javascript
const result = await query({
  prompt: "Analyze this AWS architecture",
  options: {
    provider: 'bedrock',
    region: 'us-east-1',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0'
  }
});
```

## API Key Security

### ✅ DO:

- Store API keys in `.env` files (add to `.gitignore`)
- Use `.claude/settings.local.json` (already gitignored)
- Use environment variables in production
- Rotate keys regularly
- Use project-specific keys when possible

### ❌ DON'T:

- Commit API keys to version control
- Share API keys in chat or email
- Use production keys in development
- Hard-code keys in source files

## Authentication Priority

The SDK checks for API keys in this order:

1. Explicit `apiKey` in options
2. `ANTHROPIC_API_KEY` environment variable
3. `.claude/settings.local.json` (local overrides)
4. `.claude/settings.json` (project settings)
5. `~/.claude/settings.json` (user settings)

## Troubleshooting

### Error: "No API key found"

- Check if `ANTHROPIC_API_KEY` is set: `echo $ANTHROPIC_API_KEY`
- Verify `.claude/settings.local.json` contains a valid key
- Run the test script: `node examples/test-claude-sdk.js`

### Error: "Invalid API key"

- Confirm your key starts with `sk-ant-api03-`
- Check for extra spaces or quotes in the key
- Generate a new key at https://console.anthropic.com/

### Error: "Rate limit exceeded"

- You're making too many requests
- Add delays between requests
- Use `maxBudgetUsd` to control costs
- Consider upgrading your Anthropic plan

### Error: "Model not found"

- Check model name spelling: `claude-sonnet-4`
- For Bedrock, use full model ID: `anthropic.claude-3-sonnet-20240229-v1:0`
- Verify model access in Anthropic console or AWS Bedrock

## Additional Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Agent SDK GitHub](https://github.com/anthropics/claude-agent-sdk)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Claude Code Documentation](https://docs.claude.ai/code)

## Next Steps

1. Review `claude-agent-sdk-auth.ts` for detailed examples
2. Run `test-claude-sdk.js` to verify your setup
3. Build your own scripts using the SDK
4. Check the project's `CLAUDE.md` for integration ideas

Happy coding with Claude! 🚀
