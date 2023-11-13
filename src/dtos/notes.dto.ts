import { IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  title: string;

  descrtition: string;
}

export class UpdateNoteDto {
  @IsNotEmpty()
  title: string;

  descrtition: string;
}
