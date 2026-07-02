import React, { useState, FormEvent, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabaseClient'; // Conexão real com o banco
import karenPalestra from './karen-palestra.jpg';
import bannerHero from './banner-hero.jpg';

// Ícones Minimalistas
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
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const RAS_DF = [
  "Outro Estado", "Água Quente", "Águas Claras", "Arapoanga", "Arniqueira", "Brazlândia", "Candangolândia", "Ceilândia",
  "Cruzeiro", "Fercal", "Gama", "Guará", "Itapoã", "Jardim Botânico", "Lago Norte", "Lago Sul", "Núcleo Bandeirante",
  "Paranoá", "Park Way", "Planaltina", "Plano Piloto", "Recanto das Emas", "Riacho Fundo", "Riacho Fundo II",
  "Samambaia", "Santa Maria", "São Sebastião", "SCIA (Estrutural)", "SIA", "Sobradinho", "Sobradinho II",
  "Sol Nascente/Pôr do Sol", "Sudoeste/Octogonal", "Taguatinga", "Varjão", "Vicente Pires"
];

const HeroSection = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0">
      <img src={bannerHero} alt="Karen Langkammer" className="w-full h-full object-cover object-top md:object-center" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/70 to-transparent"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
  </div>
);

interface LeadModalProps { isOpen: boolean; onClose: () => void; source: string; }

