import { createSlice} from "@reduxjs/toolkit";

interface RegisterModalProps {
  isRegisterModalOpen: boolean;
}

const initialState: RegisterModalProps = {
  isRegisterModalOpen: false,
};

const registerModalSlice = createSlice({
  name: "toggleRegisterModal",
  initialState,
  reducers: {
    openRegisterModal: (state) => {
      state.isRegisterModalOpen = true;
    },
    closeRegisterModal: (state) => {
      state.isRegisterModalOpen = false;
    },
  },
});

export const { openRegisterModal, closeRegisterModal } = registerModalSlice.actions;
export default registerModalSlice.reducer;