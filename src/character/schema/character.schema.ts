import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Character extends Document {
  @Prop()
  name: string;

  @Prop()
  level: number;

  @Prop()
  hitPoints?: number;

  @Prop()
  classes: any[];

  @Prop()
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };

  @Prop()
  items: any[];

  @Prop()
  defenses: any[]
};

export const CharacterSchema = SchemaFactory.createForClass(Character);
