import { NavLink } from 'react-router-dom';
import './TournamentCard.css';
import { RxCalendar } from 'react-icons/rx';
import { FaLocationDot, FaUser } from 'react-icons/fa6';
import { LuTrophy } from 'react-icons/lu';
import { useRef } from 'react';
import { TournamentStatus } from '../../../../types/tournament';
import PATHS from '../../../../router/path';

interface propsTournamentCard {
    id: number;
    banner?: string;
    name: string;
    prize?: number;
    date: string;
    location?: string;
    attened: number;
    status: TournamentStatus;
    winnerName?: string;
}

const TournamentCard = (props: propsTournamentCard) => {
    // console.log('tournament-card');
    const startX = useRef(0);
    const startY = useRef(0);
    const moved = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        startX.current = e.pageX;
        startY.current = e.pageY;
        moved.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (Math.abs(e.pageX - startX.current) > 5 || Math.abs(e.pageY - startY.current) > 5) {
            moved.current = true; // coi là drag nếu di chuyển > 5px
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (moved.current) {
            e.preventDefault(); // ngăn click nếu là drag
        }
    };
    const defaultBanners = [
        "images/defaultBannerTournament2.jpg",
        "images/defaultBannerTournament3.jpg"
    ];
    console.log(props);
    
    const bannerSrc = props.banner || defaultBanners[Math.floor(Math.random() * defaultBanners.length)];
    return (
        <div className="tournament-card min-h-max flex flex-col mr-[1rem]">
            <NavLink to={`${PATHS.TOURNAMENT}/` + props.id} className=''
                onDragStart={(e) => e.preventDefault()}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            >
                <div className='w-full max-h-[150px] h-[150px] overflow-hidden flex items-center justify-center relative border-b border-slate-200'>
                    {
                        <img src={bannerSrc} />
                    }
                    {
                        props.status == TournamentStatus.ONGOING && <div className='absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-semibold text-white bg-green-700'>
                            <p>Đang diễn ra</p>
                        </div>
                    }
                    {
                        props.status == TournamentStatus.PAUSED && <div className='absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-semibold text-white bg-yellow-500'>
                            <p>Tạm dừng</p>
                        </div>
                    }
                    {
                        props.status == TournamentStatus.FINISHED && <div className='absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-semibold text-white bg-red-700'>
                            <p>Đã kết thúc</p>
                        </div>
                    }
                </div>
                <div className='p-4'>
                    <div className='mb-3 flex flex-col'>
                        <p className='font-medium'> {props.name}</p>
                        <div className='text-slate-500 flex gap-2 text-sm items-center'>
                            {
                                props.prize && <p>{props.prize.toLocaleString('vi-VN') + 'đ'}</p>
                            }
                            {
                                props.winnerName && <div className='flex items-center gap-1 text-yellow-400'>
                                    <LuTrophy className='w-4 h-4 align-baseline' />
                                    <p className='leading-none'>{props.winnerName}</p>
                                </div>
                            }

                        </div>
                    </div>
                    <div className='flex flex-col gap-[3px]'>
                        <div className='flex items-center gap-1 text-slate-500'>
                            <div className='w-3.5 h3.5 flex items-center justify-center'>
                                <RxCalendar className='w-full' />
                            </div>
                            <p className='text-sm'>{props.date}</p>
                        </div>
                        <div className='flex items-center gap-1 text-slate-500'>
                            <div className='w-3.5 h3.5 flex items-center justify-center'>
                                <FaLocationDot className='w-[80%]' />
                            </div>
                            <p className='text-sm text-slate-500'>{props.location ? props.location : 'TBA'}</p>
                        </div>
                        <div className='flex items-center gap-1 text-slate-500'>
                            <div className='w-3.5 h3.5 flex items-center justify-center'>
                                <FaUser className='w-[90%]' />
                            </div>
                            <p className='text-sm text-slate-500'>{props.attened}</p>
                        </div>
                    </div>
                </div>
            </NavLink>

        </div>
    )
}

export default TournamentCard