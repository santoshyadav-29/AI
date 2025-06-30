import axios from "axios";

const API_URL = "http://localhost:8000"; // Adjust the URL as needed

export const uploadFile = async (
  file: File,
  onResponse: (message: string) => void
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/locate-object/", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok && data.message) {
      onResponse(data.message);
    } else {
      onResponse(data.message || "Unknown error from backend.");
    }
  } catch (error) {
    onResponse("Error uploading file or contacting backend.");
    console.error(error);
  }
};
