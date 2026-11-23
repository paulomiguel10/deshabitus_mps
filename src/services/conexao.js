// verificarConexao() — usado pelos controllers que precisam de internet
// (cadastro/login, desafios em grupo e sincronização – RNF10).
import NetInfo from '@react-native-community/netinfo';

export async function verificarConexao() {
  const estado = await NetInfo.fetch();
  return Boolean(estado.isConnected);
}
