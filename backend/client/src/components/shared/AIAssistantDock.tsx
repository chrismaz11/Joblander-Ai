import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const seededMessages: Message[] = [
  {
    id: "assistant-1",
    role: "assistant",
    content:
      "Hi Jordan — I analyzed your open tasks. Ready to finalize the NeuralBridge application packet?",
  },
];

export const AIAssistantDock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(seededMessages);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };
    const assistantReply: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content:
        "Got it. I'll draft the response and update the resume + cover letter with the latest achievements. Expect a summary in your dashboard shortly.",
    };
    setMessages((prev) => [...prev, userMessage, assistantReply]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 lg:flex">
      {isOpen && (
        <Card className="w-80 border border-primary/20 bg-surface/90 p-4 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-wide text-primary">
              <Sparkles className="h-4 w-4" />
              JobLander AI
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              Close
            </button>
          </div>
          <div className="max-h-48 space-y-3 overflow-y-auto pr-2 text-sm">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl px-3 py-2 ${
                  message.role === "assistant"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/40 text-foreground"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border/40 bg-surface/80 px-3 py-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask JobLander…"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button onClick={handleSend} className="text-primary transition hover:text-foreground">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}
      <Button
        className="gap-2 shadow-glow"
        variant="accent"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Sparkles className="h-4 w-4" />
        {isOpen ? "Hide assistant" : "Ask JobLander"}
      </Button>
    </div>
  );
};
