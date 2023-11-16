import { EntityRepository, Repository, getRepository } from 'typeorm';
import { Service } from 'typedi';
import { NoteEntity } from '@entities/notes.entity';
import { Note } from '@interfaces/notes.interface';
import { HttpException } from '@exceptions/httpException';
import { UserEntity } from '@/entities/users.entity';
import { DeleteResult } from 'typeorm';

@Service()
@EntityRepository()
export class NoteService extends Repository<NoteEntity> {
  public async findAllNotes(
    userId: number,
    from: number,
    size: number,
  ): Promise<{
    data: NoteEntity[];
    count: number;
  }> {
    try {
      const findUser = await UserEntity.findOne({ where: { id: userId } });
      // const query = await getRepository(NoteEntity)
      //   .createQueryBuilder('note_entity')
      //   .where({ user: findUser })
      //   .orderBy('note_entity.ceatedAt', 'DESC')
      //   .skip(startIndex)
      //   .take(limit);
      // console.log(query.getSql());
      // const notes: Note[] = await query.getMany();
      // return notes;
      const [result, total] = await NoteEntity.findAndCount({
        where: { user: findUser },
        order: { ceatedAt: 'DESC' },
        skip: from,
        take: size,
      });
      return { data: result, count: total };
    } catch (error) {
      console.log(error);
      throw new HttpException(500, error.message);
    }
  }
  public async findNoteById(userId: number, noteId: number): Promise<Note> {
    const findNote: Note = await NoteEntity.findOne({ where: { id: noteId, userId } });
    if (!findNote) throw new HttpException(409, "Note doesn't exist");

    return findNote;
  }

  public async createNoteByUserId(userId: number, noteData: Note): Promise<Note> {
    const findUser = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const createNoteData: Note = await NoteEntity.create({ ...noteData, user: findUser }).save();
    return createNoteData;
  }

  public async updateNoteByUserId(userId: number, noteId: number, noteData: Note): Promise<any> {
    try {
      const findUser = await UserEntity.findOne({ where: { id: userId } });
      if (!findUser) throw new HttpException(409, "User doesn't exist");
      const updateNote = await NoteEntity.update({ id: noteId, user: findUser }, { ...noteData });
      return updateNote;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, error.message);
    }
  }

  public async deleteNoteByUserId(userId: number, noteId: number): Promise<Note> {
    const findUser = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const findNote: Note = await NoteEntity.findOne({ where: { id: noteId, user: findUser } });
    if (!findNote) throw new HttpException(409, "Note doesn't exist");

    await NoteEntity.delete({ id: noteId, user: findUser });
    return findNote;
  }
}
