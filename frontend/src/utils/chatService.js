import config from '../config/config';

const SYSTEM_PROMPT = `You are a concise vegan meal assistant. Follow these rules STRICTLY:

1. ONLY suggest 100% vegan ingredients and recipes
2. MAXIMUM 2 SENTENCES per response - be extremely brief
3. ONE recipe suggestion maximum per response
4. Use only whole food plant-based ingredients
5. Never mention or reference non-vegan items
6. If unsure if something is vegan, do not suggest it

Your responses must be:
- Ultra-concise (2 sentences max)
- 100% vegan guaranteed
- Practical and actionable
- Focused on whole foods

Remember: Be extremely brief and strictly vegan!`;

export const getChatResponse = async (messages) => {
    try {
        const latestMessage = messages[messages.length - 1];
        
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: latestMessage.text })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('API Error Response:', error);
            throw new Error(error.error?.message || 'Failed to get response from AI');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Chat API Error:', error);
        throw error;
    }
}; 