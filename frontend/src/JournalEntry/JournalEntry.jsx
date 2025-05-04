import React from 'react'
import './JournalEntry.css'
import { BiSolidEditAlt, BiSolidTrash } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../StoreContext'
import { BASE_URL } from '../App'

const JournalEntry = () => {
    const { store } = useStore()
    let list = {}

    if (store.journalsListType === "search"){
        list = store.searchJournalsList
    } else {
        list = store.displayJournalsList
    }

    if (!Array.isArray(list) || list.length === 0) {
        if (store.journalsListType === "search") {
            if (!Array.isArray(list)) {
                return
            } else {
                return (<>
                    <div className='journal-row' key={Math.random()}>
                        <div className='journal-entry'>No journals with the given tag/tags are available</div>
                    </div>
                </>)
            }
        } else {
            return (<>
                <div className='journal-row' key={Math.random()}>
                    <div className='journal-entry'>No journals available</div>
                </div>
            </>)
        }
    }

    return (
        <>
            {list.map((journal, index) => {
                const tags = journal.j_tags.flat().join(', ')

                const date = new Date(journal.j_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })

                return (
                    <Link 
                        to='/view'
                        className='nav-to-view'
                        key={`${index}-${date}`}
                        state={journal}
                    >
                        <div className='journal-row' key={index}>
                            <div className='journal-entry'>
                                <h3 className='journal-entry-title'>{journal.j_title}</h3>
                                <b className='journal-entry-date'>{date}</b>
                                <p className='journal-entry-tags'><b>Tags:</b> <i>{tags}</i></p>
                                <h4 className='journal-entry-body'>{journal.j_content}</h4>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </>
    )
}

export default JournalEntry