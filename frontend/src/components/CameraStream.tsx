import { useEffect, useRef, useState } from "react";

interface CameraStreamProps {
  onFrameCaptured: (frame: string) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({ onFrameCaptured }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        intervalId = setInterval(captureFrame, 1000);
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (intervalId) clearInterval(intervalId);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    const captureFrame = () => {
      if (!videoRef.current) return;
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const frame = canvas.toDataURL("image/jpeg");
        onFrameCaptured(frame);
      }
    };

    if (isStreaming) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line
  }, [isStreaming, onFrameCaptured]);

  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <video
        ref={videoRef}
        className="rounded-lg border-4 border-blue-500 shadow-lg w-full max-w-md bg-black"
        autoPlay
        muted
      />
      <div className="flex gap-4">
        <button
          className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition ${
            isStreaming ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setIsStreaming(true)}
          disabled={isStreaming}
        >
          Start Camera
        </button>
        <button
          className={`px-6 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition ${
            !isStreaming ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setIsStreaming(false)}
          disabled={!isStreaming}
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
};

export default CameraStream;
