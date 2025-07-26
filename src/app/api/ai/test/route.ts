import { NextResponse } from 'next/server';
import { runOllama } from '@/lib/ollama';
import { loadPrompt, PROMPT_TEMPLATES } from '@/lib/prompts';

export async function GET() {
  try {
    // Test data
    const testProfile = {
      fullName: "John Doe",
      summary: "Software engineer with 3 years experience",
      skills: ["JavaScript", "React", "Node.js"],
      experience: [{ title: "Software Engineer", company: "Tech Corp", years: 3 }],
      education: [{ degree: "B.Tech", school: "IIT", year: 2021 }]
    };

    const testJob = {
      title: "Frontend Developer",
      company: "Startup Inc",
      description: "Looking for a React developer with JavaScript experience"
    };

    // Load and template the resume prompt
    const prompt = loadPrompt(PROMPT_TEMPLATES.RESUME_GENERATOR, {
      profile_json: testProfile,
      job: testJob
    });

    // Test Ollama with a simple prompt first
    const response = await runOllama('llama3:8b', 'Hello, this is a test. Please respond with "Hello from Ollama!"');

    return NextResponse.json({
      status: 'success',
      message: 'Ollama integration test successful',
      prompt_preview: prompt.substring(0, 200) + '...',
      ollama_response: response.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ollama test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Ollama integration test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
