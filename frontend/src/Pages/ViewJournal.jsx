import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './viewJournal.css'
import { BASE_URL } from '../App'
import { useStore } from '../StoreContext'
import { BiSolidEditAlt, BiSolidTrash } from 'react-icons/bi'

const ViewJournal = () => {
    const { store, setStore, setIsStoreUpdated } = useStore()
    const location = useLocation()
    const navigate = useNavigate()

    const { state } = location
    const journal = state

    const handleEdit = (journal) => {
        setStore(prev => ({...prev, journalEdit: journal}))
        setTimeout(() => navigate('/edit'), 0)
    }
    
    const handleDelete = async(journal) => {
        const confirmDelete = confirm("Are you sure you want to delete this entry?")

        if (confirmDelete) {
            try {
                const response = await fetch(`${BASE_URL}/api/delete_journal/${journal._id}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
            }) 

            if (response.ok){
                if (store.journalsListType === "display"){
                    setStore(prev => ({...prev, displayJournalsList: prev.displayJournalsList.filter(j => j._id !== journal._id)}))
                }
                if (store.journalsListType === "search"){
                    setStore(prev => ({...prev, searchJournalsList: prev.searchJournalsList.filter(j => j._id !== journal._id)}))
                }
                setIsStoreUpdated(true);
            }
    
            console.log('hitting for /delete_journal')
            } catch(e) {
            console.error(e);
            }
        }
    }
    

    const tags = journal.j_tags.flat().join(', ')
    const date = new Date(journal.j_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className='view-container'>
            <div className='view-row'>
                <div className='view-entry'>
                    <h3 className='journal-entry-title'>{journal.j_title}</h3>
                    <b className='journal-entry-date'>{date}</b>
                    <p className='journal-entry-tags'><b>Tags:</b> <i>{tags}</i></p>
                    <h4 className='journal-entry-body'>{journal.j_content}</h4>
                </div>
                <div className='journal-manipulate'>
                    <button onClick={() => handleEdit(journal)}>
                        <BiSolidEditAlt size={20}/>
                    </button>
                    <button onClick={() => handleDelete(journal)}>
                        <BiSolidTrash size={20}/>
                    </button>
                </div>
            </div>
        </div>
  )
}

export default ViewJournal