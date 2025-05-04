import { IoIosCloseCircleOutline } from "react-icons/io"
import { useStore } from "../StoreContext"

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

const removeTag = (tagRemove, tagsList, setTagsList) => {
    const newState = tagsList.filter(tag => {
        return tag !== tagRemove
    })
    setTagsList(newState)
}

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