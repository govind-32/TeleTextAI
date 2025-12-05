import type { ApiResult, Headline, PixelArtGrid, ChatMessage, AssistantResponse } from '../types';
import cacheService from './CacheService';

/**
 * LLMService - Handles OpenAI and Gemini API interactions
 * Requirements: 4.1, 7.2, 8.2
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const HEADLINES_CACHE_TTL = 10; // minutes

type LLMProvider = 'openai' | 'gemini';

function getOpenAIKey(): string {
  return import.meta.env.VITE_OPENAI_API_KEY || '';
}

function getGeminiKey(): string {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

function getActiveProvider(): LLMProvider {
  // Prefer Gemini if key is available, otherwise fall back to OpenAI
  if (getGeminiKey()) return 'gemini';
  if (getOpenAIKey()) return 'openai';
  return 'gemini'; // Default to Gemini
}

async function callGemini(
  messages: { role: string; content: string }[],
  _maxTokens: number = 1000
): Promise<string> {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  // Convert OpenAI-style messages to Gemini format
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const contents = userMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  // Prepend system instruction to first user message if exists
  if (systemMessage && contents.length > 0) {
    contents[0].parts[0].text = `${systemMessage.content}\n\n${contents[0].parts[0].text}`;
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: _maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // Strip markdown code blocks if present (Gemini often wraps JSON in ```json ... ```)
  text = text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  
  return text;
}

async function callOpenAI(
  messages: { role: string; content: string }[],
  maxTokens: number = 1000
): Promise<string> {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callLLM(
  messages: { role: string; content: string }[],
  maxTokens: number = 1000
): Promise<string> {
  const provider = getActiveProvider();
  
  if (provider === 'gemini') {
    return callGemini(messages, maxTokens);
  }
  return callOpenAI(messages, maxTokens);
}


/**
 * Summarize headlines from raw content
 */
export async function summarizeHeadlines(rawContent: string): Promise<ApiResult<Headline[]>> {
  const cacheKey = `headlines_${hashString(rawContent)}`;
  
  // Check cache first
  const cached = cacheService.get<Headline[]>(cacheKey);
  if (cached) {
    return { success: true, data: cached };
  }

  try {
    const prompt = `Summarize the following news content into exactly 6 headlines. 
For each headline, provide:
- title: A concise headline (max 40 characters)
- snippet: A brief summary (max 80 characters)
- source: The news source name

Return as JSON array: [{"title": "...", "snippet": "...", "source": "..."}]

Content:
${rawContent}`;

    const response = await callLLM([
      { role: 'system', content: 'You are a news summarizer. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ]);

    const headlines: Headline[] = JSON.parse(response);
    cacheService.set(cacheKey, headlines, HEADLINES_CACHE_TTL);
    
    return { success: true, data: headlines };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Service unavailable' 
    };
  }
}

/**
 * Generate 8x8 pixel art from a text prompt
 */
export async function generatePixelArt(prompt: string): Promise<ApiResult<PixelArtGrid>> {
  try {
    const systemPrompt = `You are a pixel art generator. Create an 8x8 pixel art grid based on the user's prompt.
Return ONLY a JSON object with a "pixels" property containing an 8x8 array of hex color strings.
Use the teletext color palette: #080808 (black), #E6D8B0 (cream), #FF6B35 (orange), #4CAF50 (green), #F44336 (red), #00BCD4 (cyan), #FFEB3B (yellow), #E91E63 (magenta), #2196F3 (blue), #FFFFFF (white).
Example format: {"pixels": [["#FF6B35", "#080808", ...], ...]}`;

    const response = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Create pixel art of: ${prompt}` },
    ], 1500);

    const parsed = JSON.parse(response);
    
    // Validate 8x8 grid structure
    if (!parsed.pixels || !Array.isArray(parsed.pixels) || parsed.pixels.length !== 8) {
      throw new Error('Invalid pixel art format');
    }
    
    for (const row of parsed.pixels) {
      if (!Array.isArray(row) || row.length !== 8) {
        throw new Error('Invalid pixel art row format');
      }
    }

    return { success: true, data: parsed as PixelArtGrid };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Service unavailable' 
    };
  }
}


/**
 * Chat with the AI assistant
 */
export async function chat(
  message: string, 
  history: ChatMessage[]
): Promise<ApiResult<AssistantResponse>> {
  try {
    const systemPrompt = `You are a helpful teletext-style assistant. Keep responses concise (under 200 characters per paragraph).
After your response, suggest 2-3 follow-up questions the user might ask.
You MUST return ONLY valid JSON in this exact format, no other text: {"message": "your response", "suggestions": ["question 1", "question 2", "question 3"]}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await callLLM(messages, 800);
    
    // Try to parse as JSON, fall back to plain text response
    let parsed: { message?: string; suggestions?: string[] };
    try {
      parsed = JSON.parse(response);
    } catch {
      // If not valid JSON, use the response as the message directly
      parsed = { message: response, suggestions: [] };
    }

    // Ensure suggestions array has 2-3 items
    const suggestions = Array.isArray(parsed.suggestions) 
      ? parsed.suggestions.slice(0, 3) 
      : [];
    
    if (suggestions.length < 2) {
      suggestions.push('Tell me more');
      if (suggestions.length < 2) {
        suggestions.push('What else can you help with?');
      }
    }

    return { 
      success: true, 
      data: {
        message: parsed.message || response,
        suggestions,
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Service unavailable' 
    };
  }
}

/**
 * Simple string hash for cache keys
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export const llmService = {
  summarizeHeadlines,
  generatePixelArt,
  chat,
};

export default llmService;
