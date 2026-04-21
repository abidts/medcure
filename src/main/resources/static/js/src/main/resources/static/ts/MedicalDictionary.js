import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
const MedicalDictionary = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const canSearch = useMemo(() => query.trim().length >= 2, [query]);
    const searchOnlineDictionary = async () => {
        const search = query.trim();
        if (search.length < 2)
            return;
        setLoading(true);
        setError(null);
        setSelectedEntry(null);
        try {
            const [wordResp, wikiResp] = await Promise.all([
                fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(search)}`),
                fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(search)}&limit=8&namespace=0&format=json&origin=*`)
            ]);
            const collected = [];
            if (wordResp.ok) {
                const wordData = await wordResp.json();
                if (Array.isArray(wordData)) {
                    wordData.slice(0, 4).forEach((entry) => {
                        const meaning = Array.isArray(entry.meanings) ? entry.meanings[0] : null;
                        const def = meaning?.definitions?.[0];
                        if (def?.definition) {
                            collected.push({
                                term: entry.word || search,
                                pronunciation: entry.phonetic || '',
                                definition: def.definition,
                                details: def.example ? `Example: ${def.example}` : '',
                                sourceUrl: Array.isArray(entry.sourceUrls) ? entry.sourceUrls[0] : undefined
                            });
                        }
                    });
                }
            }
            if (wikiResp.ok) {
                const wikiData = await wikiResp.json();
                const titles = Array.isArray(wikiData?.[1]) ? wikiData[1] : [];
                const descriptions = Array.isArray(wikiData?.[2]) ? wikiData[2] : [];
                const links = Array.isArray(wikiData?.[3]) ? wikiData[3] : [];
                titles.forEach((title, idx) => {
                    const isDuplicate = collected.some((c) => c.term.toLowerCase() === title.toLowerCase());
                    if (!isDuplicate) {
                        collected.push({
                            term: title,
                            definition: descriptions[idx] || 'Reference article available.',
                            details: 'This result is sourced from a free online encyclopedia.',
                            sourceUrl: links[idx]
                        });
                    }
                });
            }
            if (collected.length === 0) {
                setError('No definitions found. Try another medical term.');
                setResults([]);
            }
            else {
                setResults(collected);
            }
        }
        catch (e) {
            setError('Unable to reach online dictionary services right now.');
            setResults([]);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-gradient-to-br from-blue-600 to-blue-800 text-white", children: _jsx("div", { className: "container mx-auto px-4 py-16", children: _jsxs("div", { className: "text-center max-w-3xl mx-auto", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6", children: [_jsx(BookOpen, { size: 16 }), _jsx("span", { children: "Live Online Medical Dictionary Search" })] }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4", children: "Medical Dictionary" }), _jsx("p", { className: "text-lg text-blue-100 mb-8", children: "Search definitions from free online dictionary and encyclopedia sources." }), _jsxs("div", { className: "flex gap-3 max-w-2xl mx-auto", children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: (e) => e.key === 'Enter' && searchOnlineDictionary(), placeholder: "Search medical terms (e.g., hypertension, nephrology, anemia)", className: "flex-1 px-6 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 outline-none" }), _jsx("button", { onClick: searchOnlineDictionary, disabled: !canSearch || loading, className: "px-6 py-4 bg-white text-blue-700 rounded-2xl font-bold disabled:opacity-50", children: loading ? _jsx(Loader2, { size: 18, className: "animate-spin" }) : _jsx(Search, { size: 18 }) })] })] }) }) }), _jsxs("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: [error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold", children: error })), selectedEntry ? (_jsxs(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-2xl border border-slate-200 p-8", children: [_jsxs("button", { onClick: () => setSelectedEntry(null), className: "flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-5", children: [_jsx(ArrowLeft, { size: 18 }), " Back to results"] }), _jsx("h2", { className: "text-3xl font-bold text-slate-900", children: selectedEntry.term }), selectedEntry.pronunciation && (_jsx("p", { className: "text-slate-500 mt-1", children: selectedEntry.pronunciation })), _jsx("p", { className: "text-slate-800 mt-5 leading-relaxed", children: selectedEntry.definition }), selectedEntry.details && (_jsx("p", { className: "text-slate-600 mt-4 leading-relaxed", children: selectedEntry.details })), selectedEntry.sourceUrl && (_jsxs("a", { href: selectedEntry.sourceUrl, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 mt-6 text-blue-600 font-semibold", children: ["Read source ", _jsx(ExternalLink, { size: 16 })] }))] })) : (_jsxs("div", { className: "space-y-4", children: [results.map((entry, idx) => (_jsxs(motion.button, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: idx * 0.03 }, onClick: () => setSelectedEntry(entry), className: "w-full text-left bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 mb-1", children: entry.term }), _jsx("p", { className: "text-slate-600 text-sm line-clamp-2", children: entry.definition })] }, `${entry.term}-${idx}`))), !loading && results.length === 0 && (_jsx("div", { className: "text-center text-slate-500 py-16", children: "Search a term to get live dictionary results." }))] }))] })] }));
};
export default MedicalDictionary;
//# sourceMappingURL=MedicalDictionary.js.map