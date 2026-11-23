// C-RegistrarCheckIn — UC09 Registrar check-in de esforço (VCP07: E-Jornada -> E-CheckInEsforco)
// RN021: nível de 1 a 5, um por dia, observação opcional.
export const RegistrarCheckIn = {
  // registrarCheckIn(jornada, nivel, observacao) : void
  async registrarCheckIn(jornada, nivel, observacao) {
    await jornada.registrarCheckIn(nivel, observacao);
  },
};
