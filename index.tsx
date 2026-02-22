import React, { useState, FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabaseClient'; // Importação adicionada
import karenPalestra from './karen-palestra.jpg';
import bannerHero from './banner-hero.jpg';

// Ícones
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
      <img src={bannerHero} alt="Banner" className="w-full h-full object-cover object-top" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/70 to-transparent"></div>
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

  const formatPhone = (value: string) => {
    const nr = value.replace(/\D/g, '');
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
    if (!formData.nome || !formData.telefone || !formData.email || !formData.ra) return alert('Preencha tudo.');

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([{ ...formData, source }]);
      if (error) throw error;

      setIsSuccess(true);
      if (source === 'download') {
        const a = document.createElement('a');
        a.href = '/cartilha-karen-langkammer.pdf';
        a.download = 'cartilha.pdf';
        a.click();
      }
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {!isSuccess ? (
          <>
            <div className="bg-purple-900 p-6 flex justify-between">
              <h3 className="text-xl font-bold text-white">{source === 'download' ? 'Baixar Cartilha' : 'Apoie a Causa'}</h3>
              <button onClick={onClose} className="text-white"><CloseIcon /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <input name="nome" placeholder="Nome" onChange={handleChange} required className="w-full p-3 border rounded" />
              <input name="telefone" placeholder="Telefone" onChange={handleChange} required className="w-full p-3 border rounded" />
              <input name="email" placeholder="E-mail" onChange={handleChange} required className="w-full p-3 border rounded" />
              <select name="ra" onChange={handleChange} required className="w-full p-3 border rounded">
                <option value="">Selecione a RA</option>
                {RAS_DF.map(ra => <option key={ra} value={ra}>{ra}</option>)}
              </select>
              <button disabled={isSubmitting} className="w-full bg-purple-900 text-white p-4 rounded font-bold">
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </>
        ) : (
          <div className="p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Sucesso!</h3>
            <button onClick={onClose} className="bg-gray-200 px-6 py-2 rounded">Fechar</button>
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
      <section className="relative min-h-[90vh] flex items-center bg-gray-900 text-white">
        <HeroSection />
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">A violência contra a mulher não começa no soco.</h1>
          <button onClick={() => openModal('hero')} className="bg-white text-purple-900 font-bold py-4 px-8 rounded-full">Apoie essa luta</button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
          <img src={karenPalestra} className="w-full md:w-1/3 rounded-xl shadow-xl" alt="Karen" />
          <div>
            <h2 className="text-3xl font-bold mb-6">Quem fala aqui não é espectadora.</h2>
            <p className="text-lg text-gray-600">Karen Langkammer é Delegada da PCDF e luta pela segurança feminina.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="bg-purple-900 text-white p-10 rounded-3xl">
            <h3 className="text-2xl font-bold mb-4">Cartilha de Orientação</h3>
            <button onClick={() => openModal('download')} className="bg-white text-purple-900 font-bold py-3 px-8 rounded-xl">Baixar Agora</button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 py-12 text-center text-gray-500">
        <p className="text-white font-bold">KAREN LANGKAMMER</p>
        <p className="text-xs mt-4">© 2026 Desenvolvido por Wess design</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);