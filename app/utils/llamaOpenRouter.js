import { OpenAI } from 'openai'

// Initialize OpenAI client with OpenRouter configuration
const llamaOpenRouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    // 'HTTP-Referer': process.env.YOUR_SITE_URL,
    // 'X-Title': process.env.YOUR_SITE_NAME
  }
})

// Specify the Llama model to be used
export const LLAMA_MODEL_NAME = 'meta-llama/llama-3.1-8b-instruct:free'

// Generate system prompt for the Llama model
export function createLlamaSystemPrompt () {
  return `You are an AI assistant based on the Llama 3.1 8B Instruct model. Your task is to extract and summarize professor reviews from raw HTML content. When extracting information:

  1. Identify the professor's name, if available.
  2. Extract reviews related to the professor, including subject, review content, rating, and date.
  3. Format your output in the specified JSON format.
  4. If no reviews are found, indicate this clearly.`
}

// Enhance user prompt with extracted content for Llama
export function enhanceLlamaPromptWithContent (htmlContent) {
  return `Given the following HTML content, extract and format professor reviews. Include the professor's name, review content, subject of the class, rating (stars), and date of the review. Return ONLY the JSON object without any additional text or formatting.

HTML Content:
${htmlContent}

Provide the response in the following JSON format:
{
  "reviews": [
    {
      "professor": "Professor's Name",
      "review": "Review content...",
      "subject": "Subject of the class",
      "stars": 4.5,
      "date": "Date of the review"
    },
    // ... more reviews ...
  ]
}`
}

export default llamaOpenRouter
