import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HPGenerationMethod } from './dto/character-class.dto';

import { CharacterDto } from './dto/character.dto';
import { Character } from './schema/character.schema';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel('Character') private readonly characterModel: Model<Character>
  ) {}

  async findOneByName(name: string) : Promise<CharacterDto> {
    return await this.characterModel.findOne({ name });
  }

  async create(payload: CharacterDto, hpGenMethod: HPGenerationMethod): Promise<CharacterDto | HttpException> {
    // check if the character by the same name already exists in our database
    const char = await this.findOneByName(payload.name);
    if (char !== null) {
      return new HttpException('a character already exists with the same name', 400);
    }

    // calculate the character's hitpoints using our method passed in
    const { classes } = payload;

    // at level 1, a player's hp starts with the maximum hit die value
    // reduce its class level as we've already calculated the first level of hp
    let hp = classes[0].hitDiceValue;
    classes[0].classLevel--;

    // calculate the remaining levels
    switch (hpGenMethod) {
      case 'average':
        // take the average of each hit die and multiply it by the class level
        // that'll give us the average hp for all the classes
        hp += classes.map(cls => ((cls.hitDiceValue / 2) + 1) * cls.classLevel)
          .reduce((a, b) => a + b, 0);
        break;

      case 'roll':
        hp += classes.map(cls => {
          return Math.floor(Math.random() * (cls.hitDiceValue - 1 + 1) + 1);
        }).reduce((a, b) => a + b, 0);
        break;
    }

    payload.hitPoints = hp;
    return await this.characterModel.create(payload);
  }
}
