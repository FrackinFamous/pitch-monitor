# 🎵 Pitch Monitor

A free, browser-based pitch detection tool that works both online and offline. Perfect for musicians, singers, and anyone who needs to monitor and analyze pitch in real-time.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-enabled-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## 🌟 Features

- **Real-time Pitch Detection**: Uses advanced autocorrelation algorithm for accurate pitch detection
- **Musical Note Display**: Shows the closest musical note and octave
- **Frequency Display**: Displays precise frequency in Hz
- **Tuning Indicator**: Visual tuning meter showing cents deviation from perfect pitch
- **Waveform Visualization**: Real-time audio waveform display
- **Progressive Web App**: Install on any device and use offline
- **No Installation Required**: Works directly in your browser
- **Free and Open Source**: No subscriptions, no ads

## 🚀 Quick Start

### Online Use

Visit the live application at: **https://frackinfamous.github.io/pitch-monitor/**

Simply click "Start Monitoring" and allow microphone access when prompted.

### Offline Use

1. Visit the app URL in your browser
2. Click the install button (📱 Install App) or use your browser's install option
3. The app will be available offline on your device

## 📱 Installation

### Desktop (Chrome, Edge, Brave)

1. Visit the application URL
2. Click the install icon in the address bar (⊕ or 💻)
3. Click "Install" in the prompt
4. The app will open as a standalone application

### Mobile (iOS Safari)

1. Open the app in Safari
2. Tap the Share button (□↑)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Mobile (Android Chrome)

1. Open the app in Chrome
2. Tap the menu (⋮) in the top right
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

## 🎯 How to Use

1. **Grant Microphone Access**: Click "Start Monitoring" and allow microphone access when your browser prompts you
2. **Play or Sing**: Make sound into your microphone
3. **View Results**: 
   - **Current Pitch**: Shows the detected frequency in Hz
   - **Note**: Displays the closest musical note (e.g., A4, C#5)
   - **Tuning Indicator**: Shows how many cents sharp (♯) or flat (♭) you are
   - **Waveform**: Visual representation of your audio input

### Understanding the Tuning Indicator

- **Green center**: You're in tune! (within ±5 cents)
- **Orange zones**: Slightly sharp or flat (5-25 cents off)
- **Red zones**: Significantly out of tune (>25 cents off)
- **Cents value**: Shows exact deviation (e.g., +10¢ means 10 cents sharp)

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Structure and semantics
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Core application logic
- **Web Audio API**: Audio capture and analysis
- **Service Workers**: Offline functionality
- **PWA Manifest**: Progressive Web App capabilities

### Browser Requirements

- Modern browser with Web Audio API support:
  - Chrome/Edge 14+
  - Firefox 25+
  - Safari 14.1+
  - Opera 15+
- Microphone access permission

### Privacy

- All audio processing happens locally in your browser
- No data is sent to any server
- No tracking or analytics
- Completely private and secure

## 🧪 Development

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/FrackinFamous/pitch-monitor.git
   cd pitch-monitor
   ```

2. Serve the files with a local web server (required for service worker):
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Node.js
   npx serve
   
   # Or using PHP
   php -S localhost:8000
   ```

3. Open your browser to `http://localhost:8000`

### File Structure

```
pitch-monitor/
├── index.html              # Main HTML file
├── styles.css              # All styles
├── app.js                  # Pitch detection logic
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── icons/                  # App icons (various sizes)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   └── icon.svg
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the Web Audio API
- Uses autocorrelation algorithm for pitch detection
- Inspired by the need for accessible music tools

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on [GitHub](https://github.com/FrackinFamous/pitch-monitor/issues)
- Check existing issues for solutions

## 🎓 Learn More

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Progressive Web Apps Guide](https://web.dev/progressive-web-apps/)
- [Pitch Detection Algorithms](https://en.wikipedia.org/wiki/Pitch_detection_algorithm)

---

Made with ❤️ for musicians everywhere
