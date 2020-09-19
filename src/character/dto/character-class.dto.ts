import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsIn,
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
  @IsIn([2, 4, 6, 8, 10, 12, 20, 100])
  hitDiceValue: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(20)
  classLevel: number;
}
