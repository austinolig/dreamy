"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
import { Response } from "@/components/ai-elements/response";
import { SparklesIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";
import { DreamAnalysis } from "@prisma/client";
import { cn } from "@/lib/utils";

type DreamAnalysisProps = {
  dreamLogId: number;
  description: string;
  isNap: boolean;
  analysis?: DreamAnalysis | null;
};

export function DreamAnalysisSection({
  dreamLogId,
  description,
  isNap,
  analysis,
}: DreamAnalysisProps) {
  const { messages, sendMessage } = useChat();

  useEffect(() => {
    console.log("generating analysis for dream log:", dreamLogId);
    if (!analysis?.content) {
      const prompt = `You are a dream analyst. Analyze the following dream and provide insights about its possible meanings, symbolism, and emotional themes. Be thoughtful, empathetic, and provide actionable insights.
    
        Dream Type: ${isNap ? "Nap Dream" : "Overnight Dream"}
        Dream Description: ${description}
    
        Please provide a comprehensive analysis covering:
        1. Main themes and emotions
        2. Symbolic elements and their possible meanings
        3. Potential connections to waking life
        4. Overall interpretation and insights`;
      sendMessage({ text: prompt });
    }
  }, [isNap, description, analysis, sendMessage, dreamLogId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-5" />
          Dream Analysis
          {/* {isStreaming && (
            <span className="text-xs font-normal text-muted-foreground">
              (Generating...)
            </span>
          )} */}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map(
          (message) =>
            message.role !== "user" && (
              <div
                key={message.id}
                className={cn(
                  "whitespace-pre-wrap p-4 rounded-lg",
                  "bg-muted/80 text-muted-foreground"
                )}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Response key={`${message.id}-${i}`}>
                          {part.text}
                        </Response>
                      );
                  }
                })}
              </div>
            )
        )}
        {/* {analysis?.content ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Response>{analysis.content}</Response>
          </div>
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
