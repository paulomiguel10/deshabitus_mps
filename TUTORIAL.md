# Tutorial – Deshabitus (do GitHub ao app rodando)

Este tutorial mostra como baixar o projeto, instalar as tecnologias, rodar o app no celular e trabalhar no código sem atrapalhar a equipe.

Repositório: https://github.com/paulomiguel10/deshabitus_mps

---

## 1. Ferramentas que você precisa ter

Instale uma vez só no computador:

| Ferramenta | Para quê | Onde baixar |
|---|---|---|
| **Node.js (versão LTS)** | Roda o Expo e instala as bibliotecas (`npm`) | https://nodejs.org |
| **Git** | Baixa e envia o código para o GitHub (no Windows já vem com o **Git Bash**) | https://git-scm.com |
| **VS Code** | Editor de código | https://code.visualstudio.com |
| **Expo Go** (no celular) | Abre o app durante o desenvolvimento | Play Store / App Store |

Depois de instalar, abra o terminal (no VS Code: **Ctrl + '**) e confira as versões:

```bash
node -v
```

```bash
npm -v
```

```bash
git --version
```

Se os três mostrarem um número de versão, está pronto. Se aparecer "comando não encontrado", feche e abra o terminal (ou o VS Code) de novo.

---

## 2. Baixar o projeto (só na primeira vez)

Entre na pasta onde você guarda seus projetos:

```bash
cd ~/Documents/github
```

Clone o repositório:

```bash
git clone https://github.com/paulomiguel10/deshabitus_mps.git
```

Entre na pasta do projeto:

```bash
cd deshabitus_mps
```

Abra no VS Code:

```bash
code .
```

---

## 3. Instalar as tecnologias

Um único comando instala tudo o que está no `package.json` (equivale ao `pip install -r requirements.txt` do Python):

```bash
npm install
```

Avisos que podem aparecer e o que fazer:

| Aviso | O que fazer |
|---|---|
| `7 vulnerabilities` | **Nada.** Nunca rode `npm audit fix --force` (quebra as versões do Expo). |
| `eslint@9 deprecated` | Nada. |
| `New major version of npm` | Nada. |
| `allow-scripts ... @firebase/util ... protobufjs` | Rodar os dois comandos abaixo. |

Só se aparecer o aviso de `allow-scripts`:

```bash
npm approve-scripts @firebase/util protobufjs
```

```bash
npm rebuild @firebase/util protobufjs
```

> **Não existe SQLite para baixar.** Ele já vem dentro do Android e do iOS; a biblioteca `expo-sqlite` só dá acesso a ele.

---

## 4. Configurar o Firebase (opcional no começo)

Sem isso o app abre normalmente e tudo que é local funciona. Só é necessário para **login, backup e desafios em grupo**.

Crie o arquivo de configuração a partir do modelo:

```bash
cp .env.example .env
```

Abra o `.env` no VS Code e cole as chaves do Firebase (peça para quem criou o projeto no Firebase). **O `.env` nunca vai para o GitHub** – ele já está no `.gitignore`.

---

## 5. Rodar o app no celular

```bash
npx expo start
```

1. Abra o **Expo Go** no celular.
2. Escaneie o QR code que aparece no terminal (no iPhone, use a câmera).
3. O celular precisa estar **no mesmo Wi-Fi** do computador.

Se o QR code não conectar (comum em Wi-Fi da faculdade):

```bash
npx expo start --tunnel
```

Se o app não atualizar ou der erro estranho, inicie limpando o cache:

```bash
npx expo start -c
```

Para parar o servidor: **Ctrl + C** no terminal.

---

## 6. Testar se está tudo certo

### 6.1 Teste do app (manual)

- [ ] O app abre no Expo Go sem tela vermelha de erro.
- [ ] Aparecem as **5 abas** embaixo: Início, Economia, Conquistas, Desafios e Ajustes.
- [ ] Na aba **Início**, cada botão abre uma tela (SOS, Registrar gatilho, Check-in, Escolher hábito, Opções de jornada, Conta).
- [ ] O botão **Voltar** retorna para o Início.

### 6.2 Teste do código (padrão)

Verifica erros e o padrão do código. Rode **antes de todo commit**:

```bash
npm run lint
```

Sem nenhuma mensagem = tudo certo.

### 6.3 Teste do projeto (compatibilidade)

Verifica se as versões das bibliotecas combinam com o Expo:

```bash
npx expo-doctor
```

Se ele apontar versões incompatíveis:

```bash
npx expo install --fix
```

### 6.4 Testes que vão entrar quando as funcionalidades forem implementadas

| O que testar | Como | Requisito |
|---|---|---|
| Funciona sem internet | Ativar o **modo avião** e usar SOS, registro de gatilho e check-in | RNF10, RN27 |
| Sincroniza ao voltar a internet | Registrar no modo avião, desligar o modo avião e conferir no Firestore | RN29 |
| Desafios pedem internet | Abrir **Desafios** no modo avião: deve mostrar o aviso | US02 |
| SOS em até 2 toques | Contar os toques desde a tela inicial | RNF02 |
| Modo cego | Ativar e conferir que nenhuma tela mostra número de dias ou valores | RN09 |
| Uma jornada ativa por vez | Tentar cadastrar um segundo hábito sem encerrar o primeiro | RN05 |

---

## 7. Trabalhar no código sem atrapalhar a equipe

### Antes de começar (todo dia)

Volte para a `main`:

```bash
git checkout main
```

Pegue o que os colegas já enviaram:

```bash
git pull
```

Se alguém adicionou biblioteca nova, instale:

```bash
npm install
```

### Criar uma branch para o seu caso de uso

Uma branch por caso de uso (troque o nome):

```bash
git checkout -b uc06-registrar-gatilho
```

### Salvar e enviar o trabalho

Ver o que mudou:

```bash
git status
```

Conferir o código:

```bash
npm run lint
```

Adicionar as mudanças:

```bash
git add .
```

Criar o commit (troque a mensagem):

```bash
git commit -m "UC06: salvar registro de tentação no SQLite"
```

Enviar a branch (troque o nome):

```bash
git push -u origin uc06-registrar-gatilho
```

Depois, no GitHub, clique em **Compare & pull request** e peça para um colega revisar antes de juntar na `main`.

---

## 8. Adicionar uma biblioteca nova

**Sempre** use `npx expo install` (ele escolhe a versão compatível com o Expo). Exemplo:

```bash
npx expo install nome-da-biblioteca
```

Depois avise a equipe para rodar `npm install` e registre a biblioteca na tabela da seção 9. Se for uma decisão de arquitetura, atualize os **ADRs** no documento de requisitos.

---

## 9. Tecnologias do projeto

| Tecnologia | Para quê | Documento |
|---|---|---|
| React Native + React + Expo (SDK 58) | App mobile Android 10+ / iOS 15+ | RES03, RES04, ADR-007 |
| React Navigation | Navegação entre as telas (F-) | – |
| expo-sqlite | Banco local, fonte principal dos dados | ADR-003 |
| Firebase (Auth + Firestore) + AsyncStorage | Login, backup/sincronização e desafios em grupo | ADR-002, ADR-005 |
| @react-native-community/netinfo | Detectar internet (`verificarConexao`) | ADR-004, ADR-008 |
| expo-crypto | IDs UUID gerados no aparelho | ADR-003, RN29 |
| expo-notifications | Notificações motivacionais locais | RF08 |
| react-native-gifted-charts + react-native-svg + expo-linear-gradient | Gráficos | RN20, RF05, RF09 |
| @react-native-community/datetimepicker | Escolher datas | RN07, RN15 |
| @expo/vector-icons | Ícones | – |
| ESLint | Padrão de código | – |

---

## 10. Onde fica cada coisa (MVC = diagramas do Astah)

| Pasta | Camada | O que tem |
|---|---|---|
| `src/model/` | **Model** | Entidades **E-** (Usuario, Habito, Jornada, ...) e enums |
| `src/view/` | **View** | Telas **F-** (TelaJornada, TelaSOS, ...) |
| `src/controller/` | **Controller** | Controles **C-** (CadastrarHabito, AcionarSOS, ...) |
| `src/database/` | – | Tabelas do SQLite |
| `src/services/` | – | Firebase, conexão e sincronização |

Fluxo de uma ação: **tela (F-) → controller (C-) → entidade (E-) → SQLite**.

Cada método do diagrama já existe e chama `pendente('Classe.metodo')`. Implementar = trocar o `pendente(...)` pelo código. Para ver o que falta, pesquise no VS Code (**Ctrl + Shift + F**) por `pendente(` ou `TODO`.

**Regra de ouro:** não crie classe, atributo ou tela que não esteja no Astah. Se precisar, atualize o diagrama e o documento de requisitos primeiro.

---

## 11. Problemas comuns

| Problema | Solução |
|---|---|
| `npm` ou `node` "não encontrado" | Reinstalar o Node.js LTS e reabrir o terminal |
| QR code não conecta | `npx expo start --tunnel` |
| Expo Go diz que a versão do projeto não é suportada | Atualizar o Expo Go na loja (o projeto usa o SDK 58) |
| Tela vermelha com erro após `git pull` | `npm install` e depois `npx expo start -c` |
| Erro `TODO: implementar Classe.metodo` | Algum código chamou um método que ainda não foi implementado |
| Mudou a estrutura do banco e o app não reflete | Criar `SCHEMA_V2` em `src/database/schema.js` (não editar o V1) ou, só no seu celular de teste, apagar o app do Expo Go e abrir de novo |
| Conflito no `git pull` | Não force nada; chame a equipe e resolvam juntos no VS Code |
