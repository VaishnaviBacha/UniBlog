import {store} from "./store"
import {Provider } from "react-redux"

interface childrenProp {
    children : React.ReactNode
}

 export const Providers = ({children}:childrenProp) => {
  return (
    <Provider store={store}>
     {children}
    </Provider>
  )
}
