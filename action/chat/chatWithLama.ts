const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API as string;


interface MCPMessage {
  role: "user" | "assistant" | "system";
  content: string;
}


export async function chatWithOllama(messages: MCPMessage[], model: string = "gemma3:4b" ) {
    try {
        const newMessages = [{ role: 'system', content: 'You are a helpful assistant.' },
            ...messages];
        const response = await fetch(OLLAMA_API_URL, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ messages: newMessages, model, stream: false }),
        });
        return {reply: await response.json()};
    } catch (error) {
        console.error('Ollama error:', error);
        return { error: error };
    }
}
