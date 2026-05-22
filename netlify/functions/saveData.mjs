import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") return new Response("Only POST allowed", { status: 405 });

  try {
    const payload = await req.json();
    const store = getStore("experiment-data");
    
    const pid = payload.prolific_pid || "unknown";
    const type = payload.upload_type || "data";
    // 生成唯一文件名，例如: user123_main_1680000000.json
    const filename = `${pid}_${type}_${Date.now()}.json`;

    await store.setJSON(filename, payload);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const config = { path: "/api/save-data" };