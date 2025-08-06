import React, { useState } from "react";
import { Plus, X, Clock, Users, Copy, Download } from "lucide-react";
import * as emoji from "node-emoji";

// Types
interface Ingredient {
  id: string;
  name: string;
  category: string;
  emoji: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  matchPercentage: number;
  missingIngredients?: string[];
}

// API response types
interface ApiRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  servings: number;
}

interface ApiResponse {
  recipes: ApiRecipe[];
}

// Ingredient data with custom illustrations
const INGREDIENT_DATA = [
  { name: "egg", category: "Protein" },
  { name: "tomato", category: "Vegetable" },
  { name: "cheese", category: "Dairy" },
  { name: "chicken", category: "Protein" },
  { name: "onion", category: "Vegetable" },
  { name: "garlic", category: "Vegetable" },
  { name: "rice", category: "Grain" },
  { name: "pasta", category: "Grain" },
];

// Extended ingredient suggestions for autocomplete
const INGREDIENT_SUGGESTIONS = [
  "egg",
  "tomato",
  "cheese",
  "chicken",
  "onion",
  "garlic",
  "rice",
  "pasta",
  "butter",
  "milk",
  "bread",
  "potato",
  "carrot",
  "beef",
  "pork",
  "fish",
  "salmon",
  "tuna",
  "shrimp",
  "bacon",
  "ham",
  "sausage",
  "yogurt",
  "cream",
  "oil",
  "salt",
  "pepper",
  "sugar",
  "flour",
  "spinach",
  "lettuce",
  "mushroom",
  "bell pepper",
  "cucumber",
  "avocado",
  "lemon",
  "lime",
  "apple",
  "banana",
  "orange",
  "strawberry",
  "blueberry",
  "mango",
  "pineapple",
  "coconut",
  "honey",
  "vanilla",
  "cinnamon",
  "basil",
  "oregano",
  "thyme",
  "rosemary",
];

