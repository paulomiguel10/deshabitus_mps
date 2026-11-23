// Design system do Deshabitus (Figma, estilo Frutiger Aero)
// Página 01 – Fundamentos: cores, gradientes, tipografia, espaçamento, raios e sombra.
// As telas NUNCA usam cor "solta": sempre um token daqui.

export const cores = {
  texto: '#0D3D3A',          // teal escuro: títulos e texto principal
  textoSuave: '#35635F',     // texto secundário, legendas
  traco: '#548B86',          // contorno de botões e campos
  bordaSuave: 'rgba(84,139,134,0.35)',
  lima: '#8CC63F',
  limaClaro: '#D4EDA7',
  agua: '#86DDD8',
  ceu: '#BDEBFA',
  ceuClaro: '#DFF6FF',
  vidro: 'rgba(255,255,255,0.94)', // cards e campos "de vidro"
  branco: '#FFFFFF',
  sos: '#B53D36',            // só para SOS e ações destrutivas
  sosClaro: '#EBA296',
  desabilitado: '#E3EAE8',
  textoDesabilitado: '#6F807E',
  placeholder: '#5E7F7B',
};

// Gradientes (de cima para baixo)
export const gradientes = {
  ceu: ['#DFF6FF', '#BDEBFA', '#86DDD8'], // fundo das telas
  lima: ['#D4EDA7', '#8CC63F'],           // botão principal (gel)
  agua: ['#DFF6FF', '#86DDD8'],           // botão secundário (gel)
  aguaLima: ['#86DDD8', '#D4EDA7'],       // card de destaque
  sos: ['#EBA296', '#B53D36'],            // botão SOS
};

export const fontes = {
  regular: 'NunitoSans_400Regular',
  semi: 'NunitoSans_600SemiBold',
  negrito: 'NunitoSans_700Bold',
  extra: 'NunitoSans_800ExtraBold',
};

// Base de 4 px
export const espaco = { xs: 4, p: 8, m: 12, g: 16, xg: 20, xxg: 24, xxxg: 32 };

export const raios = { p: 8, m: 12, g: 16, card: 24, pilula: 28 };

export const sombra = {
  shadowColor: '#0D3D3A',
  shadowOpacity: 0.12,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};
