#!/usr/bin/env node

/**
 * Verify that all required environment variables are set
 */

const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
  'NEXT_PUBLIC_GITHUB_CLIENT_ID',
];

const emailVars = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM',
];

const allVars = [...requiredVars, ...emailVars];

console.log('\n📋 Verifying Environment Setup...\n');

let missing = [];
let configured = [];

allVars.forEach((varName) => {
  const value = process.env[varName];
  const isRequired = requiredVars.includes(varName);
  const isEmail = emailVars.includes(varName);

  if (value && value !== '') {
    configured.push(varName);
    console.log(`✅ ${varName}`);
  } else {
    if (isRequired) {
      missing.push(varName);
      console.log(`❌ ${varName} (REQUIRED)`);
    } else if (isEmail) {
      console.log(`⚠️  ${varName} (optional, needed for contact replies)`);
    }
  }
});

console.log(`\n📊 Summary: ${configured.length}/${allVars.length} variables configured\n`);

if (missing.length > 0) {
  console.log('🚨 Missing Required Variables:');
  missing.forEach((v) => console.log(`   - ${v}`));
  console.log(
    '\n⚡ Add these to your .env.local or Vercel environment variables'
  );
  console.log(
    '📖 See .env.example for configuration details\n'
  );
  process.exit(1);
} else {
  console.log('✨ All required variables are set!\n');
  process.exit(0);
}
