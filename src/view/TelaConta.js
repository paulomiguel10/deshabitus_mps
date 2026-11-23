// F-TelaConta — UC01 Gerenciar conta e perfil (VCP01)
// Sem usuário logado: entrar, criar conta (US01) e recuperar senha.
// Com usuário logado: perfil (alterar dados e excluir conta).
// Visual: telas Login, Criar conta e Recuperar senha do Figma. A lógica fica no C-GerenciarConta.
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Tela from './components/Tela';
import Texto from './components/Texto';
import Campo from './components/Campo';
import Botao from './components/Botao';
import Card from './components/Card';
import Link from './components/Link';
import Logo from './components/Logo';
import Interruptor from './components/Interruptor';
import { GerenciarConta } from '../controller/GerenciarConta';
import { useSessao } from './SessaoContext';
import { firebaseConfigurado } from '../services/firebase';
import { cores } from '../theme/cores';

// Executa uma ação do controller mostrando "aguarde" e o erro, se houver
function useAcao() {
  const [ocupado, setOcupado] = useState(false);
  const executar = async (acao, tituloErro) => {
    setOcupado(true);
    try {
      return await acao();
    } catch (erro) {
      Alert.alert(tituloErro, erro.message);
      return undefined;
    } finally {
      setOcupado(false);
    }
  };
  return [ocupado, executar];
}

function AvisoFirebase() {
  if (firebaseConfigurado) return null;
  return (
    <Card variante="info" icone="warning-outline" titulo="Configuração">
      <Texto cor={cores.sos}>Firebase não configurado: preencha o arquivo .env (TUTORIAL.md, seção 4).</Texto>
    </Card>
  );
}

function Entrar({ irPara }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ocupado, executar] = useAcao();
  // Depois do login o Firebase avisa a sessão (onAuthStateChanged) e a navegação muda sozinha
  const entrar = () => executar(() => GerenciarConta.fazerLogin(email, senha), 'Não foi possível entrar');

  return (
    <>
      <View style={styles.marca}>
        <Logo tamanho={96} />
        <Texto cor={cores.textoSuave} alinhar="center">Entre para continuar a sua jornada.</Texto>
      </View>
      <AvisoFirebase />
      <Card>
        <Campo rotulo="E-mail" icone="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" placeholder="seu@email.com" />
        <Campo rotulo="Senha" icone="lock-closed-outline" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="password" />
        <Link texto="Esqueci minha senha" onPress={() => irPara('recuperar')} />
      </Card>
      <Botao titulo={ocupado ? 'Entrando...' : 'Entrar'} onPress={entrar} desabilitado={ocupado} />
      <Botao titulo="Criar conta" variante="contorno" onPress={() => irPara('cadastro')} />
    </>
  );
}

function Cadastrar({ irPara }) {
  const { recarregarUsuario } = useSessao();
  const [f, setF] = useState({ nome: '', email: '', senha: '', confirmacao: '', aceiteTermos: false });
  const set = (campo) => (valor) => setF((atual) => ({ ...atual, [campo]: valor }));
  const [ocupado, executar] = useAcao();

  const cadastrar = () =>
    executar(async () => {
      if (f.senha !== f.confirmacao) throw new Error('As senhas não conferem.');
      await GerenciarConta.cadastrarConta(f.nome, f.email, f.senha, f.aceiteTermos);
      await recarregarUsuario();
    }, 'Cadastro');

  const senhasDiferentes = f.confirmacao.length > 0 && f.senha !== f.confirmacao;

  return (
    <>
      <AvisoFirebase />
      <Card>
        <Campo rotulo="Nome" icone="person-outline" value={f.nome} onChangeText={set('nome')} autoComplete="name" />
        <Campo rotulo="E-mail" icone="mail-outline" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" placeholder="seu@email.com" />
        <Campo rotulo="Senha" icone="lock-closed-outline" ajuda="Use pelo menos 6 caracteres." value={f.senha} onChangeText={set('senha')} secureTextEntry />
        <Campo
          rotulo="Confirmar senha"
          icone="lock-closed-outline"
          value={f.confirmacao}
          onChangeText={set('confirmacao')}
          secureTextEntry
          erro={senhasDiferentes ? 'As senhas não conferem.' : undefined}
        />
      </Card>
      {/* RN03: aceite obrigatório antes de criar a conta */}
      <Interruptor
        rotulo="Aceito os termos de uso e o tratamento dos meus dados de saúde, conforme a LGPD."
        valor={f.aceiteTermos}
        onChange={set('aceiteTermos')}
      />
      <Botao titulo={ocupado ? 'Criando conta...' : 'Criar conta'} onPress={cadastrar} desabilitado={ocupado || !f.aceiteTermos} />
      <Link texto="Já tenho conta" onPress={() => irPara('entrar')} />
    </>
  );
}

