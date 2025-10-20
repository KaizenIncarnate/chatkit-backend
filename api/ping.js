export const config = { runtime: "edge" };

export default async function handler() {
  return new Response(JSON.stringify({ ok: true, version: "v1-edge" }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}
