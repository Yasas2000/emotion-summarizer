# Emotion-Aware Text Summarizer

An open-source NLP project that performs emotion-aware summarization using transformer-based models. The system detects fine-grained emotions in text using a RoBERTa-based classifier and generates summaries conditioned on those emotions using an emotion-tagged BART model.

---

## 🚀 Local Deployment Instructions

### 📦 Backend (FastAPI)

1. Go to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the development server:
   ```bash
   uvicorn summarize:app --reload
   ```

   Your FastAPI backend will run at:  
   http://localhost:8000

---

### 💻 Frontend (React)

1. Go to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Create a `.env` file with the API URL:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

   The app will open in your browser at:  
   http://localhost:3000

---

## 🧠 Features

- Emotion classification using a fine-tuned RoBERTa model
- Emotion-conditioned summarization using BART
- RESTful API with FastAPI
- Clean React frontend interface
- Hugging Face model integration

---

## 🧾 Model Information

- **Emotion Classifier**: https://huggingface.co/ymeka2000/emotion-classifier
- **Summarizer (BART)**: https://huggingface.co/ymeka2000/emotion-bart

---

## 📌 Project Info

- **Author**: Ekanayake YM  
- **University**: University of Moratuwa  
- **License**: All rights reserved (MIT)
- **Course**: Natural Language Processing
- **Year**: 2025
---

## 🤝 Contributing

Contributions are welcome. Please open issues or pull requests to suggest improvements.

---

## 💡 Note

If you're planning to deploy this project on a cloud platform like Vercel, ensure:
- The models are hosted on Hugging Face Hub (public or with access token)
- The backend is deployed where large model files are supported (e.g., HF Spaces, Railway)
