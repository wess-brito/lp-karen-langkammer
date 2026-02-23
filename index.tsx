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

const RAS_DF = [
  "Outro Estado", "Plano Piloto", "Gama", "Taguatinga", "Brazlândia", "Sobradinho", "Planaltina", "Paranoá",
  "Núcleo Bandeirante", "Ceilândia", "Guará", "Cruzeiro", "Samambaia", "Santa Maria", "São Sebastião",
  "Recanto das Emas", "Lago Sul", "Riacho Fundo", "Lago Norte", "Candangolândia", "Águas Claras",
  "Riacho Fundo II", "Sudoeste/Octogonal", "Varjão", "Park Way", "SCIA (Estrutural)", "Sobradinho II",
  "Jardim Botânico", "Itapoã", "SIA", "Vicente Pires", "Fercal", "Sol Nascente/Pôr do Sol", "Arniqueira",
  "Arapoanga", "Água Quente"
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

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

      setIsSuccess(true);
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
        {!isSuccess ? (
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
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"><CheckIcon /></div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">Cadastro realizado!</h3>
            <button onClick={onClose} className="px-8 py-3 bg-gray-100 rounded-lg">Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState('hero');
  const openModal = (s: string) => { setModalSource(s); setIsModalOpen(true); };

  return (
    <div className="font-sans antialiased">
      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source={modalSource} />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center bg-gray-900 text-white overflow-hidden">
        <HeroSection />
        <div className="container mx-auto px-6 relative z-10 pt-20 pb-20">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              A violência contra a mulher não começa no soco.<br />
              <span className="text-purple-300">Começa no silêncio.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 font-light mb-8 border-l-4 border-purple-500 pl-4 drop-shadow-md">
              Eu sou <strong>Karen Langkammer</strong>, Delegada de Polícia Civil, e luto para que nenhuma mulher precise quebrar para ser protegida.
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
            <button onClick={() => openModal('download')} className="bg-white text-purple-900 font-bold py-4 px-8 rounded-xl flex items-center gap-3 shadow-lg"><DownloadIcon /><span>Baixar Cartilha</span></button>
          </div>
        </div>
      </section>

      {/* BLOCO CONEXÃO EMOCIONAL */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">“Talvez eu esteja exagerando.”<br /><span className="text-gray-400 font-normal italic">É assim que tudo começa.</span></h2>
          <div className="space-y-6 text-xl text-gray-700 font-light leading-relaxed">
            <p>Não precisa de grito. Não precisa de tapa.</p>
            <p>A violência começa quando você passa a duvidar do que sente, a se calar para evitar conflito e a diminuir quem você é para caber em alguém.</p>
            <div className="pt-8"><p className="font-display font-bold text-2xl text-purple-900">Isso não é fragilidade. É falta de informação, de apoio e de um Estado que chegue antes do pior.</p></div>
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

      {/* FOOTER DETALHADO */}
      <footer className="bg-gray-950 text-gray-500 py-12 border-t border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <p className="font-display font-bold text-white text-xl mb-4">KAREN LANGKAMMER</p>
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