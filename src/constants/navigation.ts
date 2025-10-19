import { GiTrophyCup } from "react-icons/gi"
import { PiRanking } from "react-icons/pi"
import { RiDashboard3Line, RiHistoryFill } from "react-icons/ri"
import { RxDashboard } from "react-icons/rx"
import PATHS from "../router/path"
import { GoHomeFill } from "react-icons/go"
import { CiLogout } from "react-icons/ci"
import { IoSettingsOutline } from "react-icons/io5"

interface iNavLink {
    label: string,
    path: string,
    icon?: React.ComponentType<any>,
    show: boolean,
    isLogout?: boolean,
    isHiddenGroup?: boolean
}
const NAV_LINKS: iNavLink[] = [
    {
        label: 'Overall',
        path: PATHS.OVERALL,
        icon: RiDashboard3Line,
        show: true,
    },
    {
        label: 'Rankings',
        path: PATHS.RANKINGS,
        icon: PiRanking,
        show: true,
    },
    {
        label: 'Tournaments',
        path: PATHS.TOURNAMENT,
        icon: GiTrophyCup,
        show: true,
    },
    {
        label: 'Matches',
        path: PATHS.MATCHES,
        icon: RiHistoryFill,
        show: true,
    },
    {
        label: 'Others',
        path: '#',
        icon: RxDashboard,
        show: true,
        isHiddenGroup: true,
    },
    {
        label: 'Settings',
        path: PATHS.SETTINGS,
        icon: IoSettingsOutline,
        show: false,
    },
    {
        label: 'Logout',
        path: '/',
        icon: CiLogout ,
        show: false,
        isLogout:true,
    },
]

const NAV_LINKS_WITHOUT_LOGIN: iNavLink[] = [
    {
        label: 'Home',
        path: '/',
        icon: GoHomeFill ,
        show: true,
    },
    {
        label: 'Tạo giải đấu',
        path: PATHS.CREATE_TOURNAENT,
        icon: GiTrophyCup,
        show: true,
    },
]

export const TOURNAMENT_DETAIL_NAV_LINKS: iNavLink[]=[
    {
        label:'Tổng quan',
        path:PATHS.TOURNAMENT_DETAIL_OVERVIEW,
        show:true,
    },
    {
        label:'Trận đấu',
        path:PATHS.TOURNAMENT_DETAIL_MATCHES,
        show:true,
    },
    {
        label:'Người chơi',
        path:PATHS.TOURNAMENT_DETAIL_PLAYERS,
        show:true,
    },
    {
        label:'Bảng xếp hạng',
        path:PATHS.TOURNAMENT_DETAIL_RANKINGS,
        show:true,
    },
]

export default NAV_LINKS
export {
    PATHS,
    NAV_LINKS_WITHOUT_LOGIN
}