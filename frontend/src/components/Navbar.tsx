import { NavLink } from "react-router-dom";
const Navbar = () => {
	return (
		<div className="fixed top-0 right-0 w-full box-border border-4 border-blue-400 h-20 bg-blue-200">
			<div className="flex justify-between">
				<div className="m-3 p-4 text-xl bg-skin-accent-light hover:bg-skin-accent rounded-md font-medium text-skin-inverted">
					Stickers with friends
				</div>
				<nav className="flex justify-end gap-5 ">
					<NavLink
						className="m-3 p-4 text-xl bg-skin-accent-light hover:bg-skin-accent rounded-md font-medium text-skin-inverted"
						to={"/stickerSheet"}
					>
						sheet editor
					</NavLink>
					<NavLink
						className="m-3 p-4 text-xl bg-skin-accent-light hover:bg-skin-accent rounded-md font-medium text-skin-inverted"
						to={"/stickerCreator"}
					>
						sticker editor
					</NavLink>
				</nav>
			</div>

		</div>
	)
}
export default Navbar;