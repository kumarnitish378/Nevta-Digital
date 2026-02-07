'use server';
/**
 * @fileOverview An AI agent that analyzes event contributions to provide a traditional summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EventInsightsInputSchema = z.object({
  eventName: z.string(),
  language: z.enum(['en', 'hi']),
  contributions: z.array(z.object({
    guestName: z.string(),
    location: z.string().optional(),
    amount: z.number(),
  })),
});
export type EventInsightsInput = z.infer<typeof EventInsightsInputSchema>;

const EventInsightsOutputSchema = z.object({
  summary: z.string().describe('A friendly and traditional summary of the event highlights.'),
  funFacts: z.array(z.string()).describe('A few bullet points about top locations or interesting patterns.'),
});
export type EventInsightsOutput = z.infer<typeof EventInsightsOutputSchema>;

export async function getEventInsights(input: EventInsightsInput): Promise<EventInsightsOutput> {
  return eventInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eventInsightsPrompt',
  input: { schema: EventInsightsInputSchema },
  output: { schema: EventInsightsOutputSchema },
  prompt: `You are a traditional Indian family accountant (Munim ji) who manages "Nevta" (social contribution) records.
You will analyze the contributions for the event "{{eventName}}" and provide insights in {{language}}.

Keep the tone warm, respectful, and traditional. 

Data:
{{#each contributions}}
- {{guestName}} from {{location}} gave ₹{{amount}}
{{/each}}

If the language is "hi", use polite Hindi.
The summary should highlight the total spirit of the community.
The funFacts should mention things like:
- Which city or location has the most representation.
- The most common contribution amount.
- A warm closing blessing.`,
});

const eventInsightsFlow = ai.defineFlow(
  {
    name: 'eventInsightsFlow',
    inputSchema: EventInsightsInputSchema,
    outputSchema: EventInsightsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);