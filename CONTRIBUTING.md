# Contributing to Speaker Timer

Thank you for your interest in contributing to Speaker Timer! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, trolling, or insulting/derogatory comments
- Personal or political attacks
- Publishing others' private information
- Any conduct inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** v18 or higher
- **pnpm** v8 or higher
- **Git** for version control
- **Rust** (if working on Tauri desktop features)
- A code editor (VS Code recommended)

### Familiarize Yourself

1. Read the [README.md](README.md) to understand the project
2. Browse the codebase to understand the structure
3. Check existing issues and pull requests
4. Read this contributing guide thoroughly

---

## Development Setup

### 1. Fork and Clone

Fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/speaker-timer.git
cd speaker-timer
```

### 2. Add Upstream Remote

Add the original repository as an upstream remote:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/speaker-timer.git
```

### 3. Install Dependencies

Install project dependencies using pnpm:

```bash
pnpm install
```

### 4. Create a Branch

Create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 5. Start Development Server

Start the development server:

```bash
# Web application
pnpm dev

# Desktop application
pnpm tauri:dev
```

---

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes**: Fix existing bugs or issues
2. **New Features**: Add new functionality
3. **Documentation**: Improve or add documentation
4. **Tests**: Add or improve test coverage
5. **Performance**: Optimize performance
6. **Refactoring**: Improve code quality
7. **Design**: Improve UI/UX

### Finding Issues to Work On

- Check the [Issues](https://github.com/yourusername/speaker-timer/issues) page
- Look for issues labeled `good first issue` for beginners
- Look for issues labeled `help wanted` for contributions needed
- Comment on an issue to indicate you're working on it

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid using `any` type; use proper typing
- Use interfaces for object shapes
- Use type annotations for function parameters and return types

```typescript
// Good
interface Speaker {
  id: string;
  name: string;
  topic: string;
  duration: number;
}

function addSpeaker(speaker: Speaker): void {
  // Implementation
}

// Avoid
function addSpeaker(speaker: any) {
  // Implementation
}
```

### React

- Use functional components with hooks
- Follow React best practices and hooks rules
- Use meaningful component and variable names
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

```typescript
// Good
function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const { deleteSpeaker } = useSpeakerStore();

  return (
    <div className="speaker-card">
      {/* Implementation */}
    </div>
  );
}

// Avoid deeply nested components
```

### State Management

- Use Zustand stores for shared state
- Keep store logic separate from components
- Use the persist middleware for data that should survive refreshes
- Document store structure and actions

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design (mobile-first approach)
- Test on different screen sizes

```typescript
// Good
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">

// Avoid inline styles unless necessary
<div style={{ padding: "24px" }}>
```

### File Organization

- Place components in `src/components/`
- Place stores in `src/store/`
- Place hooks in `src/hooks/`
- Place utilities in `src/utils/`
- Keep files focused and reasonably sized

### Code Quality

- Write clean, readable code
- Add comments for complex logic
- Remove unused imports and variables
- Use ESLint to catch issues: `pnpm lint`
- Fix linting errors before committing

---

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages:

```
<type>: <subject>

<optional body>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat: add sound notification when timer expires

fix: resolve synchronization issue between windows

docs: update installation instructions

refactor: extract timer logic into custom hook

test: add tests for speaker store

chore: update dependencies
```

### Best Practices

- Write in present tense ("add feature" not "added feature")
- Keep subject line under 72 characters
- Separate subject from body with blank line
- Use body to explain what and why, not how
- Reference issues in footer: `Fixes #123` or `Closes #456`

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**:
   - Run the development server and test manually
   - Test in both web and desktop modes (if applicable)
   - Test on different browsers/platforms if possible

3. **Lint your code**:
   ```bash
   pnpm lint
   ```

4. **Build the project**:
   ```bash
   pnpm build
   ```

5. **Commit your changes** following the commit guidelines

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting the Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template with:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Related Issues**: Link to related issues (e.g., "Fixes #123")
   - **Screenshots**: Include screenshots for UI changes
   - **Testing**: Describe how you tested the changes

### PR Template Example

```markdown
## Description
Brief description of the changes made.

## Related Issues
Fixes #123
Closes #456

## Changes Made
- Added feature X
- Fixed bug Y
- Updated documentation

## Testing
- [ ] Tested in web browser (Chrome, Firefox, Safari)
- [ ] Tested in desktop app (Windows/macOS/Linux)
- [ ] Tested multi-window synchronization
- [ ] No console errors
- [ ] Linting passes

## Screenshots
(if applicable)

## Additional Notes
Any additional information or context.
```

### After Submitting

- Respond to review feedback promptly
- Make requested changes in new commits
- Update the PR description if scope changes
- Be patient - reviews may take time

---

## Testing

### Manual Testing

Currently, the project relies on manual testing:

1. **Timer Functionality**
   - Start, pause, resume, stop, reset
   - Timer accuracy
   - Negative time display
   - Color transitions

2. **Speaker Management**
   - Add, edit, delete speakers
   - Drag-and-drop reordering
   - Load next speaker

3. **Synchronization**
   - Open multiple tabs/windows
   - Verify real-time sync
   - Test persistence (refresh page)

4. **Display View**
   - Timer display accuracy
   - Visual feedback
   - Fullscreen mode

5. **Responsive Design**
   - Test on different screen sizes
   - Mobile, tablet, desktop

### Automated Testing (Future)

We welcome contributions to add automated testing:
- Unit tests for stores and utilities
- Component tests
- Integration tests
- E2E tests

---

## Bug Reports

### Before Reporting

1. Check if the bug has already been reported
2. Try to reproduce the bug consistently
3. Test on the latest version
4. Gather relevant information

### Creating a Bug Report

Include the following information:

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 120, Firefox 122]
- App Version: [e.g., v1.0.0]
- Desktop or Web: [Desktop/Web]

**Additional context**
Any other relevant information.
```

---

## Feature Requests

### Before Requesting

1. Check if the feature has already been requested
2. Consider if it aligns with the project goals
3. Think about the implementation

### Creating a Feature Request

Include the following:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.

**Willing to contribute?**
[ ] Yes, I'm willing to implement this feature
[ ] No, just suggesting
```

---

## Questions?

If you have questions:

1. Check the [README.md](README.md)
2. Check existing [Issues](https://github.com/yourusername/speaker-timer/issues)
3. Open a new issue with the `question` label
4. Reach out to maintainers

---

## Recognition

Contributors will be recognized in:
- The project's contributor list
- Release notes (for significant contributions)
- GitHub's contribution graph

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Speaker Timer! Your efforts help make this project better for everyone.