function Recuperar({ irPara }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [ocupado, executar] = useAcao();
  const enviar = async () => {
    const ok = await executar(async () => {
      await GerenciarConta.recuperarSenha(email);
      return true;
    }, 'Recuperar senha');
    if (ok) setEnviado(true);
  };

  if (enviado) {
    return (
      <>
        <Card variante="info" icone="mail-open-outline" titulo="E-mail enviado">
          <Texto variante="h3">Confira sua caixa de entrada</Texto>
          <Texto cor={cores.textoSuave}>Se o e-mail tiver conta, você vai receber um link para criar uma nova senha.</Texto>
        </Card>
        <Botao titulo="Voltar para o login" onPress={() => irPara('entrar')} />
      </>
    );
  }

  return (
    <>
      <AvisoFirebase />
      <Card>
        <Campo rotulo="E-mail" icone="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="seu@email.com" />
      </Card>
      <Botao titulo={ocupado ? 'Enviando...' : 'Enviar link'} onPress={enviar} desabilitado={ocupado} />
    </>
  );
}

function Perfil() {
  const { usuario, recarregarUsuario } = useSessao();
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [ocupado, executar] = useAcao();

  const salvar = async () => {
    const ok = await executar(async () => {
      await GerenciarConta.atualizarPerfil(usuario, nome, email);
      await recarregarUsuario();
      return true;
    }, 'Perfil');
    if (ok) {
      const trocouEmail = email.trim().toLowerCase() !== usuario.email;
      Alert.alert('Perfil', trocouEmail
        ? 'Dados salvos. Confirme o novo e-mail pelo link que enviamos; até lá, continua valendo o e-mail atual.'
        : 'Dados salvos.');
    }
  };

  // RN04: confirmação antes de excluir
  const excluir = () =>
    Alert.alert('Excluir conta', 'Todos os seus dados serão apagados do aparelho e da nuvem. Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => executar(() => GerenciarConta.excluirConta(usuario), 'Excluir conta') },
    ]);

  return (
    <>
      <Card titulo="Seus dados" icone="person-outline">
        <Campo rotulo="Nome" value={nome} onChangeText={setNome} />
        <Campo rotulo="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      </Card>
      <Botao titulo={ocupado ? 'Salvando...' : 'Salvar alterações'} onPress={salvar} desabilitado={ocupado} />
      <View style={styles.zonaPerigo}>
        <Texto variante="legenda" alinhar="center">Excluir a conta apaga seus dados do aparelho e da nuvem.</Texto>
        <Botao titulo="Excluir conta" variante="perigo" icone="trash-outline" onPress={excluir} desabilitado={ocupado} />
      </View>
    </>
  );
}

const CABECALHOS = {
  entrar: {},
  cadastro: { titulo: 'Criar conta', subtitulo: 'Preencha seus dados para começar.' },
  recuperar: { titulo: 'Recuperar senha', subtitulo: 'Informe o e-mail da sua conta para receber o link de nova senha.' },
};

export default function TelaConta() {
  const { usuario } = useSessao();
  const [modo, setModo] = useState('entrar'); // 'entrar' | 'cadastro' | 'recuperar'

  if (usuario) {
    return (
      <Tela titulo="Conta e perfil">
        <Perfil />
      </Tela>
    );
  }

  const voltar = modo !== 'entrar' ? <Link texto="Voltar" icone="chevron-back" alinhar="left" onPress={() => setModo('entrar')} /> : null;
  return (
    <Tela topo={voltar} {...CABECALHOS[modo]}>
      {modo === 'entrar' ? <Entrar irPara={setModo} /> : null}
      {modo === 'cadastro' ? <Cadastrar irPara={setModo} /> : null}
      {modo === 'recuperar' ? <Recuperar irPara={setModo} /> : null}
    </Tela>
  );
}

const styles = StyleSheet.create({
  marca: { alignItems: 'center', gap: 10, marginTop: 24, marginBottom: 8 },
  zonaPerigo: { marginTop: 24, gap: 10 },
});
