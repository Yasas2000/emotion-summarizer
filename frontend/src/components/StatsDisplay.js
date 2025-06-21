import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { TrendingUp, FileText, Zap, Target } from 'lucide-react';

const StatsDisplay = ({ result }) => {
  const compressionRatio = ((result.summary_length / result.input_length) * 100);
  const wordsPerSecond = (result.input_length / 5) / result.processing_time; // Rough estimate
  
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-info text-white">
        <TrendingUp className="me-2" size={20} />
        Performance Metrics
      </Card.Header>
      <Card.Body>
        <Row className="g-4">
          <Col md={3} className="text-center">
            <div className="mb-2">
              <FileText className="text-primary" size={32} />
            </div>
            <h5 className="mb-1">{result.input_length.toLocaleString()}</h5>
            <small className="text-muted">Input Characters</small>
          </Col>
          
          <Col md={3} className="text-center">
            <div className="mb-2">
              <Target className="text-success" size={32} />
            </div>
            <h5 className="mb-1">{result.summary_length.toLocaleString()}</h5>
            <small className="text-muted">Summary Characters</small>
          </Col>
          
          <Col md={3} className="text-center">
            <div className="mb-2">
              <Zap className="text-warning" size={32} />
            </div>
            <h5 className="mb-1">{wordsPerSecond.toFixed(0)}</h5>
            <small className="text-muted">Words/Second</small>
          </Col>
          
          <Col md={3} className="text-center">
            <div className="mb-2">
              <TrendingUp className="text-info" size={32} />
            </div>
            <h5 className="mb-1">{compressionRatio.toFixed(1)}%</h5>
            <small className="text-muted">Compression</small>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small>Emotion Confidence</small>
            <small>{(result.emotion_confidence * 100).toFixed(1)}%</small>
          </div>
          <ProgressBar 
            now={result.emotion_confidence * 100} 
            variant={result.emotion_confidence > 0.7 ? 'success' : result.emotion_confidence > 0.5 ? 'warning' : 'danger'}
          />
        </div>
        
        <div>
          <div className="d-flex justify-content-between mb-1">
            <small>Text Reduction</small>
            <small>{(100 - compressionRatio).toFixed(1)}%</small>
          </div>
          <ProgressBar 
            now={100 - compressionRatio} 
            variant="info"
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsDisplay;