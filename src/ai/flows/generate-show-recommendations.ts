'use server';

/**
 * @fileOverview A TV show recommendation AI agent.
 *
 * - generateShowRecommendations - A function that generates TV show recommendations.
 * - GenerateShowRecommendationsInput - The input type for the generateShowRecommendations function.
 * - GenerateShowRecommendationsOutput - The return type for the generateShowRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShowRecommendationsInputSchema = z.object({
  viewingHistory: z
    .string()
    .describe(
      'A list of TV shows the user has watched, including titles and ratings.'
    ),
  numberOfRecommendations: z
    .number()
    .default(3)
    .describe('The number of TV show recommendations to generate.'),
});

export type GenerateShowRecommendationsInput = z.infer<
  typeof GenerateShowRecommendationsInputSchema
>;

const GenerateShowRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of recommended TV show titles.'),
});

export type GenerateShowRecommendationsOutput = z.infer<
  typeof GenerateShowRecommendationsOutputSchema
>;

export async function generateShowRecommendations(
  input: GenerateShowRecommendationsInput
): Promise<GenerateShowRecommendationsOutput> {
  return generateShowRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShowRecommendationsPrompt',
  input: {schema: GenerateShowRecommendationsInputSchema},
  output: {schema: GenerateShowRecommendationsOutputSchema},
  prompt: `You are a TV show recommendation expert. Based on the user\'s viewing history and ratings, you will recommend TV shows they might enjoy.\n
  Viewing History: {{{viewingHistory}}}\n
  Please provide {{numberOfRecommendations}} recommendations.  Format your response as a list of TV show titles, with each title on a new line.`,
});

const generateShowRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateShowRecommendationsFlow',
    inputSchema: GenerateShowRecommendationsInputSchema,
    outputSchema: GenerateShowRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
