# Contributing to AgriVerse

Thank you for your interest in contributing to AgriVerse: The Climate Survival Shards!

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser
- (Optional) NASA API access
- (Optional) Google Gemini API key
- (Optional) DeepSeek API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agriverse.git
cd agriverse
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173` (or the port shown in terminal)

### First Run

- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- The app will run in Demo Mode by default
- All features are fully functional without API keys

## Project Structure

```
/
├── components/          # React components
│   ├── ui/             # ShadCN UI components
│   └── ...             # Game components
├── contexts/           # React contexts
├── services/           # API services
├── utils/              # Utility functions
├── styles/             # Global styles
└── hooks/              # Custom React hooks
```

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Use Tailwind CSS for styling (v4.0)
- Avoid inline font size/weight classes (use globals.css defaults)
- Use Motion/React for animations

### Component Guidelines

- Create modular, reusable components
- Place new components in `/components` directory
- Import UI components from `/components/ui`
- Use proper TypeScript types
- Add comments for complex logic

### API Integration

- All API calls should handle errors gracefully
- Provide fallback data for offline/demo mode
- Store API keys securely using `apiKeyStorage.ts`
- Never commit API keys to the repository

## Features to Work On

### High Priority
- Additional climate shards
- More boss battle types
- Enhanced character customization
- Additional farming mechanics

### Medium Priority
- Multiplayer improvements
- More NASA data visualizations
- Achievement system expansion
- Mobile optimization

### Low Priority
- Sound effects
- Music system
- Additional languages
- Accessibility improvements

## Testing

Before submitting a PR:

1. Test in both Demo Mode and with real API keys
2. Check responsive design (mobile + desktop)
3. Clear cache and test from fresh state
4. Verify NASA data updates correctly
5. Test all navigation flows

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request

### PR Guidelines

- Describe what your changes do
- Reference any related issues
- Include screenshots for UI changes
- Test thoroughly before submitting
- Keep PRs focused on a single feature/fix

## API Keys for Testing

### Gemini AI (Optional)
- Get key: https://makersuite.google.com/app/apikey
- Use `gemini-1.5-flash` model
- Store via API Diagnostics in app

### DeepSeek AI (Optional)
- Get key: https://platform.deepseek.com
- Use `deepseek-chat` model
- Store via API Diagnostics in app

### NASA APIs (Free, No Key Required)
- GIBS (Global Imagery)
- SMAP (Soil Moisture)
- MODIS (Temperature)
- GPM (Precipitation)

## Documentation

When adding features:
- Update README.md if needed
- Add comments to complex code
- Update FEATURES.md for new features
- Create docs in `/guidelines` if needed

## Questions?

- Check existing documentation in `.md` files
- Review the code and comments
- Open an issue for discussion
- Demo Mode works great for development!

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Prioritize educational value
- Keep climate change education accurate

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for helping make AgriVerse better! 🌱**