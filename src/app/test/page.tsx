"use client";

import { Response } from "@/components/ai-elements/response";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Chat() {
  const session = authClient.useSession();

  if (!session) {
    redirect("/login");
  }

  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "whitespace-pre-wrap p-4 rounded-lg",
            message.role === "user"
              ? "bg-primary/80 text-primary-foreground"
              : "bg-muted/80 text-muted-foreground"
          )}
        >
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <Response key={`${message.id}-${i}`}>{part.text}</Response>
                );
            }
          })}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
