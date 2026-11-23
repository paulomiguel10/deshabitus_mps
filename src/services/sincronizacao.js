// Sincronização SQLite -> Cloud Firestore (ADR-004 / ADR-008), usada por Jornada.sincronizarPendentes().
// No DC-ENTIDADE só E-RegistroTentacao e E-CheckInEsforco têm o atributo "sincronizado" (RN029):
//   1. enviar as linhas com sincronizado = 0 para usuarios/{uid}/{tabela}/{id} e chamar marcarSincronizado()
//   2. enviar também o estado atual de usuario, jornada, habito e conquista (poucos registros; o id evita duplicar)
// TODO: implementar junto com Jornada.sincronizarPendentes().
import NetInfo from '@react-native-community/netinfo';

export const TABELAS_COM_PENDENTES = ['registroTentacao', 'checkInEsforco'];
export const TABELAS_ESTADO = ['usuario', 'jornada', 'habito', 'conquista'];

export function iniciarSincronizacao(aoConectar) {
  // Retorna a função que desliga o ouvinte
  return NetInfo.addEventListener((estado) => {
    if (estado.isConnected) aoConectar?.();
  });
}
