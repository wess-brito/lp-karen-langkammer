/**
 * Karen Langkammer - Landing Page
 * Automated Deployment Trigger
 */
import React, { useState, FormEvent, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabaseClient';
import karenPalestra from './karen-palestra.jpg';
import bannerHero from './banner-hero.jpg';

// Ícones Minimalistas (Lucide Style)
const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

// Lista de Regiões Administrativas do DF
const RAS_DF = [
  "Outro Estado", "Plano Piloto", "Gama", "Taguatinga", "Brazlândia", "Sobradinho", "Planaltina", "Paranoá",
  "Núcleo Bandeirante", "Ceilândia", "Guará", "Cruzeiro", "Samambaia", "Santa Maria", "São Sebastião",
  "Recanto das Emas", "Lago Sul", "Riacho Fundo", "Lago Norte", "Candangolândia", "Águas Claras",
  "Riacho Fundo II", "Sudoeste/Octogonal", "Varjão", "Park Way", "SCIA (Estrutural)", "Sobradinho II",
  "Jardim Botânico", "Itapoã", "SIA", "Vicente Pires", "Fercal", "Sol Nascente/Pôr do Sol", "Arniqueira",
  "Arapoanga", "Água Quente"
];

// Componente do Slider de Fundo (Hero)
// Componente do Banner Estático (Hero)
const HeroSection = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0">
        <img
          src={bannerHero}
          alt="Karen Langkammer - Banner Principal"
          className="w-full h-full object-cover object-top md:object-center"
        />
      </div>
      {/* Overlay Gradiente Azul 70% */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/70 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
    </div>
  );
};

// Ícone do Instagram
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

// Interface para o Modal
interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string; // 'hero' | 'download' | 'footer'
}

