import React, { useEffect } from "react";

const VoiceResponse: React.FC<{ response: string }> = ({ response }) => {
  useEffect(() => {
    if (response) {
      const utterance = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(utterance);
    }
  }, [response]);

  const stopVoice = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-6 flex flex-col items-center gap-4 mt-6">
      <h2 className="text-xl font-bold text-blue-700">Voice Response</h2>
      <p className="text-gray-700 text-center">{response}</p>
      <button
        onClick={stopVoice}
        className="px-6 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
      >
        Stop Voice
      </button>
    </div>
  );
};

export default VoiceResponse;
