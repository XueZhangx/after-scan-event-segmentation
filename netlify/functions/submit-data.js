// netlify/functions/submit-data.js
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  // 只接受 POST 请求
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);

    // 简单验证必要字段
    if (!payload.participant || !payload.type) {
      return { statusCode: 400, body: 'Missing required fields' };
    }

    // 定义数据文件路径（保存在项目根目录下的 data/submissions.json）
    const dataDir = path.join(__dirname, '../../data');
    const filePath = path.join(dataDir, 'submissions.json');

    // 确保 data 目录存在
    await fs.mkdir(dataDir, { recursive: true });

    // 读取已有数据（如果文件不存在则从空数组开始）
    let existing = [];
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      existing = JSON.parse(raw);
    } catch (err) {
      // 文件不存在或 JSON 格式错误，从空数组开始
    }

    // 追加新提交
    existing.push({
      receivedAt: new Date().toISOString(),
      ...payload
    });

    // 写回文件
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};