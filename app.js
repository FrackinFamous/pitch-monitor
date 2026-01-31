// Pitch detection using autocorrelation
class PitchDetector {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.bufferLength = 0;
        this.dataArray = null;
        this.isRunning = false;
        this.rafId = null;
    }

    async start() {
        try {
            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            
            // Configure analyser
            this.analyser.fftSize = 2048;
            this.bufferLength = this.analyser.fftSize;
            this.dataArray = new Float32Array(this.bufferLength);
            
            // Connect nodes
            this.microphone.connect(this.analyser);
            
            this.isRunning = true;
            this.detectPitch();
            
            return true;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            return false;
        }
    }

    stop() {
        this.isRunning = false;
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone.mediaStream.getTracks().forEach(track => track.stop());
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }

    detectPitch() {
        if (!this.isRunning) return;

        this.analyser.getFloatTimeDomainData(this.dataArray);
        
        // Autocorrelation
        const frequency = this.autoCorrelate(this.dataArray, this.audioContext.sampleRate);
        
        // Update display
        if (frequency > 0) {
            const note = this.frequencyToNote(frequency);
            updateDisplay(frequency, note);
        }
        
        // Draw waveform
        drawWaveform(this.dataArray);
        
        // Continue detection
        this.rafId = requestAnimationFrame(() => this.detectPitch());
    }

    autoCorrelate(buffer, sampleRate) {
        // Perform autocorrelation to find pitch
        const SIZE = buffer.length;
        const rms = Math.sqrt(buffer.reduce((sum, val) => sum + val * val, 0) / SIZE);
        
        // Not enough signal
        if (rms < 0.01) return -1;

        let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
        
        // Trim silence from beginning and end
        for (let i = 0; i < SIZE / 2; i++) {
            if (Math.abs(buffer[i]) < threshold) {
                r1 = i;
                break;
            }
        }
        
        for (let i = 1; i < SIZE / 2; i++) {
            if (Math.abs(buffer[SIZE - i]) < threshold) {
                r2 = SIZE - i;
                break;
            }
        }

        buffer = buffer.slice(r1, r2);
        const newSize = buffer.length;

        const c = new Array(newSize).fill(0);
        
        // Autocorrelation
        for (let i = 0; i < newSize; i++) {
            for (let j = 0; j < newSize - i; j++) {
                c[i] += buffer[j] * buffer[j + i];
            }
        }

        let d = 0;
        while (c[d] > c[d + 1]) d++;

        let maxval = -1, maxpos = -1;
        for (let i = d; i < newSize; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }

        let T0 = maxpos;

        // Interpolation for better accuracy
        const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
        const a = (x1 + x3 - 2 * x2) / 2;
        const b = (x3 - x1) / 2;
        
        if (a) T0 = T0 - b / (2 * a);

        return sampleRate / T0;
    }

    frequencyToNote(frequency) {
        const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const A4 = 440;
        const C0 = A4 * Math.pow(2, -4.75);
        
        if (frequency < 20) return { note: '--', octave: '', cents: 0 };
        
        const halfSteps = 12 * Math.log2(frequency / C0);
        const noteIndex = Math.round(halfSteps) % 12;
        const octave = Math.floor(halfSteps / 12);
        const cents = Math.round((halfSteps - Math.round(halfSteps)) * 100);
        
        return {
            note: noteStrings[noteIndex],
            octave: octave,
            cents: cents
        };
    }
}

// UI Controller
const detector = new PitchDetector();
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusEl = document.getElementById('status');
const canvas = document.getElementById('waveform');
const canvasCtx = canvas.getContext('2d');

// Set canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

startBtn.addEventListener('click', async () => {
    const success = await detector.start();
    
    if (success) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusEl.textContent = 'Listening...';
        statusEl.classList.add('active');
    } else {
        statusEl.textContent = 'Microphone access denied';
        alert('Unable to access microphone. Please check your permissions.');
    }
});

stopBtn.addEventListener('click', () => {
    detector.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusEl.textContent = 'Ready';
    statusEl.classList.remove('active');
    
    // Clear display
    document.getElementById('pitch').textContent = '--';
    document.getElementById('note').textContent = '--';
    document.getElementById('frequency').textContent = '-- Hz';
    document.getElementById('cents').textContent = '0¢';
    document.getElementById('tuningNeedle').style.left = '50%';
    
    // Clear canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
});

function updateDisplay(frequency, noteData) {
    document.getElementById('pitch').textContent = frequency.toFixed(1);
    document.getElementById('note').textContent = `${noteData.note}${noteData.octave}`;
    document.getElementById('frequency').textContent = `${frequency.toFixed(2)} Hz`;
    document.getElementById('cents').textContent = `${noteData.cents > 0 ? '+' : ''}${noteData.cents}¢`;
    
    // Update tuning needle (range: -50 to +50 cents)
    const needlePosition = 50 + (noteData.cents / 50 * 25); // Map -50/+50 cents to 25%/75%
    const clampedPosition = Math.max(0, Math.min(100, needlePosition));
    document.getElementById('tuningNeedle').style.left = `${clampedPosition}%`;
}

function drawWaveform(dataArray) {
    const width = canvas.width;
    const height = canvas.height;
    
    canvasCtx.fillStyle = 'rgba(15, 52, 96, 0.3)';
    canvasCtx.fillRect(0, 0, width, height);
    
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#00ff88';
    canvasCtx.beginPath();
    
    const sliceWidth = width / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i];
        const y = (v + 1) / 2 * height;
        
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    canvasCtx.stroke();
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});
