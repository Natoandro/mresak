import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize';

export class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
  public passwordHash!: string;
}

export default function adminModel(sequelize: Sequelize) {
  Admin.init({
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    freezeTableName: true,
  });
  return Admin;
}
