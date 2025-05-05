import { IoIosCloseCircleOutline } from "react-icons/io"
import { processQuery } from "./ProcessQueries"


//Function to handle Auto Tag population based on journal content updation
export const handleAutoTagging = 
    async(e, contentRef, tagsList, setTagsList, contentList, setContentList, lastIndex, setLastIndex) => {
    
    const triggerKeys = ['Enter', '.', '!', '?', ';']
    const currentValue = contentRef.current.value || ''
    const tags = tagsList.join(', ')

    if (triggerKeys.includes(e.key)) {
        const contentChunk = currentValue.slice(lastIndex).trim()

        if (contentChunk && /\w/.test(contentChunk)) {
            const contentChunkClean = contentChunk.replace(/([.!?;])\1+$/, '$1')
            setContentList([...contentList, contentChunkClean])
            setLastIndex(currentValue.length)

            const contentChunkQuery = `
                Your task is to understand the given context and extract keywords by utilizing punctuation 
                marks and context awareness as guides and if the keywords you extracted are similar to the meaning 
                of any given Tags below, ignore your keyword:

                CONTEXT:
                ${contentChunkClean}

                TAGS:
                ${tags}

                INSTRUCTIONS:
                - Give keywords ONLY relevant to the provided context.
                - No explanation is needed just give the keywords.
                - The response should be comma separated keywords.
                - No sentences allowed.
                - If no suitable keyword applies to the context then return '' " 
                `

            const rawTags = await processQuery(contentChunkQuery)
            if (!rawTags.includes('Could not process the request :/')) {
                const filteredTags = rawTags.split(',').map(tag => tag.trim()).filter(tag => tag)
                filteredTags.map(tag => setTagsList(prev => [...prev, tag]))
            }
        } 
    }
}


//Function to handle populating Tags based on space/enter key event
export const handleSpaceDown = (e, tagsRef, setTagsList) => {
    if (e.code === 'Space' || e.keyCode === 32 || e.code === 'Enter' || e.keyCode === 13) {
        e.preventDefault()
        const tagsSeparated = tagsRef.current.value.trim()
        if (tagsSeparated) {
            const filtered = tagsSeparated.split(' ').filter(tag => tag !== '')[0]
            setTagsList(prev => [...prev, filtered])
            tagsRef.current.value = ''
        }
    }
}


// Handle removing of tags from Tags List
const removeTag = (tagRemove, tagsList, setTagsList) => {
    const newState = tagsList.filter(tag => {
        return tag !== tagRemove
    })
    setTagsList(newState)
}


//Function to create actionable buttons to each tag
export const getTagsButton = (tagsList, setTagsList) => {
    return tagsList.map((tag, index) => {
        return (
            <button
                className='tag-button'
                value={tag}
                type='button'
                key={`${tag}-${index}`}
                onClick={() => removeTag(tag, tagsList, setTagsList)}
            >
                {tag}
                <IoIosCloseCircleOutline size={20} />
            </button>
        )
    })
}