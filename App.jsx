import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyA3g9gmFn-Uc_SoLHsVhH7eIwgzMOYmIAQ",
  authDomain: "organizaedu.firebaseapp.com",
  projectId: "organizaedu",
  storageBucket: "organizaedu.firebasestorage.app",
  messagingSenderId: "300213242364",
  appId: "1:300213242364:web:76019e1dc63cb89f034a79",
  measurementId: "G-N1GS8DXP4Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- DADOS GLOBAIS ---
const universitiesList = [
  // --- BAHIA (No Topo Absoluto) ---
  "UFRB - Universidade Federal do Recôncavo da Bahia",
  "UFBA - Universidade Federal da Bahia",
  "UFOB - Universidade Federal do Oeste da Bahia",
  "UFSB - Universidade Federal do Sul da Bahia",
  "UNIVASF - Universidade Federal do Vale do São Francisco",
  "UNEB - Universidade do Estado da Bahia",
  "UEFS - Universidade Estadual de Feira de Santana",
  "UESB - Universidade Estadual do Sudoeste da Bahia",
  "UESC - Universidade Estadual de Santa Cruz",
  "IFBA - Instituto Federal da Bahia",
  "IF Baiano - Instituto Federal Baiano",

  // --- UNIVERSIDADES FEDERAIS ---
  "UFAC - Universidade Federal do Acre",
  "UFAL - Universidade Federal de Alagoas",
  "UNIFAP - Universidade Federal do Amapá",
  "UFAM - Universidade Federal do Amazonas",
  "UNILAB - Universidade da Integração Internacional da Lusofonia Afro-Brasileira",
  "UFC - Universidade Federal do Ceará",
  "UFCA - Universidade Federal do Cariri",
  "UnB - Universidade de Brasília",
  "UFES - Universidade Federal do Espírito Santo",
  "UFG - Universidade Federal de Goiás",
  "UFCAT - Universidade Federal de Catalão",
  "UFJ - Universidade Federal de Jataí",
  "UFMA - Universidade Federal do Maranhão",
  "UFMT - Universidade Federal de Mato Grosso",
  "UFR - Universidade Federal de Rondonópolis",
  "UFMS - Universidade Federal de Mato Grosso do Sul",
  "UFGD - Universidade Federal da Grande Dourados",
  "UFMG - Universidade Federal de Minas Gerais",
  "UFOP - Universidade Federal de Ouro Preto",
  "UFLA - Universidade Federal de Lavras",
  "UFV - Universidade Federal de Viçosa",
  "UNIFAL - Universidade Federal de Alfenas",
  "UNIFEI - Universidade Federal de Itajubá",
  "UFJF - Universidade Federal de Juiz de Fora",
  "UFSJ - Universidade Federal de São João del-Rei",
  "UFU - Universidade Federal de Uberlândia",
  "UFVJM - Universidade Federal dos Vales do Jequitinhonha e Mucuri",
  "UFTM - Universidade Federal do Triângulo Mineiro",
  "UFPA - Universidade Federal do Pará",
  "UNIFESSPA - Universidade Federal do Sul e Sudeste do Pará",
  "UFOPA - Universidade Federal do Oeste do Pará",
  "UFPB - Universidade Federal da Paraíba",
  "UFCG - Universidade Federal de Campina Grande",
  "UFPR - Universidade Federal do Paraná",
  "UTFPR - Universidade Tecnológica Federal do Paraná",
  "UNILA - Universidade Federal da Integração Latino-Americana",
  "UFPE - Universidade Federal de Pernambuco",
  "UFRPE - Universidade Federal Rural de Pernambuco",
  "UFAPE - Universidade Federal do Agreste de Pernambuco",
  "UFPI - Universidade Federal do Piauí",
  "UFDPar - Universidade Federal do Delta do Parnaíba",
  "UFRJ - Universidade Federal do Rio de Janeiro",
  "UFF - Universidade Federal Fluminense",
  "UFRRJ - Universidade Federal Rural do Rio de Janeiro",
  "UNIRIO - Universidade Federal do Estado do Rio de Janeiro",
  "UFRN - Universidade Federal do Rio Grande do Norte",
  "UFERSA - Universidade Federal Rural do Semi-Árido",
  "UFRGS - Universidade Federal do Rio Grande do Sul",
  "UFSM - Universidade Federal de Santa Maria",
  "UFPel - Universidade Federal de Pelotas",
  "UNIPAMPA - Universidade Federal do Pampa",
  "UFCSPA - Universidade Federal de Ciências da Saúde de Porto Alegre",
  "UFFS - Universidade Federal da Fronteira Sul",
  "UNIR - Universidade Federal de Rondônia",
  "UFRR - Universidade Federal de Roraima",
  "UFSC - Universidade Federal de Santa Catarina",
  "UNIFESP - Universidade Federal de São Paulo",
  "UFSCar - Universidade Federal de São Carlos",
  "UFABC - Universidade Federal do ABC",
  "UFS - Universidade Federal de Sergipe",
  "UFT - Universidade Federal do Tocantins",
  "UFNT - Universidade Federal do Norte do Tocantins",

  // --- UNIVERSIDADES ESTADUAIS ---
  "USP - Universidade de São Paulo",
  "UNICAMP - Universidade Estadual de Campinas",
  "UNESP - Universidade Estadual Paulista",
  "UERJ - Universidade do Estado do Rio de Janeiro",
  "UEL - Universidade Estadual de Londrina",
  "UEM - Universidade Estadual de Maringá",
  "UENF - Universidade Estadual do Norte Fluminense",
  "UECE - Universidade Estadual do Ceará",
  "UVA - Universidade Estadual Vale do Acaraú",
  "URCA - Universidade Regional do Cariri",
  "UEMG - Universidade do Estado de Minas Gerais",
  "UNIMONTES - Universidade Estadual de Montes Claros",
  "UEG - Universidade Estadual de Goiás",
  "UEMA - Universidade Estadual do Maranhão",
  "UEPB - Universidade Estadual da Paraíba",
  "UEPG - Universidade Estadual de Ponta Grossa",
  "UNIOESTE - Universidade Estadual do Oeste do Paraná",
  "UNICENTRO - Universidade Estadual do Centro-Oeste",
  "UENP - Universidade Estadual do Norte do Paraná",

  // --- INSTITUTOS FEDERAIS E PRIVADAS ---
  "IFCE - Instituto Federal do Ceará",
  "IFMG - Instituto Federal de Minas Gerais",
  "IFPB - Instituto Federal da Paraíba",
  "IFPE - Instituto Federal de Pernambuco",
  "IFPI - Instituto Federal do Piauí",
  "IFPR - Instituto Federal do Paraná",
  "IFRJ - Instituto Federal do Rio de Janeiro",
  "IFRN - Instituto Federal do Rio Grande do Norte",
  "IFRS - Instituto Federal do Rio Grande do Sul",
  "IFSC - Instituto Federal de Santa Catarina",
  "IFSP - Instituto Federal de São Paulo",
  "Anhanguera",
  "Anhembi Morumbi",
  "Cruzeiro do Sul",
  "ESPM - Escola Superior de Propaganda e Marketing",
  "Estácio",
  "FGV - Fundação Getulio Vargas",
  "FMU - Faculdades Metropolitanas Unidas",
  "Ibmec",
  "Insper",
  "Mackenzie - Universidade Presbiteriana Mackenzie",
  "PUC-Campinas - Pontifícia Universidade Católica de Campinas",
  "PUC-MG - Pontifícia Universidade Católica de Minas Gerais",
  "PUC-PR - Pontifícia Universidade Católica do Paraná",
  "PUC-RJ - Pontifícia Universidade Católica do Rio de Janeiro",
  "PUC-RS - Pontifícia Universidade Católica do Rio Grande do Sul",
  "PUC-SP - Pontifícia Universidade Católica de São Paulo",
  "UNIP - Universidade Paulista",
  "UNISINOS - Universidade do Vale do Rio dos Sinos",
  "Outra (Digitar manualmente)"
];

