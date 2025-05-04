import React, { useEffect, useRef, useState } from 'react'
import { BiChat, BiChevronDown, BiRefresh, BiSend } from 'react-icons/bi'
import './ChatBox.css'
import {processQuery} from './PuterChat.js'
import { useStore } from '../StoreContext.jsx'
import { BASE_URL } from '../App.jsx'

const Chatbox = () => {
    const { store, setStore, isStoreUpdated } = useStore()
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] =useState(false)
    const messageEndRef = useRef(null)

    const toggleChat = () => setIsOpen(!isOpen)
    const closeChat = () => setIsOpen(false)

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const processJournalsData = async() => {
        try {
            const response = await fetch(`${BASE_URL}/api/chatbox/embed_journals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    documents: store.journalsListAll.map(journal => ({
                        content: `Title: ${journal.j_title}\nDate: ${formatDate(journal.j_date)}\nTags: ${journal.j_tags.join(',')}\n\nContent: ${journal.j_content}`
                    }))
                })
            })

            console.log('hitting for /chatbox/embed_journals')
        } catch (err) {
            console.error(err)
        }
    }

    const getContext = async(userMessage) => {
        try {
            const response = await fetch(`${BASE_URL}/api/chatbox/get_context`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userMessage: userMessage    
                }),
            })

            if (response.ok) {
                console.log('hitting for /chatbox/get_context')
                const data = await response.json()
                const uniqueContext = [...new Set(data)]
                const filteredContext = uniqueContext.map((entry, i) => 
                 `Journal ${i + 1}:\nTitle: ${entry.title}\nDate: ${entry.date}\nTags: ${entry.tags}\n\n${entry.content}`    
                ).join("\n\n");
                return filteredContext
            }
        } catch (err) {
            console.error(err)
        }
    }

    const sendMessage = async() => {
        if (!input.trim()) return

        const userQuery = { sender: 'user', type: 'query', text: input.trim()}
        const context = await getContext(userQuery.text)
        
        await new Promise(resolve => setTimeout(resolve, 100));

        const query = `
            The context below contains journal entries. The user will ask about 
            a specific journal. Your task is to answer the user's query by referencing 
            the context:

            CONTEXT:
            ${context}

            USER QUESTION:
            ${userQuery.text}

            INSTRUCTIONS:
            - Answer concisely using ONLY the provided context.
            - Use the journal title, date, tags, and content for reference.
            - If a specific journal answers the question, mention its Title or Date and NOT as Journal 1 or Journal 2.
            - If no context matches, reply: "The existing journals don't match what you're looking for :/"
            - if there are other reason why you can't fetch tell the reason
            `
        setInput('')
        setStore(prev => ({...prev, messageList: [...prev.messageList, userQuery]}))

        await new Promise(resolve => setTimeout(resolve, 0))

        setStore(prev => ({...prev, messageList: [...prev.messageList, { sender: 'bot', type: 'typing' }]}))

        await new Promise(resolve => setTimeout(resolve, 100));

        const botResponse = await processQuery(query)
        // const filteredBotResponse = botResponse[0]?.text?.trim()

        const bot = { sender: 'bot', type: 'response', text: botResponse}
        
        setStore(prev => {
            const chatList = [...prev.messageList]
            chatList.pop()
            return {...prev, messageList: [...chatList, bot]}
        })
    }

    const refreshMessage = () => {
        setStore(prev => ({...prev, messageList: []}))
    }

    useEffect(() => {
        if (isStoreUpdated || store.journalsListAll) {
            processJournalsData()
        }
    }, [isStoreUpdated, store.journalsListAll])

    useEffect(() => {
        if (!store.messageList) {
            setStore(prev => ({...prev, messageList: []}))
        }
    }, [])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: 'smooth'
            })
        }
    }, [store.messageList, isOpen])

    if(!store) {
        console.log("store Context is loading")
    }

    return (
        <>
            {isOpen && (
                <div className="chat-window">
                    <div className='chat-header'>
                        <span>Journey Query</span>
                        <button className='close-chat' onClick={closeChat}>
                            <BiChevronDown size={30}/>
                        </button>
                    </div>
                    <div className='chat-content'>
                        <div className='chat-area'>
                            {store.messageList.map((message, index) => {
                                if (message.type === 'typing') {
                                    return (
                                        <div key={index} className="loading-dots">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                    )
                                }
                                return (
                                    <div
                                        key={index}
                                        className={`chat-message ${message.sender === 'user' ? 'userQuery' : 'botResponse'}`}
                                    >
                                        {message.text}
                                    </div>
                                )
                            })}
                            <div ref={messageEndRef} />
                        </div>
                        <div className='input-area'>
                            <textarea
                                className="query-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        sendMessage()
                                    }
                                }}
                            ></textarea>
                            <button 
                                className='query send'
                                onClick={sendMessage}
                            >
                                <BiSend size={25}/>
                            </button>
                            <button 
                                className='query refresh'
                                onClick={refreshMessage}
                            >
                                <BiRefresh size={25}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!isOpen && (
                <button className='toggle-chat' onClick={toggleChat}>
                    <BiChat size={55}/>
                </button>
            )}
        </>
    )
}

export default Chatbox