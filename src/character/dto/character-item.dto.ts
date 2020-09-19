import { IsString, ValidateNested } from 'class-validator';

export class CharacterItemModiferDto {
  @IsString()
  affectedObject: string;

  @IsString()
  affectedValue: string;

  @IsString()
  value: number;
}

export class CharacterItemDto {
  @IsString()
  name: string;

  @ValidateNested()
  modifer: CharacterItemModiferDto;
}