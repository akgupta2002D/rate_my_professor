import { NextResponse } from 'next/server'
import llamaOpenRouter, {
  LLAMA_MODEL_NAME,
  createLlamaSystemPrompt,
  enhanceLlamaPromptWithContent
} from '../../utils/llamaOpenRouter'

/**
 * POST handler for the URL scraping and Llama model API route
 * @param {Request} req - The incoming request object
 * @returns {NextResponse} A response containing the structured JSON summary of professor reviews
 */
export async function POST (req) {
  try {
    const { url } = await req.json() // Parse the request body to get the URL

    // Fetch the website content
    const response = await fetch(url)
    const htmlContent = await response.text()

    // Create a prompt for Llama to extract reviews and relevant information from the HTML content
    const prompt = enhanceLlamaPromptWithContent(htmlContent)

    // Send the HTML content and prompt to Llama to extract and structure the data
    const llamaResponse = await llamaOpenRouter.chat.completions.create({
      messages: [
        { role: 'system', content: createLlamaSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      model: LLAMA_MODEL_NAME
    })

    // Get the structured output from Llama's response
    const llamaSummary = llamaResponse.choices[0].message.content

    console.log(llamaSummary)
    // Return the structured JSON response directly from Llama
    return NextResponse.json({ summary: llamaSummary })
  } catch (error) {
    console.error('Error in URL Scraping API:', error)
    return NextResponse.json(
      { error: 'Failed to process the URL or generate a summary.' },
      { status: 500 }
    )
  }
}
