# Setup Instructions for "What's in the Fridge?"

## Prerequisites

1. **OpenAI API Key**: You'll need an OpenAI API key to use the AI recipe generation feature.
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Go to [API Keys](https://platform.openai.com/api-keys)
   - Create a new API key

## Environment Setup

1. Create a `.env.local` file in the root directory of the project
2. Add your OpenAI API key:

```env
OPENAI_API_KEY=your_actual_api_key_here
```

## Running the Application

1. Install dependencies (if not already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Add Ingredients**: Enter ingredients you have in your fridge
- **AI Recipe Generation**: Get personalized recipe suggestions based on your ingredients
- **Beautiful UI**: Modern, responsive design with a great user experience
- **Fallback Recipes**: Even if the AI service is unavailable, you'll get basic recipe suggestions

## Tech Stack

- **Frontend**: React 19, TypeScript, Next.js 15
- **Styling**: TailwindCSS
- **Icons**: Heroicons, Lucide React
- **AI**: OpenAI GPT-4 with structured output
- **Development**: Turbopack for fast development

Enjoy cooking with your AI-powered recipe assistant! 🍳👨‍🍳 