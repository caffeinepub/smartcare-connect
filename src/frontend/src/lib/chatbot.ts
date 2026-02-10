import { healthFAQ, fallbackResponse } from '../content/healthFaq';

export function matchQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  for (const entry of healthFAQ) {
    const hasMatch = entry.keywords.some(keyword => 
      lowerQuestion.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      return entry.answer;
    }
  }
  
  return fallbackResponse;
}
