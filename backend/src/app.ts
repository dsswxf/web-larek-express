import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { PORT, DB_ADDRESS } from './config';
import routes from './routes';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Не удалось подключиться к базе данных', err);
  });
