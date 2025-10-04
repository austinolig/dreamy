"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const responseComplete = messages[messages.length - 1]?.parts.some(
    (part) => part.type === "text" && part.state === "done"
  );

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-5" />
          Dream Analysis
        </CardTitle>
        {/* {!responseComplete && <LoaderCircle className="size-5 animate-spin" />} */}
      </CardHeader>
      <CardContent
        className={cn(
          "border bg-background mx-6 p-6 rounded-xl prose prose-sm dark:prose-invert",
          !responseComplete ? "animate-pulse" : ""
        )}
      >
        {messages.map(
          (message) =>
            message.role !== "user" && (
              <div key={message.id} className="">
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
      </CardContent>
    </Card>
  );
}
