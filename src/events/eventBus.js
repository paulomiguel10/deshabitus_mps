// Barramento de eventos interno (ADR-009).
// Um módulo PUBLICA o que aconteceu; outros módulos ASSINAM e reagem,
// sem que um precise conhecer o outro.
//
//   eventBus.on(EVENTOS.REGISTRO_CRIADO, (dados) => { ... });
//   eventBus.emit(EVENTOS.REGISTRO_CRIADO, { habitoId });

const ouvintes = {};

export const EVENTOS = {
  HABITO_CADASTRADO: 'habito:cadastrado',
  JORNADA_REINICIADA: 'jornada:reiniciada', // recaída com recomeço (RN19)
  JORNADA_ENCERRADA: 'jornada:encerrada',   // UC12 / RN30
  REGISTRO_CRIADO: 'registro:criado',       // tentação, check-in
  MODO_ALTERADO: 'modo:alterado',           // padrão <-> cego (RN10)
  DADOS_LOCAIS_ALTERADOS: 'dados:alterados',// dispara a sincronização
};

export const eventBus = {
  on(evento, callback) {
    (ouvintes[evento] ??= new Set()).add(callback);
    return () => ouvintes[evento].delete(callback); // função para cancelar
  },
  emit(evento, dados) {
    (ouvintes[evento] ?? []).forEach((cb) => {
      try {
        cb(dados);
      } catch (erro) {
        console.warn(`[eventBus] erro ao tratar "${evento}":`, erro);
      }
    });
  },
};
