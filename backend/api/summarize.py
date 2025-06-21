from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from typing import Optional
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use your Hugging Face models
EMOTION_MODEL = "ymeka2000/emotion-classifier"
BART_MODEL = "ymeka2000/emotion-bart"

# Global pipelines (cached after first load)
emotion_pipe = None
summarizer_pipe = None

EMOTION_LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring",
    "confusion", "curiosity", "desire", "disappointment", "disapproval",
    "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
    "joy", "love", "nervousness", "optimism", "pride", "realization",
    "relief", "remorse", "sadness", "surprise", "neutral"
]

def get_emotion_pipe():
    global emotion_pipe
    if emotion_pipe is None:
        emotion_pipe = pipeline("text-classification", model=EMOTION_MODEL)
    return emotion_pipe

def get_summarizer_pipe():
    global summarizer_pipe
    if summarizer_pipe is None:
        summarizer_pipe = pipeline("text2text-generation", model=BART_MODEL)
    return summarizer_pipe

class SummarizeRequest(BaseModel):
    text: str
    max_length: Optional[int] = 150
    emotion_override: Optional[str] = None

@app.post("/api/summarize")
async def summarize(request: SummarizeRequest):
    start_time = time.time()
    
    try:
        # Validate input
        if len(request.text) < 50:
            raise HTTPException(status_code=400, detail="Text too short")
        
        # Get emotion
        if request.emotion_override and request.emotion_override in EMOTION_LABELS:
            emotion = request.emotion_override
            confidence = 1.0
        else:
            emotion_result = get_emotion_pipe()(request.text)[0]
            # Handle LABEL_X format
            if emotion_result["label"].startswith("LABEL_"):
                label_id = int(emotion_result["label"].split("_")[-1])
                emotion = EMOTION_LABELS[label_id] if label_id < len(EMOTION_LABELS) else "neutral"
            else:
                emotion = emotion_result["label"]
            confidence = emotion_result["score"]
        
        # Generate summary
        input_text = f"<{emotion}>: {request.text}"
        summary_result = get_summarizer_pipe()(
            input_text,
            max_length=request.max_length,
            do_sample=False,
            truncation=True
        )
        
        summary = summary_result[0]["generated_text"]
        processing_time = time.time() - start_time
        
        return {
            "summary": summary,
            "detected_emotion": emotion,
            "emotion_confidence": confidence,
            "processing_time": round(processing_time, 2),
            "input_length": len(request.text),
            "summary_length": len(summary)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health():
    return {"status": "healthy", "models_loaded": True}

@app.get("/api/emotions")
async def get_emotions():
    return {"emotions": EMOTION_LABELS}

# Vercel handler
from mangum import Mangum
handler = Mangum(app)