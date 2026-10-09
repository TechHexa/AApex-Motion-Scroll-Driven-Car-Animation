# Apex Motion — Scroll-Driven Car Animation

Apex Motion is a modern, interactive automotive landing page featuring a supercar animation controlled by scrolling. Built using HTML, CSS, JavaScript, and GSAP, the project combines smooth car movement, dynamic visual effects, animated performance metrics, and scroll-based engine sound.

## 🚀 Project Overview

The project demonstrates how scrolling can control a car's movement, engine audio, speedometer, progress indicators, and animated performance cards.

The goal is to create an immersive automotive experience with smooth animations, responsive design, and interactive sound effects.

## ✨ Key Features

### 1. Scroll-Driven Car Animation
- Smooth horizontal car movement based on scroll progress.
- Pinned hero section for an immersive experience.
- GSAP ScrollTrigger integration.
- Smooth animation using GSAP scrub.

### 2. Scroll-Based Engine Sound
- Interactive Sound FX ON/OFF button.
- Engine and startup audio using WAV audio files or embedded audio data.
- Engine pitch and volume respond to the scrolling speed.
- Faster scrolling increases engine intensity.
- Engine sound returns toward a lower idle level when scrolling slows or stops.
- Audio starts after user interaction to comply with browser autoplay restrictions.

### 3. Animated Performance Metrics
- Four animated performance cards.
- Number count-up animations.
- Dynamic progress bars.
- Scroll-triggered card reveals.

### 4. Real-Time Telemetry Dashboard
- Animated speedometer.
- Scroll progress percentage.
- Dynamic progress indicator.
- Speed values calculated from scroll velocity.

### 5. Dynamic Visual Effects
- Animated headlights and taillight effects.
- Kinetic green trail following the car.
- Scroll-based headline illumination.
- Dark automotive-themed interface.
- Glassmorphism-inspired metric cards.

### 6. Responsive Design
- Responsive layout for different screen sizes.
- Modern typography and visual effects.
- Optimized CSS transforms for smooth animation.

## 🛠️ Technologies Used

- **HTML5** — Website structure
- **CSS3** — Styling, responsive layouts, and visual effects
- **JavaScript (ES6+)** — Interaction and animation logic
- **GSAP 3** — Animation engine
- **GSAP ScrollTrigger** — Scroll-based animation control
- **Web Audio / HTML Audio** — Engine sound playback and audio control

## 📁 Project Structure

```text
apex-motion/
├── index.html
├── style.css
├── script.js
├── audioData.js
├── car.png
├── engine.wav
├── startup.wav
├── AUDIO-SETUP.txt
└── README.md
```

**Note:** Keep all required files in the same project folder. If embedded audio data is used, `audioData.js` must also be included.

## ⚙️ Installation and Setup

### Step 1: Download the Project

Download or clone the project repository.

```bash
git clone https://github.com/TechHexa/AApex-Motion-Scroll-Driven-Car-Animation
```

Navigate to the project directory:

```bash
cd apex-motion
```

### Step 2: Open in VS Code

Open the project folder in Visual Studio Code.

### Step 3: Run the Website

Use the Live Server extension to open `index.html`.

Alternatively, deploy the complete project folder to a static hosting service.

### Step 4: Test the Engine Sound

1. Open the website.
2. Click the **SOUND FX** button to enable audio.
3. Scroll slowly and observe the engine sound.
4. Scroll faster and check the change in engine pitch and intensity.
5. Stop scrolling and observe the engine returning toward idle.
6. Click the sound button again to mute the audio.

## 🔊 Audio Troubleshooting

If the engine sound does not work:

- Make sure the Sound FX button is enabled.
- Verify that `engine.wav`, `startup.wav`, and `audioData.js` are present when required.
- Check that the HTML file references the correct JavaScript and CSS filenames.
- Open browser Developer Tools using `F12` and inspect the Console for errors.
- Check the Network tab for missing audio files or failed requests.
- Confirm that the browser tab and website are not muted.
- Run the project through Live Server or a web server when testing locally.

**Important:** Audio playback and file loading must be verified in the target browser. Successful deployment alone does not guarantee that audio playback will work.

## 🌐 Deployment on GitHub Pages

1. Create a repository on GitHub.
2. Upload all required project files.
3. Open **Settings → Pages**.
4. Select the `main` branch and the root folder.
5. Save the configuration.
6. Open the published website URL provided by GitHub Pages.

Ensure all asset filenames and file paths match exactly, including capitalization.

## 🎯 Project Objectives

- Demonstrate scroll-driven web animations.
- Implement interactive engine audio.
- Integrate GSAP and ScrollTrigger.
- Create an engaging automotive landing page.
- Display animated telemetry and performance metrics.
- Practice front-end development and interactive UI design.

## 🔮 Future Enhancements

- More realistic engine sound synthesis.
- Advanced engine RPM simulation.
- Gear-shifting sound effects.
- Improved mobile audio controls.
- Additional camera angles and car animations.
- Performance optimization and accessibility improvements.

## Demo Link 🔗 
https://techhexa.github.io/AApex-Motion-Scroll-Driven-Car-Animation/

## 👨‍💻 Author

**Raj Kumar**

Project: Apex Motion — Scroll-Driven Car Animation