// Function to find emoji for ingredients
const findEmojiForIngredient = (ingredientName: string): string => {
  const emojiMap: { [key: string]: string } = {
    egg: "🥚",
    tomato: "🍅",
    cheese: "🧀",
    chicken: "🐔",
    onion: "🧅",
    garlic: "🧄",
    rice: "🍚",
    pasta: "🍝",
    butter: "🧈",
    milk: "🥛",
    bread: "🍞",
    potato: "🥔",
    carrot: "🥕",
    beef: "🥩",
    pork: "🥓",
    fish: "🐟",
    salmon: "🐟",
    tuna: "🐟",
    shrimp: "🦐",
    bacon: "🥓",
    ham: "🍖",
    sausage: "🌭",
    yogurt: "🥛",
    cream: "🥛",
    oil: "🫒",
    salt: "🧂",
    pepper: "🌶️",
    sugar: "🍯",
    flour: "🌾",
    spinach: "🥬",
    lettuce: "🥬",
    mushroom: "🍄",
    "bell pepper": "🫑",
    cucumber: "🥒",
    avocado: "🥑",
    lemon: "🍋",
    lime: "🍋",
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    strawberry: "🍓",
    blueberry: "🫐",
    mango: "🥭",
    pineapple: "🍍",
    coconut: "🥥",
    honey: "🍯",
    vanilla: "🌿",
    cinnamon: "🌿",
    basil: "🌿",
    oregano: "🌿",
    thyme: "🌿",
    rosemary: "🌿",
  };

  const normalizedName = ingredientName.toLowerCase().trim();

  // Check direct mapping first
  if (emojiMap[normalizedName]) {
    return emojiMap[normalizedName];
  }

  // Try to find emoji using node-emoji library
  const foundEmoji = emoji.find(normalizedName);
  if (foundEmoji) {
    return foundEmoji.emoji;
  }

  // Check if the ingredient contains any of our known ingredients
  for (const [key, value] of Object.entries(emojiMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }

  // Default fallback
  return "🥄";
};

// Custom CSS Ingredient Illustrations Component
const IngredientIllustration = ({
  type,
  size = "large",
}: {
  type: string;
  size?: "small" | "large";
}) => {
  const baseSize =
    size === "large" ? "w-10 h-10 md:w-16 md:h-16" : "w-5 h-5 md:w-8 md:h-8";

  const illustrations = {
    egg: (
      <div className={`${baseSize} relative mx-auto`}>
        <div
          className={`${baseSize} bg-gradient-to-b from-orange-50 to-orange-100 rounded-full border-4 border-orange-200 shadow-lg relative overflow-hidden`}
        >
          <div
            className={`absolute ${
              size === "large"
                ? "bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 md:w-8 md:h-8"
                : "bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 md:w-4 md:h-4"
            } bg-gradient-to-b from-orange-300 to-orange-400 rounded-full`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 md:top-3 left-1 md:left-3 w-1 h-1 md:w-3 md:h-3"
                : "top-1 left-1 w-1 h-1"
            } bg-orange-200 rounded-full opacity-70`}
          ></div>
        </div>
      </div>
    ),
    tomato: (
      <div className={`${baseSize} relative mx-auto`}>
        <div
          className={`${baseSize} bg-gradient-to-b from-red-400 to-red-500 rounded-full border-4 border-red-300 shadow-lg relative`}
        >
          <div
            className={`absolute ${
              size === "large"
                ? "-top-1 md:-top-2 left-1/2 transform -translate-x-1/2 w-3 h-2 md:w-6 md:h-4"
                : "-top-1 left-1/2 transform -translate-x-1/2 w-2 h-1 md:w-3 md:h-2"
            } bg-green-500 rounded-t-full`}
          >
            <div
              className={`absolute ${
                size === "large"
                  ? "top-0 left-0 w-1 h-1 md:h-2"
                  : "top-0 left-0 w-1 h-1"
              } bg-green-600 rounded-full`}
            ></div>
          </div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 md:top-3 left-1 md:left-3 w-1 h-1 md:w-3 md:h-3"
                : "top-1 left-1 w-1 h-1"
            } bg-red-300 rounded-full opacity-60`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-2 md:top-5 right-2 md:right-4 w-1 h-1 md:w-2 md:h-2"
                : "top-2 right-2 w-1 h-1"
            } bg-red-300 rounded-full opacity-40`}
          ></div>
        </div>
      </div>
    ),
    cheese: (
      <div className={`${baseSize} relative mx-auto`}>
        <div
          className={`${
            size === "large"
              ? "w-10 h-7 md:w-16 md:h-12"
              : "w-5 h-3 md:w-8 md:h-6"
          } bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-lg border-4 border-yellow-200 shadow-lg relative`}
        >
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 md:top-2 left-1 md:left-3 w-1 h-1 md:w-3 md:h-3"
                : "top-1 left-1 w-1 h-1"
            } bg-yellow-200 rounded-full`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-2 md:top-4 right-1 md:right-3 w-1 h-1 md:w-2 md:h-2"
                : "top-2 right-1 w-1 h-1"
            } bg-yellow-200 rounded-full`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "bottom-1 md:bottom-2 left-2 md:left-5 w-1 h-1 md:w-2 md:h-2"
                : "bottom-1 left-2 w-1 h-1"
            } bg-yellow-200 rounded-full`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-3 md:top-6 left-4 md:left-8 w-1 h-1 md:w-2 md:h-2"
                : "top-3 left-4 w-1 h-1"
            } bg-yellow-200 rounded-full`}
          ></div>
        </div>
      </div>
    ),
    chicken: (
      <div className={`${baseSize} relative mx-auto`}>
        <div
          className={`${
            size === "large"
              ? "w-7 h-10 md:w-12 md:h-16"
              : "w-3 h-5 md:w-6 md:h-8"
          } bg-gradient-to-b from-amber-200 to-amber-400 rounded-lg border-4 border-amber-200 shadow-lg relative transform rotate-12`}
        >
          <div
            className={`absolute ${
              size === "large"
                ? "bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-3 md:w-8 md:h-6"
                : "bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-1 md:w-4 md:h-3"
            } bg-amber-300 rounded-full`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 md:top-2 right-0 md:right-1 w-1 h-2 md:w-3 md:h-4"
                : "top-1 right-0 w-1 h-2"
            } bg-amber-500 rounded-lg transform rotate-45`}
          ></div>
        </div>
      </div>
    ),
    onion: (
      <div className={`${baseSize} relative mx-auto`}>
        <div
          className={`${baseSize} bg-gradient-to-b from-orange-200 to-orange-300 rounded-full border-4 border-orange-200 shadow-lg relative`}
        >
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 md:top-2 left-1 md:left-2 w-8 h-1 md:w-12 md:h-2"
                : "top-1 left-1 w-3 h-1 md:w-6 md:h-1"
            } bg-orange-400 rounded-full opacity-60`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-3 md:top-5 left-1 md:left-2 w-8 h-1 md:w-12 md:h-2"
                : "top-2 left-1 w-3 h-1 md:w-6 md:h-1"
            } bg-orange-400 rounded-full opacity-60`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-5 md:top-8 left-1 md:left-2 w-8 h-1 md:w-12 md:h-2"
                : "top-4 left-1 w-3 h-1 md:w-6 md:h-1"
            } bg-orange-400 rounded-full opacity-60`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-7 md:top-11 left-1 md:left-2 w-8 h-1 md:w-12 md:h-2"
                : "top-5 left-1 w-3 h-1 md:w-6 md:h-1"
            } bg-orange-400 rounded-full opacity-60`}
          ></div>
        </div>
      </div>
    ),
    garlic: (
      <div className={`${baseSize} relative mx-auto`}>
        <div
          className={`${
            size === "large"
              ? "w-7 h-10 md:w-12 md:h-16"
              : "w-3 h-5 md:w-6 md:h-8"
          } bg-gradient-to-b from-gray-100 to-gray-200 rounded-full border-4 border-gray-200 shadow-lg relative`}
        >
          <div
            className={`absolute ${
              size === "large"
                ? "top-0 left-1/2 transform -translate-x-1/2 w-2 h-1 md:w-4 md:h-3"
                : "top-0 left-1/2 transform -translate-x-1/2 w-2 h-1"
            } bg-green-400 rounded-full`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-2 md:top-4 left-0 md:left-1 w-1 h-5 md:w-2 md:h-8"
                : "top-2 left-0 w-1 h-2 md:h-4"
            } bg-gray-300 rounded-full opacity-50`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-2 md:top-4 right-0 md:right-1 w-1 h-5 md:w-2 md:h-8"
                : "top-2 right-0 w-1 h-2 md:h-4"
            } bg-gray-300 rounded-full opacity-50`}
          ></div>
        </div>
      </div>
    ),
    rice: (
      <div className={`${baseSize} relative mx-auto`}>
        <div
          className={`${baseSize} bg-gradient-to-b from-blue-300 to-blue-400 rounded-lg border-4 border-blue-200 shadow-lg relative`}
        >
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 md:top-2 left-1/2 transform -translate-x-1/2 w-8 h-5 md:w-12 md:h-8"
                : "top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 md:w-6 md:h-4"
            } bg-white rounded-lg border border-gray-200`}
          >
            <div
              className={`absolute ${
                size === "large"
                  ? "top-0 left-0 w-1 h-1"
                  : "top-0 left-0 w-1 h-1"
              } bg-gray-100 rounded-full`}
            ></div>
            <div
              className={`absolute ${
                size === "large"
                  ? "top-1 md:top-2 right-1 md:right-2 w-1 h-1"
                  : "top-1 right-1 w-1 h-1"
              } bg-gray-100 rounded-full`}
            ></div>
            <div
              className={`absolute ${
                size === "large"
                  ? "bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1"
                  : "bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1"
              } bg-gray-100 rounded-full`}
            ></div>
          </div>
        </div>
      </div>
    ),
    pasta: (
      <div className={`${baseSize} relative mx-auto`}>
        <div
          className={`${baseSize} bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg border-4 border-yellow-200 shadow-lg relative overflow-hidden`}
        >
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 left-1 w-1 md:w-2 h-6 md:h-12"
                : "top-1 left-1 w-1 h-3 md:h-6"
            } bg-yellow-400 rounded-full transform rotate-12`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 left-2 md:left-4 w-1 md:w-2 h-6 md:h-12"
                : "top-1 left-2 w-1 h-3 md:h-6"
            } bg-yellow-400 rounded-full transform -rotate-12`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 left-4 md:left-7 w-1 md:w-2 h-6 md:h-12"
                : "top-1 left-3 w-1 h-3 md:h-6"
            } bg-yellow-400 rounded-full transform rotate-6`}
          ></div>
          <div
            className={`absolute ${
              size === "large"
                ? "top-1 right-1 md:right-3 w-1 md:w-2 h-6 md:h-12"
                : "top-1 right-1 w-1 h-3 md:h-6"
            } bg-yellow-400 rounded-full transform -rotate-6`}
          ></div>
        </div>
      </div>
    ),
  };

  return illustrations[type as keyof typeof illustrations] || illustrations.egg;
};

