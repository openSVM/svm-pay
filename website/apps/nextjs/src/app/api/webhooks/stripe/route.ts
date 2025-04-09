// This file is used to disable the Stripe webhook route during development and testing
// We're creating a mock implementation that doesn't require a database connection

export const runtime = 'edge';

export async function POST(req: Request) {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET(req: Request) {
  return new Response(JSON.stringify({ status: 'healthy' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
