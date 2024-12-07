import { createSlice } from "@reduxjs/toolkit";

export const appVars = createSlice({
    name: "AppVars",
    initialState: {
        nickname: ''
    },
    reducers: {
        setNickname: (state, action) => {
            state.nickname = action.payload.nickname
        }
    }
})

export const { setNickname } = appVars.actions
export default appVars.reducer