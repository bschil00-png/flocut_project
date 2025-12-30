const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");

require("dotenv").config(); // 🔐 env 사용

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 n8n Webhook URL (필수)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!N8N_WEBHOOK_URL) {
  console.error("❌ N8N_WEBHOOK_URL is not defined in .env");
  process.exit(1);
}

// multer 설정
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// 🟢 헬스체크
app.get("/", (req, res) => {
  res.send("Node AI Relay Server is running");
});

// 🔥 파일 → n8n 전달
app.post("/api/ai-file", upload.single("data"), async (req, res) => {
  try {
    console.log("📂 File received");
    console.log(" - name:", req.file?.originalname);
    console.log(" - size:", req.file?.size);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded (key must be 'data')",
      });
    }

    // multipart/form-data 구성
    const form = new FormData();
    form.append("data", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // n8n webhook 호출
    const n8nRes = await axios.post(
      N8N_WEBHOOK_URL,
      form,
      {
        headers: form.getHeaders(),
        timeout: 300000,
      }
    );

    return res.json({
      success: true,
      message: "AI processing started (n8n webhook called)",
      n8nResponse: n8nRes.data ?? null,
    });

  } catch (err) {
    console.error("❌ n8n webhook error:", err.message);

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
