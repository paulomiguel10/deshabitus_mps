// F-TelaConta — UC01 Gerenciar conta e perfil (VCP01)
// Sem usuário logado: entrar, criar conta (US01) e recuperar senha.
// Com usuário logado: perfil (alterar dados e excluir conta).
// TODO: aplicar o visual do Figma; a lógica fica no C-GerenciarConta.
import { useState } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import Tela from './components/Tela';
import Campo from './components/Campo';
import Botao from './components/Botao';
import Card from './components/Card';
import { GerenciarConta } from '../controller/GerenciarConta';
import { useSessao } from './SessaoContext';
import { firebaseConfigurado } from '../services/firebase';
import { cores } from '../theme/cores';

function Link({ texto, onPress }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} style={{ minHeight: 44, justifyContent: 'center' }}>
      <Text style={{ color: cores.primaria, fontWeight: '600', textAlign: 'center' }}>{texto}</Text>
    </Pressable>
  );
}

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

function Entrar({ irPara }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ocupado, executar] = useAcao();
  // Depois do login o Firebase avisa a sessão (onAuthStateChanged) e a navegação muda sozinha
  const entrar = () => executar(() => GerenciarConta.fazerLogin(email, senha), 'Não foi possível entrar');

  return (
    <>
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Campo rotulo="Senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="password" />
      <Botao titulo={ocupado ? 'Entrando...' : 'Entrar'} onPress={entrar} desabilitado={ocupado} />
      <Botao titulo="Criar conta" variante="contorno" onPress={() => irPara('cadastro')} />
      <Link texto="Esqueci minha senha" onPress={() => irPara('recuperar')} />
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

  return (
    <>
      <Campo rotulo="Nome" value={f.nome} onChangeText={set('nome')} autoComplete="name" />
      <Campo rotulo="E-mail" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Campo rotulo="Senha (mínimo 6 caracteres)" value={f.senha} onChangeText={set('senha')} secureTextEntry />
      <Campo rotulo="Confirmar senha" value={f.confirmacao} onChangeText={set('confirmacao')} secureTextEntry />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Switch value={f.aceiteTermos} onValueChange={set('aceiteTermos')} accessibilityLabel="Aceito os termos de uso" />
        <Text style={{ flex: 1, color: cores.texto }}>
          Aceito os termos de uso e o tratamento dos meus dados de saúde, conforme a LGPD.
        </Text>
      </View>
      <Botao titulo={ocupado ? 'Criando conta...' : 'Criar conta'} variante="destaque" onPress={cadastrar} desabilitado={ocupado} />
      <Link texto="Já tenho conta" onPress={() => irPara('entrar')} />
    </>
  );
}

function Recuperar({ irPara }) {
  const [email, setEmail] = useState('');
  const [ocupado, executar] = useAcao();
  const enviar = async () => {
    const ok = await executar(async () => {
      await GerenciarConta.recuperarSenha(email);
      return true;
    }, 'Recuperar senha');
    if (ok) {
      Alert.alert('Recuperar senha', 'Se o e-mail tiver conta, você vai receber um link para criar uma nova senha.');
      irPara('entrar');
    }
  };

  return (
    <>
      <Text style={{ color: cores.texto }}>Informe o e-mail da sua conta para receber o link de nova senha.</Text>
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Botao titulo={ocupado ? 'Enviando...' : 'Enviar link'} onPress={enviar} desabilitado={ocupado} />
      <Link texto="Voltar" onPress={() => irPara('entrar')} />
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
      <Card titulo="Seus dados">
        <Campo rotulo="Nome" value={nome} onChangeText={setNome} />
        <Campo rotulo="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      </Card>
      <Botao titulo={ocupado ? 'Salvando...' : 'Salvar alterações'} onPress={salvar} desabilitado={ocupado} />
      <Botao titulo="Excluir conta" variante="perigo" onPress={excluir} desabilitado={ocupado} />
    </>
  );
}

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

  const titulos = { entrar: 'Deshabitus', cadastro: 'Criar conta', recuperar: 'Recuperar senha' };
  return (
    <Tela titulo={titulos[modo]}>
      {!firebaseConfigurado ? (
        <Text style={{ color: cores.perigo }}>Firebase não configurado: preencha o arquivo .env (TUTORIAL.md, seção 4).</Text>
      ) : null}
      {modo === 'entrar' ? <Entrar irPara={setModo} /> : null}
      {modo === 'cadastro' ? <Cadastrar irPara={setModo} /> : null}
      {modo === 'recuperar' ? <Recuperar irPara={setModo} /> : null}
    </Tela>
  );
}
