export const config = { runtime: "edge" };

export default async function handler() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const hasWorkflow = !!process.env.CHATKIT_WORKFLOW_ID;
  return new Response(JSON.stringify({ hasKey, hasWorkflow, runtime: "edge" }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}
