import { Outlet } from "react-router-dom"
import Header from "../header/HeaderOld"
import Footer from "../footer/Footer"
import HeaderTest from "../header/Header"

const MainLayout = () =>{
    return(
        <div className="main-layout flex flex-col min-h-screen">
            {/* <Header/> */}
            <HeaderTest/> 
            <div className="main-content container mx-auto mt-6rem p-2 flex-1">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}

export default MainLayout