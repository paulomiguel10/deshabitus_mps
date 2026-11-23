// Sincronização SQLite -> Cloud Firestore (ADR-004 / ADR-008).
// Ideia: ao detectar internet, enviar os registros com sincronizado = 0 para
// usuarios/{uid}/{tabela}/{id} e marcar sincronizado = 1 (marcarSincronizado()).
// TODO: implementar junto com Jornada.sincronizarPendentes().
import NetInfo from '@react-native-community/netinfo';

export const TABELAS_SINCRONIZADAS = ['usuario', 'habito', 'jornada', 'registroTentacao', 'checkInEsforco', 'jornadaConquista'];

export function iniciarSincronizacao(aoConectar) {
  // Retorna a função que desliga o ouvinte
  return NetInfo.addEventListener((estado) => {
    if (estado.isConnected) aoConectar?.();
  });
}
