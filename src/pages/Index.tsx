
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import QuestionInput from "@/components/QuestionInput";
import StatisticsCard from "@/components/StatisticsCard";
import ResultsDisplay from "@/components/ResultsDisplay";
import Footer from "@/components/Footer";
import { parseQuestions } from "@/utils/questionParser";
import { matchQuestions, calculateStatistics } from "@/utils/questionMatcher";
import { Question, MatchResult, MatchStatistics } from "@/types/questions";

const Index = () => {
  const [set1Text, setSet1Text] = useState("");
  const [set2Text, setSet2Text] = useState("");
  const [questions1, setQuestions1] = useState<Question[]>([]);
  const [questions2, setQuestions2] = useState<Question[]>([]);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [statistics, setStatistics] = useState<MatchStatistics | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const { toast } = useToast();

  // Parse questions when input changes
  useEffect(() => {
    try {
      setQuestions1(parseQuestions(set1Text));
      setQuestions2(parseQuestions(set2Text));
    } catch (error) {
      console.error("Error parsing questions:", error);
    }
  }, [set1Text, set2Text]);

  const canAnalyze = questions1.length > 0 && questions2.length > 0;

  const handleAnalyze = () => {
    try {
      // Validate input
      if (questions1.length === 0) {
        toast({
          title: "المجموعة الأولى فارغة",
          description: "يرجى إدخال أسئلة في المجموعة الأولى",
          variant: "destructive",
        });
        return;
      }

      if (questions2.length === 0) {
        toast({
          title: "المجموعة الثانية (المرجعية) فارغة",
          description: "يرجى إدخال أسئلة في المجموعة الثانية (المرجعية)",
          variant: "destructive",
        });
        return;
      }

      // Match questions
      const matchResults = matchQuestions(questions1, questions2);
      setResults(matchResults);
      
      // Calculate statistics
      const stats = calculateStatistics(matchResults);
      setStatistics(stats);
      
      setHasAnalyzed(true);
      
      toast({
        title: "تم التحليل بنجاح",
        description: `تم تحليل ${questions1.length} سؤال من المجموعة الأولى و ${questions2.length} سؤال من المجموعة الثانية (المرجعية).`,
      });
    } catch (error) {
      console.error("Error analyzing questions:", error);
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل الأسئلة. يرجى التحقق من صيغة الأسئلة والمحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMatch = (matchResultIndex: number) => {
    if (results && results[matchResultIndex] && results[matchResultIndex].question2) {
      // Get the question to delete
      const questionToDelete = results[matchResultIndex].question2;
      
      // Remove the question from set 2
      const updatedQuestions2 = questions2.filter(q => q.text !== questionToDelete?.text);
      
      // Update questions2 and the set2Text
      setQuestions2(updatedQuestions2);
      
      // Regenerate the text representation for set2Text
      const updatedSet2Text = updatedQuestions2.map(q => {
        const optionsText = q.options.map(opt => 
          `${opt.text}${opt.isCorrect ? '*' : ''}`
        ).join('\n');
        return `==\n${q.text}\n\n${optionsText}\n`;
      }).join('');
      
      setSet2Text(updatedSet2Text);
      
      // Rerun analysis
      const newResults = matchQuestions(questions1, updatedQuestions2);
      setResults(newResults);
      
      // Update statistics
      const newStats = calculateStatistics(newResults);
      setStatistics(newStats);
      
      toast({
        title: "تم حذف السؤال",
        description: "تم حذف السؤال من المجموعة الثانية (المرجعية) وإعادة التحليل.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      
      <QuestionInput
        set1={set1Text}
        set2={set2Text}
        onSet1Change={setSet1Text}
        onSet2Change={setSet2Text}
        onAnalyze={handleAnalyze}
        canAnalyze={canAnalyze}
      />
      
      {hasAnalyzed && statistics && (
        <StatisticsCard statistics={statistics} />
      )}
      
      {hasAnalyzed && results && (
        <ResultsDisplay 
          results={results} 
          onDeleteMatch={handleDeleteMatch}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
