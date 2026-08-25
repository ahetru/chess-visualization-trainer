import type { MoveHistoryEntry } from '../hooks/usePuzzleGame';

interface MoveHistoryProps {
    history: MoveHistoryEntry[];
}

export function MoveHistory({ history }: MoveHistoryProps) {
    if (history.length === 0) return null;

    const cells: { kind: 'num' | 'san'; text: string }[] = [];
    const whiteSeen = new Set<number>();

    for (const move of history) {
        if (move.color === 'w') {
            whiteSeen.add(move.moveNumber);
            cells.push({ kind: 'num', text: `${move.moveNumber}.` });
        } else if (!whiteSeen.has(move.moveNumber)) {
            cells.push({ kind: 'num', text: `${move.moveNumber}...` });
        }
        cells.push({ kind: 'san', text: move.san });
    }

    return (
        <div className="flex max-w-md flex-wrap gap-x-2 gap-y-1 font-mono text-sm">
            {cells.map((cell, i) =>
                cell.kind === 'num' ? (
                    <span key={i} className="text-dim">
                        {cell.text}
                    </span>
                ) : (
                    <span key={i} className="text-ink-strong">
                        {cell.text}
                    </span>
                ),
            )}
        </div>
    );
}
