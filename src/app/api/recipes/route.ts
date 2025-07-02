import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Define the schema for a recipe
const RecipeSchema = z.object({
	title: z.string().describe('The name of the recipe'),
	description: z.string().describe('A brief description of the dish'),
	ingredients: z
		.array(z.string())
		.describe('List of ingredients with quantities'),
	instructions: z
		.array(z.string())
		.describe('Step-by-step cooking instructions'),
	cookingTime: z.string().describe('Total cooking time (e.g., "30 minutes")'),
	servings: z.number().describe('Number of servings this recipe makes'),
});

const RecipesResponseSchema = z.object({
	recipes: z.array(RecipeSchema).describe('Array of 2-3 recipe suggestions'),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { ingredients } = body;

		if (
			!ingredients ||
			!Array.isArray(ingredients) ||
			ingredients.length === 0
		) {
			return NextResponse.json(
				{ error: 'Please provide at least one ingredient' },
				{ status: 400 }
			);
		}

		// Generate recipes using AI
		const { object } = await generateObject({
			model: openai('gpt-4o'),
			schema: RecipesResponseSchema,
			prompt: `Given these ingredients: ${ingredients.join(', ')}, 
               generate 2-3 delicious and practical recipes that can be made using some or all of these ingredients.
               
               Guidelines:
               - Recipes should be realistic and achievable for home cooks
               - Include common pantry staples that most people have (salt, pepper, oil, etc.)
               - If additional ingredients are needed, mention them in the ingredients list
               - Provide clear, step-by-step instructions
               - Focus on recipes that make good use of the provided ingredients
               - Include cooking times and serving sizes
               - Make the recipes diverse (different cuisines or cooking methods)
               
               Format each recipe with:
               - A catchy, descriptive title
               - A brief description explaining what makes this dish special
               - Complete ingredients list with quantities
               - Clear step-by-step instructions
               - Realistic cooking time
               - Number of servings`,
		});

		return NextResponse.json(object);
	} catch (error) {
		console.error('Error generating recipes:', error);

		// Return error instead of fallback recipes
		return NextResponse.json(
			{
				error:
					'Unable to generate recipes at the moment. Please try again later.',
				details: 'AI service is currently unavailable',
			},
			{ status: 503 }
		);
	}
}
