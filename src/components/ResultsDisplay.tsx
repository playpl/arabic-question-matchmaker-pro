
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchResult, MatchStatus } from "@/types/questions";
import QuestionDisplayCard from "./QuestionDisplayCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResultsDisplayProps {
  results: MatchResult[] | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const singleMatches = results.filter(r => r.matchStatus === MatchStatus.SingleMatch);
  const multipleMatches = results.filter(r => r.matchStatus === MatchStatus.MultipleMatches);
  const noMatches = results.filter(r => r.matchStatus === MatchStatus.NoMatch);

  return (
    <div className="mt-6">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="single" className="rtl">
            مطابقة واحدة ({singleMatches.length})
          </TabsTrigger>
          <TabsTrigger value="multiple" className="rtl">
            مطابقات متعددة ({multipleMatches.length})
          </TabsTrigger>
          <TabsTrigger value="none" className="rtl">
            بلا مطابقات ({noMatches.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="single">
          <ScrollArea className="h-[500px] pr-4">
            {singleMatches.length === 0 ? (
              <Alert className="rtl">
                <AlertDescription>
                  لا توجد أسئلة من المجموعة الأولى تطابق سؤالًا واحدًا بالضبط من المجموعة الثانية.
                </AlertDescription>
              </Alert>
            ) : (
              singleMatches.map((result, idx) => (
                <QuestionDisplayCard
                  key={idx}
                  question={result.question1}
                  isMatched={true}
                  matchedQuestion={result.question2}
                  matchDetails={result.matchDetails}
                />
              ))
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="multiple">
          <ScrollArea className="h-[500px] pr-4">
            {multipleMatches.length === 0 ? (
              <Alert className="rtl">
                <AlertDescription>
                  لا توجد أسئلة من المجموعة الأولى تطابق أكثر من سؤال واحد من المجموعة الثانية.
                </AlertDescription>
              </Alert>
            ) : (
              multipleMatches.map((result, idx) => (
                <QuestionDisplayCard
                  key={idx}
                  question={result.question1}
                  isMatched={true}
                  matchedQuestion={result.question2}
                  matchDetails={`يطابق ${result.matchCount} أسئلة من المجموعة الثانية`}
                />
              ))
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="none">
          <ScrollArea className="h-[500px] pr-4">
            {noMatches.length === 0 ? (
              <Alert className="rtl">
                <AlertDescription>
                  جميع الأسئلة من المجموعة الأولى لها مطابقات في المجموعة الثانية.
                </AlertDescription>
              </Alert>
            ) : (
              noMatches.map((result, idx) => (
                <QuestionDisplayCard
                  key={idx}
                  question={result.question1}
                  isMatched={false}
                />
              ))
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDisplay;
