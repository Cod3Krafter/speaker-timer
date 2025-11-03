# Speaker Timer

<div align="center">

A modern, real-time speaker timer application built with React, TypeScript, and Tailwind CSS. Perfect for managing speaking events, presentations, and conferences with synchronized multi-window support.

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Tech Stack](#technology-stack) • [Contributing](#contributing)

</div>

---

## Features

### Timer Management
- **Real-time Countdown Timer**
  - Millisecond precision timing
  - Continues into negative time when exceeded
  - Timestamp-based calculation for accuracy
  - Persistent state across page refreshes

- **Visual Feedback System**
  - Dynamic color transitions as time decreases (Blue → Indigo → Purple → Red)
  - Color transitions begin at 20% remaining time
  - Red background indicator when time is exceeded
  - Animated pulse effect while running

### Speaker Queue Management
- **Add & Edit Speakers**
  - Custom name and topic fields
  - Flexible duration setting (hours:minutes:seconds)
  - Inline editing of speaker details
  - Delete speakers with confirmation

- **Queue Organization**
  - Drag-and-drop reordering using @dnd-kit
  - Visual drag handles for intuitive interaction
  - Automatic current speaker tracking
  - Load next speaker functionality

### Multi-Window Synchronization
- **Dual-View Architecture**
  - Control panel for event organizers
  - Full-screen public display for presenters and audience
  - Real-time synchronization across windows/tabs
  - Works in both browser and Tauri desktop environments

- **Sync Technologies**
  - BroadcastChannel API for browser tabs
  - LocalStorage events for Tauri windows
  - Automatic state rehydration

### Platform Support
- **Web Application**: Deploy to any static hosting service
- **Desktop Application**: Cross-platform Tauri app (Windows, macOS, Linux)

---

## Demo

### Control Panel
The control panel provides organizers with complete event management:
- Speaker queue with drag-and-drop reordering
- Timer controls (Start, Pause, Resume, Stop, Reset)
- Add/Edit speaker form
- Load next speaker button
- Open display view button

### Public Display View
The public display provides a clean, full-screen timer for speakers and audience:
- Large, readable timer display
- Speaker name and topic
- Dynamic background colors based on remaining time
- Status indicators
- Distraction-free interface

---

## Technology Stack

### Frontend
- **Framework**: React 19.1.1 with TypeScript 5.9.3
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.15
- **State Management**: Zustand 5.0.8 with localStorage persistence
- **Routing**: React Router DOM 7.9.4
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)

### Desktop App
- **Framework**: Tauri 2.9.0
- **Language**: Rust (edition 2021)
- **Platform**: Cross-platform desktop support

### Development Tools
- **Linting**: ESLint 9.36.0 with React plugins
- **Type Checking**: TypeScript strict mode
- **Package Manager**: pnpm

---

## Installation

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** v8 or higher (or npm/yarn)
- **Rust** (only for building desktop app)

