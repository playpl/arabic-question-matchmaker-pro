
import { Question, Option, MatchResult, MatchStatus, MatchStatistics } from "../types/questions";

/**
 * Normalize Arabic text by replacing variant forms of characters with their standard form
 */
function normalizeArabicText(text: string): string {
  return text
    .replace(/[أإآ]/g, 'ا') // Normalize Alef variations
    .replace(/[ىي]/g, 'ي')  // Normalize Yaa variations
    .replace(/ؤ/g, 'و')     // Normalize Waw variations
    .replace(/ة/g, 'ه')     // Normalize Taa Marbouta to Haa
    .replace(/[ئ]/g, 'ي');  // Normalize Hamza on Yaa to Yaa
}

/**
 * Check if two questions have the same correct answer
 */
function hasSameCorrectAnswer(q1: Question, q2: Question): boolean {
  const correctOption1 = q1.options.find(opt => opt.isCorrect);
  const correctOption2 = q2.options.find(opt => opt.isCorrect);
  
  if (!correctOption1 || !correctOption2) return false;
  
  // Normalize Arabic text before comparison
  const normalizedText1 = normalizeArabicText(correctOption1.text);
  const normalizedText2 = normalizeArabicText(correctOption2.text);
  
  return normalizedText1 === normalizedText2;
}

/**
 * Check if two questions have the same question text
 */
function hasSameQuestionText(q1: Question, q2: Question): boolean {
  // Normalize Arabic text before comparison
  const normalizedText1 = normalizeArabicText(q1.text);
  const normalizedText2 = normalizeArabicText(q2.text);
  
  return normalizedText1 === normalizedText2;
}

/**
 * Handle the case where Set 1 has an extra fifth option not in Set 2
 */
function handleExtraOptionCase(q1: Question, q2: Question): Question {
  if (q1.options.length !== 5 || q2.options.length !== 4) {
    return q1;
  }

  // Copy q1 to avoid mutating the original
  const modifiedQ1 = { ...q1, options: [...q1.options] };

  // Find the extra option (all options in q2 must exist in q1, one will be left)
  const extraOptionIndex = modifiedQ1.options.findIndex(opt1 => {
    return !q2.options.some(opt2 => normalizeArabicText(opt2.text) === normalizeArabicText(opt1.text));
  });

  // If we found an extra option, remove it
  if (extraOptionIndex !== -1) {
    modifiedQ1.options.splice(extraOptionIndex, 1);
  }

  return modifiedQ1;
}

/**
 * Check if all incorrect options from q2 exist in q1
 */
function hasAllIncorrectOptions(q1: Question, q2: Question): boolean {
  // Get all incorrect options from q2
  const incorrectOptions2 = q2.options.filter(opt => !opt.isCorrect);
  
  // Check if all of q2's incorrect options exist in q1
  return incorrectOptions2.every(opt2 => {
    const normalizedOpt2Text = normalizeArabicText(opt2.text);
    return q1.options.some(opt1 => normalizeArabicText(opt1.text) === normalizedOpt2Text);
  });
}

/**
 * Compare two questions according to the specified criteria
 */
function compareQuestions(q1: Question, q2: Question): boolean {
  // Apply criteria in order
  if (!hasSameCorrectAnswer(q1, q2)) return false;
  if (!hasSameQuestionText(q1, q2)) return false;
  
  // Check if all incorrect options from q2 exist in q1
  if (!hasAllIncorrectOptions(q1, q2)) return false;
  
  return true;
}

/**
 * Match questions from set 1 against set 2 (reference set)
 * Focus is on identifying matches for questions in set 1
 */
export function matchQuestions(set1: Question[], set2: Question[]): MatchResult[] {
  const results: MatchResult[] = [];

  // For each question in set 1
  for (const q1 of set1) {
    let matchCount = 0;
    let matchedQuestions: Question[] = [];

    // Compare with each question in set 2 (reference set)
    for (const q2 of set2) {
      // Check standard comparison
      if (compareQuestions(q1, q2)) {
        matchCount++;
        matchedQuestions.push(q2);
        continue;
      }

      // Try the extra fifth option case
      const modifiedQ1 = handleExtraOptionCase(q1, q2);
      if (q1 !== modifiedQ1 && compareQuestions(modifiedQ1, q2)) {
        matchCount++;
        matchedQuestions.push(q2);
      }
    }

    // Determine match status
    let status: MatchStatus;
    if (matchCount === 0) {
      status = MatchStatus.NoMatch;
    } else if (matchCount === 1) {
      status = MatchStatus.SingleMatch;
    } else {
      status = MatchStatus.MultipleMatches;
    }

    // Add to results
    results.push({
      question1: q1,
      question2: matchedQuestions.length > 0 ? matchedQuestions[0] : null,
      matchCount,
      matchStatus: status,
      matchDetails: matchCount > 1 ? `يطابق ${matchCount} أسئلة من المجموعة الثانية (المرجعية)` : ""
    });
  }

  return results;
}

/**
 * Calculate statistics from match results
 */
export function calculateStatistics(matches: MatchResult[]): MatchStatistics {
  const singleMatches = matches.filter(m => m.matchStatus === MatchStatus.SingleMatch);
  const multipleMatches = matches.filter(m => m.matchStatus === MatchStatus.MultipleMatches);
  const noMatches = matches.filter(m => m.matchStatus === MatchStatus.NoMatch);
  
  const totalQuestions1 = matches.length;
  const totalQuestions2 = new Set(
    matches
      .filter(m => m.question2 !== null)
      .map(m => m.question2!.text)
  ).size;
  
  const matchPercentage = totalQuestions1 > 0 
    ? ((singleMatches.length + multipleMatches.length) / totalQuestions1) * 100
    : 0;

  return {
    totalQuestions1,
    totalQuestions2,
    singleMatchCount: singleMatches.length,
    multipleMatchCount: multipleMatches.length,
    noMatchCount: noMatches.length,
    matchPercentage
  };
}