// Fridge Icon Component
const FridgeIcon = () => (
  <div className="w-20 h-24 bg-orange-600 rounded-2xl shadow-2xl border-4 border-orange-500 relative overflow-hidden mx-auto">
    {/* Fridge body */}
    <div className="absolute inset-2 bg-gray-100 rounded-lg">
      {/* Shelves */}
      <div className="absolute top-2 left-1 right-1 h-1 bg-gray-300 rounded"></div>
      <div className="absolute bottom-6 left-1 right-1 h-1 bg-gray-300 rounded"></div>

      {/* Mini ingredients inside */}
      <div className="absolute top-3 left-1">
        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
      </div>
      <div className="absolute top-1 right-1">
        <div className="w-2 h-6 bg-blue-300 rounded-sm"></div>
      </div>
      <div className="absolute bottom-2 left-1">
        <div className="w-4 h-2 bg-green-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-3 right-2">
        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
      </div>
    </div>

    {/* Door handle */}
    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gray-400 rounded-full"></div>
  </div>
);

// Function to check if user has ingredient
const userHasIngredient = (
  userIngredients: string[],
  recipeIngredient: string
): boolean => {
  const userIngredientsLower = userIngredients.map((ing) => ing.toLowerCase());
  const recipeIngLower = recipeIngredient.toLowerCase();

  // Remove common words and quantities from recipe ingredient
  const cleanRecipeIng = recipeIngLower
    .replace(
      /^\d+(\.\d+)?\s*(cups?|tbsp|tablespoons?|tsp|teaspoons?|lbs?|pounds?|oz|ounces?|grams?|kg|ml|liters?|cloves?|pieces?)\s*/g,
      ""
    )
    .replace(/^\d+(\.\d+)?\s*/g, "")
    .replace(
      /\b(chopped|diced|minced|sliced|grated|fresh|dried|cooked|raw|optional|of)\b\s*/g,
      ""
    )
    .trim();

  // Check if any user ingredient matches
  return userIngredientsLower.some((userIng) => {
    // Direct match
    if (userIng === cleanRecipeIng) return true;

    // Check if recipe ingredient contains user ingredient
    if (cleanRecipeIng.includes(userIng)) return true;

    // Check if user ingredient contains recipe ingredient
    if (userIng.includes(cleanRecipeIng)) return true;

    // Check main words (longer than 3 characters)
    const recipeWords = cleanRecipeIng
      .split(" ")
      .filter((word) => word.length > 3);
    const userWords = userIng.split(" ").filter((word) => word.length > 3);

    return recipeWords.some((rWord) =>
      userWords.some((uWord) => rWord.includes(uWord) || uWord.includes(rWord))
    );
  });
};

