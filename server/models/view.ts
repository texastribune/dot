import {
  Model,
  DataTypes,
  Sequelize,
  Op as Operation,
  Filterable,
} from 'sequelize';

import { USER_PERMISSIONS } from '../../shared-config';
import {
  AccessTokenPayload,
  ViewsItemByCanonical,
  ViewsItemByDomain,
  ViewsList,
} from '../../shared-types';
import userPermissions from '../decorators/user-permissions';
import sequelize from '../db';
import { ViewsListByCanonicalArgs, ViewsListByDomainArgs } from '../types';
import { VALID_TRACKER_SOURCE } from '../config';

class View extends Model {
  public id!: number;

  public canonical!: string;

  public domain!: string | null;

  public source!: VALID_TRACKER_SOURCE;

  public visitedAt!: Date;

  public static async createView({
    canonical,
    domain,
    source,
  }: {
    canonical: string;
    domain: string;
    source: VALID_TRACKER_SOURCE;
  }): Promise<View> {
    const view = await View.create({
      canonical,
      source,
      domain: domain || null,
    });

    return view.save();
  }

  @userPermissions([USER_PERMISSIONS.ReadViews])
  public static async getViewsListByCanonical(
    user: AccessTokenPayload,
    { startDate, endDate, domain }: ViewsListByCanonicalArgs
  ): Promise<ViewsList<ViewsItemByCanonical>> {
    const where: Filterable['where'] = {
      visitedAt: {
        [Operation.gte]: startDate,
        [Operation.lt]: endDate,
      },
    };

    if (domain === null) {
      where.domain = { [Operation.is]: null };
    } else if (domain) {
      where.domain = { [Operation.like]: domain };
    }

    const [totalViews, items] = await Promise.all([
      View.count({ where }),
      View.findAll({
        attributes: [
          'canonical',
          [Sequelize.literal('COUNT(*)::integer'), 'views'],
        ],
        group: 'canonical',
        order: [[Sequelize.col('views'), 'DESC']],
        where,
      }),
    ]);

    return {
      totalViews,
      items: items.map((item) => ({
        canonical: item.canonical,
        views: item.get('views') as number,
      })),
    };
  }

  @userPermissions([USER_PERMISSIONS.ReadViews])
  public static async getViewsListByDomain(
    user: AccessTokenPayload,
    { startDate, endDate, canonical }: ViewsListByDomainArgs
  ): Promise<ViewsList<ViewsItemByDomain>> {
    const where: Filterable['where'] = {
      visitedAt: {
        [Operation.gte]: startDate,
        [Operation.lt]: endDate,
      },
    };

    if (canonical) {
      where.canonical = { [Operation.like]: canonical };
    }

    const [totalViews, items] = await Promise.all([
      View.count({ where }),
      View.findAll({
        attributes: [
          'domain',
          [Sequelize.literal('COUNT(*)::integer'), 'views'],
        ],
        group: 'domain',
        order: [[Sequelize.col('views'), 'DESC']],
        where,
      }),
    ]);

    return {
      totalViews,
      items: items.map((item) => ({
        domain: item.domain,
        views: item.get('views') as number,
      })),
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
      allowNull: true,
      validate: {
        notTest(value: string): void {
          if (value.includes('localhost')) {
            throw new Error('Domain contains "localhost"');
          }
        },
        notS3(value: string): void {
          if (value.includes('s3.amazonaws.com')) {
            throw new Error('Domain contains "s3.amazonaws.com"');
          }
        },
      },
    },
    source: {
      type: DataTypes.ENUM(...Object.values(VALID_TRACKER_SOURCE)),
      allowNull: false,
    },
    visitedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    indexes: [
      {
        using: 'BTREE',
        fields: ['canonical', 'domain', 'visitedAt'],
      },
    ],
  }
);

export default View;
