import React, { useEffect, useRef, useState } from 'react'
import JournalEntry from '../JournalEntry/JournalEntry'
import { handleSpaceDown, getTagsButton } from '../Utils/UtilFunctions'
import { useStore } from '../StoreContext'
import './SearchJournal.css'
import { BASE_URL } from '../App'
import { BiRefresh } from 'react-icons/bi'
import Chatbox from '../ChatBox/Chatbox'

const SearchJournal = () => {
    const { store, setStore } = useStore()
    const tagsRef = useRef()
    const [tagsList, setTagsList] = useState([])

    const handleSearch= async(e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${BASE_URL}/api/search_journal`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: JSON.stringify({
                journal: {
                j_tags: tagsList,
            }})
        }) 

        const data = await response.json()
        setStore(prev => ({...prev, searchJournalsList: data.journals}))
        setStore(prev => ({...prev, searchJournalTags: tagsList}))

        console.log('hitting for /search_journal')
        } catch(e) {
        console.error(e);
        }
    }

    //While the page loads set the journals list type to search
    useEffect(() => {
        setStore(prev => ({...prev, journalsListType: "search"}))
        if (!store.searchJournalTags) {
            setStore(prev => ({...prev, searchJournalTags: []}))
        } else {
            setTagsList(store.searchJournalTags)
        }
    }, [])

    const refreshSearch = () => {
        setStore(prev => ({...prev, searchJournalsList: {}}))
        setStore(prev => ({...prev, searchJournalTags: []}))
        tagsRef.current.value = ''
        setTagsList([])
    }

    return (
        <section className='search'>
            <div className='search-page'>
                <div className='header'>
                    <h1>Search your Journey with tags 🖇️</h1>
                </div>
                <div className='search-container'>
                    <form onSubmit={(e) => handleSearch(e)}>
                        <div className="form-group">
                            <div className='tag-inputs' onClick={() => tagsRef.current?.focus()}>
                                {getTagsButton(tagsList, setTagsList)}
                                <input 
                                    id="tags" name="tags" type="text" 
                                    placeholder="e.g. travel, personal, goals" 
                                    ref={tagsRef}
                                    onKeyDown={(e) => handleSpaceDown(e, tagsRef, setTagsList)}
                                />
                            </div>
                            <button className="form-submit" type="submit">Search</button>
                        </div>
                    </form>
                    <button 
                        className='search-refresh'
                        onClick={refreshSearch}
                    >
                        <BiRefresh size={25}/>
                    </button>
                </div>
                <div className='journal-container'>
                    <div className='journalList-container'>
                        <JournalEntry />
                    </div>
                    <div className='chat-box'>
                        <Chatbox />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchJournal