
// Gemini AI API Service
import { GEMINI_API_KEY } from '@/config/env';

type GeminiRequestParams = {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string[];
};

export type TravelPlan = {
  summary: string;
  destination?: string;
  days: {
    day: number;
    date: string;
    activities: {
      time: string;
      description: string;
      location?: string;
      cost?: string;
    }[];
  }[];
  tips: string[];
  totalEstimatedCost: string;
};

// This function will use the API key from environment variables or from the user input
export const generateTravelPlan = async (
  params: GeminiRequestParams, 
  userProvidedApiKey: string
): Promise<TravelPlan> => {
  try {
    // Use environment API key or user-provided key
    const apiKey = GEMINI_API_KEY || userProvidedApiKey;
    
    if (!apiKey) {
      throw new Error("API key is required");
    }

    const prompt = generatePrompt(params);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error calling Gemini API');
    }

    const data = await response.json();
    
    // Process the response to extract the travel plan
    const travelPlan = processTravelPlanResponse(data);
    
    // Ensure destination is set in the travel plan
    if (!travelPlan.destination && params.destination) {
      travelPlan.destination = params.destination;
    }
    
    return travelPlan;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw error;
  }
};

const generatePrompt = (params: GeminiRequestParams): string => {
  return `
You are a highly experienced travel planner. Create a detailed travel itinerary from ${params.source} to ${params.destination}.

Travel Details:
- Start Date: ${params.startDate}
- End Date: ${params.endDate}
- Budget: ${params.budget}
- Number of Travelers: ${params.travelers}
- Interests: ${params.interests.join(', ')}

Please provide a day-by-day itinerary in the following JSON format. Do not include any text outside of this JSON structure:

{
  "summary": "Brief overview of the trip",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "Morning/Afternoon/Evening or specific time",
          "description": "Detailed description of the activity",
          "location": "Name of the place",
          "cost": "Estimated cost"
        }
        // More activities...
      ]
    }
    // More days...
  ],
  "tips": [
    "Practical tip 1",
    "Practical tip 2"
    // More tips...
  ],
  "totalEstimatedCost": "Total estimated cost for the entire trip"
}

Make sure that the itinerary:
1. Is realistic in terms of travel times and activities per day
2. Stays within the specified budget
3. Incorporates the traveler's interests
4. Includes local specialties and hidden gems, not just tourist attractions
5. Provides practical tips for the specific destination
`;
};

const processTravelPlanResponse = (response: any): TravelPlan => {
  try {
    const textContent = response.candidates[0].content.parts[0].text;
    
    // Find where the JSON starts and ends
    const jsonStart = textContent.indexOf('{');
    const jsonEnd = textContent.lastIndexOf('}') + 1;
    const jsonString = textContent.substring(jsonStart, jsonEnd);
    
    // Parse the JSON
    const parsedPlan = JSON.parse(jsonString);
    
    // Ensure the plan has a destination property
    if (!parsedPlan.destination) {
      // Try to extract destination from other data
      if (parsedPlan.summary && parsedPlan.summary.includes("to")) {
        const parts = parsedPlan.summary.split("to");
        if (parts.length > 1) {
          parsedPlan.destination = parts[1].trim().split(" ")[0];
        }
      }
    }
    
    return parsedPlan;
  } catch (error) {
    console.error("Error processing response:", error);
    // Return fallback data structure if parsing fails
    return {
      summary: "Failed to generate travel plan. Please try again.",
      days: [],
      tips: ["Please check your input and try again."],
      totalEstimatedCost: "Unknown",
      destination: "Unknown"
    };
  }
};
