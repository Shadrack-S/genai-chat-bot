import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'
import Message from './Message.jsx'
import toast from 'react-hot-toast'

const ChatBox = () => {

    const { selectedChat, theme, user, axios } = useAppContext()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [prompt, setPrompt] = useState("")

    const containerRef = useRef(null)

    const onSubmit = async (e) => {
    e.preventDefault();
    try {
        if (!user) {
            toast("Login to send message");
            return;
        }
        setLoading(true);
        const promptCopy = prompt;
        setPrompt("");
        // Correct: Always return the new array from setMessages callback
        setMessages(prev => [
            ...prev,
            {
                role: 'user',
                parts: [
                    {
                        text: promptCopy
                    }
                ],
                timestamp: Date.now()
            }
        ]);
        // Make request to backend
        const { data } = await axios.post(
            '/api/message/text',
            { chatId: selectedChat._id, prompt: promptCopy },
            {
                headers: {
                    'Authorization': 'token'
                }
            }
        );
        if (data.success) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    parts: [
                        {
                            text: data.reply
                        }
                    ],
                    timestamp: Date.now()
                }
            ]);
        }
    } catch (error) {
        toast.error(error.message);
    } finally {
        setPrompt('');
        setLoading(false);
    }
};


useEffect(() => {
    if (selectedChat) {
        if (selectedChat && Array.isArray(selectedChat.message)) {
            // Ensure all messages are in the correct format
            const formattedMessages = selectedChat.message.map(msg => {
                if (msg.parts && Array.isArray(msg.parts)) {
                    return msg;
                } else if (msg.text) {
                    return {
                        ...msg,
                        parts: [ { text: msg.text } ]
                    };
                } else {
                    return {
                        ...msg,
                        parts: [ { text: '' } ]
                    };
                }
            });
            setMessages(formattedMessages);
        } else {
            setMessages([]);
        }
    }
}, [selectedChat])

useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth"
        })
    }
}, [messages])
return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30
    max-md:mt-14 2xl:pr-40'>

        {/* Chat Messages */}
        <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
            {messages.length === 0 && (
                <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
                    <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
                        className='w-full max-w-56 sm:max-w-68'
                        alt="" />
                    <p
                        className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 
                dark:text-white'
                    >What's on the agenda today?
                    </p>
                </div>
            )}

            {/* Display Chat message */}
            {Array.isArray(messages) && messages.map((message, index) => <Message key={index} message={message} />)}

            {/* Three Dots Loading Animation */}
            {
                loading && <div className='loader flex items-center gap-1.5'>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 
                        dark:bg-white animate-bounce'></div>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 
                        dark:bg-white animate-bounce'></div>
                    <div className='w-1.5 h-1.5 rounded-full bg-gray-500 
                        dark:bg-white animate-bounce'></div>
                </div>
            }

        </div>

        {/* Promopt Input Box */}
        <form
            onSubmit={onSubmit}
            className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary 
            dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center'>
            <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text" placeholder='Ask Anything'
                className='flex-1 w-full text-sm outline-none' required />
            <button disabled={loading}>
                <img src={loading ? assets.stop_icon : assets.send_icon}
                    className='w-8 cursor-pointer'
                    alt="" />
            </button>
        </form>
    </div>
)
}

export default ChatBox