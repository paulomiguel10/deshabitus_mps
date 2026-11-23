# Deshabitus – App mobile (base)

App de desabituação gradual de hábitos nocivos – trabalho de MPS (UEA/EST).
**React Native + Expo**, arquitetura **MVC**, **offline-first** com **SQLite** (`expo-sqlite`) e **Firebase** para login, backup e desafios em grupo.

> Esta é a **base**: tecnologias instaladas, estrutura de pastas e esqueletos das classes do Astah.
> Siga o **documento de requisitos** (RFs, RNs e ADRs) e os **diagramas do Astah** à risca.

## Como rodar

Pré-requisitos: [Node.js LTS](https://nodejs.org), Git e o app **Expo Go** no celular.

```bash
git clone https://github.com/paulomiguel10/deshabitus_mps.git
cd deshabitus_mps
npm install          # instala tudo (equivale ao pip install -r requirements.txt)
npx expo start       # escaneie o QR code com o Expo Go (ou tecle "a" para o emulador Android)
```

Comandos úteis:

| Comando | Para quê |
|---|---|
| `npx expo install nome-do-pacote` | Adicionar biblioteca (**sempre** use este, não `npm install pacote`) |
| `npm run lint` | Verificar o padrão do código antes do commit |
| `npx expo start -c` | Iniciar limpando o cache (quando algo "não atualiza") |

## Tecnologias instaladas

| Pacote | Para quê | Onde no doc |
|---|---|---|
| `expo`, `react-native`, `react` | Base do app (Android 10+ / iOS 15+) | RES04, ADR-007 |
| `@react-navigation/*`, `react-native-screens`, `react-native-safe-area-context` | Navegação entre as telas (F-) | – |
| `expo-sqlite` | Banco local, fonte principal dos dados | ADR-003 |
| `firebase` + `@react-native-async-storage/async-storage` | Login (Auth), backup e desafios (Firestore); sessão salva no aparelho | ADR-002, ADR-005 |
| `@react-native-community/netinfo` | `verificarConexao()` e sincronização ao reconectar | ADR-004, ADR-008 |
| `expo-crypto` | IDs UUID gerados no aparelho | ADR-003, RN29 |
| `expo-notifications` | Notificações motivacionais agendadas no aparelho | RF08, ADR-004 |
| `react-native-gifted-charts` + `react-native-svg` + `expo-linear-gradient` | Gráficos de gatilhos, esforço semanal e economia | RN20, RF05, RF09 |
| `@react-native-community/datetimepicker` | Escolher data de início e data/hora do registro | RN07, RN15 |
| `@expo/vector-icons` | Ícones | – |
| `eslint` + `eslint-config-expo` | Padrão de código | – |

**Widgets (RF07)** ainda não têm biblioteca: exigem código nativo e não rodam no Expo Go. Decidir quando o RF07 for implementado (prioridade Baixa).

## Firebase

Sem configurar, o app abre normalmente (tudo local). Para login, backup e desafios:

1. Crie o projeto no [Console do Firebase](https://console.firebase.google.com); ative **Authentication > E-mail/senha** e o **Firestore Database**.
2. Copie `.env.example` para `.env` e preencha com as chaves do app **Web**.
3. Publique as regras de `firestore.rules`.

O `.env` **não vai para o GitHub**. Passe as chaves para a equipe por fora.

## Estrutura (MVC = diagramas do Astah)

```
App.js                    Entrada: abre o SQLite e a navegação
src/
├── model/                E-  Entidades do DC-ENTIDADE (Usuario, Habito, Jornada, Gatilho,
│                             RegistroTentacao, CheckInEsforco, Conquista, Desafio, Convite, Mensagem)
│                             + enums.js (ModoDesabituacao, Resultado, TipoConquista, StatusConvite)
├── view/                 F-  Classes de fronteira: uma tela por F- (TelaJornada, TelaSOS, ...)
│   └── components/           Peças reutilizáveis (Botao, Campo, Card, Tela, Opcoes)
├── controller/           C-  Classes de controle: uma por caso de uso (CadastrarHabito, AcionarSOS, ...)
├── database/             Tabelas SQLite (atributos do DC-ENTIDADE) e migrações
├── services/             Firebase, verificarConexao(), sincronização
├── events/               Barramento de eventos entre módulos (ADR-009)
├── strategies/           Exibição no modo padrão/cego (ADR-010)
├── navigation/           Rotas (nomes = classes F-)
├── theme/ utils/         Cores, datas, IDs
```

Cada método do diagrama já existe no arquivo da classe e chama `pendente('Classe.metodo')`.
Implementar = trocar esse `pendente(...)` pelo código. Procure `TODO` e `pendente(` para ver o que falta.

### Regras da equipe

1. **Fluxo:** tela (F-) → controller (C-) → entidade (E-) → SQLite. A tela nunca escreve SQL.
2. **Regra de negócio** fica no controller ou na entidade, com o número da RN em comentário (`// RN21`).
3. **Não crie classe, atributo ou tela fora do diagrama.** Se precisar, atualize o Astah e o documento primeiro.
4. **Números de progresso passam pela strategy** (`obterModoExibicao(modo)`), senão o modo cego vaza (RN09).
5. **IDs são UUID** (`novoId()`), nunca autoincremento.
6. **Mudou o banco?** Crie uma versão nova (`SCHEMA_V3`...) + um passo em `migracoes.js` e aumente o `VERSAO_SCHEMA`. Nunca edite um schema que já foi publicado.
7. **Git:** uma branch por caso de uso (`uc06-registrar-gatilho`), `npm run lint` antes do commit, Pull Request para a `main`.

## Como o DC-ENTIDADE virou código e banco

| No diagrama | No código / SQLite |
|---|---|
| Atributo `char` / `int` / `double` / `boolean` | `TEXT` / `INTEGER` / `REAL` / `INTEGER` (0 ou 1) |
| Datas `int` sem hora (`dataInicio`, `dataUltimoReinicio`, `data`) | `AAAAMMDD`, ex.: `20261123` (`src/utils/datas.js`) |
| Datas `int` com hora (`dataHora`, `dataAceiteTermos`) | milissegundos (`Date.now()`) |
| Composição ◆ (ex.: Jornada ◆ CheckInEsforco) | chave estrangeira na parte (`checkInEsforco.jornadaId`) com `ON DELETE CASCADE` |
| `E-Jornada ◆ acompanha 1 E-Habito` | `habito.jornadaId` único (um hábito por jornada) |
| `motivadoPor 0..1 E-Gatilho` | `registroTentacao.gatilhoId` pode ser nulo (RN016) |
| `E-Usuario.senha` | **não** vai para o SQLite: fica no Firebase Auth com hash (RNF04) |
| E-Desafio, E-Convite, E-Mensagem | só no Firestore |
| Notas RN no diagrama | comentário no topo da classe + regra no banco quando possível (RN05, RN021, RN024) |

## Mapa caso de uso → código (conforme os VCPs do Astah)

| UC | VCP no Astah | Controle (C-) | Fronteira (F-) | Entidades (E-) |
|---|---|---|---|---|
| UC01 Gerenciar conta e perfil | VCP01 | `GerenciarConta` | `TelaConta` | Usuario, Convite, Desafio, Mensagem |
| UC02 Cadastrar hábito e metas | VCP02 | `CadastrarHabito` (include `EscolherModo`) | `TelaEscolhaHabito`, `TelaOpcoesJornada` | Usuario, Jornada, Habito |
| UC03 Escolher modo de desabituação | VCP03 | `EscolherModo` | `TelaOpcoesJornada` | Jornada |
| UC04 Gerenciar desafios em grupo | VCP04 | `GerenciarDesafios` | `TelaDesafios` | Usuario, Desafio, Convite, Mensagem, Jornada |
| UC05 Consultar economia e tempo poupado | VCP05 | `ConsultarEconomia` | `TelaEconomia` | Jornada, Habito |
| UC06 Registrar gatilho e recaída | VCP11 | `RegistrarGatilho` | `TelaRegistroGatilhos` | Jornada, RegistroTentacao, Gatilho, Conquista |
| UC07 Usar widgets de acompanhamento | VCP12 | `UsarWidgets` | `Widget` | Jornada, Habito |
| UC08 Configurar notificações motivacionais | VCP06 | `ConfigurarNotificacoes` | `TelaConfiguracoes`, `Notificacao` | Usuario, Jornada, Habito |
| UC09 Registrar check-in de esforço | VCP07 | `RegistrarCheckIn` | `TelaPercepcaoEsforco` | Jornada, CheckInEsforco |
| UC10 Consultar medalhas e conquistas | VCP08 | `ConsultarConquistas` | `TelaConquistas` | Jornada, Conquista |
| UC11 Acionar modo de emergência SOS | VCP09 | `AcionarSOS` (usa `RegistrarGatilho`) | `TelaSOS` | Jornada |
| UC12 Encerrar jornada | VCP10 | `EncerrarJornada` | `TelaJornada` | Jornada |
