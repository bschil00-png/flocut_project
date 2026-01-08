const express = require("express");
const cors = require("cors");
const axios = require("axios");
const AWS = require("aws-sdk");
const mammoth = require("mammoth");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  N8N_WEBHOOK_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
} = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

async function extractTextFromDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractText(buffer, contentType, filename) {
  const lowerFilename = filename?.toLowerCase() || "";
  const lowerType = contentType?.toLowerCase();

  // ✅ 1. MIME 타입 기준 (정식)
  if (
    lowerType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractTextFromDocx(buffer);
  }

  // ✅ 2. 확장자 문자열이 직접 들어온 경우 (🔥 지금 케이스)
  if (lowerType === "docx") {
    return extractTextFromDocx(buffer);
  }

  // ✅ 3. S3 기본값 + 확장자 fallback
  if (
    (lowerType === "application/octet-stream" || !lowerType) &&
    lowerFilename.endsWith(".docx")
  ) {
    return extractTextFromDocx(buffer);
  }

  // ✅ 4. TXT
  if (lowerType === "text/plain" || lowerType === "txt" || lowerFilename.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  throw new Error(
    `Unsupported document type: contentType=${contentType}, filename=${filename}`
  );
}

//// 음성요약
//app.post("/api/ai/audio-summary", upload.single("audio"), async (req, res) => {
//  const form = new FormData();
//  form.append("audio", req.file.buffer, {
//    filename: req.file.originalname,
//  });
//  form.append("sessionId", req.body.sessionId);
//
//  await axios.post(N8N_AUDIO_WEBHOOK, form, {
//    headers: form.getHeaders(),
//  });
//
//  res.json({ success: true });
//});

// 📄 문서 요약 (JSON)
app.post("/api/ai/document-summary", async (req, res) => {
  try {
    const {
      s3Key,
      contentType,
      sessionId,
      versionNo,
      fileId,
      filename,
    } = req.body;

    if (!s3Key || !contentType) {
      return res.status(400).json({ error: "s3Key, contentType required" });
    }

    // 1️⃣ S3 다운로드
    const s3Object = await s3
      .getObject({ Bucket: AWS_S3_BUCKET, Key: s3Key })
      .promise();

    // 2️⃣ TEXT 추출 (🔥 핵심)
   const text = await extractText(
     s3Object.Body,
     contentType,
     filename
   );

   console.log("🟢 Extracted text preview:", text.slice(0, 200));


    // 3️⃣ n8n에 JSON 전달
    await axios.post(N8N_WEBHOOK_URL, {
      text,
      sessionId,
      versionNo,
      fileId,
      filename,
      source: "document",
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(8081, () => {
  console.log("🚀 Node AI Relay running");
});



//const express = require("express");
//const cors = require("cors");
//const axios = require("axios");
//const FormData = require("form-data");
//const AWS = require("aws-sdk");
//require("dotenv").config();
//
//const app = express();
//app.use(cors());
//app.use(express.json());
//// 🔐 ENV
//const {
//  N8N_WEBHOOK_URL,
//  AWS_ACCESS_KEY_ID,
//  AWS_SECRET_ACCESS_KEY,
//  AWS_REGION,
//  AWS_S3_BUCKET,
//} = process.env;
//
//if (!N8N_WEBHOOK_URL || !AWS_S3_BUCKET) {
//
//  console.error("❌ Required env missing");
//  process.exit(1);
//}
//
//// 🔐 AWS S3 설정
//AWS.config.update({
//  accessKeyId: AWS_ACCESS_KEY_ID,
//  secretAccessKey: AWS_SECRET_ACCESS_KEY,
//  region: AWS_REGION,
//});
//
//const s3 = new AWS.S3();
//
//// 🟢 헬스체크
//app.get("/", (req, res) => {
//  res.send("Node AI Relay Server (S3-based) is running");
//});
//
//// 🔥 요약 요청 엔드포인트 (JSON)
//app.post("/api/ai/document-summary", async (req, res) => {
//  console.log("🔥 ENTER document-summary at", new Date().toISOString());
//  try {
//    const {
//      s3Key,
//      filename,
//      contentType,
//      sessionId,
////      roundNo,
//      versionNo,
//      fileId,
//    } = req.body;
//
//    if (!s3Key) {
//      return res.status(400).json({
//        success: false,
//        error: "s3Key is required",
//      });
//    }
//
//    console.log("📥 Summary request received");
//    console.log(" - s3Key:", s3Key);
//
//    // 1️⃣ S3 파일 다운로드
//    const s3Object = await s3
//      .getObject({
//        Bucket: AWS_S3_BUCKET,
//        Key: s3Key,
//      })
//      .promise();
//      console.log("S3 ContentType:", s3Object.ContentType);
//      console.log("Filename:", filename);
//
//      const text = s3Object.Body.toString("utf-8");
//
//    // 2️⃣ n8n으로  전달
//    //========multipart 형식=======================
//    const form = new FormData();
//    form.append("data", s3Object.Body, {
//      filename,
//      contentType,
//    });
//    // 메타데이터도 함께 전달 (n8n에서 사용 가능)
//    form.append("sessionId", sessionId);
////    form.append("roundNo", roundNo);
//    form.append("versionNo", versionNo);
//    form.append("file_id", fileId);
//
//    const n8nRes = await axios.post(
////      `${N8N_WEBHOOK_URL}?sessionId=${sessionId}&roundNo=${roundNo}&versionNo=${versionNo}&file_id=${fileId}`,
//      `${N8N_WEBHOOK_URL}?sessionId=${sessionId}&versionNo=${versionNo}&file_id=${fileId}`,
//      form,
//      {
//        headers: form.getHeaders(),
//        timeout: 300000,
//      }
//    );
//
////    const n8nRes = await axios.post(N8N_WEBHOOK_URL, form, {
////      headers: form.getHeaders(),
////      timeout: 300000,
////    });
//
//    return res.json({
//      success: true,
//      message: "AI processing started via n8n",
//      n8nResponse: n8nRes.data ?? null,
//    });
//
//  } catch (err) {
//    console.error("❌ AI Relay Error:", err);
//
//    return res.status(500).json({
//      success: false,
//      error: err.message,
//    });
//  }
//});
//
//// 🚀 서버 시작
//const PORT = 8081;
//app.listen(PORT, () => {
//  console.log(`🚀 Node AI Relay running on http://localhost:${PORT}`);
//});
