#!/usr/bin/env node

/**
 * Quick Test Script for Claude Agent SDK
 *
 * Run this to verify your authentication is working
 * Usage: node examples/test-claude-sdk.js
 */

const { query } = require("@anthropic-ai/claude-agent-sdk");

async function testAuthentication() {
  console.log("🔧 Testing Claude Agent SDK Authentication...\n");

  try {
    // Test 1: Simple query using environment variable
    console.log("Test 1: Simple query with ANTHROPIC_API_KEY from environment");
    console.log("─".repeat(60));

    const result = await query({
      prompt: "Say 'Hello from Claude Agent SDK!' and tell me what model you are.",
    });

    console.log("✅ Success! Response:");
    console.log(result);
    console.log("\n");

    // Test 2: Query with explicit options
    console.log("Test 2: Query with explicit model configuration");
    console.log("─".repeat(60));

    const result2 = await query({
      prompt: "Write a one-line function comment for: function add(a, b) { return a + b; }",
      options: {
        model: 'claude-sonnet-4',
        maxTokens: 100
      }
    });

    console.log("✅ Success! Response:");
    console.log(result2);
    console.log("\n");

    console.log("🎉 All tests passed! Your Claude Agent SDK is configured correctly.\n");

  } catch (error) {
    console.error("❌ Authentication failed!\n");
    console.error("Error:", error.message);
    console.error("\n");

    console.log("💡 Troubleshooting:");
    console.log("1. Make sure ANTHROPIC_API_KEY is set in your environment");
    console.log("   - Check with: echo $ANTHROPIC_API_KEY");
    console.log("   - Or add to .env file: ANTHROPIC_API_KEY=sk-ant-api03-...");
    console.log("\n");
    console.log("2. Alternatively, add API key to .claude/settings.local.json:");
    console.log('   {');
    console.log('     "apiKey": "sk-ant-api03-..."');
    console.log('   }');
    console.log("\n");
    console.log("3. Get your API key from: https://console.anthropic.com/");
    console.log("\n");

    process.exit(1);
  }
}

// Check for API key before running
if (!process.env.ANTHROPIC_API_KEY) {
  console.log("⚠️  Warning: ANTHROPIC_API_KEY not found in environment");
  console.log("The SDK will try to load from .claude/settings files...\n");
}

testAuthentication();
