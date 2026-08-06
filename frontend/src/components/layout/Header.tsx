import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../features/auth/context/AuthContext'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
    const { isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/', { replace: true })
    }

    return (
        <header className="border-b border-edge">
            <nav className="flex items-center gap-4 px-4 py-3">
                <Link to="/" className="font-medium text-ink">
                    InnerChess
                </Link>
                <Link to="/puzzle" className="text-dim hover:text-ink transition-colors">
                    Puzzle
                </Link>

                <div className="ml-auto flex items-center gap-3">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm text-dim hover:text-ink transition-colors"
                        >
                            Log out
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-dim hover:text-ink transition-colors">
                                Log in
                            </Link>
                            <Link to="/register" className="text-sm text-dim hover:text-ink transition-colors">
                                Register
                            </Link>
                        </>
                    )}
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}
