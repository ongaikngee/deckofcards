import React from 'react'
import { NavLink } from "react-router-dom";
import {PokerChipIcon, GearIcon} from "@phosphor-icons/react";

export const UserNavBar = () => {
	return (
		<div className="col-12 bg-secondary py-3">
			<nav className="nav">
				<NavLink to="chips" className="nav-link text-white">
					<PokerChipIcon size={24} />
					Chips
				</NavLink>

				<NavLink to="settings" className="nav-link text-white">
					<GearIcon size={24} />
					Settings
				</NavLink>
			</nav>
		</div>
	)
}


export default UserNavBar