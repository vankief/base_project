import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { createJwtToken } from '@/utils/token';

// const createToken = (user: User): TokenData => {
//   const dataStoredInToken: DataStoredInToken = { id: user.id };
//   const secretKey: string = SECRET_KEY;
//   const expiresIn: number = 60 * 60;

//   return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
// };

// const createCookie = (tokenData: TokenData): string => {
//   return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
// };

@Service()
@EntityRepository()
export class AuthService extends Repository<UserEntity> {
  public async signup(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();
    return createUserData;
  }

  public async login(userData: User): Promise<{ accessToken: string; refreshToken: string }> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });

    if (!findUser) {
      throw new HttpException(409, `This email ${userData.email} not exists`);
    }

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);

    if (!isPasswordMatching) {
      throw new HttpException(409, 'Wrong password');
    }

    const accessToken = createJwtToken({ id: findUser.id } as DataStoredInToken, 'accessToken');
    const refreshToken = createJwtToken({ id: findUser.id } as DataStoredInToken, 'refreshToken');

    return { accessToken, refreshToken };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
