import { createSlice } from "@reduxjs/toolkit"

const userInfoSlice = createSlice({
    name: "userInfo",
    initialState: {
        value: null,
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.value = action.payload
        }
    }
})

export const  { setUserInfo } = userInfoSlice.actions
export const selectUserInfo = (state) => state.userInfo.value
export default userInfoSlice.reducer