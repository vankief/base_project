import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { get } from 'http';

const getAuthorization = req => {
  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const accessToken = getAuthorization(req);
    if (accessToken) {
      const tokenData = (await verify(accessToken, ACCESS_TOKEN)) as DataStoredInToken;
      const userId = tokenData.id;
      const user = await UserEntity.findOne(userId);

      if (user) {
        req.user = user;
        next();
      } else {
        next(new HttpException(401, 'User not found'));
      }
    } else {
      next(new HttpException(401, 'Authentication token not provided'));
    }
  } catch (error) {
    console.log(error);
    next(new HttpException(401, 'Invalid authentication token'));
  }
};
