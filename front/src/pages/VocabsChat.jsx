import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, MessageCircle, AlertCircle, BookOpen } from 'lucide-react';
import { AppContext } from '../App';
import { sendRagChat } from '../lib/ragClient';
import { coerceDisplayText } from '../data/vocabs/vocabItemStructure';

const SUPPORTED = 'medi-vocabs';

export default function VocabsChat() {
  const { domainId } = useParams();
  const { lang } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const unsupported = domainId !== SUPPORTED;

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading || unsupported) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const data = await sendRagChat({
        messages: nextMessages,
        domainId,
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer || '(réponse vide)' },
      ]);
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      setError(err.message || 'Échec de la requête');
    } finally {
      setLoading(false);
    }
  };

  const title =
    lang === 'en' ? 'MediVocabs Chat' : lang === 'mg' ? 'Chat MediVocabs' : 'Chat MediVocabs';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-28 flex flex-col min-h-[70vh]">
      <header className="flex items-center gap-3 mb-5">
        <Link
          to={`/vocabs/${domainId}`}
          className="w-9 h-9 rounded-xl bg-white border border-[#dadce0] flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] shrink-0"
          title="Retour"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-[18px] sm:text-[20px] font-medium text-[#202124] flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#1a73e8]" />
            {title}
          </h1>
          <p className="text-[12px] text-[#9aa0a6]">
            RAG · embeddings anglais (gte-small) · Groq
          </p>
        </div>
      </header>

      {unsupported ? (
        <div className="rounded-2xl border border-[#f9e2ae] bg-[#fef7e0] px-4 py-3 text-[13px] text-[#5f6368]">
          Le chat RAG est activé uniquement pour <code className="font-semibold">{SUPPORTED}</code> pour le moment.
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-4 mb-4">
            {messages.length === 0 && !loading && (
              <div className="rounded-2xl border border-[#e8eaed] bg-white px-4 py-6 text-center">
                <BookOpen className="w-8 h-8 text-[#1a73e8] mx-auto mb-2 opacity-80" />
                <p className="text-[14px] text-[#3c4043] font-medium mb-1">
                  Pose une question sur le vocabulaire médical
                </p>
                <p className="text-[12px] text-[#9aa0a6]">
                  Ex. « What is the heart? » ou « Explain pneumonia in simple terms »
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[#1a73e8] text-white'
                      : 'bg-white border border-[#e8eaed] text-[#202124]'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[13px] text-[#5f6368]">
                <Loader2 className="w-4 h-4 animate-spin text-[#1a73e8]" />
                Recherche + génération…
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-[13px] text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {sources.length > 0 && !loading && (
              <div className="rounded-2xl border border-[#e8eaed] bg-[#f8f9fa] px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9aa0a6] mb-2">
                  Sources (RAG)
                </p>
                <ul className="space-y-1.5">
                  {sources.map((s) => (
                    <li key={s.id} className="text-[12px] text-[#3c4043]">
                      <span className="font-semibold text-[#1a73e8]">{coerceDisplayText(s.en)}</span>
                      {coerceDisplayText(s.fr) ? <span className="text-[#5f6368]"> · {coerceDisplayText(s.fr)}</span> : null}
                      {typeof s.similarity === 'number' ? (
                        <span className="text-[#9aa0a6]"> · {(s.similarity * 100).toFixed(0)}%</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="sticky bottom-20 sm:bottom-6 flex gap-2 items-end bg-[#f8f9fa]/95 backdrop-blur-sm pt-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={2}
              placeholder="Ta question…"
              className="flex-1 resize-none rounded-2xl border border-[#dadce0] bg-white px-3.5 py-2.5 text-[14px] text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 w-11 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center hover:bg-[#1b66c9] disabled:opacity-40 shrink-0"
              aria-label="Envoyer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