const LeadModal = ({ isOpen, onClose, source }: LeadModalProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    ra: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'form' | 'success' | 'instagram'>('form');
  const [emailError, setEmailError] = useState('');

  // Reset view when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView('form');
        setFormData({ nome: '', telefone: '', email: '', ra: '' });
        setEmailError('');
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const formatPhone = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 2) return phoneNumber;
    if (phoneNumberLength <= 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (e.target.name === 'telefone') {
      value = formatPhone(value);
    }

    if (e.target.name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Por favor, insira um e-mail válido.');
      } else {
        setEmailError('');
      }
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    if (!formData.nome || !formData.telefone || !formData.email || !formData.ra) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError('Por favor, insira um e-mail válido para prosseguir.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([{ ...formData, source }]);
      if (error) throw error;

      setView('success');
      if (source === 'download') {
        const link = document.createElement('a');
        link.href = '/cartilha-karen-langkammer.pdf';
        link.download = 'cartilha-karen-langkammer.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      console.error("Erro no Supabase:", err.message);
      alert("Erro ao salvar dados. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com blur */}
      <div
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Card do Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
        {view === 'form' ? (
          <>
            <div className="bg-purple-900 p-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {source === 'download' ? 'Baixar Cartilha' : 'Faça parte do movimento'}
                </h3>
                <p className="text-purple-200 text-sm">
                  {source === 'download'
                    ? 'Preencha seus dados para receber o material exclusivo.'
                    : 'Junte-se a nós para transformar a segurança pública.'}
                </p>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  required
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone (WhatsApp)</label>
                  <input
                    required
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(61) 99999-9999"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                    {emailError && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{emailError}</span>}
                  </div>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className={`w-full px-4 py-3 rounded-lg border ${emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ra" className="block text-sm font-medium text-gray-700 mb-1">Região Administrativa</label>
                <select
                  required
                  name="ra"
                  value={formData.ra}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="" disabled>Selecione sua cidade (RA)</option>
                  {RAS_DF.map((ra) => (
                    <option key={ra} value={ra}>{ra}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-900 hover:bg-purple-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processando...' : (source === 'download' ? 'Cadastrar e Baixar PDF' : 'Enviar e Apoiar')}
                  {!isSubmitting && <ArrowRight />}
                </button>
                <p className="text-xs text-gray-400 text-center mt-4">
                  Seus dados estão seguros. Não enviamos spam.
                </p>
              </div>
            </form>
          </>
        ) : view === 'success' ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <CheckIcon />
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">Cadastro realizado!</h3>
            <p className="text-gray-600 mb-2">Buscar informação é um ato de coragem.</p>
            <p className="text-gray-600 mb-8">Obrigada por começar.</p>
            {source === 'download' && (
              <a
                href="/cartilha-karen-langkammer.pdf"
                download
                className="text-purple-600 hover:text-purple-800 font-semibold underline underline-offset-4 mb-6 block"
              >
                Clique aqui se o download não iniciar
              </a>
            )}
            <button
              onClick={() => setView('instagram')}
              className="w-full bg-purple-900 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              Continuar <ArrowRight />
            </button>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center relative">
            <div className="absolute top-6 right-6">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="Fechar"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 mb-6 animate-bounce"><InstagramIcon /></div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">Siga no Instagram</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Acompanhe o trabalho da <strong>Delegada Karen</strong> em tempo real e receba mais orientações.
            </p>
            <div className="w-full">
              <a
                href="https://www.instagram.com/delegadakarendf?igsh=NWpmcHJ3dWR1bmRr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <InstagramIcon /> Seguir no Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface Pauta {
  id: number;
  title: string;
  description: string;
  icon: (className?: string) => React.ReactNode;
}

const PAUTAS: Pauta[] = [
  {
    id: 1,
    title: "Proteção à Mulher",
    description: "Discussão de políticas de proteção, prevenção à violência e fortalecimento da rede de apoio.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="10" r="3" /><path d="M12 13v4M10 15h4" /></svg>
    )
  },
  {
    id: 2,
    title: "Infância e Família",
    description: "Acompanhamento de temas relacionados ao desenvolvimento infantil, fortalecimento familiar e proteção social.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
    )
  },
  {
    id: 3,
    title: "Famílias Atípicas",
    description: "Inclusão, acolhimento e acesso a serviços públicos para famílias atípicas.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><path d="M12 8v8" /><path d="M8 12h8" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>
    )
  },
  {
    id: 4,
    title: "Segurança Pública",
    description: "Foco na prevenção, integração entre órgãos públicos e proteção da comunidade.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M12 2a5 5 0 0 0-5 5v4h10V7a5 5 0 0 0-5-5z" /></svg>
    )
  },
  {
    id: 5,
    title: "Esporte",
    description: "Valorização do esporte como ferramenta de inclusão, parquinhos e Centro Olímpico.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M6 12A6 6 0 0 1 18 12" /><path d="M12 6A6 6 0 0 1 12 18" /></svg>
    )
  },
  {
    id: 6,
    title: "Saúde Pública",
    description: "Fiscalização relacionadas ao acesso, atendimento e qualidade dos serviços públicos.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
    )
  },
  {
    id: 7,
    title: "Mobilidade Urbana",
    description: "Acessibilidade, deslocamento seguro e melhoria dos espaços urbanos.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M7 20h10" /><path d="M12 16v4" /><circle cx="7" cy="12" r="1" /><circle cx="17" cy="12" r="1" /></svg>
    )
  },
  {
    id: 8,
    title: "Educação",
    description: "Valorização da educação como ferramenta de transformação social, geração de oportunidades e desenvolvimento humano.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
    )
  },
  {
    id: 9,
    title: "Gestão Pública e Transparência",
    description: "Eficiência administrativa, fiscalização e transparência na gestão pública.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>
    )
  },
  {
    id: 10,
    title: "Empreendedorismo",
    description: "Incentivo à geração de renda, ao fortalecimento dos pequenos negócios e à criação de oportunidades.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
    )
  },
  {
    id: 11,
    title: "Inclusão e Respeito às Pessoas",
    description: "Defesa da dignidade humana, combate à discriminação, promoção do respeito e garantia de acesso igualitário aos serviços públicos.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    )
  },
  {
    id: 12,
    title: "Bem-Estar Animal e Guarda Responsável",
    description: "Incentivo a políticas de proteção animal, guarda responsável, campanhas educativas e ações integradas de saúde pública.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="4" /><circle cx="6.5" cy="10.5" r="2.5" /><circle cx="10" cy="5.5" r="2.5" /><circle cx="14" cy="5.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /></svg>
    )
  }
];

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState('hero');
  const [showPautas, setShowPautas] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/pautas-dep-karen.pdf';
    link.download = 'pautas-dep-karen.pdf';
    link.click();
  };

  const openModal = (source: string) => {
    setModalSource(source);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="font-sans antialiased selection:bg-purple-200 selection:text-purple-900">

      {/* MODAL COMPONENT */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        source={modalSource}
      />

      {/* 1. HERO SECTION COM SLIDER FULL WIDTH */}
      <section className="relative min-h-[95vh] flex items-center bg-gray-900 text-white overflow-hidden">

        {/* Banner Estático */}
        <HeroSection />

        <div className="container mx-auto px-6 relative z-10 pt-20 pb-20">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              A violência contra a mulher não começa no soco.<br />
              <span className="text-purple-300">Começa no silêncio.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-100 font-light mb-8 border-l-4 border-purple-500 pl-4 drop-shadow-md">
              Eu sou <strong>Karen Langkammer</strong>, Delegada de Polícia Civil,
              e luto para que nenhuma mulher precise quebrar para ser protegida.
            </p>

            <button
              onClick={() => openModal('hero')}
              className="group bg-white text-purple-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-3 text-lg"
            >
              Conheça a proposta | Apoie essa luta
              <span className="group-hover:translate-x-1 transition-transform">
                <ArrowRight />
              </span>
            </button>
          </div>

          {/* Coluna da direita removida para permitir visão total do slider */}
        </div>
      </section>

      {/* 2. BLOCO AUTORIDADE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3">
              <div className="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl relative">
                <img
                  src={karenPalestra}
                  alt="Karen Langkammer discursando"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-purple-900 shadow-sm">
                  Delegada PCDF
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Quem fala aqui não é espectadora.<br />
                <span className="text-purple-800">É quem enfrentou o problema de frente.</span>
              </h2>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Karen Langkammer é <strong>Delegada da Polícia Civil do Distrito Federal</strong> e esteve à frente do atendimento direto a mulheres vítimas de violência.
                </p>
                <p>
                  Viu de perto como o abuso começa em sinais silenciosos, como o sistema falha na prevenção e como muitas mulheres só recebem ajuda quando já estão destruídas.
                </p>
                <p className="font-display font-bold text-purple-900 text-xl border-l-4 border-purple-900 pl-4 mt-8">
                  Essa experiência virou compromisso público: transformar dor em política pública eficiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DOWNLOAD DA CARTILHA */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-purple-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-700 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-3 mb-4 text-purple-300 font-semibold tracking-wide uppercase text-sm">
                <ShieldIcon />
                <span>Material Educativo Gratuito</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Cartilha de Proteção e Orientação
              </h3>
              <p className="text-purple-100 leading-relaxed mb-6">
                Informação salva vidas. Baixe agora o material completo com orientações sobre como identificar abusos, canais de denúncia e direitos da mulher.
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <span>PDF Gratuito</span> • <span>Leitura Rápida</span>
              </div>
            </div>
            <button
              onClick={() => openModal('download')}
              className="relative z-10 bg-white text-purple-900 hover:bg-purple-50 font-bold py-4 px-8 rounded-xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-3 w-full md:w-auto text-center"
            >
              <DownloadIcon />
              <span>Baixar Cartilha</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. CONEXÃO EMOCIONAL */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            “Talvez eu esteja exagerando.”<br />
            <span className="text-gray-400 font-normal italic">É assim que tudo começa.</span>
          </h2>

          <div className="space-y-6 text-xl text-gray-700 font-light leading-relaxed">
            <p>Não precisa de grito.</p>
            <p>Não precisa de tapa.</p>
            <p>
              A violência começa quando você passa a duvidar do que sente,
              a se calar para evitar conflito e a diminuir quem você é para caber em alguém.
            </p>
            <div className="pt-8">
              <p className="font-display font-bold text-2xl text-purple-900">
                Isso não é fragilidade.<br />
                É falta de informação, de apoio e de um Estado que chegue antes do pior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DESTAQUE PAUTAS */}
      <section className="py-20 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white text-center relative overflow-hidden">
        {/* Efeitos de brilho decorativos de fundo */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <span className="text-purple-300 font-bold tracking-widest uppercase text-sm mb-3 block">Compromisso e Ação</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Minhas Pautas
          </h2>
          <p className="text-purple-200 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 uppercase tracking-wider font-display">
            Proteger pessoas. Criar oportunidades. Transformar vidas.
          </p>
          <p className="text-purple-100/80 max-w-3xl mx-auto text-base md:text-lg mb-12 leading-relaxed font-light">
            Como Delegada de Polícia, vivi a realidade da segurança pública de perto. Minhas propostas buscam ir na raiz do problema, construindo um futuro de proteção, dignidade e respeito para todo o Distrito Federal.
          </p>

          <div className="mb-12">
            <button
              onClick={() => setShowPautas(!showPautas)}
              className="group inline-flex items-center gap-3 bg-white text-purple-900 font-bold py-4 px-10 rounded-full shadow-2xl hover:bg-purple-100 active:scale-95 transition-all duration-300 text-lg"
            >
              <span>{showPautas ? "Ocultar Pautas" : "Visualizar Minhas Pautas"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${showPautas ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          {/* Grid de Pautas Expansível */}
          <div className={`transition-all duration-700 ease-in-out overflow-hidden ${showPautas ? "max-h-[3000px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95 pointer-events-none"
            }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 text-left">
              {PAUTAS.map((pauta) => (
                <div
                  key={pauta.id}
                  className="bg-purple-900/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 hover:bg-purple-900/60 hover:border-purple-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/20 transition-all duration-300 flex flex-col gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:bg-purple-500/40 group-hover:text-white transition-all duration-300">
                    {pauta.icon("w-6 h-6")}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white mb-2 tracking-wide group-hover:text-purple-200 transition-colors">
                      {pauta.title}
                    </h3>
                    <p className="text-purple-100/70 text-sm md:text-base leading-relaxed font-light">
                      {pauta.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 mb-4 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={handleDownload}
                className="flex items-center gap-3 bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:bg-purple-600/40 hover:text-white hover:border-purple-400 font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 group"
              >
                <span className="group-hover:-translate-y-1 transition-transform duration-300"><DownloadIcon /></span>
                <span>Baixar versão completa em PDF</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROBLEMA DO SISTEMA */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight">
                O problema não é só o agressor.<br />
                <span className="text-purple-400">É um sistema que chega tarde.</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Isso não é falha individual. É falha estrutural. Precisamos mudar a lógica de atuação.
              </p>
            </div>

            <div className="space-y-6">
              {[
                "A maioria das mulheres não denuncia por medo, desinformação ou descrédito",
                "O atendimento ainda é burocrático, frio e fragmentado",
                "A prevenção quase não existe — só a reação ao desastre"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500 transition-colors">
                  <div className="mt-1 text-purple-400">
                    <ArrowRight />
                  </div>
                  <p className="font-medium text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROPOSTA */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold tracking-widest uppercase text-sm mb-2 block">Nosso Compromisso</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              O que muda quando quem legisla já esteve na linha de frente?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Fortalecimento da prevenção e da informação",
              "Ampliação do atendimento humanizado",
              "Integração real entre segurança, saúde e assistência social",
              "Leis pensadas por quem conhece a realidade, não por quem só leu relatório"
            ].map((prop, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 border border-gray-100">
                <div className="bg-purple-50 p-3 rounded-full">
                  <CheckIcon />
                </div>
                <p className="text-lg font-medium text-gray-800 pt-1">{prop}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AUTORIDADE + HUMANIZAÇÃO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl text-center border-t border-b border-gray-100 py-12">
          <p className="text-2xl font-light text-gray-600 italic mb-8">
            “Karen provou, com a própria trajetória, que força policial também é escuta, empatia e responsabilidade.”
          </p>
          <p className="text-lg text-gray-800">
            Sua atuação representa uma nova visão de segurança pública no DF: <strong className="text-purple-900 bg-purple-50 px-2 py-1 rounded">firme contra o agressor e presente para a vítima.</strong>
          </p>
        </div>
      </section>

      {/* 7. CTA FINAL */}
      <section id="apoie" className="py-24 bg-gradient-to-br from-purple-900 to-purple-950 text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Você não está sozinha.</h2>
          <h3 className="text-2xl md:text-3xl text-purple-200 mb-12 font-light">E essa luta não é individual.</h3>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => openModal('footer')}
              className="w-full md:w-auto bg-white text-purple-900 hover:bg-gray-100 font-bold py-5 px-10 rounded-full shadow-xl transition-transform hover:-translate-y-1 text-lg"
            >
              Apoie esta luta
            </button>
            <button
              onClick={() => openModal('footer_info')}
              className="w-full md:w-auto bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white text-white font-bold py-5 px-10 rounded-full transition-all text-lg"
            >
              Receber conteúdos e informações
            </button>
          </div>

          <div className="mt-12">
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Olá! Conheça a causa da Karen Langkammer pela segurança das mulheres no DF: ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-white underline underline-offset-4 transition-colors inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
              Compartilhar essa causa com uma amiga
            </a>
          </div>
        </div>
      </section>

      {/* BLOCO GRUPOS WHATSAPP - REDESIGN PREMIUM (LIGHT THEME) */}
      <section className="py-24 relative overflow-hidden bg-gray-50 border-t border-gray-100">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/40 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/40 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 ring-1 ring-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#greenGradientLight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="greenGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              A força da nossa comunidade
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Escolha sua região e junte-se ao grupo de multiplicadores. Vamos construir juntos um DF mais seguro e com mais oportunidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { city: "Ceilândia / Sol Nascente / Pôr do Sol", link: "https://chat.whatsapp.com/KuglJIzMX0VBbGy1onRhUy?mode=gi_t" },
              { city: "Areal / Arniqueira", link: "https://chat.whatsapp.com/JfoRMYS7tyUIGxcFTb4cyA?mode=gi_t" },
              { city: "Recanto das Emas", link: "https://chat.whatsapp.com/Gbdc2edaNLE07gUYxSS1tI?mode=gi_t" },
              { city: "Planaltina / Sobradinho", link: "https://chat.whatsapp.com/IV5jSpbCxgm5ssC7a26KS0?mode=gi_t" },
            ].map((grupo, i) => (
              <a
                key={i}
                href={grupo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.2)] block"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Borda gradiente animada */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-green-500/20 opacity-0 group-hover:opacity-100 group-hover:from-green-400 group-hover:via-emerald-500 group-hover:to-teal-500 transition-opacity duration-500"></div>

                {/* Conteúdo do Card */}
                <div className="relative h-full flex flex-col md:flex-row items-start md:items-center gap-5 p-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 group-hover:border-transparent transition-all duration-500">

                  {/* Ícone com Glow */}
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shrink-0 group-hover:from-green-500 group-hover:to-emerald-600 transition-all duration-500 border border-green-200 group-hover:border-transparent z-10">
                    <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 rounded-full"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 group-hover:text-white transition-colors duration-500 relative z-10">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>

                  <div className="flex-1 text-left relative z-10">
                    <p className="font-display font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors duration-300 line-clamp-2">
                      {grupo.city}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <p className="text-gray-500 text-sm font-medium">Entrar no grupo</p>
                    </div>
                  </div>

                  {/* Seta Direita */}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-100 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300 shrink-0 self-end md:self-auto border border-gray-100 group-hover:border-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-500 py-12 border-t border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <p className="font-display font-bold text-white text-xl mb-4">Delegada Karen</p>
          <p className="text-sm mb-2">Delegada de Polícia Civil • Pré-candidata a Deputada Distrital</p>
          <p className="text-xs opacity-50 mt-8">
            © {new Date().getFullYear()} Todos os direitos reservados a Karen Langkammer
            <span className="mx-2">|</span>
            <span className="text-purple-400">Desenvolvido por Wess design</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);