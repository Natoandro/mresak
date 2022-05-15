import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes } from 'sequelize';

class Session
  extends Model<InferAttributes<Session>, InferCreationAttributes<Session>>
{
  public sid!: string;
  public sess!: string;
}

export default function sessionsModel(sequelize: Sequelize) {
  Session.init({
    sid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    sess: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { sequelize });
  return Session;
}


export type { Session };

