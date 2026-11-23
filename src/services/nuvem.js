// Operações no Cloud Firestore usadas pelas entidades.
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import { TABELAS_COM_PENDENTES, TABELAS_ESTADO } from './sincronizacao';

// RN04: apaga a cópia na nuvem de todos os dados do usuário (usuarios/{uid}/...)
export async function apagarDadosDoUsuario(uid) {
  for (const tabela of [...TABELAS_COM_PENDENTES, ...TABELAS_ESTADO]) {
    const documentos = await getDocs(collection(firestore, 'usuarios', uid, tabela));
    await Promise.all(documentos.docs.map((d) => deleteDoc(d.ref)));
  }
  await deleteDoc(doc(firestore, 'usuarios', uid));
}
