import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {  dummyUserData } from "../assets/assets";
import axios from "axios"
import toast from "react-hot-toast";


// AxiosConfig

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;


const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    const fetchUser = async () => {
        setUser(dummyUserData)
    }

    const createNewChat = async () => {

        try {
            if (!user) return toast("Login to create a new chat")
            navigate('/')
            await axios.post(
                '/api/chat/create',
                {   
                    userName: dummyUserData.name
                },
                {   
                    headers: {
                        Authorization: "token"
                    }
                }
            );
            fetchUsersChats()
        } catch (error) {
            toast.error(error.message)
        }

    }

    const fetchUsersChats = async () => {
        try {
            const { data } = await axios.get('/api/chat/get', {
                headers: {
                    Authorization: "token"
                },
                params: {
                    userName: dummyUserData.name
                }
            })
            if (data.success) {
                setChats(data.chats)
                // no chat
                if (data.chats.length === 0) {
                    await createNewChat()
                    return fetchUsersChats
                }else{
                    setSelectedChat(data.chats[0])
                }
            }else{
                toast.error(data.message

                )
            }
        } catch (error) {
            toast.error(error.message)
        }
        // setChats(dummyChats)
        // setSelectedChat(dummyChats[0])
    }

    // To set theme in local storage
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

    }, [theme])

    // For loading chat when user is logged in
    useEffect(() => {
        if (user) {
            fetchUsersChats()
        } else {
            setChats([])
            setSelectedChat(null)
        }
    }, [user])

    // To check if user is logged in or not
    useEffect(() => {
        fetchUser()
    }, [])
    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        fetchUser,
        createNewChat,
        axios

    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)
