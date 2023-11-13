import { EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { NoteEntity } from '@entities/notes.entity';
import { Note } from '@interfaces/notes.interface';
import { HttpException } from '@exceptions/httpException';
import { UserEntity } from '@/entities/users.entity';
import { DeleteResult } from 'typeorm';

@Service()
@EntityRepository()
export class NoteService extends Repository<NoteEntity> {
  public async findAllNotes(userId: number): Promise<Note[]> {
    try {
      const findUser = await UserEntity.findOne({ where: { id: userId } });
      const notes: Note[] = await NoteEntity.find({ where: { user: findUser } });
      return notes;
    } catch (error) {
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
