"use client";

import { useState } from "react";
import { chatWithOllama } from "@/action/chat/chatWithLama";
interface MCPMessage {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: MCPMessage[] = [
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ];

export default function Chat() {
  const [messages, setMessages] = useState<MCPMessage[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: 'user', content: message }]);
      setInput("");
      const res = await chatWithOllama([{ role: 'user', content: message }]);
      if(res.error) {
        throw new Error(String(res.error));
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: String(res.reply.message.content || '') }]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
    <main className="flex flex-col gap-[8px] row-start-2 items-center sm:items-start h-[calc(100vh-80px)] p-10">
      
      <div className="w-full max-w-3xl mx-auto flex flex-col rounded-lg overflow-y-auto gap-3">
      {
        messages.map((message, index) => (
          <>
          {message.role === "assistant" ?
          <div className="self-start border-white border-2 p-3 rounded-lg shadow-sm" key={message.role + index}>
            {message.content}
          </div>
          :
          <div className="self-end border-blue-500 border-2 text-white p-3 rounded-lg shadow-sm max-w-[80%]" key={message.role + index}>
            {message.content}
          </div>
          }
          </>
          ))
        }
      {isLoading && (
        <div className="self-start border-white border-2 p-3 rounded-lg shadow-sm">
              <p>Loading...</p>
            </div>
            )
          }
          </div>
    </main>
    <footer className="bg-black">
      <div className="fixed bottom-0 left-0 right-0 p-4 ">
        <div className="w-full max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            name="chat"
            id="chat"
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors" onClick={() => handleSendMessage(input)}>
            Send
          </button>
        </div>
      </div>
    </footer>
    </>
  )

}