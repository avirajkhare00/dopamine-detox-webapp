import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client if API key is available
// Note: You'll need to set OPENAI_API_KEY in your environment variables
const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

if (apiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key is not configured', 
          markdown: generateFallbackMarkdown()
        },
        { status: 200 } // Still return 200 to allow fallback content to be used
      );
    }

    // Parse the request body
    const body = await request.json();
    const { duration, allowedActivities, forbiddenActivities, goals, includeSchedule } = body;

    // Validate required fields
    if (!duration) {
      return NextResponse.json(
        { error: 'Duration is required' },
        { status: 400 }
      );
    }

    // Construct the prompt for OpenAI
    const prompt = `
Generate a personalized dopamine detox plan for a ${duration} period.

${goals ? `The person's goals are: ${goals}` : ''}

Allowed activities: ${allowedActivities || 'None specified'}
Activities to avoid: ${forbiddenActivities || 'None specified'}
${includeSchedule ? 'Please include a daily schedule for the detox period.' : ''}

The plan should include:
1. A brief introduction to dopamine detox
2. A clear list of allowed and forbidden activities
3. Specific goals for the detox
4. ${includeSchedule ? 'A detailed daily schedule' : 'General timing recommendations'}
5. Tips for success
6. A disclaimer about this being a self-experiment, not medical advice

Format the response in Markdown.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // You can adjust the model as needed
      messages: [
        {
          role: "system",
          content: "You are an expert in digital wellness and dopamine detox planning. Create personalized, practical, and science-based detox plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    // Extract the generated markdown content
    const markdownContent = completion.choices[0].message.content;

    // Return the markdown content
    return NextResponse.json({ markdown: markdownContent });
  } catch (error) {
    console.error('Error generating detox plan:', error);
    // Return fallback markdown if OpenAI API fails
    return NextResponse.json(
      { 
        error: 'Failed to generate detox plan', 
        markdown: generateFallbackMarkdown() 
      },
      { status: 200 } // Still return 200 to allow fallback content to be used
    );
  }
}

// Fallback markdown generator function
function generateFallbackMarkdown(): string {
  return `# Your Personalized Dopamine Detox Plan

## Introduction

A dopamine detox is a period where you intentionally reduce activities that trigger dopamine spikes, allowing your brain's reward system to reset. This plan is designed to help you take a break from high-stimulation activities and reset your brain's reward system.

## Your Goals

During this detox period, focus on reconnecting with lower-stimulation activities and giving your brain a chance to recalibrate its reward system.

## Allowed Activities

- Reading physical books
- Walking in nature
- Journaling
- Meditation and mindfulness practices
- Face-to-face conversations
- Creative activities like drawing or playing an instrument
- Exercise without digital devices
- Cooking meals from scratch

## Activities to Avoid

- Social media
- Video games
- Streaming services and TV
- News websites and apps
- Online shopping
- Excessive smartphone use
- Processed foods high in sugar
- Recreational drugs and alcohol

## Suggested Schedule

### Daily Structure

- **Morning**
  - Wake up and hydrate
  - Mindful breathing or meditation (10-15 minutes)
  - Physical activity without technology
  
- **Afternoon**
  - Engage in a creative activity
  - Read a physical book
  - Take a walk outdoors
  
- **Evening**
  - Reflection on the day
  - Social interaction without screens
  - Prepare for rest with a calming routine

## Tips for Success

1. **Start small**: If this is your first detox, be gentle with yourself.
2. **Remove temptations**: Put your phone in another room or use app blockers.
3. **Prepare alternatives**: Have your allowed activities easily accessible.
4. **Track your experience**: Notice how you feel before, during, and after.
5. **Be mindful of withdrawal**: You might feel bored or anxious - this is normal.

## Disclaimer

This plan is designed as a self-experiment and is not a substitute for professional medical advice. If you're dealing with addiction or mental health issues, please consult a healthcare professional.
`;
}
