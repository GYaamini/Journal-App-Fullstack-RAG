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

        const botText = res.message.content
        return botText

    } catch(e) {
        console.log(e)
        return "Could not process the request :/"
    }
}