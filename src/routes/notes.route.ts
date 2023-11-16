import e, { Router } from 'express';
import { NoteController } from '@controllers/notes.controller';
import { Routes } from '@interfaces/routes.interface';
import { CreateNoteDto, UpdateNoteDto } from '@dtos/notes.dto';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class NotesRoute implements Routes {
  public path = '/notes';
  public router = Router();
  public notes = new NoteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:userId`, AuthMiddleware, this.notes.getNotesByUserId);
    this.router.post(`${this.path}`, AuthMiddleware, ValidationMiddleware(CreateNoteDto), this.notes.createNoteByUserId);
    this.router.put(`${this.path}/:noteId(\\d+)`, AuthMiddleware, ValidationMiddleware(UpdateNoteDto), this.notes.updateNoteByUserId);
    this.router.delete(`${this.path}/:noteId(\\d+)`, AuthMiddleware, this.notes.deleteNoteByUserId);
  }
}
