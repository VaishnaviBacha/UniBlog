import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfo = {
  username: string;
  email: string;
  is_admin: number;
 
  user_id: number;
};

type AuthState = {
  userInfo: UserInfo | null;
};

const getLocalStorageItem = (key: string): UserInfo | null => {
  const item = localStorage.getItem(key);
  if (item === null) {
    return null;
  }
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    return null;
  }
};

const saveUserInfoToLocalStorage = (userInfo: UserInfo) => {
  const userInfoToSave = {
    username: userInfo.username,
    email: userInfo.email,
    is_admin:userInfo.is_admin,
    user_id:userInfo.user_id

  };
  localStorage.setItem("userInfo", JSON.stringify(userInfoToSave));
};

const initialState: AuthState = {
  userInfo: getLocalStorageItem("userInfo"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      saveUserInfoToLocalStorage(action.payload);
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
