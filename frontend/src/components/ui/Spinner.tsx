interface SpinnerProps {
    className?: string;
}

export function Spinner({ className }: SpinnerProps) {
    return (
        <span
            aria-hidden="true"
            className={`inline-block animate-spin rounded-full border-2 border-[var(--muted)] border-t-[var(--accent)] ${
                className ?? 'h-4 w-4'
            }`}
        />
    );
}
