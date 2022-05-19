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
  ProjectionAlias,
  Sequelize,
} from 'sequelize';
import { NextSerializable, Writable } from '~/lib/types';
import ensureNumber from '~/lib/utils/ensureNumber';
import { ChatMembers } from './chatMembers';
import { Message, MessageAttributes } from './messages';
import { User, UserAsChatMemberAttributes } from './users';


export interface ChatAttributes extends Writable<NextSerializable<Attributes<Chat>>> {
  members?: UserAsChatMemberAttributes[];
  latestMessage: MessageAttributes | null;
}


const getChatIdsByMemberQuery = (s: Sequelize, memberId: number) => s.literal(`(
  SELECT chatId
    FROM ChatMembers
    WHERE userId = ${ensureNumber(memberId)}
    GROUP BY chatId
)`);

export class Chat
  extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>>
{
  declare readonly id: CreationOptional<number>;
  declare title: CreationOptional<string | null>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly latestActivityDate: CreationOptional<Date>;
  declare readonly unseenMessageCount: CreationOptional<number>;

  declare readonly members?: NonAttribute<User[]>;
  declare readonly messages?: NonAttribute<Message[]>;

  declare getMembers: HasManyGetAssociationsMixin<User>;
  declare addMember: HasManyAddAssociationMixin<User, number>;

  public static projectLatestActivityDate(sequelize: Sequelize): ProjectionAlias {
    return [
      sequelize.literal(`(
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
        )`),
      'latestActivityDate'
    ];
  }

  public static projectUnseenMessageCount(sequelize: Sequelize, memberId: number): ProjectionAlias {
    return [
      sequelize.literal(`(
        SELECT COUNT(*) FROM Messages M
          WHERE M.ChatId = Chat.id
            AND  M.createdAt > (
            SELECT latestSeen FROM ChatMembers
              WHERE ChatId = Chat.id AND UserId = ${ensureNumber(memberId)}
          )
      )`),
      'unseenMessageCount'
    ];
  }

  public toJSON(): ChatAttributes {
    const obj = super.toJSON() as unknown as Writable<ChatAttributes>;
    obj.createdAt = Number(obj.createdAt);
    obj.latestMessage = this.messages?.[0]?.toJSON() ?? null;
    obj.latestActivityDate = Number(obj.latestActivityDate);
    delete (obj as any).messages;
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
    const sequelize = Chat.sequelize!;
    const latestActivityDate = sequelize.literal(`
      CASE WHEN messages.createdAt IS NULL THEN Chat.createdAt
                ELSE messages.createdAt
            END
    `);
    return Chat.findAll({
      attributes: {
        include: [
          [latestActivityDate, 'latestActivityDate'],
          Chat.projectUnseenMessageCount(sequelize, memberId),
        ]
      },
      where: {
        [Op.and]: [
          { id: { [Op.in]: getChatIdsByMemberQuery(sequelize, memberId) } },
          sequelize.where(Chat.queryLatestMessageIdByChat, {
            [Op.or]: [
              { [Op.is]: null },
              { [Op.col]: 'messages.id' }
            ]
          })
        ],
      },
      include: [Chat.associations.members, Chat.associations.messages],
      order: [[sequelize.literal('latestActivityDate'), 'DESC']],
    });
  }

  private static get queryLatestMessageIdByChat() {
    return Chat.sequelize!.literal(`(
      SELECT M.id
        FROM Messages AS M
        WHERE M.ChatId = Chat.id
        ORDER BY M.createdAt DESC
        LIMIT 1
    )`);
  }

  public static async findLatestByMember(memberId: number): Promise<Chat | null> {
    const sequelize = Chat.sequelize!;
    return Chat.findOne({
      attributes: {
        include: [
          Chat.projectLatestActivityDate(sequelize),
          Chat.projectUnseenMessageCount(sequelize, memberId),
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
    },
    unseenMessageCount: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('unseenMessageCount');
      }
    }
  }, { sequelize });

  Chat.belongsToMany(User, { through: ChatMembers, as: 'members' });
  User.belongsToMany(Chat, { through: ChatMembers });

  return Chat;
}
