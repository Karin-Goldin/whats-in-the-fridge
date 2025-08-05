# What's in the Fridge? 🥘

An AI-powered React application that helps you create delicious recipes based on ingredients you have at home. Reduce food waste and discover new meal ideas with intelligent recipe suggestions!

## ✨ Features

- **Smart Ingredient Management**: Add and remove ingredients with an intuitive interface
- **AI Recipe Generation**: Get personalized recipe suggestions powered by OpenAI GPT-4
- **Beautiful Modern UI**: Responsive design with TailwindCSS and smooth animations
- **Fallback Recipes**: Basic recipe suggestions even when AI service is unavailable
- **Real-time Updates**: Instant recipe generation with loading states
- **Mobile Friendly**: Fully responsive design that works on all devices

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Next.js 15
- **Styling**: TailwindCSS v4
- **Icons**: Heroicons, Lucide React
- **AI Integration**: OpenAI API with structured output using Zod
- **Development**: Turbopack for blazing-fast development
- **Type Safety**: Full TypeScript support throughout

## 🛠️ Setup & Installation

### Prerequisites

1. **Node.js** (v18 or higher)
2. **OpenAI API Key** - Get yours from [OpenAI Platform](https://platform.openai.com/api-keys)

### Installation Steps

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd whats-in-the-fridge
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # Create .env.local file
   echo "OPENAI_API_KEY=your_actual_api_key_here" > .env.local
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Add Ingredients**: Type ingredients you have in your fridge and click the "+" button
2. **Generate Recipes**: Click "Generate Recipes" to get AI-powered suggestions
3. **Browse Results**: View detailed recipes with ingredients lists and step-by-step instructions
4. **Cook & Enjoy**: Follow the instructions to create delicious meals!

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

The app uses OpenAI's GPT-4 model for recipe generation. You can modify the AI prompt and model settings in `src/app/api/recipes/route.ts`.

## 🤝 Contributing

Feel free to submit issues and enhancement requests! This project is perfect for:
- UI/UX improvements
- Additional recipe features
- Performance optimizations
- New ingredient categorization features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Cooking!** 👨‍🍳👩‍🍳

Built with ❤️ by Karin Goldin
