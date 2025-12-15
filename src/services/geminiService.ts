// Gemini AI Service
// This service will handle communication with Google's Gemini API

interface GeminiConfig {
  apiKey: string;
  model?: string;
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

class GeminiService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-pro';
  }

  async generateResponse(message: string, conversationHistory: GeminiMessage[] = []): Promise<string> {
    try {
      const messages: GeminiMessage[] = [
        ...conversationHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: messages,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }

  // Convert chat messages to Gemini format
  convertChatHistory(messages: { content: string; type: 'user' | 'ai' }[]): GeminiMessage[] {
    return messages
      .filter(msg => msg.type !== 'ai' || msg.content !== 'This is a simulated AI response. The Gemini API integration will be added when you provide the API key.')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
  }
}

export { GeminiService, type GeminiConfig, type GeminiMessage };