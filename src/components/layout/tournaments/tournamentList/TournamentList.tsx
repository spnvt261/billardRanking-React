import { useEffect, useRef } from "react";
import TournamentCard from "../tournamentCard/TournamentCard";
import './TournamentList.css';
import type { iTournament } from "../../../../data/tournamentData";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
interface propsTournamentList {
    label: string;
    list: iTournament[];
}
const TournamentList = (props: propsTournamentList) => {
    // console.log('Tournament List');
    const listTournaments = props.list;
    const scrollRef = useRef<HTMLDivElement>(null);
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    const leftBtnRef = useRef<HTMLButtonElement>(null);
    const rightBtnRef = useRef<HTMLButtonElement>(null);
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
    const updateScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;

        const canScroll = el.scrollWidth > el.clientWidth;

        if (leftBtnRef.current && rightBtnRef.current) {
            if (!canScroll) {
                leftBtnRef.current.style.display = "none";
                rightBtnRef.current.style.display = "none";
                return;
            }
            leftBtnRef.current.style.display = el.scrollLeft > 0 ? "flex" : "none";
            rightBtnRef.current.style.display = el.scrollLeft + el.clientWidth < el.scrollWidth - 5 ? "flex" : "none";
        }
    };
    useEffect(() => {
        updateScrollButtons();
        window.addEventListener("resize", updateScrollButtons);
        return () => window.removeEventListener("resize", updateScrollButtons);
    }, []);
    const handleScroll = () => updateScrollButtons();
    return (
        <div
            className="tournament-list flex flex-col pb-[3rem]  relative"
            onMouseDown={mouseDown}
            onMouseLeave={mouseLeave}
            onMouseUp={mouseUp}
            onMouseMove={mouseMove}
        >
            <h3
                className="mb-1 label-sm text-slate-500 font-bold"
            >{props.label.toUpperCase()}</h3>
            <div className="hide-scrollbar overflow-x-auto scroll-x pt-[0.5rem] pb-[0.5rem] pl-[0.25rem] pr-[0.25rem]"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                <button
                    className="button-scroll absolute left-0 top-1/2 transform hover:scale-110 -translate-y-1/2 -translate-x-1/2 z-10"
                    onClick={() => scrollByOffset(-300)} 
                    ref={leftBtnRef}
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
                    onClick={() => scrollByOffset(300)}
                    ref={rightBtnRef}
                >
                    <FaAngleRight className="w-1/2 h-1/2" />
                </button>

            </div>

        </div>
    )
}

export default TournamentList