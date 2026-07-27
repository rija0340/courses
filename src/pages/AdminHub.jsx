import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Globe, Settings, ArrowLeft } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

export default function AdminHub() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const domainId = params.get('domain');

  const cards = [
    {
      to: '/admin/courses',
      title: 'Cours',
      desc: 'Niveaux, chapitres, leçons et exercices (JSON).',
      icon: BookOpen,
      color: '#1a73e8',
    },
    {
      to: '/admin/vocabs',
      title: 'Vocabulaires',
      desc: 'Domaines et mots — admin global.',
      icon: Globe,
      color: '#0d9488',
    },
  ];

  if (domainId) {
    cards.push({
      to: `/vocabs/${domainId}/admin`,
      title: 'Domaine courant',
      desc: `Admin du vocabulaire « ${domainId} ».`,
      icon: Settings,
      color: '#7c4dff',
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      <Breadcrumb items={[{ label: 'Admin' }]} />
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-normal text-lh-text">Administration</h1>
        <p className="text-sm text-lh-secondary mt-1">
          Choisissez une section. Le contenu pédagogique des cours reste en JSON.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="group bg-lh-card border border-lh-border rounded-2xl p-5 hover:shadow-lh transition-all"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: card.color }}
              >
                <Icon size={22} />
              </div>
              <h2 className="text-lg font-medium text-lh-text group-hover:text-lh-accent transition-colors">
                {card.title}
              </h2>
              <p className="text-sm text-lh-secondary mt-1">{card.desc}</p>
            </Link>
          );
        })}
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 mt-8 text-sm text-lh-secondary hover:text-lh-accent"
      >
        <ArrowLeft size={16} /> Accueil
      </Link>
    </div>
  );
}
