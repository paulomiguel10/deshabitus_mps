// F-TelaDesafios — UC04: Desafios em grupo (exige internet)
import Tela from './components/Tela';
import Texto from './components/Texto';
import Card from './components/Card';

export default function TelaDesafios() {
  // TODO: implementar conforme o protótipo do Figma e o VCP correspondente
  return (
    <Tela titulo="Desafios em grupo" subtitulo="Esta parte do app precisa de internet.">
      <Card variante="info" titulo="Em construção" icone="construct-outline">
        <Texto>F-TelaDesafios (UC04)</Texto>
      </Card>
    </Tela>
  );
}
