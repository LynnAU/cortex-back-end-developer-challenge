import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CharacterDamageDto } from './dto/character-damage.dto';
import { CharacterHealDto } from './dto/character-heal.dto';

import { CharacterDto } from './dto/character.dto';
import { Character } from './schema/character.schema';
import { HPGenerationMethod } from './types/hp-gen-method.type';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel('Character') private readonly characterModel: Model<Character>
  ) {}

  async findOneByName(name: string) : Promise<CharacterDto> {
    return this.characterModel.findOne({ name });
  }

  async create(payload: CharacterDto, hpGenMethod: HPGenerationMethod): Promise<CharacterDto | HttpException> {
    // check if the character by the same name already exists in our database
    const char = await this.findOneByName(payload.name);
    if (char !== null) {
      return new HttpException('a character already exists with the same name', 400);
    }

    // delete any representation of _id
    // so the db doesn't error out
    delete payload['_id'];

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
        // like the name suggests, roll/generate a random number between the
        // max face value of the hit die and 1
        hp += classes.map(cls => {
          return Math.floor(Math.random() * (cls.hitDiceValue - 1 + 1) + 1);
        }).reduce((a, b) => a + b, 0);
        break;
    }

    // factor in the constitution modifer of the player
    hp += Math.floor((payload.stats.constitution - 10) / 2);

    payload.hitPoints = hp;
    (payload.maxHitPoints as Character['maxHitPoints']) = hp;
    return this.characterModel.create(payload);
  }

  async damage(name: string, payload: CharacterDamageDto[] | CharacterDamageDto): Promise<CharacterDto | HttpException> {
    // check if the character exists
    const char = await this.findOneByName(name);
    if (char === null) {
      return new HttpException('no character was found with this name', 400);
    }

    const immunity = char.defenses.filter(def => def.defense === 'immunity')
      .map(def => def.type);
    const resistances = char.defenses.filter(def => def.defense === 'resistance')
      .map(def => def.type);

    const damages: CharacterDamageDto[] = [].concat(payload);
    damages.forEach(dmg => {
      // check if the player can resist this type of damage
      // or if they're immune to it
      if (immunity.includes(dmg.type)) {
        return;
      }

      let damageModifier = 1;
      // set the modifier to half if the player is resistant to the damage type
      if (resistances.includes(dmg.type)) {
        damageModifier = 0.5;
      }

      // apply the damage to the health
      // but only if we have no temporary hitpoints remaining
      let amount = dmg.amount * damageModifier;
      if (char.temporaryHitPoints > 0) {
        amount -= char.temporaryHitPoints;
      }

      // there is no damage left to use
      if (amount <= 0) {
        char.temporaryHitPoints = -amount;
        return;
      }

      char.temporaryHitPoints = 0;
      char.hitPoints -= amount;
    });

    // catch for negative hp
    if (char.hitPoints < 0) {
      char.hitPoints = 0;
    }

    // update the db
    return this.characterModel.findOneAndUpdate({ name: char.name }, char, { new: true });
  }

  async heal(name: string, payload: CharacterHealDto): Promise<CharacterDto | HttpException> {
    // check if the character exists
    const char = await this.findOneByName(name);
    if (char === null) {
      return new HttpException('no character was found with this name', 400);
    }

    // add hp to the player, temporary or permanent
    char.hitPoints += payload.permanentHitPoints;
    if (char.hitPoints > char.maxHitPoints) {
      char.hitPoints = char.maxHitPoints;
    }

    char.temporaryHitPoints = payload.temporaryHitPoints > (char.temporaryHitPoints || 0) ?payload.temporaryHitPoints : char.temporaryHitPoints;

    return this.characterModel.findOneAndUpdate({ name }, char, { new: true }); 
  }
}
