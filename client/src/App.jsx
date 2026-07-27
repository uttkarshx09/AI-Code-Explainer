import { useActionState, useState } from 'react';
import { explainCodeAction } from './actions/explainCodeAction';
import { examples } from './data/examples';

const initialState = {
    status: 'idle',
    error: '',
    result: null,
};

function App() {
    const [code, setCode] = useState(examples[0].code);
    const [language, setLanguage] = useState(examples[0].language);
    const [state, formAction, isPending] = useActionState(explainCodeAction, initialState);

    const activeResult = state.result;
    const keyPoints = activeResult?.keyPoints || [];
    const improvements = activeResult?.improvementIdeas || [];

    return (
        <div className="min-h-screen text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl space-y-3">
                        <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
                            React 19 + Express + Tailwind
                        </p>
                        <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                            Explain any code snippet in plain English.
                        </h1>
                        <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                            Paste code, choose a language, and get a beginner-friendly breakdown with key points,
                            complexity, and practical improvement ideas.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <StatCard label="Mode" value={activeResult?.mode || 'ready'} />
                        <StatCard label="Complexity" value={activeResult?.complexity || '—'} />
                        <StatCard label="Examples" value={String(examples.length)} />
                    </div>
                </header>

                <main className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="rounded-3xl border border-white/10 bg-[#0b1324]/90 p-5 shadow-glow backdrop-blur-xl sm:p-6">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Code input</h2>
                                <p className="text-sm text-slate-400">Use the sample chips or paste your own snippet.</p>
                            </div>

                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                Uses <span className="font-semibold text-white">useActionState</span> for submission state
                            </div>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-2">
                            {examples.map((example) => (
                                <button
                                    key={example.id}
                                    type="button"
                                    onClick={() => {
                                        setCode(example.code);
                                        setLanguage(example.language);
                                    }}
                                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-amber-300/50 hover:bg-amber-300/10"
                                >
                                    {example.label}
                                </button>
                            ))}
                        </div>

                        <form action={formAction} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
                                <label className="space-y-2 text-sm text-slate-300">
                                    <span>Language</span>
                                    <input
                                        name="language"
                                        value={language}
                                        onChange={(event) => setLanguage(event.target.value)}
                                        placeholder="javascript"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50"
                                    />
                                </label>

                                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                                    <p className="font-medium text-white">What it returns</p>
                                    <p className="mt-1 leading-6">Summary, explanation, key points, complexity, and suggestions.</p>
                                </div>
                            </div>

                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Code snippet</span>
                                <textarea
                                    name="code"
                                    value={code}
                                    onChange={(event) => setCode(event.target.value)}
                                    spellCheck="false"
                                    rows={16}
                                    className="w-full resize-y rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 font-mono text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-300/50"
                                    placeholder="Paste a function, component, or script here..."
                                />
                            </label>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isPending ? 'Explaining...' : 'Explain code'}
                                </button>

                                {state.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
                            </div>
                        </form>
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl sm:p-6">
                            <h2 className="text-lg font-semibold text-white">Result</h2>

                            {activeResult ? (
                                <div className="mt-4 space-y-5 text-sm leading-6 text-slate-200">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Summary</p>
                                        <p className="mt-2 text-base text-white">{activeResult.summary}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Explanation</p>
                                        <p className="mt-2 whitespace-pre-wrap text-slate-200">{activeResult.explanation}</p>
                                    </div>

                                    <ResultList title="Key points" items={keyPoints} />
                                    <ResultList title="Improvement ideas" items={improvements} />
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </section>

                        <section className="grid gap-4 sm:grid-cols-2">
                            <InfoCard
                                title="Backend"
                                text="Express handles validation, rate limiting, and the LLM request.
"
                            />
                            <InfoCard
                                title="Frontend"
                                text="React 19 manages submission state with useActionState and renders structured output."
                            />
                        </section>
                    </aside>
                </main>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="min-w-[120px] rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{value}</p>
        </div>
    );
}

function ResultList({ title, items }) {
    if (!items.length) {
        return null;
    }

    return (
        <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
            <ul className="mt-2 space-y-2">
                {items.map((item) => (
                    <li key={item} className="rounded-2xl border border-white/8 bg-slate-950/50 px-3 py-2 text-slate-200">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="mt-4 rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm leading-6 text-slate-400">
            Submit a snippet to see a structured explanation here.
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-slate-300">
                The app ships with a demo fallback, so the UI still works even before you add an API key.
            </div>
        </div>
    );
}

function InfoCard({ title, text }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-glow">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{text}</p>
        </div>
    );
}

export default App;