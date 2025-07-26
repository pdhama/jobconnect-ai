import { readFileSync } from 'fs';
import { join } from 'path';

export function loadPrompt(templateName: string, variables: Record<string, any>): string {
  const promptPath = join(process.cwd(), 'prompts', `${templateName}.txt`);
  let template = readFileSync(promptPath, 'utf-8');
  
  // Replace variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, 'g'), JSON.stringify(value));
  });
  
  return template;
}

export const PROMPT_TEMPLATES = {
  RESUME_GENERATOR: 'resume-generator',
  COVER_LETTER: 'cover-letter',
  OUTREACH: 'outreach'
} as const;
