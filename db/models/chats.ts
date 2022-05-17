import {
  Association,
  Attributes,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Op,
  Sequelize,
} from 'sequelize';
import { NextSerializable, Writable } from '~/lib/types';
import ensureNumber from '~/lib/utils/ensureNumber';
import { ChatMembers } from './chatMembers';
import { Message } from './messages';
import { User, UserAsChatMemberAttributes } from './users';


export interface ChatAttributes extends NextSerializable<Attributes<Chat>> {
  readonly members?: UserAsChatMemberAttributes[];
}


const latestActivityDateQuery = `(
  SELECT
      CASE
        WHEN latestMessageDate IS NULL
          THEN Chat.createdAt
        ELSE latestMessageDate
      END
    FROM (
      SELECT MAX(Messages.createdAt) AS latestMessageDate
        FROM Messages
        WHERE chatId = Chat.id
    ) AS LatestDateSubquery
)`;

const getChatIdsByMemberQuery = (s: Sequelize, memberId: number) => s.literal(`(
  SELECT chatId
    FROM ChatMembers
    WHERE userId = ${memberId}
    GROUP BY chatId
)`);

export class Chat
  extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>>
{
  declare readonly id: CreationOptional<number>;
  declare title: CreationOptional<string | null>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly latestActivityDate: CreationOptional<Date>;

  declare readonly members?: NonAttribute<User[]>;

  declare getMembers: HasManyGetAssociationsMixin<User>;
  declare addMember: HasManyAddAssociationMixin<User, number>;

  public toJSON(): ChatAttributes {
    const obj = super.toJSON() as unknown as Writable<ChatAttributes>;
    obj.createdAt = Number(obj.createdAt);
    obj.latestActivityDate = Number(obj.latestActivityDate);
    delete (obj as any).updatedAt;
    if (this.members) {
      obj.members = this.members.map(m => m.toJsonAsChatMember());
    }
    return obj;
  }

  public static async createWithMembers(title: string | undefined, memberIds: number[]): Promise<Chat> {
    return Chat.sequelize!.transaction(async (transaction) => {
      const chat = await Chat.create({ title }, { transaction });
      for (const memberId of memberIds) {
        await chat.addMember(memberId, { transaction });
      }
      await chat.reload({ transaction, include: [Chat.associations.members] });
      return chat;
    });
  }

  public static async findAllByMember(memberId: number): Promise<Chat[]> {
    ensureNumber(memberId);  //* ensures that user it is a number!!
    if (Number.isNaN(memberId)) throw new Error('invalid member id');

    const sequelize = Chat.sequelize!;
    return Chat.findAll({
      attributes: {
        include: [
          [sequelize!.literal(latestActivityDateQuery), 'latestActivityDate']
        ]
      },
      where: {
        id: {
          [Op.in]: getChatIdsByMemberQuery(sequelize, memberId),
        }
      },
      include: [
        {
          model: User,
          as: 'members',
        }
      ],
      order: [[Chat.sequelize!.literal('latestActivityDate'), 'DESC']],
    });
  }

  public static async findLatestByMember(memberId: number): Promise<Chat | null> {
    const sequelize = Chat.sequelize!;
    return Chat.findOne({
      attributes: {
        include: [
          [sequelize.literal(latestActivityDateQuery), 'latestActivityDate']
        ]
      },
      where: {
        id: { [Op.in]: getChatIdsByMemberQuery(sequelize, memberId) }
      },
      order: [[sequelize.literal('latestActivityDate'), 'DESC']]
    });
  }

  public static associations: {
    members: Association<Chat, User>;
    messages: Association<Chat, Message>;
  };
}


export default function chatsModel(sequelize: Sequelize) {
  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    latestActivityDate: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Date(this.getDataValue('latestActivityDate'));
      },
    }
  }, { sequelize });

  Chat.belongsToMany(User, { through: ChatMembers, as: 'members' });
  User.belongsToMany(Chat, { through: ChatMembers });

  return Chat;
}