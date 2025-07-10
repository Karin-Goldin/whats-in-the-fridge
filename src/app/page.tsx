'use client';

import { useState } from 'react';
import {
	Plus,
	X,
	Clock,
	Users,
	Star,
	ArrowLeft,
	Copy,
	Download,
} from 'lucide-react';

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
	difficulty: 'Easy' | 'Medium' | 'Hard';
	rating: number;
	ingredients: string[];
	instructions: string[];
	missingIngredients: string[];
	matchPercentage: number;
}

interface ApiRecipe {
	title: string;
	description: string;
	cookingTime: string;
	servings: number;
	ingredients: string[];
	instructions: string[];
}

const INGREDIENT_SUGGESTIONS = [
	{ name: 'eggs', emoji: '🥚', category: 'Dairy' },
	{ name: 'tomato', emoji: '🍅', category: 'Vegetables' },
	{ name: 'cheese', emoji: '🧀', category: 'Dairy' },
	{ name: 'chicken', emoji: '🍗', category: 'Meat' },
	{ name: 'onion', emoji: '🧅', category: 'Vegetables' },
	{ name: 'garlic', emoji: '🧄', category: 'Vegetables' },
	{ name: 'rice', emoji: '🍚', category: 'Grains' },
	{ name: 'pasta', emoji: '🍝', category: 'Grains' },
	{ name: 'milk', emoji: '🥛', category: 'Dairy' },
	{ name: 'bread', emoji: '🍞', category: 'Grains' },
	{ name: 'bell pepper', emoji: '🫑', category: 'Vegetables' },
	{ name: 'carrot', emoji: '🥕', category: 'Vegetables' },
];

// AI recipe generation with API integration
const generateRecipesFromIngredients = async (
	ingredients: string[]
): Promise<Recipe[]> => {
	try {
		const response = await fetch('/api/recipes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ingredients }),
		});

		if (response.ok) {
			const data = await response.json();
			// Transform API response to match our Recipe interface
			const transformedRecipes = data.recipes.map(
				(recipe: ApiRecipe, index: number) => ({
					id: index.toString(),
					title: recipe.title,
					description: recipe.description,
					cookTime: recipe.cookingTime,
					servings: recipe.servings,
					difficulty: 'Easy' as const,
					rating: 4.5,
					ingredients: recipe.ingredients,
					instructions: recipe.instructions,
					missingIngredients: [],
					matchPercentage: Math.floor(Math.random() * 30) + 70, // 70-100%
				})
			);
			return transformedRecipes;
		} else {
			console.error('API request failed');
			return [];
		}
	} catch (error) {
		console.error('Error generating recipes:', error);
		return [];
	}
};

