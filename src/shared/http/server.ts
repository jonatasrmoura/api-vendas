import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import { pagination } from 'typeorm-pagination';

import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import uploadConfig from '@config/upload';
import rateLimiter from '@shared/http/middlewares/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());

app.use(rateLimiter); // middleware de controle de requisições por segundo

app.use(pagination); // Register the pagination middleware

// para o front-end está consumindo as imagens de avatar dos usuários
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(errors());

// Middleware para identificar erros na aplicação (tratamento de erros)
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3334, () => {
  console.log('Server started ON! http://localhost:3334/');
});
