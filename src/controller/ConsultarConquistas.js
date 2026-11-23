// C-ConsultarConquistas — UC10 Consultar medalhas e conquistas (VCP08: E-Jornada -> E-Conquista)
export const ConsultarConquistas = {
  // consultarConquistas(jornada) : { modo, diasConsecutivos, marcoAtingido, proximoMarco, conquistas }
  async consultarConquistas(jornada) {
    await jornada.verificarConquistas(); // concede o que já foi alcançado (RN022, RN023, RN024)
    return {
      modo: jornada.obterModo(), // a tela usa o modo para esconder os números (RN09)
      diasConsecutivos: jornada.calcularDiasConsecutivos(),
      marcoAtingido: jornada.obterMarcosAtingidos(),
      proximoMarco: jornada.obterProximoMarco(),
      conquistas: await jornada.obterConquistas(),
    };
  },
};
