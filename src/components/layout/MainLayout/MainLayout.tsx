import { Outlet } from "react-router-dom"
import Header from "../header/Header"
import Footer from "../footer/Footer"

const MainLayout = () =>{
    return(
        <div className="main-layout flex flex-col min-h-screen">
            <Header/>
            <div className="main-content container mx-auto mt-6rem p-2 flex-1">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}

export default MainLayout