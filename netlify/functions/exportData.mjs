import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const store = getStore("experiment-data");
    const { blobs } = await store.list();
    
    let allData = [];
    // 遍历抓取所有被试的数据
    for (const blob of blobs) {
      const data = await store.getJSON(blob.key);
      allData.push({ filename: blob.key, data });
    }

    // 将所有数据合并成一个大 JSON 文件供你下载
    return new Response(JSON.stringify(allData, null, 2), { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=ALL_EXPERIMENT_DATA.json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const config = {
  path: "/api/export-data"
};