import React, { useState } from "react";

interface FileUploadProps {
  onResponse: (response: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onResponse }) => {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !target) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_object", target);

    try {
      const response = await fetch("http://localhost:8000/locate-object/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.message) onResponse(data.message);
    } catch (error) {
      onResponse("Error uploading file or contacting backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 my-6 w-full max-w-md mx-auto">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <input
        type="text"
        placeholder="Enter object to locate (e.g. bottle)"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleUpload}
        disabled={!file || !target || loading}
        className={`px-6 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition w-full ${
          !file || !target || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUpload;
