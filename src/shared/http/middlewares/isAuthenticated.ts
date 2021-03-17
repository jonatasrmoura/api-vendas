/**
 * @fileoverview Criar uma forma de proteger as rotas da minha aplicação, exigindo que só sejá
 * possível acessar esse conteúdo com usuários autenticados na aplicação ou sejá o usuário tem
 * que ter um token, esse token tem que ser enviado no cabeçalho da requisição e dessa forma a
 * aplicação consegue validar ou sejá verificar se aquele token ta sendo enviado se é um token válido(se ele não está inspirado)
 * e também se é um token criado pela a minha aplicação com o hash em APP_SECRET somente os token que seram criados
 * a partir desse hash que seram válidos, para isso preciso de um moddleware e passar essa configuração para cada rota que
 * eu quero proteger.
 */

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
  const authHeader = request.headers.authorization; // aqui é de onde o token vai vim

  // se não tiver nada neste cabeçalho
  if (!authHeader) {
    throw new AppError('JWT Token is missing.');
  }

  // se existe o cabeçalho authorization

  // array token vai ter 2 posições -> Bearer e a chave do token(açsd6464JAFPO(&&%/;). -> chave secreta o token
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