const semestersList = [
  "1º Semestre", "2º Semestre", "3º Semestre", "4º Semestre", 
  "5º Semestre", "6º Semestre", "7º Semestre", "8º Semestre", 
  "9º Semestre", "10º Semestre", "11º Semestre", "12º Semestre"
];

// --- ÍCONES SVG ---
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264,51.509 C -3.264,50.719 -3.334,49.969 -3.454,49.239 L -14.754,49.239 L -14.754,53.749 L -8.284,53.749 C -8.574,55.229 -9.424,56.479 -10.684,57.329 L -10.684,60.329 L -6.824,60.329 C -4.564,58.239 -3.264,55.159 -3.264,51.509 Z"/>
      <path fill="#34A853" d="M -14.754,63.239 C -11.514,63.239 -8.804,62.159 -6.824,60.329 L -10.684,57.329 C -11.764,58.049 -13.134,58.489 -14.754,58.489 C -17.884,58.489 -20.534,56.379 -21.484,53.529 L -25.464,53.529 L -25.464,56.619 C -23.494,60.539 -19.444,63.239 -14.754,63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484,53.529 C -21.734,52.809 -21.864,52.039 -21.864,51.239 C -21.864,50.439 -21.724,49.669 -21.484,48.949 L -21.484,45.859 L -25.464,45.859 C -26.284,47.479 -26.754,49.299 -26.754,51.239 C -26.754,53.179 -26.284,54.999 -25.464,56.619 L -21.484,53.529 Z"/>
      <path fill="#EA4335" d="M -14.754,43.989 C -12.984,43.989 -11.404,44.599 -10.154,45.789 L -6.734,41.939 C -8.804,40.009 -11.514,38.989 -14.754,38.989 C -19.444,38.989 -23.494,41.689 -25.464,45.859 L -21.484,48.949 C -20.534,46.099 -17.884,43.989 -14.754,43.989 Z"/>
    </g>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#32D74B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ArrowBackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// --- TELA DE CARREGAMENTO (SPLASH) ---
