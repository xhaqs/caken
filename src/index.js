const DB = 'https://riakoine-caken-default-rtdb.firebaseio.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (url.pathname === '/api/orders') {
      return handleOrders(request);
    }

    if (url.pathname === '/api/gallery') {
      return handleGallery(request);
    }

    if (url.pathname === '/api/recipes') {
      return handleRecipes(request, url);
    }

    if (url.pathname === '/api/chef-ai' && request.method === 'POST') {
      return handleChefAI(request, env);
    }

    if (url.pathname === '/api/inventory') {
      return handleInventory(request, url);
    }

    if (url.pathname === '/api/settings') {
      return handleSettings(request);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const newResponse = new Response(assetResponse.body, assetResponse);
    newResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://riakoine-caken-default-rtdb.firebaseio.com; img-src 'self' data: blob:; media-src 'self' data: blob:; base-uri 'self'");
    return newResponse;
  }
};

async function handleOrders(request) {
  try {
    if (request.method === 'POST') {
      const body = await request.json();
      const r = await fetch(DB + '/caken/orders.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'GET') {
      const r = await fetch(DB + '/caken/orders.json');
      const data = await r.json();
      return new Response(JSON.stringify(data || {}), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'PUT') {
      const body = await request.json();
      const { key, status } = body;
      const r = await fetch(DB + '/caken/orders/' + key + '/status.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status)
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'DELETE') {
      const key = new URL(request.url).searchParams.get('key');
      await fetch(DB + '/caken/orders/' + key + '.json', { method: 'DELETE' });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

async function handleSettings(request) {
  try {
    if (request.method === 'POST') {
      const body = await request.json();
      const r = await fetch(DB + '/caken/settings.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'GET') {
      const r = await fetch(DB + '/caken/settings.json');
      const data = await r.json();
      return new Response(JSON.stringify(data || {}), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

async function handleInventory(request, url) {
  try {
    if (request.method === 'POST') {
      const body = await request.json();
      const r = await fetch(DB + '/caken/inventory.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'GET') {
      const r = await fetch(DB + '/caken/inventory.json');
      const data = await r.json();
      return new Response(JSON.stringify(data || {}), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'PUT') {
      const body = await request.json();
      const { key, quantity } = body;
      await fetch(DB + '/caken/inventory/' + key + '/quantity.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quantity)
      });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    if (request.method === 'DELETE') {
      const key = url.searchParams.get('key');
      await fetch(DB + '/caken/inventory/' + key + '.json', { method: 'DELETE' });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

async function handleChefAI(request, env) {
  try {
    const { message, history } = await request.json();
    if (!message) {
      return new Response(JSON.stringify({ error: 'message required' }), { status: 400 });
    }

    const messages = (history || []).concat([{ role: 'user', content: message }]);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: "You are a friendly, knowledgeable pastry chef assistant helping Ken, a home baker running a small custom cake business in Ohio. Give practical, concise advice on recipes, ingredient substitutions, baking techniques, flavor pairings, and cake design ideas. Keep responses conversational and useful for a working baker, not overly formal. Use plain text, not markdown formatting.",
        messages: messages
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'AI error' }), {
        status: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const reply = data.content?.[0]?.text || 'Sorry, I could not think of anything.';
    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

async function handleRecipes(request, url) {
  try {
    if (request.method === 'POST') {
      const body = await request.json();
      const r = await fetch(DB + '/caken/recipes.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'GET') {
      const r = await fetch(DB + '/caken/recipes.json');
      const data = await r.json();
      return new Response(JSON.stringify(data || {}), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'DELETE') {
      const key = url.searchParams.get('key');
      await fetch(DB + '/caken/recipes/' + key + '.json', { method: 'DELETE' });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

async function handleGallery(request) {
  try {
    if (request.method === 'POST') {
      const body = await request.json();
      const r = await fetch(DB + '/caken/gallery.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'GET') {
      const r = await fetch(DB + '/caken/gallery.json');
      const data = await r.json();
      return new Response(JSON.stringify(data || {}), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }
    if (request.method === 'DELETE') {
      const key = new URL(request.url).searchParams.get('key');
      await fetch(DB + '/caken/gallery/' + key + '.json', { method: 'DELETE' });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
