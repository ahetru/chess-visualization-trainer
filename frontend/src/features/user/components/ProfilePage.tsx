import { useCurrentUser } from '../hooks/useCurrentUser';
import { Spinner } from '../../../components/ui/Spinner';

export function ProfilePage() {
    const { user, isLoading, error } = useCurrentUser();

    if (isLoading) {
        return (
            <div role="status" className="flex flex-col items-center gap-3 px-4 py-16">
                <Spinner className="h-6 w-6" />
                <p className="text-dim">Loading profile…</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
                <p className="text-[var(--accent-red)]">Error: {error}</p>
            </div>
        );
    }

    return (
        <section className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm card p-6">
                <h1 className="mb-4 text-xl font-semibold text-[var(--fg-strong)]">Profile</h1>

                <dl className="space-y-3">
                    <Field label="Username" value={user.userName} />
                    <Field label="Email" value={user.email} />
                    <Field label="Role" value={user.role} />
                    <div>
                        <dt className="text-sm text-dim">User ID</dt>
                        <dd className="break-all font-mono text-sm text-[var(--fg-strong)]">{user.id}</dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-sm text-dim">{label}</dt>
            <dd className="text-[var(--fg-strong)]">{value}</dd>
        </div>
    );
}
