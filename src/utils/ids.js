import * as Crypto from 'expo-crypto';

// ID gerado no aparelho (ADR-003 / ADR-008): o mesmo registro nunca duplica no servidor.
export const novoId = () => Crypto.randomUUID();
