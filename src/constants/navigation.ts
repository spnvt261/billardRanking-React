import { GiTrophyCup } from "react-icons/gi"
import { PiRanking } from "react-icons/pi"
import { RiDashboard3Line, RiHistoryFill } from "react-icons/ri"
import { RxDashboard } from "react-icons/rx"

const PATHS = {
    OVERALL: '/overall',
    RANKING: '/rankings',
    TOURNAMENTS:'/tournaments',
    MATCHS:'/matchs'
} 
interface NavLink{
    label: string,
    path:string,
    icon?: React.ComponentType<any>,
    show:boolean,
}
const NAV_LINKS :NavLink[] = [
    {
        label: 'Overall',
        path: PATHS.OVERALL,
        icon: RiDashboard3Line,
        show:true,
    },
    {
        label: 'Rankings',
        path: PATHS.RANKING,
        icon: PiRanking,
        show:true,
    },
    {
        label: 'Tournaments',
        path:PATHS.TOURNAMENTS,
        icon:GiTrophyCup,
        show:true,
    },
    {
        label: 'Matchs',
        path:PATHS.MATCHS,
        icon:RiHistoryFill,
        show:true,
    },
    {
        label: 'Others',
        path:'#',
        icon:RxDashboard,
        show:true,
    },
    {
        label: 'Others1',
        path:'#1',
        icon:RxDashboard,
        show:false,
    },
    {
        label: 'Others2',
        path:'#2',
        icon:RxDashboard,
        show:false,
    },
    {
        label: 'Tournaments',
        path:PATHS.TOURNAMENTS,
        icon:GiTrophyCup,
        show:false,
    },
]

export default NAV_LINKS
export{
    PATHS
}