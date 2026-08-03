import { Link } from 'react-router'

export function Header() {
    return (
        <header className="border-b border-edge">
            <nav className="flex items-center gap-4 px-4 py-3">
                <Link to="/" className="font-medium text-ink">
                    InnerChess
                </Link>
                <Link to="/puzzle" className="text-dim hover:text-ink transition-colors">
                    Puzzle
                </Link>
            </nav>
        </header>
    )
}
