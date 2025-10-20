export const config = { runtime: "edge" };

export default async function handler() {
  return new Response(JSON.stringify({ ok: true, route: "start-edge", v: "1" }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}
