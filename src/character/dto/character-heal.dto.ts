import {
  IsNumber,
  IsPositive,
  Min
} from 'class-validator';

export class CharacterHealDto {
  @IsNumber()
  @Min(0)
  permanentHitPoints: number;

  @IsNumber()
  @Min(0)
  temporaryHitPoints: number;
}