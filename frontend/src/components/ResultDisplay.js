import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { Heart, Clock, FileText, BarChart } from 'lucide-react';

const ResultDisplay = ({ result }) => {
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      joy: 'success', anger: 'danger', sadness: 'info',
      fear: 'warning', surprise: 'primary', disgust: 'secondary',
      love: 'danger', excitement: 'warning', gratitude: 'success',
      optimism: 'success', pride: 'primary', neutral: 'secondary'
    };
    return emotionColors[emotion] || 'secondary';
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return { level: 'High', variant: 'success' };
    if (confidence >= 0.6) return { level: 'Medium', variant: 'warning' };
    return { level: 'Low', variant: 'danger' };
  };

  const confidenceInfo = getConfidenceLevel(result.emotion_confidence);

  return (
    <div>
      {/* Emotion Detection */}
      <Card className="mb-3 border-0 bg-light">
        <Card.Body className="py-2">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                <Heart className="me-2 text-danger" size={16} />
                <strong>Detected Emotion:</strong>
                <Badge 
                  bg={getEmotionColor(result.detected_emotion)} 
                  className="ms-2 me-2"
                >
                  {result.detected_emotion.toUpperCase()}
                </Badge>
                <small className="text-muted">
                  Confidence: {(result.emotion_confidence * 100).toFixed(1)}%
                  <Badge 
                    bg={confidenceInfo.variant} 
                    className="ms-1"
                    style={{ fontSize: '0.7em' }}
                  >
                    {confidenceInfo.level}
                  </Badge>
                </small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Summary */}
      <Card className="mb-3">
        <Card.Header className="bg-light">
          <FileText className="me-2" size={16} />
          Generated Summary
        </Card.Header>
        <Card.Body>
          <p className="mb-0" style={{ lineHeight: '1.6', fontSize: '1.1em' }}>
            {result.summary}
          </p>
        </Card.Body>
      </Card>

      {/* Metrics */}
      <Row className="g-2">
        <Col sm={6}>
          <Card className="text-center border-0 bg-light">
            <Card.Body className="py-2">
              <Clock className="text-primary mb-1" size={20} />
              <div className="small">
                <strong>{result.processing_time}s</strong>
                <br />Processing Time
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6}>
          <Card className="text-center border-0 bg-light">
            <Card.Body className="py-2">
              <BarChart className="text-success mb-1" size={20} />
              <div className="small">
                <strong>{((result.summary_length / result.input_length) * 100).toFixed(1)}%</strong>
                <br />Compression Ratio
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResultDisplay;