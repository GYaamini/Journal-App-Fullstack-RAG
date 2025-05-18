import React, { useEffect, useRef, useState } from 'react'
import './EditJournal.css'
import { useStore } from '../StoreContext'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../App'
import { handleSpaceDown, getTagsButton, handleAutoTagging } from '../Utils/UtilFunctions'

const EditJournal = () => {
    const { store, setIsStoreUpdated } = useStore()
    const titleRef = useRef()
    const dateRef = useRef()
    const tagsRef = useRef()
    const contentRef = useRef()
    const [tagsList, setTagsList] = useState([])
    const navigate = useNavigate()
    const [contentList, setContentList] = useState([])
    const [lastIndex, setLastIndex] = useState(0)

    const journal = store.journalEdit

    useEffect(() => {
        if (journal){
            titleRef.current.value = journal.j_title
            dateRef.current.value = journal.j_date.substring(0, 10)
            contentRef.current.value = journal.j_content
            setTagsList(journal.j_tags.flat())
        }
    },[])

    const handleEdit = async(e) => {
        e.preventDefault();
        const confirmEdit = confirm("Save the changes?")

        if (confirmEdit) {
            try {
                const response = await fetch(`${BASE_URL}/api/update_journal/${journal._id}`, {
                method: 'PUT',
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

            if (response.ok){
                setIsStoreUpdated(true);
                navigate('/')
            }
    
            console.log('hitting for /edit_journal')
            } catch(e) {
            console.error(e);
            }
        }
    }

    return (
        <section className="journal-edit">
            <div className='header'>
                <h1>So the Journey was 𓂃🖊</h1>
            </div>
            <div className='journal-form'>
                <form onSubmit={(e) => handleEdit(e)}>
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
                            onKeyDown={(e) => handleAutoTagging(
                                e, contentRef, tagsList, setTagsList, 
                                contentList, setContentList, lastIndex, setLastIndex
                            )}
                        ></textarea>
                    </div>

                    <div className="form-submit">
                        <button type="submit">Edit</button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditJournal