import React, { useState } from 'react';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { Send, Type, Settings } from 'lucide-react';

const SummarizerForm = ({ onSubmit, loading, emotions }) => {
  const [text, setText] = useState('');
  const [maxLength, setMaxLength] = useState(150);
  const [emotionOverride, setEmotionOverride] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length < 50) {
      alert('Please enter at least 50 characters for summarization');
      return;
    }

    const formData = {
      text: text.trim(),
      max_length: maxLength,
      emotion_override: emotionOverride || null
    };

    onSubmit(formData);
  };

  const sampleTexts = [
    {
      title: "News Article",
      text: "Scientists have made a groundbreaking discovery in renewable energy technology. A new type of solar panel has been developed that can generate electricity even in low-light conditions, potentially revolutionizing how we harness solar power. The research team, led by Dr. Sarah Johnson at MIT, spent five years developing this innovative technology. The new panels use a special coating that can capture and convert infrared light into electricity, making them 40% more efficient than traditional solar panels. This breakthrough could significantly reduce our dependence on fossil fuels and help combat climate change. The technology is expected to be commercially available within the next three years, with major energy companies already expressing interest in licensing the technology."
    },
    {
      title: "Sports News",
      text: "In an thrilling match last night, the home team secured a dramatic victory in the final minutes of the game. The crowd erupted in celebration as the winning goal was scored with just 30 seconds left on the clock. This victory puts the team at the top of the league standings and significantly improves their chances of making it to the playoffs. The star player, who scored the winning goal, dedicated the victory to the fans who have supported the team throughout this challenging season. The coach praised the team's determination and resilience, noting that this win demonstrates their championship potential."
    }
  ];

  const loadSampleText = (sampleText) => {
    setText(sampleText);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Sample Text Buttons */}
      <div className="mb-3">
        <small className="text-muted">Quick samples:</small>
        <div className="mt-1">
          {sampleTexts.map((sample, index) => (
            <Button
              key={index}
              variant="outline-secondary"
              size="sm"
              className="me-2 mb-2"
              onClick={() => loadSampleText(sample.text)}
            >
              {sample.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <Form.Group className="mb-3">
        <Form.Label>
          <Type className="me-2" size={16} />
          Text to Summarize
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text you want to summarize (minimum 50 characters)..."
          required
        />
        <Form.Text className="text-muted">
          Characters: {text.length} (minimum 50 required)
        </Form.Text>
      </Form.Group>

      {/* Settings */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              <Settings className="me-2" size={16} />
              Max Summary Length
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                min="50"
                max="300"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value))}
              />
              <InputGroup.Text>words</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Emotion Override (Optional)</Form.Label>
            <Form.Select
              value={emotionOverride}
              onChange={(e) => setEmotionOverride(e.target.value)}
            >
              <option value="">Auto-detect emotion</option>
              {emotions.map((emotion) => (
                <option key={emotion} value={emotion}>
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading || text.trim().length < 50}
        className="w-100"
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Generating Summary...
          </>
        ) : (
          <>
            <Send className="me-2" size={16} />
            Generate Summary
          </>
        )}
      </Button>
    </Form>
  );
};

export default SummarizerForm;