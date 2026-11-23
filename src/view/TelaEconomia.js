// F-TelaEconomia — UC05 Consultar economia e tempo poupado (VCP05)
// Economia acumulada, valores do dia e do mês, tempo poupado e gráfico de evolução.
// Modo cego: valores ocultos e aviso de que o modo está ativado (RN09). Tudo offline (ADR-006).
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';
import Tela from './components/Tela';
import Texto from './components/Texto';
import Card from './components/Card';
import Botao from './components/Botao';
import { ConsultarEconomia } from '../controller/ConsultarEconomia';
import { obterModoExibicao } from '../strategies/modoExibicao';
import { useSessao } from './SessaoContext';
import { cores, fontes } from '../theme/cores';

const LARGURA_EIXO_Y = 54;
const estiloEixo = { color: cores.textoSuave, fontSize: 11, fontFamily: fontes.regular };

export default function TelaEconomia({ navigation }) {
  const { jornada } = useSessao();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [larguraGrafico, setLarguraGrafico] = useState(0);

  useFocusEffect(
    useCallback(() => {
      ConsultarEconomia.consultarEconomia(jornada)
        .then((d) => { setDados(d); setErro(null); })
        .catch((e) => setErro(e.message));
    }, [jornada])
  );

  if (erro) {
    return (
      <Tela titulo="Sua economia">
        <Card variante="info" icone="warning-outline">
          <Texto cor={cores.sos}>{erro}</Texto>
        </Card>
      </Tela>
    );
  }
  if (!dados) {
    return (
      <Tela titulo="Sua economia">
        <ActivityIndicator color={cores.texto} />
      </Tela>
    );
  }

  const exibir = obterModoExibicao(dados.modo);

  return (
    <Tela titulo="Sua economia" subtitulo="O que você deixou de gastar e o tempo que ganhou de volta.">
      {!exibir.mostraMetricas ? (
        <Card variante="info" titulo="Modo cego ativado" icone="eye-off-outline">
          <Texto>Os valores estão ocultos para reduzir a ansiedade. Seus dados continuam sendo registrados.</Texto>
          <Botao titulo="Mudar o modo" variante="contorno" onPress={() => navigation.navigate('TelaOpcoesJornada')} />
        </Card>
      ) : null}

      <Card variante="destaque" titulo="Economia acumulada" icone="wallet-outline">
        <Texto variante={exibir.mostraMetricas ? 'numero' : 'h3'}>{exibir.dinheiro(dados.total)}</Texto>
      </Card>

      <View style={styles.linha}>
        <Card titulo="Hoje" style={styles.metade}>
          <Texto variante={exibir.mostraMetricas ? 'h2' : 'corpo'}>{exibir.dinheiro(dados.dia)}</Texto>
        </Card>
        <Card titulo="Este mês" style={styles.metade}>
          <Texto variante={exibir.mostraMetricas ? 'h2' : 'corpo'}>{exibir.dinheiro(dados.mes)}</Texto>
        </Card>
      </View>

      <Card titulo="Tempo poupado" icone="hourglass-outline">
        <Texto variante={exibir.mostraMetricas ? 'h2' : 'corpo'}>{exibir.tempo(dados.tempoPoupado)}</Texto>
      </Card>

      {exibir.mostraMetricas ? (
        <Card titulo="Evolução nos últimos 7 dias" icone="trending-up-outline">
          <View onLayout={(e) => setLarguraGrafico(e.nativeEvent.layout.width)}>
            {larguraGrafico > 0 ? (
              <LineChart
                data={dados.evolucao.map((p) => ({ value: p.valor, label: String(p.dia).slice(6, 8) }))}
                width={larguraGrafico - LARGURA_EIXO_Y - 8}
                adjustToWidth
                yAxisLabelWidth={LARGURA_EIXO_Y}
                height={160}
                initialSpacing={10}
                endSpacing={22}
                thickness={3}
                color={cores.textoSuave}
                dataPointsColor={cores.lima}
                dataPointsRadius={5}
                areaChart
                curved
                startFillColor={cores.agua}
                endFillColor={cores.ceuClaro}
                startOpacity={0.7}
                endOpacity={0.1}
                noOfSections={4}
                yAxisLabelPrefix="R$ "
                yAxisColor="transparent"
                xAxisColor={cores.bordaSuave}
                yAxisTextStyle={estiloEixo}
                xAxisLabelTextStyle={estiloEixo}
                hideRules
              />
            ) : null}
          </View>
        </Card>
      ) : null}
    </Tela>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 12 },
  metade: { flex: 1 },
});
