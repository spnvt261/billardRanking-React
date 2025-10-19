import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { PATHS, TOURNAMENT_DETAIL_NAV_LINKS } from "../../../../constants/navigation";
import "./Navbar.css";

const Navbar = () => {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="tournament-nav glass rounded-[1rem] z-10"
            style={isOpen?{width:'100%'}:{}}
        >
            <button className="menu-btn" onClick={toggleMenu}>
                {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <nav className={`nav-list ${isOpen ? "open" : ""}`}>
                {TOURNAMENT_DETAIL_NAV_LINKS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={`${PATHS.TOURNAMENT}/${id}/${item.path}`}
                        end={item.path === ""}
                        className={({ isActive }) => (isActive ? "active" : "")}
                        onClick={() => setIsOpen(false)}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Navbar;
