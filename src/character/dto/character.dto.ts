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

  @IsArray()
  classes: CharacterClassDto[];

  stats: CharacterStatsDto;

  @IsArray()
  items: CharacterItemDto[];

  @IsArray()
  defenses: CharacterDefenseDto[];
}