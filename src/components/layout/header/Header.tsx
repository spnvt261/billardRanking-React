import { NavLink } from 'react-router-dom';
import NAV_LINKS from '../../../constants/navigation';
import './Header.css'
import { PiNumberCircleNine } from 'react-icons/pi';
import { useEffect, useRef, useState } from 'react';
const Header = () => {
    console.log('Header');
    const ulRef = useRef<HTMLUListElement | null>(null);
    const liRefs = useRef<Array<HTMLAnchorElement | null>>([]);
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

    const setLiRef = (index: number) => (el: HTMLAnchorElement | null) => {
        liRefs.current[index] = el;
    };
    const visibleLinks = NAV_LINKS.filter(item => item.show);
    const hiddenLinks = NAV_LINKS.filter(item => !item.show);
    const _showOthers = () => {
        setShowOthers(!showOthers)

    }
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
                                <NavLink
                                    to={item.path}
                                    key={item.label}
                                    className={({ isActive }) =>
                                        `nav-link flex flex-col justify-center cursor-pointer ${isActive && !item.isHiddenGroup ? 'active' : ''} ${showOthers ? 'opacity-0' : 'opacity-1'}`
                                    }
                                    ref={setLiRef(index)}
                                    onClick={item.isHiddenGroup ? () => _showOthers() : () => { }}
                                >
                                    {({ isActive }) => {
                                        useEffect(() => {
                                            if (isActive) {
                                                updateActiveBlock();
                                            }
                                        }, [isActive]);

                                        return (
                                            <>
                                                {item.icon && (
                                                    <div className="flex justify-center">
                                                        <Icon size="1.5rem" />
                                                    </div>
                                                )}
                                                <div className="label">{item.label}</div>
                                            </>
                                        );
                                    }}
                                </NavLink>
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
                                hiddenLinks.map((item) => {
                                    const Icon = item.icon || (() => <div />);
                                    return (
                                        <NavLink
                                            to={item.path}
                                            key={item.label}
                                            className={({ isActive }) =>
                                                `nav-link flex flex-col justify-center cursor-pointer ${isActive && !item.isHiddenGroup ? 'active' : ''}`
                                            }
                                            onClick={() => {
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
                                        </NavLink>
                                    )
                                })
                            }
                        </ul>
                    }
                    <div ref={blockRef} className={`block glass ${showOthers ? 'opacity-0' : 'opacity-1'}`}></div>
                </ul>
            </div>

        </nav>
    )
}

export default Header;