import { Model } from 'sequelize';

export function toPlainObject<T>(model: Model): T {
  const obj = model.toJSON();
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj as T;
}
