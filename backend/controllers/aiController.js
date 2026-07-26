import axios from "axios";

const sendSuccess = (res, status, message, data) => res.status(status).json({ success: true, message, data });
const sendError = (res, status, message) => res.status(status).json({ success: false, message });

export const buildForwardedHeaders = (req) => {
  const headers = { "Content-Type": "application/json" };
  const cookieHeader = req.headers?.cookie || req.headers?.Cookie;
  const authorizationHeader = req.headers?.authorization || req.headers?.Authorization;

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  } else {
    const token = req.cookies?.token;
    if (token) {
      headers.Cookie = `token=${token}`;
    }
  }

  if (authorizationHeader) {
    headers.Authorization = authorizationHeader;
  }

  return headers;
};

export const chatWithAI = async (req, res) => {
  const startedAt = Date.now();

  try {
    const { message } = req.body || {};

    if (!message || !message.toString().trim()) {
      return sendError(res, 400, "Message is required.");
    }

    const headers = buildForwardedHeaders(req);
    const targetUrl = `${process.env.AI_SERVICE_URL || "http://localhost:8000"}/chat`;

    const aiResponse = await axios.post(
      targetUrl,
      { message: message.toString().trim() },
      {
        headers,
        timeout: 120000,
      }
    );

    const payload = aiResponse?.data ?? {};
    return sendSuccess(res, 200, "AI response received", payload);
  } catch (error) {
    console.error("[AI][ERR]", error.message);
    const detail =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      "AI service error";

    return sendError(res, error.response?.status || 500, detail);
  }
};
