import { useRef } from "react";
import TournamentCard from "../tournamentCard/TournamentCard";
import './TournamentList.css';
import type { iTournament } from "../../../../data/tournamentData";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
interface propsTournamentList {
    label: string;
    list: iTournament[];
}
const TournamentList = (props: propsTournamentList) => {
    console.log('Tournament List');
    const listTournaments = props.list;
    const scrollRef = useRef<HTMLDivElement>(null);
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const mouseDown = (e: React.MouseEvent) => {
        isDown = true;
        startX = e.pageX - (scrollRef.current?.offsetLeft || 0);
        scrollLeft = scrollRef.current?.scrollLeft || 0;
    };

    const mouseLeave = () => (isDown = false);
    const mouseUp = () => {
        return isDown = false
    }

    const mouseMove = (e: React.MouseEvent) => {
        if (!isDown || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };
    const scrollByOffset = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };
    return (
        <div

            className="tournament-list flex flex-col mb-4 relative"
            onMouseDown={mouseDown}
            onMouseLeave={mouseLeave}
            onMouseUp={mouseUp}
            onMouseMove={mouseMove}
        >
            <h3
                className="mb-1 label-sm text-slate-500 font-bold"
            >{props.label.toUpperCase()}</h3>
            <div className="no-scrollbar overflow-x-auto scroll-x pt-[0.5rem] pb-[0.5rem] pl-[0.25rem] pr-[0.25rem]"
                ref={scrollRef}
            >
                <button
                    className="button-scroll absolute left-0 top-1/2 transform hover:scale-110 -translate-y-1/2 -translate-x-1/2 z-10"
                    onClick={() => scrollByOffset(-300)} // scroll trái 200px
                >
                    <FaAngleLeft className="w-1/2 h-1/2" />
                </button>
                <div className="flex min-w-max ">
                    {
                        listTournaments.map((item) => {
                            return (
                                <TournamentCard
                                    key={item.id}
                                    id={item.id}
                                    attened={item.attened}
                                    date={item.start_date}
                                    name={item.name}
                                    status={item.status}
                                    banner={item.banner}
                                    location={item.location}
                                    prize={item.prize}
                                    winnerName={item.winnerName}
                                />
                            )
                        })
                    }
                </div>
                <button
                    className="button-scroll absolute right-0 top-1/2 transform hover:scale-110 -translate-y-1/2 translate-x-1/2 z-10"
                    onClick={() => scrollByOffset(300)} // scroll phải 200px
                >
                    <FaAngleRight className="w-1/2 h-1/2"/>
                </button>
            </div>

        </div>
    )
}

export default TournamentList