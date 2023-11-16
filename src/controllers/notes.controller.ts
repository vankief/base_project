import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Note } from '@interfaces/notes.interface';
import { NoteService } from '@services/notes.service';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { clearScreenDown } from 'readline';
import { OK } from 'valid_respones/success.response';

export class NoteController {
  public note = Container.get(NoteService);

  public getNotesByUserId = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const from = Number(req.query.from) || 0;
      const size = Number(req.query.size) || 10;
      const result = await this.note.findAllNotes(userId, from, size);
      new OK({
        data: {
          notes: result.data,
          count: result.count,
          notefilter: result.data.length,
        },
        message: 'Success',
      }).send(res);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  public createNoteByUserId = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const noteData: Note = req.body;
      const createNoteData: Note = await this.note.createNoteByUserId(userId, noteData);
      res.status(201).json({ data: createNoteData, message: 'created' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public updateNoteByUserId = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const noteId = Number(req.params.noteId);
      const noteData: Note = req.body;

      const updateNoteData: Note = await this.note.updateNoteByUserId(userId, noteId, noteData);
      res.status(200).json({ data: updateNoteData, message: 'updated' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public deleteNoteByUserId = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const noteId = Number(req.params.noteId);
      const deleteNoteData: Note = await this.note.deleteNoteByUserId(userId, noteId);
      res.status(200).json({ data: deleteNoteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
