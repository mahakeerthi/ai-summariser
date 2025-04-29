# 🧠 AI Summarizer

A modern web app that uses AI to summarize documents and text. Upload PDFs, get concise summaries in different formats.

## ✨ Features

- 📄 PDF upload and parsing
- 💡 AI-powered summarization with OpenAI, Anthropic, and Google models
- 📝 Custom prompt templates library
- 🔄 Multiple summary formats (bullet points, paragraphs, etc.)
- 💾 Save and organize your summaries
- 🔒 Simple auth system to keep your summaries private

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- API keys for at least one AI provider (OpenAI, Anthropic, or Google)

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/ai-summarizer.git
cd ai-summarizer

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

### 🔑 API Keys

On first use, you'll need to add your API keys in the app settings. We don't store these on any server - they're saved locally in your browser.

## 🛠️ Tech Stack

- React 19 with TypeScript
- Vite for lightning-fast builds
- Tailwind CSS for styling
- React Router for navigation
- IndexedDB for client-side storage

## 📖 How to Use

1. Sign up or log in
2. Upload a PDF document on the dashboard
3. Choose your AI provider and summary format
4. Generate your summary
5. View, edit and organize your summaries

## 🤝 Contributing

Contributions welcome! Just follow these steps:

1. Fork the repo
2. Create a feature branch (`git checkout -b cool-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add some cool feature'`)
5. Push to your branch (`git push origin cool-feature`)
6. Open a Pull Request

## 📝 License

MIT License - feel free to use this however you want!
