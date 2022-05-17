import {
  Attributes,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize';
import { NextSerializable } from '~/lib/types';

export interface ChatMembersAttributes extends NextSerializable<Attributes<ChatMembers>> { }

export class ChatMembers
  extends Model<InferAttributes<ChatMembers>, InferCreationAttributes<ChatMembers>>
{
  declare readonly chatId: ForeignKey<number>;
  declare readonly userId: ForeignKey<number>;
  declare latestDelivered: Date;
  declare latestSeen: Date;

  public toJSON(): ChatMembersAttributes {
    const obj = super.toJSON() as unknown as ChatMembersAttributes;
    obj.latestDelivered = String(obj.latestDelivered);
    obj.latestSeen = String(obj.latestSeen);
    return obj;
  }
}

export default function chatMembersModel(sequelize: Sequelize) {
  ChatMembers.init({
    latestDelivered: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    latestSeen: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    timestamps: false,
  });
}
