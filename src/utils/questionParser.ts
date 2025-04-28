
import { Question, Option } from "../types/questions";

/**
 * Parse raw text input into an array of questions
 */
export function parseQuestions(input: string): Question[] {
  if (!input.trim()) {
    return [];
  }

  // Split by double equals separator
  const sections = input.split("==").filter(section => section.trim());
  
  return sections.map(section => {
    const lines = section.split("\n").filter(line => line.trim());
    
    if (lines.length < 2) {
      return {
        text: section.trim(),
        options: [],
        raw: section.trim()
      };
    }

    const questionText = lines[0].trim();
    const options: Option[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const isCorrect = line.endsWith("*");
      const optionText = isCorrect ? line.slice(0, -1).trim() : line.trim();

      options.push({
        text: optionText,
        isCorrect
      });
    }

    return {
      text: questionText,
      options,
      raw: section.trim()
    };
  });
}

/**
 * Serialize questions back to text format
 */
export function serializeQuestions(questions: Question[]): string {
  return questions.map(question => {
    const options = question.options.map(option => 
      `${option.text}${option.isCorrect ? "*" : ""}`
    ).join("\n");
    
    return `==\n${question.text}\n\n${options}\n`;
  }).join("");
}