// Function to calculate match percentage
const calculateMatchPercentage = (
  userIngredients: string[],
  recipeIngredients: string[]
): number => {
  // Filter out common pantry items from calculation
  const pantryItems = [
    "salt",
    "pepper",
    "oil",
    "water",
    "butter",
    "olive oil",
    "vegetable oil",
  ];

  const relevantIngredients = recipeIngredients.filter((ingredient) => {
    const lowerIng = ingredient.toLowerCase();
    return !pantryItems.some((pantryItem) => lowerIng.includes(pantryItem));
  });

  if (relevantIngredients.length === 0) return 100;

  const matchCount = relevantIngredients.filter((ingredient) =>
    userHasIngredient(userIngredients, ingredient)
  ).length;

  return Math.round((matchCount / relevantIngredients.length) * 100);
};

// Function to find missing ingredients
const findMissingIngredients = (
  userIngredients: string[],
  recipeIngredients: string[]
): string[] => {
  // Filter out common pantry items
  const pantryItems = [
    "salt",
    "pepper",
    "oil",
    "water",
    "butter",
    "olive oil",
    "vegetable oil",
  ];

  const missingIngredients = recipeIngredients.filter((ingredient) => {
    const lowerIng = ingredient.toLowerCase();

    // Skip pantry items
    if (pantryItems.some((pantryItem) => lowerIng.includes(pantryItem))) {
      return false;
    }

    // Check if user doesn't have this ingredient
    return !userHasIngredient(userIngredients, ingredient);
  });

  return missingIngredients.slice(0, 3); // Show max 3 missing ingredients
};

