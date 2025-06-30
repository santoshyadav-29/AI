from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import numpy as np
import cv2
import concurrent.futures

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pretrained YOLOv8n model
model = YOLO('yolov8n.pt')

def get_direction(person_box, object_box):
    """Calculate 2D direction from person to object based on bounding box centers"""
    px = (person_box[0] + person_box[2]) / 2
    py = (person_box[1] + person_box[3]) / 2
    ox = (object_box[0] + object_box[2]) / 2
    oy = (object_box[1] + object_box[3]) / 2

    dx = ox - px
    dy = oy - py

    direction = []
    if abs(dx) > 50:
        direction.append("right" if dx > 0 else "left")
    if abs(dy) > 50:
        direction.append("forward" if dy > 0 else "backward")

    return " and ".join(direction) if direction else "right here"

def detect(frame, target_object):
    """Detect objects in the frame and return bounding boxes for person and target object"""
    results = model(frame)
    boxes = results[0].boxes
    names = model.model.names if hasattr(model, "model") else model.names

    person_box = None
    object_box = None

    for box in boxes:
        cls = int(box.cls[0])
        label = names[cls].lower()
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        if label == "person" and person_box is None:
            person_box = (x1, y1, x2, y2)
        elif label == target_object.lower():
            object_box = (x1, y1, x2, y2)

    return person_box, object_box

@app.post("/locate-object/")
async def locate_object(
    file: UploadFile = File(...),
    target_object: str = Form(...)
):
    try:
        # Read and decode image
        image_bytes = await file.read()
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return JSONResponse(status_code=400, content={"message": "Invalid image file."})

        # Run YOLO detection with a 3-second timeout
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(detect, frame, target_object)
            try:
                person_box, object_box = future.result(timeout=3)
            except concurrent.futures.TimeoutError:
                return JSONResponse(status_code=504, content={"message": "Detection timed out. Try again."})

        # If both detected
        if person_box and object_box:
            direction = get_direction(person_box, object_box)
            response_text = f"The {target_object} is to your {direction}."
            # TTS removed for backend API
            return {"message": response_text}
        else:
            return JSONResponse(
                status_code=404,
                content={"message": f"Could not find both 'person' and '{target_object}' in the image."}
            )
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Server error: {str(e)}"})

@app.get("/")
async def root():
    return {"message": "Welcome to the Object Locator API. Use /locate-object/ to find objects in images."}
