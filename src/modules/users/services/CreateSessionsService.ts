/**
 * @fileoverview Serviço de criação de uma sessão.(Retornando o token)

 * Aonde o usuário envia seu e-mail e senha e o sistema
 verifica esses dados e considera esse usuário autenticado na aplicação.

 E para garantir que o usuário não consiga acessar as rotas protegidas da aplicação
 vou utilizar a biblioteca jsonwebtoken.
 Através dessa lib poderei controlar o acesso a determinadas rotas protegendo essas
 rotas exigindo o uso de um token.
 Se um usuário não se identificar através de um token, ele não vai conseguir buscar
 o conteúdo daquela rota.
 */

import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import User from '../typeorm/entities/User';
import UserRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const UsersRepository = getCustomRepository(UserRepository);
    const user = await UsersRepository.findByEmail(email);

    // Verificar se o email do usuário existe no DB

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // Comparar a senha que o usuário está enviando com a que está salva no DB

    /* primeiro a senha sem criptografia(parâmetro que o usuário enviar) e o segundo
      vou pegar de dentro do user, que é o Objeto que trouxe os dados do DB e lá a senha está
      criptografada, e vai comparar essas duas senhas e vai armezenar o resultado na variável
    */
    const passwordConfirmed = await compare(password, user.password);

    // verificar se a senha está vinculada com o e-mail desse usuário e se está certa

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // configurar o token
    // site para gerar código de segurança louco -> http://www.md5.cz/
    const token = await sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionsService;
