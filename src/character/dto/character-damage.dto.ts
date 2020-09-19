import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min
} from 'class-validator';

export class CharacterDamageDto {
  @IsNumber()
  @IsPositive()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  type: string;
}