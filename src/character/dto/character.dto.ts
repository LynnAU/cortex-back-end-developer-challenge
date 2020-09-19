import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsPositive,
  IsOptional,
  MinLength,
  Min,
  Max,
  ValidateNested
} from 'class-validator';

import { CharacterClassDto } from './character-class.dto';
import { CharacterDefenseDto } from './character-defense.dto';
import { CharacterItemDto } from './character-item.dto';
import { CharacterStatsDto } from './character-stats.dto';

export class CharacterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  level: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  hitPoints?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly maxHitPoints?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  temporaryHitPoints?: number;

  @IsArray()
  @ValidateNested()
  classes: CharacterClassDto[];

  @ValidateNested()
  stats: CharacterStatsDto;

  @IsArray()
  @ValidateNested()
  items: CharacterItemDto[];

  @IsArray()
  @ValidateNested()
  defenses: CharacterDefenseDto[];
}