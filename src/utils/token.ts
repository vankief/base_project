import jwt from 'jsonwebtoken';
import { User } from '@interfaces/users.interface';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { ACCESS_TOKEN, REFRESH_TOKEN, EXPIRES_IN_ACCESS, EXPIRES_IN_REFRESH } from '@/config';
import { NextFunction, Response } from 'express';

type TTypekey = 'accessToken' | 'refreshToken';

export const createJwtToken = (payload: DataStoredInToken, typeKey: TTypekey) => {
  const key = typeKey === 'accessToken' ? ACCESS_TOKEN : REFRESH_TOKEN;
  const expiresIn = typeKey === 'accessToken' ? EXPIRES_IN_ACCESS : EXPIRES_IN_REFRESH;
  const token = jwt.sign(payload, key, { expiresIn: expiresIn });
  return token;
};

export const verifyJwtToken = (token: string, typeKey: TTypekey, next: NextFunction) => {
  try {
    const key = typeKey === 'accessToken' ? ACCESS_TOKEN : REFRESH_TOKEN;
    const data = jwt.verify(token, key) as DataStoredInToken;
    return data;
  } catch (err) {
    next(err);
  }
};
