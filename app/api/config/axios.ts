import axios, { AxiosError, HttpStatusCode } from "axios";
import { API_TIMEOUT_MS } from "@/app/lib/constants";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

if (!baseURL || !apiKey) {
  throw new Error("NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_KEY must be set in .env.local");
}

const api = axios.create({
  baseURL,
  timeout: API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    let message = "Something went wrong. Please try again.";

    if (error.code === "ECONNABORTED") {
      message = "The request took too long. Please try again.";
    } else if (!error.response) {
      message = "Unable to reach the server. Check your connection.";
    } else if (error.response.status === HttpStatusCode.TooManyRequests) {
      message = "Too many requests. The API's daily limit has been reached, please try again later.";
    } else {
      message = error.response.data?.message ?? error.response.data?.error ?? message;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
