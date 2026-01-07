/**
 * Claude Agent SDK - Authentication Examples
 *
 * This file demonstrates different ways to authenticate with the Claude Agent SDK
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// ============================================================================
// METHOD 1: Environment Variable (Recommended for Production)
// ============================================================================
// Set ANTHROPIC_API_KEY in your environment or .env file
// The SDK will automatically pick it up

async function exampleWithEnvVar() {
  console.log("Method 1: Using environment variable ANTHROPIC_API_KEY");

  const result = await query({
    prompt: "What is the capital of France?",
    // No explicit authentication needed - uses ANTHROPIC_API_KEY from env
  });

  console.log(result);
}

// ============================================================================
// METHOD 2: Explicit API Key in Options
// ============================================================================
// Useful for testing or when you need to use different keys

async function exampleWithExplicitKey() {
  console.log("Method 2: Explicit API key in options");

  const result = await query({
    prompt: "Explain TypeScript generics",
    options: {
      apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key-here'
    }
  });

  console.log(result);
}

// ============================================================================
// METHOD 3: API Key Source (User, Project, Org)
// ============================================================================
// Load API key from different configuration sources

async function exampleWithKeySource() {
  console.log("Method 3: Using specific API key source");

  const result = await query({
    prompt: "Write a function to reverse a string",
    options: {
      apiKeySource: 'project'  // Options: 'user', 'project', 'org', 'temporary'
    }
  });

  console.log(result);
}

// ============================================================================
// METHOD 4: Settings Sources (Configuration Files)
// ============================================================================
// Load configuration from Claude Code settings files

async function exampleWithSettingsSources() {
  console.log("Method 4: Using settings sources");

  const result = await query({
    prompt: "Explain AWS Lambda cold starts",
    options: {
      settingSources: [
        'local',    // .claude/settings.local.json (gitignored)
        'project',  // .claude/settings.json
        'user'      // ~/.claude/settings.json
      ]
    }
  });

  console.log(result);
}

// ============================================================================
// METHOD 5: Full Configuration with All Options
// ============================================================================

async function exampleWithFullConfig() {
  console.log("Method 5: Full configuration");

  const result = await query({
    prompt: "Generate a README for a TypeScript library",
    options: {
      // Authentication
      apiKeySource: 'project',
      settingSources: ['project', 'user'],

      // Model configuration
      model: 'claude-sonnet-4',

      // Budget control
      maxBudgetUsd: 5.00,

      // Additional options
      temperature: 0.7,  // Creativity (0-1)
      maxTokens: 4000    // Response length limit
    }
  });

  console.log(result);
}

// ============================================================================
// METHOD 6: AWS Bedrock Authentication
// ============================================================================
// For using Claude through AWS Bedrock instead of Anthropic API

async function exampleWithBedrock() {
  console.log("Method 6: AWS Bedrock authentication");

  // Note: Bedrock uses AWS credentials (IAM roles, access keys)
  // Configure AWS credentials separately using AWS SDK

  const result = await query({
    prompt: "Explain AWS Bedrock pricing",
    options: {
      provider: 'bedrock',  // Use AWS Bedrock instead of Anthropic API
      region: 'us-east-1',  // AWS region
      model: 'anthropic.claude-3-sonnet-20240229-v1:0'
    }
  });

  console.log(result);
}

// ============================================================================
// AUTHENTICATION SETUP GUIDE
// ============================================================================

/**
 * Where to Store API Keys:
 *
 * 1. Environment Variables (.env file):
 *    ANTHROPIC_API_KEY=sk-ant-api03-...
 *
 * 2. User Settings (~/.claude/settings.json):
 *    {
 *      "apiKey": "sk-ant-api03-...",
 *      "model": "claude-sonnet-4"
 *    }
 *
 * 3. Project Settings (.claude/settings.json):
 *    {
 *      "apiKey": "sk-ant-api03-...",
 *      "maxBudgetUsd": 10.00
 *    }
 *
 * 4. Local Settings (.claude/settings.local.json) - gitignored:
 *    {
 *      "apiKey": "sk-ant-api03-..."
 *    }
 *
 * Best Practices:
 * - Use environment variables for production
 * - Store personal keys in user settings (~/.claude/)
 * - Store team keys in project settings (.claude/settings.json)
 * - Never commit API keys to version control
 * - Use .claude/settings.local.json for local overrides (already gitignored)
 */

// ============================================================================
// ERROR HANDLING
// ============================================================================

async function exampleWithErrorHandling() {
  console.log("Error handling example");

  try {
    const result = await query({
      prompt: "Generate a blog post",
      options: {
        apiKeySource: 'project',
        maxBudgetUsd: 1.00  // Budget limit
      }
    });

    console.log("Success:", result);

  } catch (error) {
    if (error.message.includes('authentication')) {
      console.error("Authentication failed. Check your API key.");
    } else if (error.message.includes('budget')) {
      console.error("Budget exceeded. Increase maxBudgetUsd or reduce usage.");
    } else {
      console.error("Error:", error.message);
    }
  }
}

// ============================================================================
// GETTING YOUR API KEY
// ============================================================================

/**
 * How to Get an Anthropic API Key:
 *
 * 1. Go to: https://console.anthropic.com/
 * 2. Sign up or log in
 * 3. Navigate to "API Keys" section
 * 4. Click "Create Key"
 * 5. Copy the key (starts with sk-ant-api03-...)
 * 6. Store it securely (see storage options above)
 *
 * For AWS Bedrock:
 * 1. Enable AWS Bedrock in your AWS account
 * 2. Request access to Claude models in Bedrock console
 * 3. Configure AWS credentials using AWS CLI or IAM roles
 * 4. Use provider: 'bedrock' in SDK options
 */

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

async function main() {
  // Choose one method to run:

  // await exampleWithEnvVar();
  // await exampleWithExplicitKey();
  // await exampleWithKeySource();
  // await exampleWithSettingsSources();
  // await exampleWithFullConfig();
  // await exampleWithBedrock();
  await exampleWithErrorHandling();
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  exampleWithEnvVar,
  exampleWithExplicitKey,
  exampleWithKeySource,
  exampleWithSettingsSources,
  exampleWithFullConfig,
  exampleWithBedrock,
  exampleWithErrorHandling
};
