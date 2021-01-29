// verificar se o usuário está autenticado -> middleware de autenticação -> proteger as rotas que vão ser verificadas

import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

interface ITokenPayLoad {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // verificar se no cabeçalho existe um token
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing.');
  }

  // array token vai ter 2 posições -> Bearer açsd6464JAFPO(&&%/;). -> chave secreta o token
  const [, token] = authHeader.split(' ');

  // verificar se esse token foi criado pela minha aplicação, se ele é válido (se eu posso liberar o acesso)
  try {
    /* Esse método usa esses 2 parâmetros, ele quer o Token a ser verificado e quer a secret que foi usada
    na aplicação e ele vai verificar se esse Token foi criado com essa secret (parâmetro informado no método) se não foi dá erro. */
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as ITokenPayLoad;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token.');
  }
}
