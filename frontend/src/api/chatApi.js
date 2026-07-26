/*import axios from "axios";

const normalizeAIResponse = (payload) => {
  const response = payload?.data?.response ?? payload?.response ?? payload?.data ?? payload;

  if (typeof response === "string" && response.trim()) {
    return response;
  }

  if (response && typeof response === "object") {
    if (typeof response.answer === "string" && response.answer.trim()) {
      return response.answer;
    }

    if (typeof response.message === "string" && response.message.trim()) {
      return response.message;
    }

    if (typeof response.detail === "string" && response.detail.trim()) {
      return response.detail;
    }
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return "Sorry, I couldn't process that request.";
};

const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_BACKEND_URL?.toString().trim();
  return configured ? configured.replace(/\/+$/, "") : "";
};

const getChatEndpoint = () => {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}/api/ai/chat` : "/api/ai/chat";
};

export const askAI = async (message) => {
  const { data } = await axios.post(getChatEndpoint(), { message }, { withCredentials: true });

  return normalizeAIResponse(data);
};
*/
import axios from "axios";

const normalizeAIResponse = (payload) => {
  const response =
    payload?.data?.response ??
    payload?.response ??
    payload?.data ??
    payload;

  // If AI returns plain text
  if (typeof response === "string" && response.trim()) {
    return response;
  }

  // If AI returns an array of complaints
  if (Array.isArray(response)) {
    if (response.length === 0) {
      return "You don't have any complaints.";
    }

    return response
      .map(
        (complaint, index) => `
${index + 1}. ${complaint.title}
Status: ${complaint.status}
Category: ${complaint.category}
Block: ${complaint.block}
Room: ${complaint.room}`
      )
      .join("\n");
  }

  // If AI returns an object
  if (response && typeof response === "object") {
    if (typeof response.answer === "string" && response.answer.trim()) {
      return response.answer;
    }

    if (typeof response.message === "string" && response.message.trim()) {
      return response.message;
    }

    if (typeof response.detail === "string" && response.detail.trim()) {
      return response.detail;
    }
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return "Sorry, I couldn't process that request.";
};

const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_BACKEND_URL?.toString().trim();

  return configured ? configured.replace(/\/+$/, "") : "";
};

const getChatEndpoint = () => {
  const baseUrl = getApiBaseUrl();

  return baseUrl ? `${baseUrl}/api/ai/chat` : "/api/ai/chat";
};

export const askAI = async (message) => {
  try {
    const { data } = await axios.post(
      getChatEndpoint(),
      { message },
      { withCredentials: true }
    );

    return normalizeAIResponse(data);
  } catch (error) {
    console.error("AI Error:", error);

    return (
      error.response?.data?.response?.message ||
      error.response?.data?.message ||
      "Sorry, something went wrong."
    );
  }
};