const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white">
      <div className="flex flex-col items-center justify-center animate-pulse">
        <img 
          src="https://i.imgur.com/PC5Ijma.png" 
          alt="OrganizaEdu Logo" 
          className="w-40 h-40 object-contain drop-shadow-2xl"
        />
        <h1 className="mt-8 text-3xl font-bold tracking-wide">
          OrganizaEdu
        </h1>
      </div>
    </div>
  );
};

// --- TELA DE LOGIN ---
const LoginScreen = ({ onLoginClick }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 md:w-[500px] md:h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center justify-center w-full max-w-5xl px-8 h-full">
        <div className="flex flex-col items-center justify-center flex-1 w-full mt-16 md:mt-0">
          <img 
            src="https://i.imgur.com/PC5Ijma.png" 
            alt="OrganizaEdu Logo" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain mb-8 md:mb-12 hover:scale-105 transition-transform duration-500"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-center">
            Bem-vindo
          </h1>
          <p className="text-lg md:text-xl text-gray-400 text-center max-w-md md:max-w-lg leading-relaxed">
            A sua vida acadêmica organizada de forma incrivelmente simples.
          </p>
        </div>

        <div className="w-full flex justify-center pb-12 pt-8 md:pb-24">
          <button 
            onClick={onLoginClick}
            className="flex items-center justify-center w-full max-w-sm md:max-w-md bg-white text-black py-4 px-6 rounded-2xl md:rounded-full font-semibold text-lg hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <GoogleIcon />
            <span className="ml-4">Continuar com o Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SUB-TELAS DE SELEÇÃO ---
const SelectionScreen = ({ title, items, onSelect, onBack, showSearch = false }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] text-white">
      {/* Header */}
      <div className="flex items-center p-4 pt-6 border-b border-white/5">
        <button onClick={onBack} className="p-2 mr-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowBackIcon />
        </button>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Ex: USP, Ceará, Bahia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1C1C1E] text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect(item)}
            className="w-full text-left bg-transparent hover:bg-[#1C1C1E] active:bg-[#2C2C2E] text-white py-4 px-4 rounded-xl transition-colors border-b border-white/5 last:border-0"
          >
            <span className="text-base">{item}</span>
          </button>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>
    </div>
  );
};


