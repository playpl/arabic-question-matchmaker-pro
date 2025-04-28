
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuestionInputProps {
  set1: string;
  set2: string;
  onSet1Change: (value: string) => void;
  onSet2Change: (value: string) => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  set1,
  set2,
  onSet1Change,
  onSet2Change,
  onAnalyze,
  canAnalyze
}) => {
  const [activeTab, setActiveTab] = useState<string>("set1");
  
  const sampleFormat = `==
سؤال

خيار
خيار*
خيار
خيار
==
سؤال آخر

خيار
خيار
خيار*
خيار`;

  const clearTextArea = (setNumber: number) => {
    if (setNumber === 1) {
      onSet1Change("");
    } else {
      onSet2Change("");
    }
  };

  const loadSample = (setNumber: number) => {
    if (setNumber === 1) {
      onSet1Change(sampleFormat);
    } else {
      onSet2Change(sampleFormat);
    }
  };
  
  return (
    <Card className="mb-6 w-full">
      <CardHeader className="bg-arabicBlue text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex justify-between items-center">
          <span>إدخال مجموعات الأسئلة</span>
          <Button 
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="bg-arabicGold hover:bg-arabicGold-dark text-black font-bold"
          >
            تحليل الأسئلة
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs 
          defaultValue="set1" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="set1">المجموعة الأولى</TabsTrigger>
            <TabsTrigger value="set2">المجموعة الثانية</TabsTrigger>
          </TabsList>
          <TabsContent value="set1">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground rtl">* يُرجى وضع علامة النجمة بجانب الإجابة الصحيحة</span>
                <div className="space-x-2 rtl:space-x-reverse">
                  <Button 
                    variant="outline" 
                    onClick={() => clearTextArea(1)} 
                    size="sm"
                  >
                    مسح
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => loadSample(1)} 
                    size="sm"
                  >
                    نموذج
                  </Button>
                </div>
              </div>
              <Textarea
                dir="rtl"
                placeholder="أدخل أسئلة المجموعة الأولى هنا..."
                className="min-h-[300px] arabic-text"
                value={set1}
                onChange={(e) => onSet1Change(e.target.value)}
              />
            </div>
          </TabsContent>
          <TabsContent value="set2">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground rtl">* يُرجى وضع علامة النجمة بجانب الإجابة الصحيحة</span>
                <div className="space-x-2 rtl:space-x-reverse">
                  <Button 
                    variant="outline" 
                    onClick={() => clearTextArea(2)} 
                    size="sm"
                  >
                    مسح
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => loadSample(2)} 
                    size="sm"
                  >
                    نموذج
                  </Button>
                </div>
              </div>
              <Textarea
                dir="rtl"
                placeholder="أدخل أسئلة المجموعة الثانية هنا..."
                className="min-h-[300px] arabic-text"
                value={set2}
                onChange={(e) => onSet2Change(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuestionInput;
