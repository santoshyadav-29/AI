from ultralytics import YOLO
import cv2
import pyttsx3

# Load YOLOv8
model = YOLO('yolov8n.pt')

# Text-to-speech setup
tts = pyttsx3.init()

# Object list to detect
TARGET_OBJECTS = ['cup']

# Get direction from person to object (2D)
def get_direction(person_box, object_box):
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

# Use webcam
cap = cv2.VideoCapture(0)

# Main loop
while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)[0]

    person_box = None
    object_boxes = {}

    # Analyze detected objects
    for box in results.boxes:
        cls = int(box.cls[0])
        label = model.names[cls]
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        if label == 'person' and person_box is None:
            person_box = (x1, y1, x2, y2)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, 'Person', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        elif label in TARGET_OBJECTS:
            object_boxes[label] = (x1, y1, x2, y2)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)

    # Give audio guidance for each object
    if person_box:
        for obj, obj_box in object_boxes.items():
            direction = get_direction(person_box, obj_box)
            print(f"{obj.capitalize()} is to your {direction}")
            tts.say(f"The {obj} is to your {direction}")
        if object_boxes:
            tts.runAndWait()

    # Show frame
    cv2.imshow("Live Object Tracker", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