// Real API call to generate recipes using OpenAI
const generateRecipes = async (
  ingredientNames: string[]
): Promise<Recipe[]> => {
  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ingredients: ingredientNames,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate recipes");
  }

  const data: ApiResponse = await response.json();

  // Transform API response to match our Recipe interface
  return data.recipes.map((recipe: ApiRecipe, index: number) => ({
    id: (index + 1).toString(),
    title: recipe.title,
    description: recipe.description,
    cookTime: recipe.cookingTime || "30 min", // Map cookingTime to cookTime
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    matchPercentage: calculateMatchPercentage(
      ingredientNames,
      recipe.ingredients
    ),
    missingIngredients: findMissingIngredients(
      ingredientNames,
      recipe.ingredients
    ),
  }));
};

const FridgeApp: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<"ingredients" | "recipes">(
    "ingredients"
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Copy recipe to clipboard
  const copyRecipe = (recipe: Recipe) => {
    const recipeText = `
${recipe.title}

${recipe.description}

⏱️ Cooking Time: ${recipe.cookTime}
👥 Servings: ${recipe.servings}
📊 Match: ${recipe.matchPercentage}%

${
  recipe.missingIngredients && recipe.missingIngredients.length > 0
    ? `🛒 Missing ingredients: ${recipe.missingIngredients.join(", ")}\n`
    : ""
}

📝 Ingredients:
${recipe.ingredients.map((ing) => `• ${ing}`).join("\n")}

👨‍🍳 Instructions:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join("\n")}
		`.trim();

    navigator.clipboard
      .writeText(recipeText)
      .then(() => {
        // Could add a toast notification here
      })
      .catch((err) => {
        console.error("Failed to copy recipe:", err);
      });
  };

  // Download recipe as text file
  const downloadRecipe = (recipe: Recipe) => {
    const recipeText = `
${recipe.title}

${recipe.description}

⏱️ Cooking Time: ${recipe.cookTime}
👥 Servings: ${recipe.servings}
📊 Match: ${recipe.matchPercentage}%

${
  recipe.missingIngredients && recipe.missingIngredients.length > 0
    ? `🛒 Missing ingredients: ${recipe.missingIngredients.join(", ")}\n`
    : ""
}

📝 Ingredients:
${recipe.ingredients.map((ing) => `• ${ing}`).join("\n")}

👨‍🍳 Instructions:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join("\n")}
		`.trim();

    const blob = new Blob([recipeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter suggestions based on input
  const handleInputChange = (value: string) => {
    setNewIngredient(value);
    if (value.trim()) {
      const filtered = INGREDIENT_SUGGESTIONS.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase()) &&
          !ingredients.some((ing) => ing.name === suggestion.toLowerCase())
      ).slice(0, 5); // Show max 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addIngredient = (name: string) => {
    if (!name.trim()) return;

    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: name.toLowerCase(),
      category:
        INGREDIENT_DATA.find((item) => item.name === name)?.category || "Other",
      emoji: findEmojiForIngredient(name),
    };

    setIngredients((prev) => [...prev, ingredient]);
    setNewIngredient("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: string) => {
    addIngredient(suggestion);
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const findRecipes = async () => {
    if (ingredients.length === 0) return;

    setLoading(true);
    setCurrentScreen("recipes");
    setError(null);

    try {
      const ingredientNames = ingredients.map((ing) => ing.name);
      const foundRecipes = await generateRecipes(ingredientNames);

      // Sort recipes by match percentage (highest first)
      const sortedRecipes = foundRecipes.sort(
        (a, b) => b.matchPercentage - a.matchPercentage
      );
      setRecipes(sortedRecipes);
    } catch (error) {
      console.error("Error finding recipes:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate recipes"
      );
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const goBackToIngredients = () => {
    setCurrentScreen("ingredients");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-red-400 relative overflow-hidden text-orange-900">
      <div className="relative z-10 max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto px-4 py-8">
        {/* Ingredients Screen */}
        {currentScreen === "ingredients" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-6">
              <FridgeIcon />

              <div>
                <h1 className="font-poppins font-black text-2xl md:text-4xl lg:text-5xl text-orange-900 mb-4 leading-tight tracking-wide">
                  WHAT&apos;S IN YOUR
                  <br />
                  FRIDGE?
                </h1>
                <p className="font-poppins font-semibold text-orange-800 text-base md:text-lg max-w-md mx-auto leading-relaxed px-4 md:px-0">
                  Add your ingredients and discover amazing recipes you can make
                  right now!
                </p>
              </div>
            </div>

            {/* Input Section */}
            <div className="relative mx-2 sm:mx-4 md:mx-0">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-1 shadow-2xl border-2 sm:border-4 border-orange-300">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && addIngredient(newIngredient)
                    }
                    onFocus={() => handleInputChange(newIngredient)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    placeholder="Type an ingredient"
                    className="flex-1 px-2 sm:px-3 md:px-6 py-3 md:py-4 bg-transparent text-orange-900 font-poppins font-medium text-sm sm:text-base md:text-lg placeholder-orange-600 focus:outline-none rounded-l-2xl sm:rounded-l-3xl min-w-0"
                  />
                  <button
                    onClick={() => addIngredient(newIngredient)}
                    className="px-2 sm:px-3 md:px-8 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl sm:rounded-3xl font-poppins font-bold text-sm sm:text-base md:text-lg shadow-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2 shrink-0"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <span className="hidden md:inline">Add</span>
                  </button>
                </div>
              </div>

              {/* Autocomplete Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-orange-200 z-50">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors font-poppins font-medium text-orange-900 capitalize first:rounded-t-2xl last:rounded-b-2xl flex items-center gap-2"
                    >
                      <span className="text-lg">
                        {findEmojiForIngredient(suggestion)}
                      </span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ingredient Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 max-w-lg md:max-w-2xl mx-auto">
              {INGREDIENT_DATA.map((item, index) => (
                <button
                  key={index}
                  onClick={() => addIngredient(item.name)}
                  className={`bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-2 md:p-6 text-center shadow-xl hover:bg-opacity-100 transition-all transform hover:scale-105 active:scale-95 border-2 border-white border-opacity-50 aspect-square flex flex-col items-center justify-center space-y-1 md:space-y-3 ${
                    // Center the last row items in mobile view - put them in columns 2 and 3
                    index === 6
                      ? "md:col-auto col-start-2 col-end-3"
                      : index === 7
                      ? "md:col-auto col-start-3 col-end-4"
                      : ""
                  }`}
                >
                  <div className="flex-1 flex items-center justify-center">
                    <IngredientIllustration type={item.name} />
                  </div>
                  <div className="font-poppins font-semibold text-xs md:text-base text-orange-900 capitalize">
                    {item.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Ingredients */}
            {ingredients.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-poppins font-semibold text-xl text-orange-900 text-center">
                  Selected Ingredients
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="bg-white bg-opacity-95 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg flex items-center gap-3 border-2 border-orange-200"
                    >
                      <span className="text-lg">{ingredient.emoji}</span>
                      <span className="font-poppins font-semibold text-orange-900 capitalize">
                        {ingredient.name}
                      </span>
                      <button
                        onClick={() => removeIngredient(ingredient.id)}
                        className="text-orange-600 hover:text-red-600 transition-colors font-poppins font-bold text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Find Recipes Button */}
            {ingredients.length > 0 && (
              <button
                onClick={findRecipes}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-3xl font-poppins font-bold text-xl shadow-2xl hover:from-red-600 hover:to-orange-600 disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95 border-4 border-red-400"
              >
                {loading ? "Finding Recipes... 🔍" : "Find Recipes"}
              </button>
            )}
          </div>
        )}

        {/* Recipes Screen */}
        {currentScreen === "recipes" && (
          <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-3 pb-4">
              <button
                onClick={goBackToIngredients}
                className="p-3 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-lg border-2 border-orange-200 active:scale-95 transition-all"
              >
                <X className="w-6 h-6 text-orange-600" />
              </button>
              <div className="flex-1">
                <h1 className="font-poppins font-black text-2xl lg:text-3xl text-orange-900">
                  🍳 Recipe Ideas
                </h1>
                <p className="font-poppins font-semibold text-orange-800 text-sm lg:text-base">
                  Based on {ingredients.length} ingredients
                </p>
              </div>
            </div>

            {loading ? (
              <div className="bg-white bg-opacity-95 backdrop-blur-sm border-2 border-orange-200 rounded-3xl p-8 text-center shadow-2xl">
                <div className="animate-spin w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full mx-auto mb-3"></div>
                <p className="font-poppins font-medium text-orange-900">
                  Finding recipes... ✨
                </p>
              </div>
            ) : error ? (
              <div className="bg-white bg-opacity-95 backdrop-blur-sm border-2 border-orange-200 rounded-3xl p-8 text-center shadow-2xl">
                <div className="text-6xl mb-3">👨‍🍳</div>
                <p className="font-poppins font-semibold text-orange-900 text-sm mb-1">
                  {error}
                </p>
                <p className="font-poppins font-medium text-orange-800 text-sm">
                  Try adding more ingredients 😋
                </p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="bg-white bg-opacity-95 backdrop-blur-sm border-2 border-orange-200 rounded-3xl p-8 text-center shadow-2xl">
                <div className="text-6xl mb-3">👨‍🍳</div>
                <p className="font-poppins font-semibold text-orange-900 text-sm mb-1">
                  No recipes found!
                </p>
                <p className="font-poppins font-medium text-orange-800 text-sm">
                  Try adding more ingredients 😋
                </p>
              </div>
            ) : (
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-4 border-orange-200">
                <h2 className="font-poppins font-black text-3xl text-orange-900 mb-6 text-center">
                  🍳 Recipe Suggestions
                </h2>

                <div className="space-y-6">
                  {recipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-5 shadow-lg"
                    >
                      <h3 className="font-poppins font-bold text-xl text-orange-900 mb-2">
                        {recipe.title}
                      </h3>
                      <p className="font-poppins font-medium text-orange-700 text-sm mb-4">
                        {recipe.description}
                      </p>

                      <div className="flex items-center gap-4 mb-3 text-sm flex-wrap">
                        <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="font-poppins font-semibold text-orange-800">
                            {recipe.cookTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
                          <Users className="w-4 h-4 text-orange-600" />
                          <span className="font-poppins font-semibold text-orange-800">
                            {recipe.servings} servings
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm ${
                            recipe.matchPercentage >= 80
                              ? "bg-green-50"
                              : recipe.matchPercentage >= 60
                              ? "bg-yellow-50"
                              : "bg-red-50"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              recipe.matchPercentage >= 80
                                ? "bg-gradient-to-r from-green-400 to-green-500"
                                : recipe.matchPercentage >= 60
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                : "bg-gradient-to-r from-red-400 to-red-500"
                            }`}
                          ></div>
                          <span className="font-poppins font-semibold text-orange-800 text-xs">
                            {recipe.matchPercentage}% match
                          </span>
                        </div>
                      </div>

                      {/* Missing Ingredients */}
                      {recipe.missingIngredients &&
                        recipe.missingIngredients.length > 0 && (
                          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <h5 className="font-poppins font-semibold text-orange-900 text-sm mb-2 flex items-center gap-2">
                              🛒 Missing ingredients:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {recipe.missingIngredients.map(
                                (ingredient, index) => (
                                  <span
                                    key={index}
                                    className="font-poppins font-medium text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full border border-orange-200"
                                  >
                                    {ingredient}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Instructions */}
                      <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
                        <h4 className="font-poppins font-bold text-orange-900 mb-2">
                          Instructions:
                        </h4>
                        <ol className="font-poppins font-medium text-sm text-orange-800 space-y-1">
                          {recipe.instructions.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex gap-2">
                              <span className="font-poppins font-semibold text-orange-600">
                                {stepIndex + 1}.
                              </span>
                              <span className="font-poppins font-medium">
                                {step}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Copy and Download buttons - moved to bottom */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => copyRecipe(recipe)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-poppins font-medium text-sm hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Recipe
                        </button>
                        <button
                          onClick={() => downloadRecipe(recipe)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-poppins font-medium text-sm hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Copyright Footer */}
        <div className="mt-8 text-center">
          <p className="font-poppins text-sm text-orange-900">
            © 2025 Karin Goldin. Designed and developed by me.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FridgeApp;
