import { URL } from 'url';

import { Model, DataTypes } from 'sequelize';

import { ValidSource, ValidTracker } from '../../config';
import sequelize from '../db';

class View extends Model {
  public id!: number;

  public canonical!: string;

  public referrer!: string | null;

  public source!: ValidSource;

  public tracker!: ValidTracker;

  public url!: string;

  public version!: string;

  public visited_at!: Date;

  get domain(): string {
    return new URL(this.url).hostname;
  }
}

View.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    canonical: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { isUrl: true },
    },
    referrer: {
      type: DataTypes.TEXT,
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
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { isUrl: true },
    },
    version: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    visited_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, timestamps: false }
);

export default View;
