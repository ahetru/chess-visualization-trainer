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
        <header
            className="sticky top-0 z-50 border-b border-[var(--bg-alt)]"
            style={{
                backgroundColor: 'color-mix(in srgb, var(--bg) 88%, transparent)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <nav className="mx-auto flex max-w-[960px] items-center gap-4 px-4 py-2">
                <Link to="/" className="text-[0.9375rem] font-semibold text-[var(--fg-strong)]">
                    InnerChess
                </Link>
                <Link
                    to="/puzzle"
                    className="text-[0.8125rem] text-dim transition-colors border-b-2 border-transparent pb-[2px] hover:text-[var(--fg-strong)]"
                >
                    Puzzle
                </Link>

                <div className="ml-auto flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/profile"
                                className="text-[0.8125rem] text-dim hover:text-[var(--fg-strong)] transition-colors"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-[0.8125rem] text-dim hover:text-[var(--fg-strong)] transition-colors"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-[0.8125rem] text-dim hover:text-[var(--fg-strong)] transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="text-[0.8125rem] text-dim hover:text-[var(--fg-strong)] transition-colors"
                            >
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
