
import React, { useState } from "react";
import { Question } from "@/types/questions";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ManualReviewCardProps {
  question: Question;
  reviewQuestion: Question;
  onAcceptMatch: (reviewQuestion: Question) => void;
  onRejectMatch: (reviewQuestion: Question) => void;
}

const ManualReviewCard: React.FC<ManualReviewCardProps> = ({
  question,
  reviewQuestion,
  onAcceptMatch,
  onRejectMatch
}) => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAccept = () => {
    onAcceptMatch(reviewQuestion);
    toast({
      title: "تمت المطابقة",
      description: "تم اعتبار الأسئلة متطابقة."
    });
  };

  const handleReject = () => {
    onRejectMatch(reviewQuestion);
    toast({
      title: "تم الرفض",
      description: "تم اعتبار الأسئلة غير متطابقة."
    });
  };

  return (
    <Card className="mb-4 overflow-hidden border-2 border-yellow-400/40">
      <CardContent className="p-0">
        <div className="bg-yellow-400/10 p-4 rtl">
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
          
          <div className="mt-6 border-t pt-4">
            <div className="mb-2">
              <div className="text-sm font-medium rtl">
                السؤال المحتمل من المجموعة الثانية (تطابق في الإجابة الصحيحة والخيارات، ولكن نص السؤال مختلف):
              </div>
            </div>
            <div className="bg-yellow-400/5 p-3 rounded rtl">
              <div className="font-bold arabic-text mb-2">{reviewQuestion.text}</div>
              <div className="space-y-1">
                {reviewQuestion.options.map((option, idx) => (
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

          <div className="mt-4 border-t pt-4">
            <div className="text-sm font-medium mb-2 rtl">هل تعتبر هذان السؤالان متطابقان؟</div>
            <RadioGroup
              className="rtl flex space-x-4"
              value={selectedOption || ""}
              onValueChange={setSelectedOption}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="match" id="match" />
                <label htmlFor="match" className="cursor-pointer">نعم، متطابقان</label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="no_match" id="no_match" />
                <label htmlFor="no_match" className="cursor-pointer">لا، غير متطابقين</label>
              </div>
            </RadioGroup>

            <div className="flex justify-end mt-4 space-x-2 rtl space-x-reverse">
              <Button
                variant="outline"
                onClick={handleReject}
                className="rtl flex gap-2"
                disabled={!selectedOption}
              >
                <X className="w-4 h-4" />
                <span>غير متطابقين</span>
              </Button>
              <Button
                onClick={handleAccept}
                className="rtl flex gap-2"
                disabled={!selectedOption}
              >
                <Check className="w-4 h-4" />
                <span>متطابقان</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualReviewCard;
