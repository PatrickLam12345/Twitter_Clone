import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import { useDispatch } from 'react-redux'
import { setUserInfo } from '../redux/userInfoSlice'


export default function Logout() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        window.localStorage.removeItem("token");
        dispatch(setUserInfo(null))
        navigate("/");
    }, []);

    return null
}