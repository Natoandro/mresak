import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize';

class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
  declare passwordHash: string;
}

export default function adminModel(sequelize: Sequelize) {
  Admin.init({
    passwordHash: {
      type: DataTypes.NUMBER,
    }
  }, {
    sequelize,
    freezeTableName: true,
  });
  return Admin;
}

export type { Admin };
