# Voice Agent HTML Frontend

Pure HTML/CSS/JavaScript frontend for [Deepgram's Voice Agent API](https://developers.deepgram.com/docs/voice-agent-api).

## Features

- 🎤 Real-time voice conversation with AI agent
- 💬 Live chat interface with message history
- ⚙️ Configurable STT, TTS, and LLM models
- 📊 Connection and usage statistics
- 🎨 Built with [Deepgram Design System](https://github.com/deepgram/design-system)
- 🚀 No framework dependencies - pure vanilla JavaScript

## Prerequisites

- Node.js 14.0.0+
- pnpm 10.0.0+
- A backend server that implements the Voice Agent WebSocket endpoint

## Backend Requirements

This frontend requires a backend server that provides:

1. **WebSocket endpoint** at `/agent/converse` that:
   - Accepts WebSocket connections
   - Proxies bidirectional communication to Deepgram's Voice Agent API
   - Handles both JSON messages and binary audio data

2. **HTTP endpoint** at `/metadata` (optional) that returns:
   ```json
   {
     "title": "Your App Title",
     "description": "Your app description",
     "repository": "https://github.com/your-org/your-repo"
   }
   ```

See the [Node.js Voice Agent starter](https://github.com/deepgram-starters/node-voice-agent) for a complete backend implementation example.

## Quickstart

### Install Dependencies

```bash
pnpm install
```

### Development Mode

Start the Vite dev server:

```bash
pnpm dev
```

This runs on `http://localhost:5173` by default.

**Important:** You must also run a backend server that implements the Voice Agent WebSocket endpoint. The Vite config proxies `/agent` and `/metadata` requests to `http://localhost:8080`.

To change the backend URL, edit `vite.config.js`:

```javascript
proxy: {
  '/agent': {
    target: 'http://localhost:YOUR_BACKEND_PORT',
    ws: true,
  },
}
```

### Build for Production

```bash
pnpm build
```

Outputs to `dist/` directory. Serve these static files from your backend.

### Preview Production Build

```bash
pnpm preview
```

## Integration Patterns

### Pattern 1: Separate Frontend/Backend (Development)

**Best for:** Active development with HMR

- Frontend (Vite): `http://localhost:5173`
- Backend: `http://localhost:8080`
- Vite proxies API requests to backend

### Pattern 2: Backend Serves Frontend (Production)

**Best for:** Production deployment

1. Build frontend: `pnpm build`
2. Copy `dist/*` to backend's static files directory
3. Backend serves both static files and API endpoints

Example with Express:

```javascript
import express from 'express';
import path from 'path';

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.get('/metadata', (req, res) => { /* ... */ });

// WebSocket endpoint at /agent/converse
// ... WebSocket server setup
```

### Pattern 3: CDN + Backend API (Advanced)

**Best for:** Global scale, edge deployment

1. Build frontend: `pnpm build`
2. Deploy `dist/*` to CDN (Cloudflare, Vercel, etc.)
3. Update API endpoints in `main.js` to point to backend
4. Configure CORS on backend

## Configuration

### Agent Settings

Located in the left sidebar:

- **Listen (STT)**: Speech-to-text model (locked when connected)
- **Think (LLM)**: Language model (locked when connected)
- **Speak (TTS)**: Text-to-speech voice (updateable live)
- **System Prompt**: Agent instructions (updateable live)

Only Speak and System Prompt can be changed mid-conversation via the "Update Settings" button.

### Environment Variables

Set `VITE_PORT` to change dev server port:

```bash
VITE_PORT=3000 pnpm dev
```

## Architecture

```
frontend/
├── index.html          # Main HTML structure
├── main.js            # All JavaScript logic
├── vite.config.js     # Vite configuration
└── package.json       # Dependencies

main.js modules:
├── State Management   # WebSocket, audio, config state
├── DOM Initialization # Element references, event listeners
├── Metadata Loading   # Fetch /metadata endpoint
├── Config Tracking    # Detect setting changes
├── WebSocket Layer    # Connection, message handling
├── Audio Processing   # Microphone capture, playback queue
├── Chat Interface     # Message rendering, auto-scroll
└── UI Updates         # Status indicators, stats
```

## API Reference

### WebSocket Messages (Client → Server)

**Settings** - Initial configuration (sent on Welcome)
```javascript
{
  type: 'Settings',
  audio: {
    input: { encoding: 'linear16', sample_rate: 16000 },
    output: { encoding: 'linear16', sample_rate: 16000 }
  },
  agent: {
    listen: { provider: { type: 'deepgram', model: 'nova-2' } },
    speak: { provider: { type: 'deepgram', model: 'aura-asteria-en' } },
    think: { provider: { type: 'open_ai', model: 'gpt-4o-mini' }, prompt: '...' }
  }
}
```

**UpdateSpeak** - Change TTS voice
```javascript
{
  type: 'UpdateSpeak',
  speak: {
    provider: { type: 'deepgram', model: 'aura-luna-en' }
  }
}
```

**UpdatePrompt** - Change system prompt
```javascript
{
  type: 'UpdatePrompt',
  prompt: 'New system instructions...'
}
```

**TextMessage** - Send text message
```javascript
{
  type: 'TextMessage',
  content: 'User message text'
}
```

**KeepAlive** - Maintain connection
```javascript
{
  type: 'KeepAlive'
}
```

### WebSocket Messages (Server → Client)

**Welcome** - Connection established
```javascript
{ type: 'Welcome' }
```

**SettingsApplied** - Configuration accepted
```javascript
{ type: 'SettingsApplied' }
```

**ConversationText** - Transcribed text
```javascript
{
  type: 'ConversationText',
  role: 'user' | 'assistant',
  content: 'Message text'
}
```

**UserStartedSpeaking** - User speech detected
```javascript
{ type: 'UserStartedSpeaking' }
```

**AgentThinking** - LLM processing
```javascript
{ type: 'AgentThinking' }
```

**AgentStartedSpeaking** - TTS started
```javascript
{ type: 'AgentStartedSpeaking' }
```

**AgentAudioDone** - TTS complete
```javascript
{ type: 'AgentAudioDone' }
```

**Error** - Error occurred
```javascript
{
  type: 'Error',
  description: 'Error message',
  code: 'ERROR_CODE'
}
```

## Customization

### Styling

Uses Deepgram Design System CSS custom properties:

```css
/* Override in index.html <style> */
:root {
  --dg-primary: #13ef95;
  --dg-background: #0b0b0c;
  --dg-charcoal: #1a1a1f;
}
```

### Adding Features

The code is organized into clear sections in `main.js`:

1. **State Management** (lines 10-40) - Add new state properties
2. **DOM Elements** (lines 42-70) - Add new element references
3. **Event Listeners** (lines 125-150) - Add new interactions
4. **WebSocket Handlers** (lines 300-400) - Add new message types

## Troubleshooting

### WebSocket connection fails

- Ensure backend is running on correct port
- Check `vite.config.js` proxy configuration
- Verify backend implements `/agent/converse` endpoint

### Microphone not working

- Check browser permissions
- Ensure HTTPS in production (HTTP only works on localhost)
- Verify WebAudio API support

### No audio playback

- Check browser audio permissions
- Verify audio context state (may need user interaction to start)
- Check browser console for audio decoding errors

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Code of Conduct

This project follows the [Deepgram Code of Conduct](./CODE_OF_CONDUCT.md).

## Security

For security policy and procedures, see [SECURITY.md](./SECURITY.md).

## License

MIT - See [LICENSE](./LICENSE)

## Related Projects

- [Node Voice Agent Starter](https://github.com/deepgram-starters/node-voice-agent) - Complete Node.js backend + this frontend
- [Deepgram Voice Agent API Docs](https://developers.deepgram.com/docs/voice-agent-api)
- [Deepgram Design System](https://github.com/deepgram/design-system)

## Getting Help

- [Open an issue](https://github.com/deepgram-starters/voice-agent-html/issues/new)
- [Deepgram Discord Community](https://discord.gg/xWRaCDBtW4)
- [Deepgram GitHub Discussions](https://github.com/orgs/deepgram/discussions)
