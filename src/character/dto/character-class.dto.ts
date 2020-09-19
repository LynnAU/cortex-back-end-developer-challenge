import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  Max
} from 'class-validator';

export class CharacterClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  hitDiceValue: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(20)
  classLevel: number;
}

export type HPGenerationMethod = 'roll' | 'average';
