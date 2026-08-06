import { Link } from 'react-router'

export function HomePage() {
    return (
        <section className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold text-[var(--fg-strong)] tracking-[-0.01em]">
                    InnerChess
                </h1>
                <p className="text-[var(--muted)]">Chess visualization trainer.</p>
            </div>
            <Link to="/puzzle" className="btn-primary mt-6 no-underline">
                Solve puzzles
            </Link>
        </section>
    )
}
