export const processQuery = async(query) => {
    try{
        const res = await puter.ai.chat(
            query,
            {
                // model: "meta-llama/llama-3.3-70b-instruct",
                // temperature: 0.3
                // model: "claude-3-5-sonnet"
                model: "gpt-4o"
            }
        )

        return res.message.content

    } catch(firstError) {
        console.log('typing fallBack query processor...')
        try {
            const fallBackRes = await puter.ai.chat(
            query,
            {
                model: "openrouter:perplexity/sonar-reasoning"
            }
        )

        return fallBackRes.message.content

        } catch (fallBackError) {
            console.log(fallBackError)
            return "Could not process the request :/"
        }
    }
}