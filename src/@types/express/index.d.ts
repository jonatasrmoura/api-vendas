// Sobrescrita do Objeto Request do Express, (ver na documentação de como sobrescrever arquivos de bibliotecas)

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
