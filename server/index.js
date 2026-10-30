import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { BENCHMARK_PRESETS } from './data/presets.js';
import { extractEntitiesFromInput } from './services/extractionService.js';
import { runComprehensiveAudit } from './services/scamDetector.js';
import { extractTextFromImage } from './services/ocrService.js';
import { registerUser, loginUser } from './services/authService.js';
import { getRedditAndReviewSentiment } from './services/redditService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (.env) natively
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (e) {
    // .env file is optional
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve built frontend assets
app.use(express.static(path.join(__dirname, '../dist')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'VeriFirm Threat Intelligence Engine' });
});

// Real OCR Endpoint for screenshots & offer letters
app.post('/api/ocr', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided for OCR.' });
    }

    const result = await extractTextFromImage(image, mimeType);
    return res.json(result);
  } catch (err) {
    console.error('OCR processing error:', err);
    return res.status(500).json({ error: 'OCR processing failed: ' + err.message });
  }
});

// Get Benchmark Presets (Exclusively for DEMO scenario evaluation)
app.get('/api/presets', (req, res) => {
  const summary = BENCHMARK_PRESETS.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    badge: p.badge,
    badgeColor: p.badgeColor,
    sampleInputType: p.sampleInputType,
    sampleInput: p.sampleInput,
    trustScore: p.trustScore,
    verdict: p.verdict,
    isDemoPreset: true
  }));
  res.json(summary);
});

// Get Specific Preset Details
app.get('/api/presets/:id', (req, res) => {
  const preset = BENCHMARK_PRESETS.find(p => p.id === req.params.id);
  if (!preset) {
    return res.status(404).json({ error: 'Preset not found' });
  }
  res.json({ ...preset, isDemoPreset: true });
});

// Authentication Endpoints (Real Email & Password)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = registerUser({ name, email, password });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = loginUser({ email, password });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

// Main Analysis Endpoint (Evidence-Grounded, Non-Fabricating)
app.post('/api/analyze', async (req, res) => {
  try {
    const { type, content, presetId, userProvidedDetails } = req.body;

    // Explicit DEMO preset requested by ID
    if (presetId) {
      const preset = BENCHMARK_PRESETS.find(p => p.id === presetId);
      if (preset) {
        return res.json({ ...preset, isDemoPreset: true });
      }
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Please provide link, email text, or screenshot content to analyze.' });
    }

    // Step 1: Entity Extraction & NLP (Extracts strictly from user input)
    const extractedData = extractEntitiesFromInput(content, type, userProvidedDetails);

    // Step 2: Evidence-Based Network & Forensic Audit
    const auditResult = await runComprehensiveAudit(extractedData, userProvidedDetails);

    return res.json({ ...auditResult, isDemoPreset: false });
  } catch (err) {
    console.error('Error during analysis:', err);
    res.status(500).json({ error: 'Analysis failed: ' + (err.message || 'Unknown error') });
  }
});

// Real-Time Community Discussions Search (Reddit)
app.get('/api/search/reddit', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q || !q.trim()) {
      return res.status(400).json({ error: 'Search query parameter q is required.' });
    }
    const result = await getRedditAndReviewSentiment(q.trim(), q.trim());
    return res.json(result);
  } catch (err) {
    console.error('Error during Reddit search:', err);
    res.status(500).json({ error: 'Search failed: ' + err.message });
  }
});

// SPA fallback for frontend client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`VeriFirm Intelligence Server running on http://localhost:${PORT}`);
});

