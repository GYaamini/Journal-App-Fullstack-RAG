import React, { useRef, useState } from 'react'
import './CreateJournal.css'
import { BASE_URL } from '../App'
import { useStore } from '../StoreContext'
import { handleSpaceDown, getTagsButton } from './UtilFunctions'

const CreateJournal = () => {
    const { setIsStoreUpdated } = useStore()
    const titleRef = useRef()
    const dateRef = useRef()
    const tagsRef = useRef()
    const contentRef = useRef()
    const [tagsList, setTagsList] = useState([])

    const handleSubmit = async(e) => {
        try {
            const response = await fetch(`${BASE_URL}/api/create_journal`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: JSON.stringify({
                journal: {
                j_title: titleRef.current.value,
                j_date: dateRef.current.value,
                j_tags: tagsList,
                j_content: contentRef.current.value,
            }})
        }) 

        setIsStoreUpdated(true)

        console.log('hitting for /create_journal')
        } catch(e) {
        console.error(e);
        }
        resetForm()
    }

    const resetForm =() => {
        titleRef.current.value = ''
        dateRef.current.value = ''
        tagsRef.current.value = ''
        contentRef.current.value = ''
        setTagsList([])
    }

    return (
        <section className="journal-create">
            <div className='header'>
                <h1>Jot Your Journey ✍︎</h1>
            </div>
            <div className='journal-form'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input 
                            id="title" name="title" type="text" 
                            placeholder="Give your entry a title..." required 
                            ref={titleRef}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input id="date" name="date" type="date" required  ref={dateRef}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <div className='tag-inputs' onClick={() => tagsRef.current?.focus()}>
                            {getTagsButton(tagsList, setTagsList)}
                            <input 
                                id="tags" name="tags" type="text" 
                                placeholder="e.g. travel, personal, goals" 
                                ref={tagsRef}
                                onKeyDown={(e) => handleSpaceDown(e, tagsRef, setTagsList)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Yo Me,</label>
                        <textarea
                            id="content"
                            name="content"
                            rows="6"
                            placeholder="Write your thoughts here..."
                            required
                            ref={contentRef}
                        ></textarea>
                    </div>

                    <div className="form-submit">
                        <button type="submit">Add Entry</button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default CreateJournal