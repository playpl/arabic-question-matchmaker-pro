
import React, { useState, useCallback } from "react";
import { Question } from "@/types/questions";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [decision, setDecision] = useState<"match" | "no_match" | null>(null);

  const handleAccept = useCallback(() => {
    setDecision("match");
    onAcceptMatch(reviewQuestion);
    toast({
      title: "تمت المطابقة",
      description: "تم اعتبار الأسئلة متطابقة."
    });
  }, [onAcceptMatch, reviewQuestion, toast]);

  const handleReject = useCallback(() => {
    setDecision("no_match");
    onRejectMatch(reviewQuestion);
    toast({
      title: "تم الرفض",
      description: "تم اعتبار الأسئلة غير متطابقة."
    });
  }, [onRejectMatch, reviewQuestion, toast]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto border-2 border-yellow-400/40 animate-fade-in">
        <CardContent className="p-0">
          {/* العنوان */}
          <div className="bg-yellow-400/20 p-4 rtl border-b border-yellow-400/30">
            <h2 className="text-xl font-bold arabic-text">مراجعة تطابق السؤال</h2>
          </div>

          {/* محتوى السؤال الأصلي */}
          <div className="p-4 space-y-4">
            <div className="bg-arabicBlue/10 p-4 rounded-lg rtl">
              <h3 className="font-bold text-lg mb-2 arabic-text text-arabicBlue">السؤال الأصلي:</h3>
              <p className="font-bold arabic-text text-lg">{question.text}</p>
              
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold arabic-text">الخيارات:</h4>
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
            </div>
            
            {/* السؤال المحتمل التطابق معه */}
            <div className="bg-yellow-400/10 p-4 rounded-lg rtl">
              <h3 className="font-bold text-lg mb-2 arabic-text text-yellow-600">السؤال المحتمل التطابق معه:</h3>
              <p className="font-bold arabic-text text-lg">{reviewQuestion.text}</p>
              
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold arabic-text">الخيارات:</h4>
                {reviewQuestion.options.map((option, idx) => (
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
            </div>

            {/* قسم القرار */}
            <div className="bg-gray-50 p-6 rounded-lg rtl">
              <h3 className="font-bold text-lg mb-4 arabic-text text-center">هل تعتبر هذان السؤالان متطابقان؟</h3>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                {/* زر القبول */}
                <Button
                  onClick={handleAccept}
                  disabled={decision === "match"}
                  className={cn(
                    "w-full sm:w-64 h-16 text-lg gap-3 transition-all duration-300",
                    decision === "match" 
                      ? "bg-green-500 border-4 border-green-700" 
                      : "bg-green-500 hover:bg-green-600 hover:scale-105"
                  )}
                >
                  <Check className="w-6 h-6" />
                  <span className="arabic-text">نعم، متطابقان</span>
                </Button>
                
                {/* زر الرفض */}
                <Button
                  onClick={handleReject}
                  disabled={decision === "no_match"}
                  className={cn(
                    "w-full sm:w-64 h-16 text-lg gap-3 transition-all duration-300",
                    decision === "no_match" 
                      ? "bg-red-500 border-4 border-red-700" 
                      : "bg-red-500 hover:bg-red-600 hover:scale-105"
                  )}
                  variant="destructive"
                >
                  <X className="w-6 h-6" />
                  <span className="arabic-text">لا، غير متطابقين</span>
                </Button>
              </div>
              
              {decision && (
                <div className="mt-4 text-center font-semibold arabic-text">
                  {decision === "match" 
                    ? "تم تأكيد التطابق. سيتم تحميل السؤال التالي..." 
                    : "تم رفض التطابق. سيتم تحميل السؤال التالي..."}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualReviewCard;