const LeadModal = ({ isOpen, onClose, source }: LeadModalProps) => {
  const [formData, setFormData] = useState({ nome: '', telefone: '', email: '', ra: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'form' | 'success' | 'instagram'>('form');
  const [emailError, setEmailError] = useState('');

  // Reset view when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView('form');
        setFormData({ nome: '', telefone: '', email: '', ra: '' });
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formatPhone = (val: string) => {
    const nr = val.replace(/\D/g, '');
    if (nr.length <= 2) return nr;
    if (nr.length <= 7) return `(${nr.slice(0, 2)}) ${nr.slice(2)}`;
    return `(${nr.slice(0, 2)}) ${nr.slice(2, 7)}-${nr.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (e.target.name === 'telefone') value = formatPhone(value);
    if (e.target.name === 'email') setEmailError(value && !validateEmail(value) ? 'E-mail inválido' : '');
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
      setEmailError('E-mail inválido para prosseguir.');
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
        link.click();
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
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
        {view === 'form' ? (
          <>
            <div className="bg-purple-900 p-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {source === 'download' ? 'Baixar Cartilha' : 'Faça parte do movimento'}
                </h3>
                <p className="text-purple-200 text-sm">Preencha seus dados para continuar.</p>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white"><CloseIcon /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <input required name="nome" value={formData.nome} onChange={handleChange} placeholder="Seu nome" className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input required name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(61) 99999-9999" className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" />
                <input required name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className={`w-full px-4 py-3 rounded-lg border ${emailError ? 'border-red-500' : 'border-gray-300'} outline-none`} />
              </div>
              <select required name="ra" value={formData.ra} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none">
                <option value="" disabled>Selecione sua RA</option>
                {RAS_DF.map(ra => <option key={ra} value={ra}>{ra}</option>)}
              </select>
              <button type="submit" disabled={isSubmitting} className="w-full bg-purple-900 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-70">
                {isSubmitting ? 'Processando...' : (source === 'download' ? 'Baixar PDF' : 'Enviar e Apoiar')}
              </button>
            </form>
          </>
        ) : view === 'success' ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"><CheckIcon /></div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">Cadastro realizado.</h3>
            <p className="text-gray-600 mb-2">Buscar informação é um ato de coragem.</p>
            <p className="text-gray-600 mb-8">Obrigada por começar.</p>
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
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="3"/><path d="M12 13v4M10 15h4"/></svg>
    )
  },
  {
    id: 2,
    title: "Infância e Família",
    description: "Acompanhamento de temas relacionados ao desenvolvimento infantil, fortalecimento familiar e proteção social.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
    )
  },
  {
    id: 3,
    title: "Famílias Atípicas",
    description: "Inclusão, acolhimento e acesso a serviços públicos para famílias atípicas.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 8v8"/><path d="M8 12h8"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>
    )
  },
  {
    id: 4,
    title: "Segurança Pública",
    description: "Foco na prevenção, integração entre órgãos públicos e proteção da comunidade.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M12 2a5 5 0 0 0-5 5v4h10V7a5 5 0 0 0-5-5z"/></svg>
    )
  },
  {
    id: 5,
    title: "Esporte",
    description: "Valorização do esporte como ferramenta de inclusão, parquinhos e Centro Olímpico.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M6 12A6 6 0 0 1 18 12"/><path d="M12 6A6 6 0 0 1 12 18"/></svg>
    )
  },
  {
    id: 6,
    title: "Saúde Pública",
    description: "Fiscalização relacionadas ao acesso, atendimento e qualidade dos serviços públicos.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    )
  },
  {
    id: 7,
    title: "Mobilidade Urbana",
    description: "Acessibilidade, deslocamento seguro e melhoria dos espaços urbanos.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10"/><path d="M12 16v4"/><circle cx="7" cy="12" r="1"/><circle cx="17" cy="12" r="1"/></svg>
    )
  },
  {
    id: 8,
    title: "Educação",
    description: "Valorização da educação como ferramenta de transformação social, geração de oportunidades e desenvolvimento humano.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    )
  },
  {
    id: 9,
    title: "Gestão Pública e Transparência",
    description: "Eficiência administrativa, fiscalização e transparência na gestão pública.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
    )
  },
  {
    id: 10,
    title: "Empreendedorismo",
    description: "Incentivo à geração de renda, ao fortalecimento dos pequenos negócios e à criação de oportunidades.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    )
  },
  {
    id: 11,
    title: "Inclusão e Respeito às Pessoas",
    description: "Defesa da dignidade humana, combate à discriminação, promoção do respeito e garantia de acesso igualitário aos serviços públicos.",
    icon: (className) => (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
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
  const openModal = (s: string) => { setModalSource(s); setIsModalOpen(true); };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/pautas-dep-karen.pdf';
    link.download = 'pautas-dep-karen.pdf';
    link.click();
  };

  return (
    <div className="font-sans antialiased">
      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source={modalSource} />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center bg-gray-900 text-white overflow-hidden">
        <HeroSection />
        <div className="container mx-auto px-6 relative z-10 pt-20 pb-20">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              A violência contra a mulher <span className="text-purple-300">começa quando ninguém escuta.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 font-light mb-8 border-l-4 border-purple-500 pl-4 drop-shadow-md">
              Eu sou <strong>a Delegada Karen.</strong> Este espaço existe para informar, orientar e proteger. Aqui, a violência é tratada com seriedade, sem relativizações, sem julgamentos e sem atalhos fáceis.
            </p>
            <button onClick={() => openModal('hero')} className="group bg-white text-purple-900 font-bold py-4 px-8 rounded-full shadow-lg flex items-center gap-3 text-lg">
              Conheça a proposta | Apoie essa luta <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* 2. BLOCO AUTORIDADE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/3">
            <div className="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl relative">
              <img src={karenPalestra} alt="Karen" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-purple-900 shadow-sm">Delegada PCDF</div>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Quem fala aqui não é espectadora.<br /><span className="text-purple-800">É quem enfrentou o problema de frente.</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>Karen Langkammer é <strong>Delegada da Polícia Civil do Distrito Federal</strong> e esteve à frente do atendimento direto a mulheres vítimas de violência.</p>
              <p>Viu de perto como o abuso começa em sinais silenciosos, como o sistema falha na prevenção e como muitas mulheres só recebem ajuda quando já estão destruídas.</p>
              <p className="font-display font-bold text-purple-900 text-xl border-l-4 border-purple-900 pl-4 mt-8">Essa experiência virou compromisso público: transformar dor em política pública eficiente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DOWNLOAD DA CARTILHA */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-purple-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-4 text-purple-300 font-semibold tracking-wide uppercase text-sm"><ShieldIcon /><span>Material Educativo Gratuito</span></div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Cartilha de Proteção e Orientação</h3>
              <p className="text-purple-100 leading-relaxed">Informação salva vidas. Baixe agora o material completo.</p>
            </div>
            <button onClick={handleDownload} className="bg-white text-purple-900 font-bold py-4 px-8 rounded-xl flex items-center gap-3 shadow-lg"><DownloadIcon /><span>Baixar Cartilha</span></button>
          </div>
        </div>
      </section>

      {/* BLOCO CONEXÃO EMOCIONAL */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">“Talvez eu esteja exagerando.”<br /><span className="text-gray-400 font-normal italic">É assim que tudo começa.</span></h2>
          <div className="space-y-6 text-xl text-gray-700 font-light leading-relaxed">
            <p>Não precisa de grito. Não precisa de tapa.</p>
            <p>Ela começa quando você duvida do que sente, se cala para evitar conflito e se diminui para caber em alguém.</p>
            <div className="pt-8"><p className="font-display font-bold text-2xl text-purple-900">Isso não é fragilidade. É falta de informação, de apoio e de um Estado que chegue antes do pior.</p></div>
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
          <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
            showPautas ? "max-h-[3000px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95 pointer-events-none"
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

      {/* BLOCO PROBLEMA DO SISTEMA */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight">O problema não é só o agressor.<br /><span className="text-purple-400">É um sistema que chega tarde.</span></h2>
              <p className="text-gray-400 text-lg">Isso não é falha individual. É falha estrutural. Precisamos mudar a lógica de atuação.</p>
            </div>
            <div className="space-y-6">
              {["A maioria das mulheres não denuncia por medo ou descrédito", "O atendimento ainda é burocrático e fragmentado", "A prevenção quase não existe — só a reação ao desastre"].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="mt-1 text-purple-400"><ArrowRight /></div>
                  <p className="font-medium text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO PROPOSTA */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <span className="text-purple-600 font-bold tracking-widest uppercase text-sm mb-2 block">Nosso Compromisso</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-16">O que muda quando quem legisla já esteve na linha de frente?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {["Fortalecimento da prevenção e da informação", "Ampliação do atendimento humanizado", "Integração real entre segurança e assistência", "Leis pensadas por quem conhece a realidade"].map((prop, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm flex items-start gap-4 border border-gray-100">
                <div className="bg-purple-50 p-3 rounded-full"><CheckIcon /></div>
                <p className="text-lg font-medium text-gray-800 text-left pt-1">{prop}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="apoie" className="py-24 bg-gradient-to-br from-purple-900 to-purple-950 text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Você não está sozinha.</h2>
          <h3 className="text-2xl md:text-3xl text-purple-200 mb-12 font-light">E essa luta não é individual.</h3>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button onClick={() => openModal('footer')} className="w-full md:w-auto bg-white text-purple-900 font-bold py-5 px-10 rounded-full shadow-xl">Apoie esta luta</button>
            <button onClick={() => openModal('footer_info')} className="w-full md:w-auto bg-transparent border-2 border-white/30 text-white font-bold py-5 px-10 rounded-full">Receber conteúdos</button>
          </div>
        </div>
      </section>

      {/* BLOCO GRUPOS WHATSAPP */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span className="text-green-700 font-bold tracking-widest uppercase text-sm">Comunidade</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Faça parte dos meus grupos
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-14 leading-relaxed font-light">
            Entre nos grupos de multiplicadores da sua região e acompanhe de perto as ações, eventos e conquistas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                className="group flex items-center gap-5 p-5 md:p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-green-50 hover:border-green-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">
                    {grupo.city}
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">Grupo de Multiplicadores</p>
                </div>
                <div className="ml-auto text-gray-300 group-hover:text-green-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* FOOTER DETALHADO */}
      <footer className="bg-gray-950 text-gray-500 py-12 border-t border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <p className="font-display font-bold text-white text-xl mb-4">KAREN LANGKAMMER</p>
          <p className="text-sm mb-2">Delegada de Polícia Civil</p>
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