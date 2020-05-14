import { URL } from 'url';

import { Model, DataTypes } from 'sequelize';

import { ValidSource, ValidTracker } from '../../config';
import sequelize from '../db';

class Visit extends Model {
  public id!: number;

  public canonical!: string;

  public referrer!: string | null;

  public source!: ValidSource;

  public tracker!: ValidTracker;

  public url!: string;

  public version!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  get domain(): string {
    return new URL(this.url).hostname;
  }
}

Visit.init(
  {
    id: {
      type: DataTypes.NUMBER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    canonical: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: true },
    },
    referrer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM(...Object.values(ValidSource)),
      allowNull: false,
    },
    tracker: {
      type: DataTypes.ENUM(...Object.values(ValidTracker)),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: true },
    },
    version: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
  },
  { sequelize }
);

export default Visit;