### Web Application

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/speaker-timer.git
   cd speaker-timer
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:5173](http://localhost:5173)

### Desktop Application

1. **Install Tauri prerequisites**:
   - Follow the [Tauri prerequisites guide](https://tauri.app/v1/guides/getting-started/prerequisites) for your platform

2. **Run in development mode**:
   ```bash
   pnpm tauri:dev
   ```

3. **Build for production**:
   ```bash
   pnpm tauri:build
   ```

   Built applications will be in `src-tauri/target/release/bundle/`

---

## Usage

### Quick Start

1. **Add Your First Speaker**
   - Enter speaker name (e.g., "John Doe")
   - Enter topic (e.g., "Introduction to React")
   - Set duration (e.g., "00:05:00" for 5 minutes)
   - Click "Add Speaker"

2. **Start the Timer**
   - Click "Load" on a speaker card to load them as current speaker
   - The timer will display their allocated time
   - Click "Start" to begin the countdown

3. **Open the Display View**
   - Click "Open Display View" button
   - Position the window on a secondary screen or projector
   - The display automatically syncs with the control panel

### Managing the Speaker Queue

#### Adding Speakers
- Fill out the form with speaker details
- Duration format: `HH:MM:SS` (hours:minutes:seconds)
- Click "Add Speaker" to add to the queue

#### Editing Speakers
- Click the "Edit" button on any speaker card
- The form will populate with their details
- Modify as needed and click "Update Speaker"

#### Reordering Speakers
- Hover over a speaker card to see the drag handle (⋮⋮)
- Click and hold the drag handle
- Drag up or down to reposition
- Release to drop in the new position

#### Deleting Speakers
- Click the "Delete" button on a speaker card
- Confirm the deletion

### Timer Controls

- **Start**: Begin the countdown timer
- **Pause**: Freeze the timer at current time
- **Resume**: Continue from paused state
- **Stop**: Return timer to idle state
- **Reset**: Reset timer to original duration
- **Load Next**: Automatically load the next speaker in queue

### Understanding Timer Colors

The timer background changes color based on remaining time:

- **Blue/Indigo**: Plenty of time remaining (>20%)
- **Purple**: Time is running low (≤20%)
- **Red**: Time has been exceeded (negative time)

Color transitions begin when 20% of the total time remains to provide visual warning.

### Multi-Window Setup

For events, use a dual-screen setup:

1. **Primary Screen** (Organizer):
   - Open the control panel (`/`)
   - Manage speakers and control the timer

2. **Secondary Screen** (Audience/Presenter):
   - Open the display view (`/display`)
   - Set to fullscreen (F11 in most browsers)
   - Position facing the speaker/audience

Both views stay synchronized in real-time.

---

## Project Structure

```
speaker-timer/
├── src/
│   ├── components/           # React components
│   │   ├── SpeakerForm.tsx       # Add/edit speaker form
│   │   ├── SpeakerList.tsx       # Speaker queue list
│   │   ├── SpeakerListItem.tsx   # Individual speaker card
│   │   ├── TimerControls.tsx     # Timer control buttons
│   │   ├── TimerDisplay.tsx      # Timer display component
│   │   └── public-display.tsx    # Public display view
│   ├── store/               # Zustand state management
│   │   ├── useSpeakerStore.ts    # Speaker queue state
│   │   └── useTimerStore.ts      # Timer state
│   ├── hooks/               # Custom React hooks
│   │   └── useSyncStore.ts       # Store synchronization
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts            # Helper functions
│   │   └── tauriWindows.ts       # Tauri window management
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Entry point
│   └── *.css               # Stylesheets
├── src-tauri/               # Tauri desktop app
│   ├── src/
│   │   └── lib.rs              # Rust backend
│   ├── icons/                  # App icons
│   ├── Cargo.toml             # Rust dependencies
│   └── tauri.conf.json        # Tauri configuration
├── public/                  # Static assets
├── package.json            # Node dependencies
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

---

## Configuration

### Build Configuration

The project uses Vite for building. Configuration is in [vite.config.ts](vite.config.ts).

Key settings:
- Base path cleared for Tauri integration
- React plugin for JSX transformation
- Tailwind CSS plugin for styling

### Tauri Configuration

Desktop app configuration is in [src-tauri/tauri.conf.json](src-tauri/tauri.conf.json).

Key settings:
- **Product Name**: Speaker Timer
- **Window Size**: 1200x800
- **Bundle Category**: Productivity
- **Platforms**: Windows, macOS, Linux

### Environment Variables

No environment variables are required for basic usage.

---

## Scripts

### Development
```bash
pnpm dev              # Start web development server
pnpm tauri:dev        # Start desktop app in development mode
```

### Building
```bash
pnpm build            # Build web application for production
pnpm tauri:build      # Build desktop application for production
pnpm preview          # Preview production build locally
```

### Linting
```bash
pnpm lint             # Run ESLint
```

---

## State Management

The application uses Zustand for state management with two main stores:

### Timer Store ([src/store/useTimerStore.ts](src/store/useTimerStore.ts))
- Timer state (idle, running, paused)
- Start time and duration tracking
- Timer control functions
- Timestamp-based time calculation
- LocalStorage persistence

### Speaker Store ([src/store/useSpeakerStore.ts](src/store/useSpeakerStore.ts))
- Speaker queue management
- Current speaker tracking
- CRUD operations for speakers
- Queue reordering
- LocalStorage persistence

Both stores automatically persist to localStorage and synchronize across windows/tabs.

---

## Browser Support

- **Modern Browsers**: Chrome, Edge, Firefox, Safari (latest 2 versions)
- **Features Required**:
  - BroadcastChannel API (for tab synchronization)
  - LocalStorage API (for persistence)
  - ES6+ JavaScript support

---

## Desktop App Deployment

### Building for Distribution

Build the desktop app for your target platform:

```bash
pnpm tauri:build
```

Output locations:
- **Windows**: `src-tauri/target/release/bundle/msi/` or `nsis/`
- **macOS**: `src-tauri/target/release/bundle/dmg/` or `macos/`
- **Linux**: `src-tauri/target/release/bundle/deb/` or `appimage/`

### Platform-Specific Notes

**Windows**:
- `.msi` installer for standard installation
- `.exe` portable executable

**macOS**:
- `.dmg` disk image for drag-and-drop installation
- `.app` application bundle
- May need to sign for distribution outside App Store

**Linux**:
- `.deb` package for Debian/Ubuntu
- `.AppImage` portable application

---

## Web Deployment

### Static Hosting

Build the web application:

```bash
pnpm build
```

The `dist/` folder contains static files that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Deployment Steps (Example: Netlify)

1. Build the project: `pnpm build`
2. Connect your repository to Netlify
3. Set build command: `pnpm build`
4. Set publish directory: `dist`
5. Deploy

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

---

## Known Issues

### Weird Behavior with "Load Next Speaker"
There's a known issue where clicking "Load Next Speaker" may cause unexpected behavior. This is being investigated.

### Public Name and Topic Sync
Public name and topic synchronization may occasionally lag. A fix is in progress.

---

## Roadmap

- [ ] Fix "Load Next Speaker" behavior
- [ ] Improve name/topic synchronization
- [ ] Add sound notifications when time expires
- [ ] Add preset duration templates
- [ ] Add export/import speaker lists
- [ ] Add timer themes/customization
- [ ] Add multiple timer modes (Pomodoro, etc.)
- [ ] Add speaker time statistics

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- State management by [Zustand](https://github.com/pmndrs/zustand)
- Desktop app powered by [Tauri](https://tauri.app/)
- Drag and drop by [@dnd-kit](https://dndkit.com/)

---

## Support

If you encounter any issues or have questions:
- Open an [issue](https://github.com/yourusername/speaker-timer/issues)
- Check existing issues for solutions
- Review the documentation above

---

<div align="center">

Made with ❤️ for speakers and event organizers everywhere

</div>
