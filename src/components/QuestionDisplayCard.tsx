
import React from "react";
import { Question, Option } from "@/types/questions";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface QuestionDisplayCardProps {
  question: Question;
  isMatched?: boolean;
  matchedQuestion?: Question | null;
  matchDetails?: string;
  onDeleteMatch?: () => void;
  showDeleteButton?: boolean;
}

const QuestionDisplayCard: React.FC<QuestionDisplayCardProps> = ({
  question,
  isMatched = false,
  matchedQuestion = null,
  matchDetails = "",
  onDeleteMatch,
  showDeleteButton = false
}) => {
  return (
    <Card className={cn(
      "mb-4 overflow-hidden border-2", 
      isMatched ? "border-arabicBlue/40" : "border-destructive/40"
    )}>
      <CardContent className="p-0">
        <div className="bg-arabicBlue/10 p-4 rtl">
          <h3 className="font-bold arabic-text">{question.text}</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2 rtl">
            {question.options.map((option, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-2 rounded arabic-text",
                  option.isCorrect ? "bg-arabicBlue/20 font-bold" : "bg-gray-50"
                )}
              >
                {option.text} {option.isCorrect && <span className="text-arabicBlue">✓</span>}
              </div>
            ))}
          </div>
          
          {matchedQuestion && (
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium rtl">السؤال المطابق من المجموعة الثانية:</div>
                {showDeleteButton && onDeleteMatch && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={onDeleteMatch}
                    className="rtl flex gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف المطابقة</span>
                  </Button>
                )}
              </div>
              <div className="bg-arabicBlue/5 p-3 rounded rtl">
                <div className="font-bold arabic-text mb-2">{matchedQuestion.text}</div>
                <div className="space-y-1">
                  {matchedQuestion.options.map((option, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "p-1.5 rounded text-sm arabic-text",
                        option.isCorrect ? "bg-arabicBlue/10 font-bold" : "bg-gray-50"
                      )}
                    >
                      {option.text} {option.isCorrect && <span className="text-arabicBlue">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {matchDetails && (
            <div className="mt-3 text-sm text-muted-foreground rtl">
              {matchDetails}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionDisplayCard;
