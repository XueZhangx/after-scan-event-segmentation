import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") return new Response("Only POST allowed", { status: 405 });

  try {
    const payload = await req.json();
    
    // 连接到名为 "experiment-data" 的官方数据库
    const store = getStore("experiment-data");
    
    // 生成一个绝对不重复的文件名 (被试ID + 类型 + 时间戳)
    const pid = payload.prolific_pid || "unknown";
    const type = payload.upload_type || "data";
    const filename = `${pid}_${type}_${Date.now()}.json`;

    // 将 JSON 数据永久存入云端数据库
    await store.setJSON(filename, payload);

    return new Response(JSON.stringify({ success: true, filename }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const config = {
  path: "/api/save-data"
};