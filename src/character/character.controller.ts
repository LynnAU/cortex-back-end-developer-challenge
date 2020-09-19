import {
  Controller,
  Body, Param, Query,
  Get, Post,
  HttpException
} from '@nestjs/common';

import { CharacterService } from './character.service';
import { CharacterDamageDto } from './dto/character-damage.dto';
import { CharacterDto } from './dto/character.dto';
import { HPGenerationMethod } from './types/hp-gen-method.type';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get(':name')
  getOne(@Param('name') name: string): Promise<CharacterDto | HttpException> {
    return this.characterService.findOneByName(name);
  }

  @Post()
  create(
    @Query('hpGenMethod') hpGenMethod: HPGenerationMethod = 'average',
    @Body() payload: CharacterDto): Promise<CharacterDto | HttpException> {
    return this.characterService.create(payload, hpGenMethod);
  }

  @Post('/:name/damage')
  damage(
    @Param('name') name: string,
    @Body() payload: CharacterDamageDto[]): Promise<CharacterDto | HttpException> {
    return this.characterService.damage(name, payload);
  }
}
