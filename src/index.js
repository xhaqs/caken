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
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
