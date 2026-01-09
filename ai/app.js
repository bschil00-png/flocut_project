const express = require("express");
const cors = require("cors");
const axios = require("axios");
const AWS = require("aws-sdk");
const mammoth = require("mammoth");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// ENV
// =========================
const {
    N8N_WEBHOOK_URL,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_S3_BUCKET,
    PORT,
} = process.env;

if (!N8N_WEBHOOK_URL || !AWS_S3_BUCKET) {
    console.error("❌ Required env missing");
    process.exit(1);
}

// =========================
// AWS S3 설정
// =========================
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
});

const s3 = new AWS.S3();

// =========================
// Utils
// =========================
async function extractTextFromDocx(buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

async function extractText(buffer, contentType, filename) {
    const lowerFilename = filename?.toLowerCase() || "";
    const lowerType = contentType?.toLowerCase();

    // 1️⃣ MIME 타입 기준
    if (
        lowerType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        return extractTextFromDocx(buffer);
    }

    // 2️⃣ 확장자 문자열이 직접 들어온 경우
    if (lowerType === "docx") {
        return extractTextFromDocx(buffer);
    }

    // 3️⃣ S3 기본값 + 확장자 fallback
    if (
        (lowerType === "application/octet-stream" || !lowerType) &&
        lowerFilename.endsWith(".docx")
    ) {
        return extractTextFromDocx(buffer);
    }

    // 4️⃣ TXT
    if (
        lowerType === "text/plain" ||
        lowerType === "txt" ||
        lowerFilename.endsWith(".txt")
    ) {
        return buffer.toString("utf-8");
    }

    throw new Error(
        `Unsupported document type: contentType=${contentType}, filename=${filename}`
    );
}

// =========================
// Health Check
// =========================
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// =========================
// 📄 문서 요약 (JSON)
// =========================
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
            return res.status(400).json({
                success: false,
                error: "s3Key, contentType required",
            });
        }

        // 1️⃣ S3 다운로드
        const s3Object = await s3
            .getObject({
                Bucket: AWS_S3_BUCKET,
                Key: s3Key,
            })
            .promise();

        // 2️⃣ 텍스트 추출
        const text = await extractText(
            s3Object.Body,
            contentType,
            filename
        );

        console.log("🟢 Extracted text preview:", text.slice(0, 200));

        // 3️⃣ n8n으로 전달
        await axios.post(
            N8N_WEBHOOK_URL,
            {
                text,
                sessionId,
                versionNo,
                fileId,
                filename,
                source: "document",
            },
            {
                timeout: 300000, // 5분
            }
        );

        return res.json({ success: true });
    } catch (err) {
        console.error("❌ Document summary error:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

// =========================
// Server Start
// =========================
const listenPort = PORT || 3003;

app.listen(listenPort, () => {
    console.log(`🚀 Node AI Relay running on port ${listenPort}`);
});



//const express = require("express");
//const cors = require("cors");
//const axios = require("axios");
//const AWS = require("aws-sdk");
//const mammoth = require("mammoth");
//require("dotenv").config();
//
//const app = express();
//app.use(cors());
//app.use(express.json());
//
//const {
//  N8N_WEBHOOK_URL,
//  AWS_ACCESS_KEY_ID,
//  AWS_SECRET_ACCESS_KEY,
//  AWS_REGION,
//  AWS_S3_BUCKET,
//} = process.env;
//
//AWS.config.update({
//  accessKeyId: AWS_ACCESS_KEY_ID,
//  secretAccessKey: AWS_SECRET_ACCESS_KEY,
//  region: AWS_REGION,
//});
//
//const s3 = new AWS.S3();
//
//async function extractTextFromDocx(buffer) {
//  const result = await mammoth.extractRawText({ buffer });
//  return result.value;
//}
//
//async function extractText(buffer, contentType, filename) {
//  const lowerFilename = filename?.toLowerCase() || "";
//  const lowerType = contentType?.toLowerCase();
//
//  // ✅ 1. MIME 타입 기준 (정식)
//  if (
//    lowerType ===
//    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//  ) {
//    return extractTextFromDocx(buffer);
//  }
//
//  // ✅ 2. 확장자 문자열이 직접 들어온 경우 (🔥 지금 케이스)
//  if (lowerType === "docx") {
//    return extractTextFromDocx(buffer);
//  }
//
//  // ✅ 3. S3 기본값 + 확장자 fallback
//  if (
//    (lowerType === "application/octet-stream" || !lowerType) &&
//    lowerFilename.endsWith(".docx")
//  ) {
//    return extractTextFromDocx(buffer);
//  }
//
//  // ✅ 4. TXT
//  if (lowerType === "text/plain" || lowerType === "txt" || lowerFilename.endsWith(".txt")) {
//    return buffer.toString("utf-8");
//  }
//
//  throw new Error(
//    `Unsupported document type: contentType=${contentType}, filename=${filename}`
//  );
//}
//
//
//// 📄 문서 요약 (JSON)
//app.post("/api/ai/document-summary", async (req, res) => {
//  try {
//    const {
//      s3Key,
//      contentType,
//      sessionId,
//      versionNo,
//      fileId,
//      filename,
//    } = req.body;
//
//    if (!s3Key || !contentType) {
//      return res.status(400).json({ error: "s3Key, contentType required" });
//    }
//
//    // 1️⃣ S3 다운로드
//    const s3Object = await s3
//      .getObject({ Bucket: AWS_S3_BUCKET, Key: s3Key })
//      .promise();
//
//    // 2️⃣ TEXT 추출 (🔥 핵심)
//   const text = await extractText(
//     s3Object.Body,
//     contentType,
//     filename
//   );
//
//   console.log("🟢 Extracted text preview:", text.slice(0, 200));
//
//
//    // 3️⃣ n8n에 JSON 전달
//    await axios.post(N8N_WEBHOOK_URL, {
//      text,
//      sessionId,
//      versionNo,
//      fileId,
//      filename,
//      source: "document",
//    },
//    {
//        timeout: 300000, // 5분
//    }
//);
//
//    res.json({ success: true });
//  } catch (e) {
//    console.error(e);
//    res.status(500).json({ error: e.message });
//  }
//});
//
//app.listen(8081, () => {
//  console.log("🚀 Node AI Relay running");
//});
