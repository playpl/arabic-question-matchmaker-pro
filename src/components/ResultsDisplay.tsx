
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchResult, MatchStatus } from "@/types/questions";
import QuestionDisplayCard from "./QuestionDisplayCard";
import ManualReviewCard from "./ManualReviewCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ResultsDisplayProps {
  results: MatchResult[] | null;
  onDeleteMatch?: (matchResultIndex: number) => void;
  onDeleteAllMatches?: () => void;
  onAcceptReview?: (matchResultIndex: number, reviewQuestion: any) => void;
  onRejectReview?: (matchResultIndex: number, reviewQuestion: any) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  results, 
  onDeleteMatch, 
  onDeleteAllMatches,
  onAcceptReview,
  onRejectReview
}) => {
  const { toast } = useToast();

  if (!results || results.length === 0) {
    return null;
  }

  const singleMatches = results.filter(r => r.matchStatus === MatchStatus.SingleMatch);
  const multipleMatches = results.filter(r => r.matchStatus === MatchStatus.MultipleMatches);
  const noMatches = results.filter(r => r.matchStatus === MatchStatus.NoMatch);
  const needsReview = results.filter(r => r.matchStatus === MatchStatus.NeedsReview);

  const handleDeleteMatch = (resultIndex: number) => {
    if (onDeleteMatch) {
      onDeleteMatch(resultIndex);
      toast({
        title: "تم حذف المطابقة",
        description: "تم حذف السؤال المطابق من المجموعة الثانية (المرجعية).",
      });
    }
  };

  const handleDeleteAllMatches = () => {
    if (onDeleteAllMatches) {
      onDeleteAllMatches();
      toast({
        title: "تم حذف جميع المطابقات",
        description: "تم حذف جميع الأسئلة المطابقة من المجموعة الثانية (المرجعية).",
      });
    }
  };

  return (
    <div className="mt-6">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="single" className="rtl">
            مطابقة واحدة ({singleMatches.length})
          </TabsTrigger>
          <TabsTrigger value="multiple" className="rtl">
            مطابقات متعددة ({multipleMatches.length})
          </TabsTrigger>
          <TabsTrigger value="review" className="rtl">
            بحاجة لمراجعة ({needsReview.length})
          </TabsTrigger>
          <TabsTrigger value="none" className="rtl">
            بلا مطابقات ({noMatches.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="single">
          {singleMatches.length > 0 && (
            <div className="mb-4 flex justify-end">
              <Button 
                variant="destructive"
                onClick={handleDeleteAllMatches}
                className="rtl flex gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف كل المطابقات من المجموعة الثانية</span>
              </Button>
            </div>
          )}
          <ScrollArea className="h-[500px] pr-4">
            {singleMatches.length === 0 ? (
              <Alert className="rtl">
                <AlertDescription>
                  لا توجد أسئلة من المجموعة الأولى تطابق سؤالًا واحدًا بالضبط من المجموعة الثانية (المرجعية).
                </AlertDescription>
              </Alert>
            ) : (
              singleMatches.map((result, idx) => {
                // Find the index in the original results array
                const originalIndex = results.findIndex(r => 
                  r.question1.text === result.question1.text && 
                  r.matchStatus === MatchStatus.SingleMatch
                );
                
                return (
                  <QuestionDisplayCard
                    key={idx}
                    question={result.question1}
                    isMatched={true}
                    matchedQuestion={result.question2}
                    matchDetails={result.matchDetails}
                    showDeleteButton={true}
                    onDeleteMatch={() => handleDeleteMatch(originalIndex)}
                  />
                );
              })
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="multiple">
          <ScrollArea className="h-[500px] pr-4">
            {multipleMatches.length === 0 ? (
              <Alert className="rtl">
                <AlertDescription>
                  لا توجد أسئلة من المجموعة الأولى تطابق أكثر من سؤال واحد من المجموعة الثانية (المرجعية).
                </AlertDescription>
              </Alert>
            ) : (
              multipleMatches.map((result, idx) => (
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
        
        <TabsContent value="review">
          <ScrollArea className="h-[500px] pr-4">
            {needsReview.length === 0 ? (
              <Alert className="rtl">
                <AlertDescription>
                  لا توجد أسئلة بحاجة إلى مراجعة يدوية.
                </AlertDescription>
              </Alert>
            ) : (
              needsReview.map((result, idx) => {
                // Find the index in the original results array
                const originalIndex = results.findIndex(r => 
                  r.question1.text === result.question1.text && 
                  r.matchStatus === MatchStatus.NeedsReview
                );
                
                if (result.reviewQuestions && result.reviewQuestions.length > 0) {
                  return (
                    <ManualReviewCard
                      key={idx}
                      question={result.question1}
                      reviewQuestion={result.reviewQuestions[0]}
                      onAcceptMatch={(reviewQuestion) => onAcceptReview && onAcceptReview(originalIndex, reviewQuestion)}
                      onRejectMatch={(reviewQuestion) => onRejectReview && onRejectReview(originalIndex, reviewQuestion)}
                    />
                  );
                }
                return null;
              })
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="none">
          <ScrollArea className="h-[500px] pr-4">
            {noMatches.length === 0 ? (
              <Alert className="rtl">
                <AlertDescription>
                  جميع الأسئلة من المجموعة الأولى لها مطابقات في المجموعة الثانية (المرجعية).
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
