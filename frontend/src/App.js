import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FileText, Brain, Clock, BarChart3 } from 'lucide-react';
import SummarizerForm from './components/SummarizerForm';
import ResultDisplay from './components/ResultDisplay';
import StatsDisplay from './components/StatsDisplay';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [emotions, setEmotions] = useState([]);

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
    fetchEmotions();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      setApiHealth(response.data);
    } catch (err) {
      setApiHealth({ status: 'unhealthy', models_loaded: false });
    }
  };

  const fetchEmotions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/emotions`);
      setEmotions(response.data.emotions);
    } catch (err) {
      console.error('Failed to fetch emotions:', err);
    }
  };

  const handleSummarize = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/summarize`, formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during summarization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="display-4 mb-3">
                <Brain className="me-3" size={48} />
                Emotion-Aware Text Summarizer
              </h1>
              <p className="lead text-muted">
                Advanced AI-powered summarization that understands and preserves emotional context
              </p>
            </div>
          </Col>
        </Row>

        {/* API Status */}
        <Row className="mb-4">
          <Col>
            {apiHealth && (
              <Alert 
                variant={apiHealth.status === 'healthy' ? 'success' : 'danger'}
                className="d-flex align-items-center"
              >
                <div className="me-3">
                  {apiHealth.status === 'healthy' ? '✅' : '❌'}
                </div>
                <div>
                  <strong>API Status:</strong> {apiHealth.status} | 
                  <strong> Models:</strong> {apiHealth.models_loaded ? 'Loaded' : 'Not Loaded'} |
                  <strong> Device:</strong> {apiHealth.device}
                </div>
              </Alert>
            )}
          </Col>
        </Row>

        {/* Main Content */}
        <Row>
          {/* Input Form */}
          <Col lg={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <FileText className="me-2" size={20} />
                Input Text
              </Card.Header>
              <Card.Body>
                <SummarizerForm 
                  onSubmit={handleSummarize}
                  loading={loading}
                  emotions={emotions}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Results */}
          <Col lg={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-success text-white">
                <BarChart3 className="me-2" size={20} />
                Results
              </Card.Header>
              <Card.Body>
                {loading && (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Analyzing emotions and generating summary...</p>
                  </div>
                )}

                {error && (
                  <Alert variant="danger">
                    <strong>Error:</strong> {error}
                  </Alert>
                )}

                {result && <ResultDisplay result={result} />}

                {!loading && !error && !result && (
                  <div className="text-center py-5 text-muted">
                    <FileText size={48} className="mb-3" />
                    <p>Enter text above and click "Generate Summary" to see results</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistics */}
        {result && (
          <Row className="mt-4">
            <Col>
              <StatsDisplay result={result} />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default App;