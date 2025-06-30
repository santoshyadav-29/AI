import { useState } from "react";
import FileUpload from "./components/FileUpload";
import CameraStream from "./components/CameraStream";
import VoiceResponse from "./components/VoiceResponse";

function App() {
  const [response, setResponse] = useState<string>("");

  // Handler for file/camera responses
  const handleResponse = (voiceCommand: string) => {
    setResponse(voiceCommand);
  };

  // Handler for camera frame capture (base64 image)
  const handleFrameCaptured = async (frame: string) => {
    // Convert base64 to Blob
    const blob = await (await fetch(frame)).blob();
    const file = new File([blob], "frame.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("file", file);
    // For demo, you can prompt for target object or set a default
    formData.append("target_object", "bottle");

    try {
      const res = await fetch("http://localhost:8000/locate-object/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.message) setResponse(data.message);
    } catch {
      setResponse("Error contacting backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center py-8">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 drop-shadow">
        Media Upload &amp; Voice Response
      </h1>
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <FileUpload onResponse={handleResponse} />
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Live Camera</h2>
          <CameraStream onFrameCaptured={handleFrameCaptured} />
        </div>
        <VoiceResponse response={response} />
      </div>
    </div>
  );
}

export default App;
