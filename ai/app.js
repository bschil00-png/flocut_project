const express = require("express");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");
const AWS = require("aws-sdk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
// 🔐 ENV
const {
  N8N_WEBHOOK_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
} = process.env;

if (!N8N_WEBHOOK_URL || !AWS_S3_BUCKET) {

  console.error("❌ Required env missing");
  process.exit(1);
}

// 🔐 AWS S3 설정
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

// 🟢 헬스체크
app.get("/", (req, res) => {
  res.send("Node AI Relay Server (S3-based) is running");
});

// 🔥 요약 요청 엔드포인트 (JSON)
app.post("/api/ai/document-summary", async (req, res) => {
  console.log("🔥 ENTER document-summary at", new Date().toISOString());
  try {
    const {
      s3Key,
      filename,
      contentType,
      sessionId,
      roundNo,
      versionNo,
      fileId,
    } = req.body;

    if (!s3Key) {
      return res.status(400).json({
        success: false,
        error: "s3Key is required",
      });
    }

    console.log("📥 Summary request received");
    console.log(" - s3Key:", s3Key);

    // 1️⃣ S3 파일 다운로드
    const s3Object = await s3
      .getObject({
        Bucket: AWS_S3_BUCKET,
        Key: s3Key,
      })
      .promise();
      console.log("S3 ContentType:", s3Object.ContentType);
      console.log("Filename:", filename);

      const text = s3Object.Body.toString("utf-8");

    // 2️⃣ n8n으로  전달
    const n8nRes = await axios.post(
          N8N_WEBHOOK_URL,
          {
            file_id: fileId,
            session_id: sessionId,
            round_no: roundNo,
            version_no: versionNo,
            text: text,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 300000,
          }
        );

        console.log("✅ Sent to n8n successfully");
//    const form = new FormData();
//    form.append("data", s3Object.Body, {
//      filename,
//      contentType,
//    });
//    // 메타데이터도 함께 전달 (n8n에서 사용 가능)
//    form.append("sessionId", sessionId);
//    form.append("roundNo", roundNo);
//    form.append("versionNo", versionNo);
//    form.append("file_id", fileId);
//
//    const n8nRes = await axios.post(N8N_WEBHOOK_URL, form, {
//      headers: form.getHeaders(),
//      timeout: 300000,
//    });

    return res.json({
      success: true,
      message: "AI processing started via n8n",
      n8nResponse: n8nRes.data ?? null,
    });

  } catch (err) {
    console.error("❌ AI Relay Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 🚀 서버 시작
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`🚀 Node AI Relay running on http://localhost:${PORT}`);
});
