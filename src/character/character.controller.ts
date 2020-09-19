import {
  Controller,
  Body, Param, Query,
  Get, Post,
  HttpException
} from '@nestjs/common';

import { CharacterService } from './character.service';
import { HPGenerationMethod } from './dto/character-class.dto';
import { CharacterDto } from './dto/character.dto';

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
      console.log('hpGenMethod', hpGenMethod);
      // return new Promise(resolve => resolve(payload));
    return this.characterService.create(payload, hpGenMethod);
  }
}
