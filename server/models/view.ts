import {
  Model,
  DataTypes,
  Sequelize,
  Op as Operation,
  Filterable,
} from 'sequelize';
import jwt from 'jsonwebtoken';

import { TRACKER_JWT_SECRET } from '../config';
import {
  AccessTokenPayload,
  ViewsItemByCanonical,
  ViewsItemByDomain,
  ViewsList,
  UserPermissions,
} from '../../shared-types';
import { userPermissions } from '../utils/decorators';
import sequelize from '../db';
import {
  TrackerTokenPayload,
  ValidTrackerSource,
  ViewsListByCanonicalArgs,
  ViewsListByDomainArgs,
} from '../types';

class View extends Model {
  public id!: number;

  public canonical!: string;

  public domain!: string | null;

  public source!: ValidTrackerSource;

  public visitedAt!: Date;

  public static async createViewFromToken({
    token,
    domain,
  }: {
    token: string;
    domain: string;
  }): Promise<View> {
    const tokenPayload = await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        TRACKER_JWT_SECRET as string,
        {
          algorithms: ['HS256'],
          ignoreExpiration: true,
        },
        (error, payload) => {
          if (error) {
            reject(error);
          } else {
            resolve(payload);
          }
        }
      );
    });

    const { canonical, source } = tokenPayload as TrackerTokenPayload;
    const view = await View.create({
      canonical,
      source,
      domain: domain || null,
    });

    return view.save();
  }

  @userPermissions([UserPermissions.ReadViews])
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
          [Sequelize.literal('COUNT(canonical)::integer'), 'views'],
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

  @userPermissions([UserPermissions.ReadViews])
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
          [Sequelize.literal('COUNT(domain)::integer'), 'views'],
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
        notContains: ['localhost', 's3.amazonaws.com'],
      },
    },
    source: {
      type: DataTypes.ENUM(...Object.values(ValidTrackerSource)),
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
