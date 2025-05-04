import React, { useEffect, useState } from 'react'
import './Home.css'
import JournalEntry from '../JournalEntry/JournalEntry'
import Chatbox from '../ChatBox/Chatbox'
import { useStore } from '../StoreContext'
import { BASE_URL } from '../App'

const Home = () => {
  const {store, setStore, isStoreUpdated, setIsStoreUpdated} = useStore()
  const [selectedYear, setSelectedYear] = useState("All")

  //Fetch the selected year's journals
  const fetchYears = async() => {
    try {
      const response = await fetch(`${BASE_URL}/api/get_journal_years`)
      const data = await response.json()

      if (data.minYear && data.maxYear) {
        const availableYears = Array.from(
          {length: data.maxYear - data.minYear + 1},
          (_,i) => data.maxYear - i
        )
        setStore(prev => ({...prev, yearsAvailable: ["All",...availableYears]}))
      } else {
        setStore(prev => ({...prev, yearsAvailable: ["All"]}))
      }

      console.log('hitting for /get_journal_years')
    } catch (err) {
      console.error('Failed to fetch year range:', err);
    }
  }

  //Fetch journals based on selected year or all journals by default
  const fetchJournals = async(year) => {
    const endpoint = year ==="All" ? `${BASE_URL}/api/get_all_journals` : `${BASE_URL}/api/get_journals?year=${year}`
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      }) 

      const data = await response.json()
      setStore(prev => ({...prev, displayJournalsList: data.journals}))

      if (year === "All"){
        setStore(prev => ({...prev, journalsListAll: data.journals}))
      }

      console.log('hitting for /', endpoint.split('/')[3])
    } catch(e) {
      console.error(e);
    }
  }

  const setJournalListAll = async() => {
    setStore(prev => ({...prev, displayJournalsList: store.journalsListAll}))
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  //Initial Load
  useEffect(() => {
    //While the page loads set the journals list type to display
    setStore(prev => ({...prev, journalsListType: "display"}))

    //When there is no journal list to display make a DB call else set the journal list to 'All'
    if (!store.displayJournalsList){
      fetchJournals("All")
      fetchYears()
    } else {
      setJournalListAll()
    }
  }, [])

  //Every time isStoreUpdated value changes a DB call is made
  useEffect(() => {
    if (isStoreUpdated) {
      fetchJournals("All")
      fetchYears()
      setIsStoreUpdated(false)
    }
  }, [isStoreUpdated])

  //Every time a specific year is selected a DB call is made to fetch that year's journals
  const handleYear = (year) => {
    setSelectedYear(year)
    fetchJournals(year)
  }

  if(!store) {
    return <div className='wait'>Waiting...</div>
  }

  if (!store?.yearsAvailable) {
    return <div className='wait'>Loading years...</div>
  }

  return (
    <section className='home'>
      <div className='header'>
        <h1>Journal Your Journey ✎🗒</h1>
      </div>
      <div className='journal-container'>
        <div className='journal-timeline'>
          {store.yearsAvailable.map((year) => (
            <div
              key={year}
              className={`timeline-year ${year === selectedYear ? 'selected' : ''}`}
              onClick={() => handleYear(year)}
            >
              {year}
            </div>
          ))}
        </div>
        <div className='journal-list'>
          <JournalEntry />
        </div>
        <div className='chat-box'>
          <Chatbox />
        </div>
      </div>
    </section>
  )
}

export default Home