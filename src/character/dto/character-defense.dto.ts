import {
  IsString
} from 'class-validator';

export class CharacterDefenseDto {
  @IsString()
  type: string;

  @IsString()
  defense: string;
}