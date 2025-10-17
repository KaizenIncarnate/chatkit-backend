import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const workflowId = process.env.CHATKIT_WORKFLOW_ID;
    const session = await client.chatkit.sessions.create({ workflow_id: workflowId });

    return res.status(200).json({ client_secret: session.client_secret });
  } catch (err) {
    console.error("refresh error", err?.response?.data || err?.message || err);
    return res.status(500).json({ error: "Failed to refresh session" });
  }
}
