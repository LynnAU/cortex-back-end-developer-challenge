import { IsString, IsIn } from 'class-validator';

export class CharacterDefenseDto {
  @IsString()
  @IsIn(['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'])
  type: string;

  @IsString()
  @IsIn(['immunity', 'resistance'])
  defense: 'immunity' | 'resistance';
}