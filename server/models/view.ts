import { Model, DataTypes, Op, literal, Filterable, col } from 'sequelize';

import { ValidSource, ValidTracker } from '../../config';
import sequelize from '../db';

interface ReprintArgs {
  startDate: string;
  endDate: string;
  domain?: string;
}

class View extends Model {
  public id!: number;

  public canonical!: string;

  public domain!: string;

  public referrer!: string | null;

  public source!: ValidSource;

  public tracker!: ValidTracker;

  public version!: string;

  public visitedAt!: Date;

  public static async getReprints({
    startDate,
    endDate,
    domain,
  }: ReprintArgs): Promise<any> {
    const where: Filterable['where'] = {
      visitedAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (domain) {
      where.domain = { [Op.like]: domain };
    }

    const countQuery = View.count({ where });
    const resultsQuery = View.findAll({
      attributes: [
        'canonical',
        [literal('COUNT(canonical)::integer'), 'views'],
      ],
      group: ['canonical'],
      order: [[col('views'), 'DESC']],
      where,
    });

    const [totalViews, items] = await Promise.all([countQuery, resultsQuery]);
    return {
      totalViews,
      items: items.map((item) => item.get({ plain: true })),
    };
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
    domain: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notContains: ['localhost', 's3.amazonaws.com'],
      },
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
    version: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    visitedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, timestamps: false, underscored: true }
);

export default View;
