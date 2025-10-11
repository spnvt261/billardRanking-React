import { GiTrophyCup } from "react-icons/gi"
import { PiRanking } from "react-icons/pi"
import { RiDashboard3Line, RiHistoryFill } from "react-icons/ri"
import { RxDashboard } from "react-icons/rx"
import PATHS from "../router/path"

interface iNavLink{
    label: string,
    path:string,
    icon?: React.ComponentType<any>,
    show:boolean,
    isHiddenGroup?:boolean
}
const NAV_LINKS :iNavLink[] = [
    {
        label: 'Overall',
        path: PATHS.OVERALL,
        icon: RiDashboard3Line,
        show:true,
    },
    {
        label: 'Rankings',
        path: PATHS.RANKINGS,
        icon: PiRanking,
        show:true,
    },
    {
        label: 'Tournaments',
        path:PATHS.TOURNAMENT,
        icon:GiTrophyCup,
        show:true,
    },
    {
        label: 'Matches',
        path:PATHS.MATCHES,
        icon:RiHistoryFill,
        show:true,
    },
    {
        label: 'Others',
        path:'#',
        icon:RxDashboard,
        show:true,
        isHiddenGroup:true,
    },
    {
        label: 'Others1',
        path:'/abc',
        icon:RxDashboard,
        show:false,
    },
    {
        label: 'Others2',
        path:'/abc2',
        icon:RxDashboard,
        show:false,
    },
    {
        label: 'Tournaments',
        path:'/111',
        icon:GiTrophyCup,
        show:false,
    },
    {
        label: 'NotFound',
        path:PATHS.NOTFOUND,
        icon:RxDashboard,
        show:false,
    },
    {
        label: 'Testt',
        path:'/kk',
        icon:RxDashboard,
        show:false,
    },
]

export default NAV_LINKS
export{
    PATHS
}