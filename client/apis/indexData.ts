import axios from "axios";

interface IndexDataResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function indexData(
  type: string,
  fileOrText: File | string
): Promise<IndexDataResponse> {
  try {
    const formData = new FormData();

    // Always append type
    formData.append("type", type);

    if (fileOrText instanceof File) {
      // File upload
      formData.append("file", fileOrText);
    } else {
      // Text / URL
      formData.append("file", fileOrText);
    }

    const response = await axios.post<IndexDataResponse>(
      "http://localhost:3000/indexData",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}
