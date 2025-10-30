'use server';

/**
 * @fileOverview A flow to verify user identity by comparing a captured facial image with an ID.
 *
 * - verifyUserIdentity - A function that handles the user identity verification process.
 * - VerifyUserIdentityInput - The input type for the verifyUserIdentity function.
 * - VerifyUserIdentityOutput - The return type for the verifyUserIdentity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyUserIdentityInputSchema = z.object({
  livePhotoDataUri: z
    .string()
    .describe(
      "A live photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  idPhotoDataUri: z
    .string()
    .describe(
      "A photo of the user's ID, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyUserIdentityInput = z.infer<typeof VerifyUserIdentityInputSchema>;

const VerifyUserIdentityOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether the live photo matches the ID photo.'),
  confidence: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the likelihood of a match.  Higher values indicate higher confidence.'
    ),
  reason: z.string().optional().describe('Reasoning for the match result.'),
});
export type VerifyUserIdentityOutput = z.infer<typeof VerifyUserIdentityOutputSchema>;

export async function verifyUserIdentity(
  input: VerifyUserIdentityInput
): Promise<VerifyUserIdentityOutput> {
  return verifyUserIdentityFlow(input);
}

const verifyUserIdentityPrompt = ai.definePrompt({
  name: 'verifyUserIdentityPrompt',
  input: {schema: VerifyUserIdentityInputSchema},
  output: {schema: VerifyUserIdentityOutputSchema},
  prompt: `You are an expert identity verification specialist.

You will be provided with two images: a live photo of a person's face and a photo of their ID.
Your task is to determine if the two images depict the same person.

Analyze the facial features, compare the images, and provide a confidence score (0-1) indicating the likelihood of a match.
Also, provide a brief explanation for your decision.

Live Photo: {{media url=livePhotoDataUri}}
ID Photo: {{media url=idPhotoDataUri}}`,
});

const verifyUserIdentityFlow = ai.defineFlow(
  {
    name: 'verifyUserIdentityFlow',
    inputSchema: VerifyUserIdentityInputSchema,
    outputSchema: VerifyUserIdentityOutputSchema,
  },
  async input => {
    const {output} = await verifyUserIdentityPrompt(input);
    return output!;
  }
);
