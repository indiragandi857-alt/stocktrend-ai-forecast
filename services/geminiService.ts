import { GoogleGenAI } from "@google/genai";
import { TrendSearchParams, TrendResponse, StockTrend, GroundingSource, GeneratedPrompt, StockAssetType } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: apiKey });

const MODEL_ID = "gemini-3-flash-preview";

export const analyzeStockTrends = async (params: TrendSearchParams): Promise<TrendResponse> => {
  const { region, category, mediaType } = params;
  
  const systemInstruction = `
    You are an expert Stock Media Market Analyst and Creative Director. 
    Your goal is to predict future visual trends (next 3-6 months) for stock ${mediaType} creators.
    You must use the provided Google Search tool to find real-world emerging signals, news, and search interests in the '${region}' region for the '${category}' sector.
    
    Output Requirements:
    1. Identify 6 distinct emerging trends.
    2. For each trend, provide a popularity score (0-100) based on search momentum.
    3. Generate 3 specific, high-quality AI prompts per trend initially.
    4. Return the data strictly as a JSON object inside a code block.
  `;

  const userPrompt = `
    Analyze the current market and forecast future trends for Stock ${mediaType} in ${region} related to ${category}.
    
    Structure your response as a JSON object with this shape:
    {
      "trends": [
        {
          "trendName": "Name of the trend",
          "popularityScore": 85,
          "reasoning": "Explanation citing real-world events or data found via search.",
          "visualStyle": "Description of lighting, colors, and mood.",
          "prompts": [
            {
              "title": "Short title for prompt",
              "description": "The actual full prompt text for generation.",
              "technicalSettings": "Camera/Lighting settings suggestions"
            }
          ]
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract Grounding Metadata
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    // Parse JSON
    let jsonData: { trends: StockTrend[] } = { trends: [] };
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);

    if (jsonMatch) {
      try {
        const rawJson = jsonMatch[1] || jsonMatch[0];
        jsonData = JSON.parse(rawJson);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
        throw new Error("Failed to parse trend data.");
      }
    } else {
        throw new Error("No structured trend data found in response.");
    }

    const trendsWithIds = jsonData.trends.map((t, idx) => ({
      ...t,
      id: `trend-${Date.now()}-${idx}`
    }));

    return {
      trends: trendsWithIds,
      sources: sources
    };

  } catch (error) {
    console.error("Error analyzing trends:", error);
    throw error;
  }
};

export const generateTailoredPrompts = async (
  trendName: string, 
  trendContext: string, 
  assetType: StockAssetType,
  region: string
): Promise<GeneratedPrompt[]> => {
  
  const systemInstruction = `
    You are a Technical Stock Photography Prompt Engineer.
    Your task is to generate 3 distinct, high-quality generative AI prompts based on a specific Trend and a specific Asset Type.
    
    Asset Type Definitions:
    - Photography (People/Lifestyle): Realistic, human-centric, emotions, diversity.
    - Object & Still Life: Isolated objects, food, products, knolling, studio lighting. No people.
    - Vector Icon & Illustration: Flat design, 3D render icons, stickers, simple vectors, svg style.
    - Background & Texture: Abstract, patterns, blurred backgrounds for posters.
    - Conceptual & Copy Space: Compositions specifically designed to have negative space for text overlays (e.g. for greetings).
  `;

  const userPrompt = `
    Trend: "${trendName}"
    Context/Reasoning: "${trendContext}"
    Target Region: "${region}"
    Requested Asset Type: "${assetType}"

    Generate 3 professional prompts strictly for this Asset Type.
    For 'Object', focus on key items (e.g., Ketupat for Ramadan, Flag for Independence).
    For 'Copy Space', explicitly mention where the empty space should be.
    
    Return ONLY a JSON array:
    [
      {
        "title": "Short descriptive title",
        "description": "Detailed prompt text...",
        "technicalSettings": "Specific settings (e.g. 'Macro 100mm' for objects, 'Flat Vector' for icons)"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        // No search needed for prompt expansion usually, relying on model knowledge
      }
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
        const rawJson = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(rawJson);
    } else {
        throw new Error("Failed to parse generated prompts.");
    }

  } catch (error) {
    console.error("Error generating tailored prompts:", error);
    throw error;
  }
};