/**
 * Cloudflare Worker - Code Verification API
 * Deploy this as a Cloudflare Worker to handle code verification
 */

// Sample codes database (in production, use KV storage)
const CODES_DATABASE = {
  'ALPHA2025': {
    valid: true,
    expires: '2025-09-01T23:59:59Z',
    rewards: ['1000 Coins', '50 Gems'],
    usageLimit: null
  },
  'SURVIVE100': {
    valid: true,
    expires: '2025-08-31T23:59:59Z',
    rewards: ['Epic Armor'],
    usageLimit: 10000
  },
  'WELCOME2HZ': {
    valid: true,
    expires: null,
    rewards: ['Starter Pack'],
    usageLimit: null
  },
  'UPDATE16': {
    valid: true,
    expires: '2025-09-05T23:59:59Z',
    rewards: ['Plasma Rifle', '2x XP Boost (2 hours)'],
    usageLimit: 5000
  },
  'DISCORD1K': {
    valid: true,
    expires: '2025-08-30T23:59:59Z',
    rewards: ['Discord Pet'],
    usageLimit: 1000
  },
  'NIGHTMARE': {
    valid: false,
    expires: '2025-08-20T23:59:59Z',
    rewards: ['Nightmare Survivor Title'],
    usageLimit: null
  }
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=300' // Cache for 5 minutes
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Route: /api/verify-code
  if (path === '/api/verify-code' && request.method === 'GET') {
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response(
        JSON.stringify({
          error: 'Missing code parameter',
          message: 'Please provide a code to verify'
        }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const codeData = await verifyCode(code.toUpperCase());
    
    return new Response(
      JSON.stringify(codeData),
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  }

  // Route: /api/all-codes
  if (path === '/api/all-codes' && request.method === 'GET') {
    const allCodes = await getAllCodes();
    
    return new Response(
      JSON.stringify(allCodes),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  }

  // Route: /api/stats
  if (path === '/api/stats' && request.method === 'GET') {
    const stats = await getGameStats();
    
    return new Response(
      JSON.stringify(stats),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  }

  // 404 for unknown routes
  return new Response(
    JSON.stringify({
      error: 'Not Found',
      message: 'The requested endpoint does not exist'
    }),
    { 
      status: 404,
      headers: corsHeaders
    }
  );
}

async function verifyCode(code) {
  // In production, fetch from KV storage or external API
  const codeInfo = CODES_DATABASE[code];
  
  if (!codeInfo) {
    return {
      code: code,
      valid: false,
      message: 'Invalid code',
      status: 'invalid'
    };
  }

  // Check expiration
  if (codeInfo.expires) {
    const expiryDate = new Date(codeInfo.expires);
    const now = new Date();
    
    if (now > expiryDate) {
      return {
        code: code,
        valid: false,
        message: 'Code has expired',
        status: 'expired',
        expiredAt: codeInfo.expires
      };
    }
  }

  // Code is valid
  return {
    code: code,
    valid: codeInfo.valid,
    status: codeInfo.valid ? 'active' : 'inactive',
    rewards: codeInfo.rewards,
    expires: codeInfo.expires,
    usageLimit: codeInfo.usageLimit,
    message: codeInfo.valid ? 'Code is valid and active' : 'Code is currently inactive'
  };
}

async function getAllCodes() {
  const now = new Date();
  const codes = [];
  
  for (const [code, info] of Object.entries(CODES_DATABASE)) {
    const isExpired = info.expires ? new Date(info.expires) < now : false;
    
    codes.push({
      code: code,
      status: !info.valid ? 'inactive' : isExpired ? 'expired' : 'active',
      rewards: info.rewards,
      expires: info.expires,
      usageLimit: info.usageLimit
    });
  }
  
  // Sort codes: active first, then expired, then inactive
  codes.sort((a, b) => {
    const statusOrder = { 'active': 0, 'expired': 1, 'inactive': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
  
  return {
    totalCodes: codes.length,
    activeCodes: codes.filter(c => c.status === 'active').length,
    expiredCodes: codes.filter(c => c.status === 'expired').length,
    codes: codes,
    lastUpdated: new Date().toISOString()
  };
}

async function getGameStats() {
  // In production, fetch real-time data from game API or database
  // This is mock data for demonstration
  
  const stats = {
    playersOnline: Math.floor(Math.random() * 5000) + 10000,
    activeServers: Math.floor(Math.random() * 200) + 800,
    totalPlayers: 1254789,
    highestRound: 847,
    currentVersion: '1.6.2',
    lastUpdate: '2025-08-27T00:00:00Z',
    nextUpdate: '2025-09-03T00:00:00Z',
    trending: {
      direction: Math.random() > 0.5 ? 'up' : 'down',
      percentage: Math.floor(Math.random() * 20) + 1
    },
    events: [
      {
        name: 'Double XP Weekend',
        status: 'active',
        endsAt: '2025-08-31T23:59:59Z'
      },
      {
        name: 'Nightmare Boss Fight',
        status: 'upcoming',
        startsAt: '2025-09-01T00:00:00Z'
      }
    ],
    timestamp: new Date().toISOString()
  };
  
  return stats;
}

// KV Storage functions (for production use)
/*
// Initialize KV namespace binding in wrangler.toml:
// [[kv_namespaces]]
// binding = "CODES_KV"
// id = "your-kv-namespace-id"

async function getCodeFromKV(code) {
  const value = await CODES_KV.get(code);
  return value ? JSON.parse(value) : null;
}

async function setCodeInKV(code, data) {
  await CODES_KV.put(code, JSON.stringify(data), {
    expirationTtl: 86400 // 24 hours
  });
}

async function getAllCodesFromKV() {
  const list = await CODES_KV.list();
  const codes = [];
  
  for (const key of list.keys) {
    const value = await CODES_KV.get(key.name);
    if (value) {
      codes.push(JSON.parse(value));
    }
  }
  
  return codes;
}
*/