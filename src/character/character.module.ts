import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { CharacterSchema } from './schema/character.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Character', schema: CharacterSchema }
  ])],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
