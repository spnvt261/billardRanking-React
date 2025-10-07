import { Link, useLocation, useNavigate } from 'react-router-dom';
import NAV_LINKS from '../../../constants/navigation';
import './Header.css'
import { PiNumberCircleNine } from 'react-icons/pi';
import { useEffect, useRef, useState } from 'react';
const Header = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    console.log('Header');
    const navigate = useNavigate();
    const ulRef = useRef<HTMLUListElement | null>(null);
    const liRefs = useRef<Array<HTMLLIElement | null>>([]);
    const blockRef = useRef<HTMLDivElement | null>(null);
    const [showOthers, setShowOthers] = useState(false);

    const othersRef = useRef<HTMLUListElement | null>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (othersRef.current && !othersRef.current.contains(event.target as Node)) {
                setShowOthers(false);
            }
        };

        if (showOthers) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showOthers]);
    const updateActiveBlock = () => {
        if (!ulRef.current || !blockRef.current) return;

        const rect = ulRef.current.getBoundingClientRect();

        liRefs.current.forEach((li) => {
            if (li && li.classList.contains('active')) {
                const liRect = li.getBoundingClientRect();
                const relativeX = liRect.left - rect.left;
                const width = liRect.width;
                if (blockRef.current) {
                    blockRef.current.style.display = 'inline';
                    blockRef.current.style.left = `${relativeX}px`;
                    blockRef.current.style.width = `${width}px`;
                    blockRef.current.style.transform = "scale(1.1)";
                    setTimeout(() => {
                        if (blockRef.current) blockRef.current.style.transform = "scale(1)";
                    }, 300);
                }
            }
        });
    };

    const setLiRef = (index: number) => (el: HTMLLIElement | null) => {
        liRefs.current[index] = el;
    };
    const _navLinkOnClick = (path: string) => {
        navigate(path);

    }
    const visibleLinks = NAV_LINKS.filter(item => item.show);
    const hiddenLinks = NAV_LINKS.filter(item => !item.show);
    const _showOthers = () => {
        setShowOthers(!showOthers)

    }
    useEffect(() => {
        updateActiveBlock()
    }, [location])
    return (
        <nav className="nav fixed top-0 left-0 w-full z-50">
            <div className='container mx-auto flex justify-between items-center'>
                <div className='flex logo'>
                    <h1 className='text-2xl font-bold'>NineBall</h1>
                    <div className='fex items-center justify-center ml-1'>
                        <PiNumberCircleNine size='2rem' />
                    </div>

                </div>
                <ul className={`nav-links flex`}
                    // onMouseMove={handleMouseMove}
                    ref={ulRef}
                >
                    {
                        visibleLinks.map((item, index) => {
                            const Icon = item.icon || (() => <div />);
                            return (
                                <li key={item.label}
                                    className={`nav-link flex flex-col justify-center cursor-pointer ${currentPath === item.path ? "active" : ""} ${showOthers?'opacity-0':'opacity-1'}`}
                                    ref={setLiRef(index)}
                                    onClick={item.label !== "Others" ? () => _navLinkOnClick(item.path) : () => _showOthers()}
                                >
                                    {
                                        item.icon &&
                                        <div className='flex justify-center'>
                                            <Icon size='1.5rem' />
                                        </div>
                                    }
                                    {/* <Link
                                        to={item.path}
                                    >
                                        {item.label}
                                    </Link> */}
                                    <div className='label'>{item.label}</div>
                                </li>
                            )
                        })

                    }
                    {
                        hiddenLinks &&
                        <ul className={`other-nav-links flex absolute glass ${showOthers ? 'open' : ''}`}
                            // style={showOthers?{maxWidth:'fit-content'}:{}}
                            ref={othersRef}
                        >
                            {
                                hiddenLinks.map((item, index) => {
                                    const Icon = item.icon || (() => <div />);
                                    return (
                                        <li key={item.label}
                                            className={`nav-link flex flex-col justify-center cursor-pointer ${currentPath === item.path ? "active" : ""}`}
                                            onClick={() => {
                                                _navLinkOnClick(item.path); 
                                                setShowOthers(false);      
                                            }}
                                        >
                                            {
                                                item.icon &&
                                                <div className='flex justify-center'>
                                                    <Icon size='1.5rem' />
                                                </div>
                                            }
                                            <div className='label'>{item.label}</div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    }
                    <div ref={blockRef} className={`block glass ${showOthers?'opacity-0':'opacity-1'}`}></div>
                </ul>
            </div>

        </nav>
    )
}

export default Header;