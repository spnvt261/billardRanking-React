import { Outlet } from "react-router-dom"
import Footer from "../footer/Footer"
import Header from "../header/Header"

const MainLayout = () =>{
    // console.log('Main layout');
    return(
        <div className="main-layout flex flex-col min-h-screen">
            <Header/> 
            <div className="main-content container mx-auto mt-6rem p-2 flex flex-col flex-1"
                style={{paddingTop:'env(safe-area-inset-top)'}}
            >
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}

export default MainLayout