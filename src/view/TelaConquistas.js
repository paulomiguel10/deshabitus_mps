// F-TelaConquistas — UC10 Consultar medalhas e conquistas (VCP08)
// Marcos (5, 10, 20, 40, 60 dias consecutivos), medalhas (60, 90, 120, 150) e conquistas de manutenção (RN022, RN023).
// Modo cego: números de dias ocultos (RN09); as medalhas obtidas continuam aparecendo.
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Tela from './components/Tela';
import Texto from './components/Texto';
import Card from './components/Card';
import BarraProgresso from './components/BarraProgresso';
import { ConsultarConquistas } from '../controller/ConsultarConquistas';
import { obterModoExibicao } from '../strategies/modoExibicao';
import { MARCOS_DIAS } from '../model/regras';
import { TipoConquista } from '../model/enums';
import { useSessao } from './SessaoContext';
import { cores, gradientes } from '../theme/cores';

// Cor de cada medalha (os nomes vêm de MEDALHAS em model/regras.js)
const COR_MEDALHA = { Bronze: '#B0713A', Prata: '#7F8C93', Ouro: '#C9970C', Diamante: '#2E9CC4' };

function Marco({ dias, atingido }) {
  return (
    <View
      accessibilityLabel={`Marco de ${dias} dias ${atingido ? 'atingido' : 'ainda não atingido'}`}
      style={[styles.marco, !atingido && styles.marcoPendente]}
    >
      {atingido ? <LinearGradient colors={gradientes.lima} style={StyleSheet.absoluteFill} /> : null}
      {atingido ? <Ionicons name="checkmark" size={14} color={cores.texto} /> : null}
      <Texto variante="rotulo" cor={atingido ? cores.texto : cores.textoSuave}>{dias}d</Texto>
    </View>
  );
}

function ItemConquista({ conquista }) {
  const medalha = conquista.tipo === TipoConquista.MEDALHA;
  const cor = medalha ? COR_MEDALHA[conquista.nome] ?? cores.texto : cores.lima;
  return (
    <View style={styles.item}>
      <View style={[styles.icone, { borderColor: cor }]}>
        <Ionicons name={medalha ? 'medal' : 'star'} size={22} color={cor} />
      </View>
      <View style={{ flex: 1 }}>
        <Texto variante="corpoForte">{conquista.nome}</Texto>
        <Texto variante="legenda">{medalha ? 'Medalha' : 'Conquista de manutenção'}</Texto>
      </View>
    </View>
  );
}

export default function TelaConquistas() {
  const { jornada } = useSessao();
  const [dados, setDados] = useState(null);

  useFocusEffect(
    useCallback(() => {
      ConsultarConquistas.consultarConquistas(jornada).then(setDados);
    }, [jornada])
  );

  if (!dados) {
    return (
      <Tela titulo="Conquistas">
        <ActivityIndicator color={cores.texto} />
      </Tela>
    );
  }
  const exibir = obterModoExibicao(dados.modo);

  return (
    <Tela titulo="Conquistas">
      <Card variante="destaque" titulo="Sua contagem" icone="leaf-outline">
        <Texto variante={exibir.mostraMetricas ? 'numero' : 'h2'}>{exibir.dias(dados.diasConsecutivos)}</Texto>
        {exibir.mostraMetricas ? (
          <BarraProgresso
            fracao={dados.diasConsecutivos / dados.proximoMarco}
            rotulo={exibir.progresso(dados.diasConsecutivos, dados.proximoMarco)}
          />
        ) : null}
        <Texto cor={cores.textoSuave}>{exibir.progresso(dados.diasConsecutivos, dados.proximoMarco)}</Texto>
      </Card>

      {exibir.mostraMetricas ? (
        <Card titulo="Marcos" icone="ribbon-outline">
          <View style={styles.marcos}>
            {MARCOS_DIAS.map((m) => <Marco key={m} dias={m} atingido={dados.diasConsecutivos >= m} />)}
          </View>
        </Card>
      ) : null}

      <Card titulo="Medalhas e conquistas" icone="trophy-outline">
        {dados.conquistas.length === 0 ? (
          <Texto>A primeira medalha, Bronze, chega aos 60 dias. Continue!</Texto>
        ) : (
          dados.conquistas.map((c) => <ItemConquista key={c.id} conquista={c} />)
        )}
      </Card>
    </Tela>
  );
}

const styles = StyleSheet.create({
  marcos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  marco: {
    minWidth: 56,
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: cores.lima,
  },
  marcoPendente: { backgroundColor: cores.vidro, borderColor: cores.bordaSuave, borderWidth: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  icone: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.branco },
});
