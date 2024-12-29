import { NextResponse } from 'next/server';

export function GET(request: Request) {
  // Try to get the IP address from the `x-forwarded-for` header (for production).
  const forwardedFor = request.headers.get('x-forwarded-for');

  // If behind a proxy, the IP is in the `x-forwarded-for` header. Otherwise, fallback to `remoteAddress`.
  let ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('host');

  // If the IP address is in the IPv6-mapped format, extract the IPv4 part
  if (ip && ip.includes('::ffff:')) {
    ip = ip.split('::ffff:')[1];
  }

  return NextResponse.json({ ip });
}

// // POST method
// export const POST = async (req: Request) => {
//   // Parse the incoming JSON body using req.json()
//   const body = await req.json();
//   console.log({ body });
//   return new Response(JSON.stringify({ message: 'Success' }), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' }
//   });
// };

// export const GET = async (req: Request) => {
//   return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
//     status: 500,
//     headers: { 'Content-Type': 'application/json' }
//   });
// };
