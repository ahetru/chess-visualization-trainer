import { Link } from 'react-router'

export function Header() {
    return (
        <header className="border-b border-gray-200">
            <nav className="flex items-center gap-4 px-4 py-3">
                <Link to="/" className="font-semibold">
                    InnerChess
                </Link>
                <Link to="/puzzle" className="text-gray-600 hover:text-gray-900">
                    Puzzle
                </Link>
            </nav>
        </header>
    )
}
