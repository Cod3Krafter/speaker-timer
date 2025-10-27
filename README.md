# Speaker Timer

A modern, real-time speaker timer application built with React, TypeScript, and Tailwind CSS. Perfect for managing speaking events, presentations, and conferences.

## Features

- 🎯 **Real-time Timer Display**
  - Countdown timer with millisecond precision
  - Smooth color transitions as time approaches zero
  - Continues into negative time with visual indicators
  - Synchronized display across multiple tabs/windows

- 👥 **Speaker Management**
  - Add, edit, and remove speakers
  - Set custom duration for each speaker
  - Drag-and-drop queue reordering
  - Speaker name and topic display

- 🎮 **Timer Controls**
  - Start/Pause/Resume functionality
  - Reset timer option
  - Load next speaker automatically
  - Persistent state across page refreshes

- 📺 **Display View**
  - Separate display window for presenters
  - Real-time synchronization with control panel
  - Clean, distraction-free interface
  - Color-coded time remaining indicators

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Drag & Drop**: @dnd-kit
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Cod3Krafter/speaker-timer.git
   cd speaker-timer
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Managing Speakers

1. **Adding a Speaker**
   - Fill out the speaker form with name, topic, and duration
   - Click "Add Speaker" to add them to the queue

2. **Editing Speakers**
   - Click the "Edit" button on any speaker card
   - Modify the details in the form
   - Click "Update Speaker" to save changes

3. **Reordering Speakers**
   - Use the drag handle (⋮⋮) to grab a speaker card
   - Drag up or down to reposition in the queue
   - Release to drop in the new position

### Using the Timer

1. **Starting a Session**
   - Load a speaker from the queue
   - Click the "Start" button to begin countdown
   - Timer will change color as time reduces

2. **Display View**
   - Click "Open Display View" to open presenter display
   - Position on a secondary screen if needed
   - Display automatically syncs with control panel

3. **Timer Controls**
   - Use Start/Pause/Resume as needed
   - Reset timer resets to original duration
   - Load next speaker when current presentation ends
```