export default function FridgeRecipeApp() {
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [newIngredient, setNewIngredient] = useState('');
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(false);
	const [currentScreen, setCurrentScreen] = useState<'ingredients' | 'recipes'>(
		'ingredients'
	);

	const addIngredient = (ingredientData?: {
		name: string;
		emoji: string;
		category: string;
	}) => {
		let name, emoji, category;

		if (ingredientData) {
			name = ingredientData.name;
			emoji = ingredientData.emoji;
			category = ingredientData.category;
		} else {
			if (!newIngredient.trim()) return;
			name = newIngredient.trim();
			emoji = '🥄'; // default emoji
			category = 'Other';
		}

		const ingredient: Ingredient = {
			id: Date.now().toString(),
			name,
			emoji,
			category,
		};

		setIngredients([...ingredients, ingredient]);
		setNewIngredient('');
	};

	const removeIngredient = (id: string) => {
		setIngredients(ingredients.filter((ing) => ing.id !== id));
	};

	const findRecipes = async () => {
		if (ingredients.length === 0) return;

		setLoading(true);
		setCurrentScreen('recipes');

		try {
			const ingredientNames = ingredients.map((ing) => ing.name);
			const foundRecipes = await generateRecipesFromIngredients(
				ingredientNames
			);
			setRecipes(foundRecipes);
		} catch (error) {
			console.error('Error finding recipes:', error);
		} finally {
			setLoading(false);
		}
	};

	const goBackToIngredients = () => {
		setCurrentScreen('ingredients');
	};

	const copyRecipe = (recipe: Recipe) => {
		const recipeText = `${recipe.title}\n\n${
			recipe.description
		}\n\nCook Time: ${recipe.cookTime} | Servings: ${
			recipe.servings
		}\n\nIngredients:\n${recipe.ingredients
			.map((ing) => `• ${ing}`)
			.join('\n')}\n\nInstructions:\n${recipe.instructions
			.map((step, index) => `${index + 1}. ${step}`)
			.join('\n')}`;

		navigator.clipboard.writeText(recipeText).then(() => {
			// Could add a toast notification here
			console.log('Recipe copied to clipboard!');
		});
	};

	const downloadRecipe = (recipe: Recipe) => {
		const recipeText = `${recipe.title}\n\n${
			recipe.description
		}\n\nCook Time: ${recipe.cookTime} | Servings: ${
			recipe.servings
		}\n\nIngredients:\n${recipe.ingredients
			.map((ing) => `• ${ing}`)
			.join('\n')}\n\nInstructions:\n${recipe.instructions
			.map((step, index) => `${index + 1}. ${step}`)
			.join('\n')}`;

		const blob = new Blob([recipeText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${recipe.title
			.replace(/[^a-z0-9]/gi, '_')
			.toLowerCase()}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${
					i < Math.floor(rating)
						? 'text-yellow-400 fill-current'
						: 'text-gray-300'
				}`}
			/>
		));
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100'>
			<div className='max-w-sm mx-auto px-4 py-6'>
				{/* Ingredients Screen */}
				{currentScreen === 'ingredients' && (
					<div className='space-y-6'>
						{/* Header */}
						<div className='text-center'>
							<div className='flex items-center justify-center gap-3 mb-4'>
								<img
									src='/Untitled.png'
									alt='Fridge with food items'
									className='w-24 h-24 object-contain'
								/>
								<div>
									<h1 className='text-4xl font-bold text-gray-800 font-[var(--font-playful)] tracking-wide'>
										What&apos;s in the
									</h1>
									<h1 className='text-4xl font-bold text-gray-800 font-[var(--font-playful)] tracking-wide'>
										Fridge?
									</h1>
								</div>
							</div>
							<p className='text-gray-700 text-center max-w-sm mx-auto font-[var(--font-playful)] text-lg font-medium'>
								Add your ingredients and discover amazing recipes you can make
								right now! ✨
							</p>
						</div>

						{/* Main Content Card */}
						<div className='bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-100'>
							<h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
								Your Ingredients
							</h2>

							{/* Add Ingredient Section */}
							<div className='mb-6'>
								<div className='flex gap-3 mb-4 justify-center'>
									<input
										type='text'
										value={newIngredient}
										onChange={(e) => setNewIngredient(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
										placeholder='Type an ingredient'
										className='w-48 px-4 py-3 border-2 border-dashed border-orange-300 rounded-2xl focus:border-orange-400 focus:outline-none text-gray-600'
									/>
									<button
										onClick={() => addIngredient()}
										className='px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-2xl font-bold shadow-lg hover:from-orange-500 hover:to-red-500 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2'
									>
										<Plus className='w-5 h-5' />
										Add
									</button>
								</div>

								{/* Quick Add Suggestions */}
								<div className='grid grid-cols-4 gap-3 mb-6'>
									{INGREDIENT_SUGGESTIONS.slice(0, 8).map(
										(suggestion, index) => (
											<button
												key={index}
												onClick={() => addIngredient(suggestion)}
												className='bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl p-3 text-center hover:from-blue-100 hover:to-purple-100 transition-all transform hover:scale-105 active:scale-95'
											>
												<div className='text-3xl mb-1'>{suggestion.emoji}</div>
												<div className='text-xs font-medium text-gray-600'>
													{suggestion.name}
												</div>
											</button>
										)
									)}
								</div>
							</div>

							{/* Ingredients Display */}
							<div className='mb-6'>
								{ingredients.length === 0 ? (
									<div className='text-center py-8 text-gray-500'>
										<div className='text-6xl mb-4'>🥪</div>
										<p>Add ingredients to get started!</p>
									</div>
								) : (
									<div className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100'>
										<div className='flex flex-wrap gap-2 justify-center'>
											{ingredients.map((ingredient) => (
												<div
													key={ingredient.id}
													className='bg-white rounded-full px-3 py-2 shadow-md border-2 border-blue-100 flex items-center gap-2 flex-shrink-0'
												>
													<span className='text-lg'>{ingredient.emoji}</span>
													<span className='font-medium text-gray-700 text-sm'>
														{ingredient.name}
													</span>
													<button
														onClick={() => removeIngredient(ingredient.id)}
														className='text-gray-400 hover:text-red-500 transition-colors'
													>
														<X className='w-4 h-4' />
													</button>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Find Recipes Button */}
							{ingredients.length > 0 && (
								<button
									onClick={findRecipes}
									disabled={loading}
									className='w-full py-4 bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-red-500 hover:to-orange-500 disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95'
								>
									{loading ? 'Finding Recipes... 🔍' : 'Find Recipes 🍳'}
								</button>
							)}
						</div>

						{/* Meal Categories */}
						<div className='text-center'>
							<h3 className='text-xl font-bold text-gray-700 mb-4'>
								Breakfast - Dinner - Dessert
							</h3>
							<div className='flex justify-center gap-6 text-4xl'>
								<span>🥞</span>
								<span>🍽️</span>
								<span>🧁</span>
							</div>
						</div>
					</div>
				)}

				{/* Recipes Screen */}
				{currentScreen === 'recipes' && (
					<div className='space-y-6'>
						{/* Header with Back Button */}
						<div className='flex items-center gap-3 pb-2'>
							<button
								onClick={goBackToIngredients}
								className='p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all'
							>
								<ArrowLeft className='w-6 h-6 text-gray-600' />
							</button>
							<div className='flex-1'>
								<h1 className='text-xl font-bold text-gray-800 font-[var(--font-playful)]'>
									🍳 Recipe Ideas
								</h1>
								<p className='text-gray-600 text-sm'>
									Based on {ingredients.length} ingredients
								</p>
							</div>
						</div>

						{loading ? (
							<div className='bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 text-center'>
								<div className='animate-spin w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full mx-auto mb-3'></div>
								<p className='text-purple-700 font-bold'>
									Finding recipes... ✨
								</p>
							</div>
						) : recipes.length === 0 ? (
							<div className='bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 text-center'>
								<div className='text-6xl mb-3'>👨‍🍳</div>
								<p className='text-orange-700 font-bold text-sm mb-1'>
									No recipes found!
								</p>
								<p className='text-orange-600 text-sm'>
									Try adding more ingredients 😋
								</p>
							</div>
						) : (
							<div className='space-y-4'>
								{recipes.map((recipe, index) => {
									const gradients = [
										'from-pink-100 to-purple-100 border-pink-200',
										'from-blue-100 to-cyan-100 border-blue-200',
										'from-green-100 to-teal-100 border-green-200',
										'from-yellow-100 to-orange-100 border-yellow-200',
										'from-purple-100 to-indigo-100 border-purple-200',
									];
									const gradient = gradients[index % gradients.length];

									return (
										<div
											key={recipe.id}
											className={`bg-gradient-to-br ${gradient} border-2 rounded-2xl overflow-hidden p-4`}
										>
											<div className='flex justify-between items-start mb-3'>
												<div className='flex-1 pr-2'>
													<h3 className='text-lg font-bold text-gray-800 mb-1'>
														{recipe.title} 🍽️
													</h3>
													<p className='text-gray-700 text-sm leading-relaxed'>
														{recipe.description}
													</p>
												</div>
												<div className='flex items-center gap-1'>
													{renderStars(recipe.rating)}
												</div>
											</div>

											<div className='flex items-center gap-2 mb-3 text-xs'>
												<div className='flex items-center gap-1 bg-white rounded-full px-2 py-1'>
													<Clock className='w-3 h-3 text-blue-500' />
													<span className='font-bold'>{recipe.cookTime}</span>
												</div>
												<div className='flex items-center gap-1 bg-white rounded-full px-2 py-1'>
													<Users className='w-3 h-3 text-green-500' />
													<span className='font-bold'>{recipe.servings}</span>
												</div>
												<div className='flex items-center gap-1 bg-white rounded-full px-2 py-1'>
													<div className='w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full'></div>
													<span className='font-bold'>
														{recipe.matchPercentage}%
													</span>
												</div>
											</div>

											{recipe.missingIngredients.length > 0 && (
												<div className='mb-3 p-2 bg-orange-100 rounded-lg'>
													<p className='text-orange-800 font-medium text-sm'>
														Need: {recipe.missingIngredients.join(', ')}
													</p>
												</div>
											)}

											{/* Recipe Instructions */}
											<div className='mt-4 p-3 bg-white rounded-lg border border-gray-200'>
												<h4 className='font-bold text-gray-800 mb-2'>
													Instructions:
												</h4>
												<ol className='text-sm text-gray-700 space-y-1'>
													{recipe.instructions.map((step, stepIndex) => (
														<li key={stepIndex} className='flex gap-2'>
															<span className='font-medium text-blue-600'>
																{stepIndex + 1}.
															</span>
															<span>{step}</span>
														</li>
													))}
												</ol>
											</div>

											{/* Copy and Download Buttons */}
											<div className='mt-4 flex gap-3'>
												<button
													onClick={() => copyRecipe(recipe)}
													className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95'
												>
													<Copy className='w-4 h-4' />
													Copy
												</button>
												<button
													onClick={() => downloadRecipe(recipe)}
													className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium shadow-md hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105 active:scale-95'
												>
													<Download className='w-4 h-4' />
													Download
												</button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
