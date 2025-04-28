
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MatchStatistics } from "@/types/questions";

interface StatisticsCardProps {
  statistics: MatchStatistics | null;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics }) => {
  if (!statistics) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="bg-arabicBlue text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold rtl">إحصائيات المطابقة</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between rtl">
              <span className="text-muted-foreground">إجمالي الأسئلة في المجموعة ١:</span>
              <span className="font-bold">{statistics.totalQuestions1}</span>
            </div>
            <div className="flex justify-between rtl">
              <span className="text-muted-foreground">إجمالي الأسئلة في المجموعة ٢ (المرجعية):</span>
              <span className="font-bold">{statistics.totalQuestions2}</span>
            </div>
            <div className="flex justify-between rtl">
              <span className="text-muted-foreground">نسبة المطابقة:</span>
              <span className="font-bold">{statistics.matchPercentage.toFixed(2)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between rtl mb-1">
                <span className="text-muted-foreground">أسئلة بمطابقة واحدة:</span>
                <span className="font-bold">{statistics.singleMatchCount}</span>
              </div>
              <Progress value={statistics.totalQuestions1 > 0 ? (statistics.singleMatchCount / statistics.totalQuestions1) * 100 : 0} className="h-2 bg-secondary" />
            </div>
            <div>
              <div className="flex justify-between rtl mb-1">
                <span className="text-muted-foreground">أسئلة بمطابقات متعددة:</span>
                <span className="font-bold">{statistics.multipleMatchCount}</span>
              </div>
              <Progress value={statistics.totalQuestions1 > 0 ? (statistics.multipleMatchCount / statistics.totalQuestions1) * 100 : 0} className="h-2 bg-secondary" />
            </div>
            <div>
              <div className="flex justify-between rtl mb-1">
                <span className="text-muted-foreground">أسئلة بلا مطابقات:</span>
                <span className="font-bold">{statistics.noMatchCount}</span>
              </div>
              <Progress value={statistics.totalQuestions1 > 0 ? (statistics.noMatchCount / statistics.totalQuestions1) * 100 : 0} className="h-2 bg-secondary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
