export const config = { runtime: "edge" };

export default async function handler() {
  try {
    const r = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1"   // ← correct value
      },
      body: JSON.stringify({ workflow_id: process.env.CHATKIT_WORKFLOW_ID })
    });

    const ct = r.headers.get("content-type") || "";
    const body = ct.includes("application/json") ? await r.json() : { text: await r.text() };

    if (!r.ok) {
      return new Response(JSON.stringify({ ok:false, where:"openai", status:r.status, body }), {
        status: 500, headers: { "content-type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok:true, client_secret: body.client_secret }), {
      status: 200, headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, where:"fetch", message:String(e) }), {
      status: 500, headers: { "content-type": "application/json" }
    });
  }
}
