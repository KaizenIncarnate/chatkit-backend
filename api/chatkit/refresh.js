export const config = { runtime: "edge" };

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

export default async function handler(req) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  const deploymentId = process.env.CHATKIT_DEPLOYMENT_ID;
  const workflowId   = process.env.CHATKIT_WORKFLOW_ID;

  const target = deploymentId
    ? { deployment: { id: deploymentId } }
    : { workflow:   { id: workflowId   } };

  try {
    const r = await fetch("https://api.openai.com/v1/chatkit/sessions/refresh", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1"
      },
      body: JSON.stringify({
        ...target,
        user: `shopify-${crypto.randomUUID()}`
      })
    });

    const ct = r.headers.get("content-type") || "";
    const body = ct.includes("application/json") ? await r.json() : { text: await r.text() };

    if (!r.ok) {
      return new Response(JSON.stringify({ ok:false, where:"openai", status:r.status, body }), {
        status: 500, headers: { "content-type": "application/json", ...cors }
      });
    }

    return new Response(JSON.stringify({ ok:true, client_secret: body.client_secret }), {
      status: 200, headers: { "content-type": "application/json", ...cors }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, where:"fetch", message:String(e) }), {
      status: 500, headers: { "content-type": "application/json", ...cors }
    });
  }
}
