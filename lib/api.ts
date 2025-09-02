const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  post: async (path: string, data: any, token?: string) => { // Added token parameter
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers: getHeaders(token), // Use getHeaders
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
  upload: async (path: string, formData: FormData, token?: string) => { // Added token parameter
    const headers: HeadersInit = {}; // FormData handles Content-Type
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers: headers, // Use headers directly for FormData
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
  get: async (path: string, token?: string) => { // Added token parameter
    const response = await fetch(`${BACKEND_URL}${path}`, {
      headers: getHeaders(token), // Use getHeaders
    });

    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
  put: async (path: string, data: any, token?: string) => { // Added token parameter
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "PUT",
      headers: getHeaders(token), // Use getHeaders
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

    patch: async (path: string, data: any, token?: string) => { // Added token parameter
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "PATCH",
      headers: getHeaders(token), // Use getHeaders
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (path: string, token?: string) => { // Added token parameter
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "DELETE",
      headers: getHeaders(token), // Use getHeaders
    });

    if (!response.ok) {
      let errorMessage = "An unknown error occurred.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
};
