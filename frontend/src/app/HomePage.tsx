import { Link } from 'react-router'

export function HomePage() {
    return (
        <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 px-4">
            <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-3xl font-medium text-ink">
                    InnerChess
                </h1>
                <p className="text-base text-dim">
                    Chess visualization trainer.
                </p>
            </div>
            <Link
                to="/puzzle"
                className="rounded-sm bg-accent px-6 py-3 text-base font-medium text-white 
                           hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                           transition-all"
            >
                Solve puzzles
            </Link>
        </section>
    )
}
