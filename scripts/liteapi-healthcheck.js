#!/usr/bin/env node

const baseUrl = process.env.LITEAPI_BASE_URL || 'https://api.liteapi.travel/v3.0';
const apiKey = process.env.LITEAPI_KEY || process.env.LITEAPI_SANDBOX_KEY;

if (!apiKey) {
  console.error('[LiteAPI Health] Missing LITEAPI_KEY. Set a private server-side key before running the health check.');
  process.exit(1);
}

async function main() {
  const url = `${baseUrl.replace(/\/$/, '')}/data/countries`;
  console.log(`[LiteAPI Health] GET ${url}`);

  const response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  const requestId = response.headers.get('X-Request-ID') || response.headers.get('x-request-id') || 'n/a';
  console.log(`[LiteAPI Health] status=${response.status} ${response.statusText} requestId=${requestId}`);

  const bodyText = await response.text();
  if (bodyText) {
    const trimmed = bodyText.slice(0, 800);
    console.log(trimmed);
  }

  if (!response.ok) {
    console.error('[LiteAPI Health] Request failed. Check that LITEAPI_KEY is a private server-side key and that the key has permission to access /data/countries.');
    process.exit(1);
  }

  console.log('[LiteAPI Health] OK');
}

main().catch((error) => {
  console.error('[LiteAPI Health] Health check crashed.');
  console.error(error);
  process.exit(1);
});