// --- TELA DE CONFIGURAÇÃO DE PERFIL ---
const SetupProfileScreen = ({ user, onComplete }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [university, setUniversity] = useState('');
  const [customUniversity, setCustomUniversity] = useState('');
  
  // Controle das telas de seleção sobrepostas
  const [showUniSelect, setShowUniSelect] = useState(false);
  const [showSemSelect, setShowSemSelect] = useState(false);

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (university !== "Outra (Digitar manualmente)") {
      setCustomUniversity('');
    }
  }, [university]);

  useEffect(() => {
    if (username.trim().length > 2) {
      setIsCheckingUsername(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const q = query(collection(db, "users"), where("username", "==", username));
          const querySnapshot = await getDocs(q);
          setIsUsernameAvailable(querySnapshot.empty);
        } catch (error) {
          console.error("Erro ao verificar username:", error);
          setIsUsernameAvailable(false);
        } finally {
          setIsCheckingUsername(false);
        }
      }, 800);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setIsUsernameAvailable(true);
    }
  }, [username]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSaving) return;

    setIsSaving(true);
    try {
      const finalUniversity = university === "Outra (Digitar manualmente)" ? customUniversity : university;
      
      await setDoc(doc(db, "users", user.uid), {
        displayName,
        username,
        course,
        semester,
        university: finalUniversity,
        profileImageUrl: user?.photoURL || ""
      }, { merge: true });
      onComplete();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Ocorreu um erro ao salvar o perfil.");
      setIsSaving(false);
    }
  };

  const isUniversityValid = university && (university !== "Outra (Digitar manualmente)" || customUniversity.trim() !== "");
  const isFormValid = displayName && username.length > 2 && course && semester && isUniversityValid && isUsernameAvailable && !isCheckingUsername;

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center pt-12 px-6 pb-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-extrabold mb-2 text-center tracking-tight">Complete seu perfil</h2>
          <p className="text-gray-400 text-center mb-10">Precisamos de alguns dados para personalizar sua experiência.</p>

          <form onSubmit={handleSave} className="space-y-5">
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1 ml-1">Nome de Perfil (Ex: João Silva)</label>
              <input 
                type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#1C1C1E] text-white rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1 ml-1">Nome de Usuário (@usuario)</label>
              <div className="relative">
                <input 
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                  className={`w-full bg-[#1C1C1E] text-white rounded-2xl px-4 py-4 outline-none transition-all ${!isUsernameAvailable && username.length > 2 ? 'ring-2 ring-[#FF3B30]' : 'focus:ring-2 focus:ring-[#4A90E2]'}`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isCheckingUsername ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-[#4A90E2] rounded-full animate-spin"></div>
                  ) : username.length > 2 ? (
                    isUsernameAvailable ? <CheckCircleIcon /> : <XCircleIcon />
                  ) : null}
                </div>
              </div>
              {username.length > 2 && !isCheckingUsername && !isUsernameAvailable && (
                <p className="text-[#FF3B30] text-xs mt-1 ml-1">Este nome de usuário já está em uso!</p>
              )}
              <p className="text-gray-500 text-xs mt-1 ml-1">Esse nome deve ser único globalmente.</p>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1 ml-1">Qual o seu curso?</label>
              <input 
                type="text" required value={course} onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-[#1C1C1E] text-white rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
              />
            </div>

            {/* Semestre - Substituído por Botão */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1 ml-1">Semestre atual</label>
              <button
                type="button"
                onClick={() => setShowSemSelect(true)}
                className={`w-full text-left bg-[#1C1C1E] rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all ${!semester ? 'text-gray-500' : 'text-white'}`}
              >
                {semester || "Selecione o semestre..."}
              </button>
            </div>

            {/* Universidade - Substituído por Botão */}
            <div className="flex flex-col mb-4">
              <label className="text-sm text-gray-400 mb-1 ml-1">Sua Universidade (Sigla - Nome)</label>
              <button
                type="button"
                onClick={() => setShowUniSelect(true)}
                className={`w-full text-left bg-[#1C1C1E] rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all ${!university ? 'text-gray-500' : 'text-white'}`}
              >
                <div className="truncate">
                   {university || "Toque para buscar..."}
                </div>
              </button>
            </div>

            {/* Input Extra se for "Outra" */}
            {university === "Outra (Digitar manualmente)" && (
              <div className="flex flex-col mb-8 animate-fade-in">
                <label className="text-sm text-gray-400 mb-1 ml-1">Qual o nome da sua universidade?</label>
                <input 
                  type="text" required value={customUniversity} onChange={(e) => setCustomUniversity(e.target.value)}
                  className="w-full bg-[#1C1C1E] text-white rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
                />
              </div>
            )}

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={!isFormValid}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isFormValid ? 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-lg' : 'bg-[#1C1C1E] text-gray-500 cursor-not-allowed'}`}
              >
                {isSaving ? 'Salvando...' : 'Finalizar Perfil'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* OVERLAYS (MODALS FULLSCREEN) PARA SELEÇÃO */}
      {showUniSelect && (
        <SelectionScreen 
          title="Buscar Universidade" 
          items={universitiesList} 
          showSearch={true}
          onSelect={(val) => { setUniversity(val); setShowUniSelect(false); }} 
          onBack={() => setShowUniSelect(false)} 
        />
      )}

      {showSemSelect && (
        <SelectionScreen 
          title="Semestre atual" 
          items={semestersList} 
          onSelect={(val) => { setSemester(val); setShowSemSelect(false); }} 
          onBack={() => setShowSemSelect(false)} 
        />
      )}
    </>
  );
};

// --- TELA HOME (MOCK PARA TESTE DO FLUXO) ---
const HomeScreen = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-6 text-center">
      {user?.photoURL ? (
        <img src={user.photoURL} alt="Perfil" className="w-24 h-24 rounded-full border-2 border-[#4A90E2] mb-6" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-[#1C1C1E] flex items-center justify-center mb-6">
          <span className="text-3xl">👤</span>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2">Bem-vindo ao OrganizaEdu Web!</h1>
      <p className="text-gray-400 mb-8">Seu perfil está configurado e pronto.</p>
      
      <button 
        onClick={onLogout}
        className="px-6 py-3 bg-[#FF3B30]/10 text-[#FF3B30] rounded-xl font-bold hover:bg-[#FF3B30]/20 transition-colors"
      >
        Sair da Conta
      </button>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL E GERENCIAMENTO DE ESTADO ---
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Monitora o estado de autenticação em tempo real
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Verifica se o usuário já preencheu o perfil no Firestore
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setCurrentScreen('home'); // Já tem perfil, vai pro app
          } else {
            setCurrentScreen('setup_profile'); // Não tem perfil, precisa preencher
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário", error);
          setCurrentScreen('setup_profile');
        }
      } else {
        setUser(null);
        // Se não tem usuário, espera o splash screen terminar e mostra o login
        setTimeout(() => setCurrentScreen('login'), 2000);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro ao fazer login com o Google", error);
      
      // Tratativa pura e segura para o erro de Domínio Não Autorizado, SEM fallback anônimo
      if (error.code === 'auth/unauthorized-domain') {
        alert(
          "⚠️ Domínio Não Autorizado:\n\n" +
          "O domínio atual (scf.usercontent.goog) precisa ser adicionado nas configurações do seu Firebase.\n\n" +
          "Vá em: Firebase Console -> Authentication -> Settings -> Authorized domains, e adicione 'scf.usercontent.goog'."
        );
      } else {
        alert("Ocorreu um erro ao tentar fazer login com o Google: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  }

  return (
    <div className="font-sans antialiased selection:bg-[#4A90E2]/30">
      {currentScreen === 'loading' && <LoadingScreen />}
      {currentScreen === 'login' && <LoginScreen onLoginClick={handleGoogleLogin} />}
      {currentScreen === 'setup_profile' && <SetupProfileScreen user={user} onComplete={() => setCurrentScreen('home')} />}
      {currentScreen === 'home' && <HomeScreen user={user} onLogout={handleLogout} />}
    </div>
  );
}