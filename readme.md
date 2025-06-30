# AI Object Locator Web Application

## Overview

This project is a full-stack AI-powered web application that allows users to upload images, videos, or use their live camera to locate a specific object relative to a person in the scene. The backend uses YOLOv8 for object detection, while the frontend provides a modern, user-friendly interface with real-time voice feedback using browser speech synthesis.

---

## Features

- **Upload images or videos** to detect objects.
- **Live camera streaming** with real-time object localization.
- **Voice feedback**: The frontend speaks the result using browser TTS.
- **FastAPI backend** with YOLOv8 for robust object detection.
- **Modern React frontend** styled with Tailwind CSS.
- **Timeout mechanism**: Backend responds within 3 seconds.

---

## Project Structure

```
Assignment/
│
├── backend/
│   ├── main.py           # FastAPI backend with YOLOv8 detection
│   ├── requirements.txt  # Python dependencies
│   └── ...               # Other backend files
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── FileUpload.tsx
│   │       ├── CameraStream.tsx
│   │       └── VoiceResponse.tsx
│   ├── package.json      # Frontend dependencies
│   └── ...               # Other frontend files
│
├── .gitignore            # Ignores node_modules, venv, cache, etc.
└── README.md             # Project documentation
```

---

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- [YOLOv8 weights](https://github.com/ultralytics/ultralytics) (e.g., `yolov8n.pt`)

### Backend Setup

1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Download the YOLOv8 weights (if not present).
5. Start the backend server:
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Upload an image or video** using the upload form, or use the **Live Camera** feature.
2. **Enter the object name** you want to locate (e.g., "bottle").
3. The backend will process the image and return the location of the object relative to the person.
4. The frontend will display and speak the result.

---

## Example Response

```json
{
  "message": "The bottle is to your right and forward."
}
```

---

## Notes

- The backend is configured to allow CORS for local development.
- The frontend uses browser speech synthesis for voice feedback.
- For live camera, frames are sent as images to the backend for detection.

---

## License

This project is for educational and demonstration purposes.

---

## Acknowledgements

- [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
-
