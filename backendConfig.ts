const isLocalhost = typeof window !== 'undefined' && window.location.hostname === "localhost";

export const BACKEND_URL = isLocalhost
    ? "http://localhost:8000"
    : "https://aury-backend.onrender.com";
