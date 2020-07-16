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
import { TrackerIntegrityError } from '../errors';
import {
  CreateViewArgs,
  TrackerTokenPayload,
  ValidTrackerSource,
  ValidTrackerType,
  ViewsListByCanonicalArgs,
  ViewsListByDomainArgs,
} from '../types';

class View extends Model {
  public id!: number;

  public canonical!: string;

  public domain!: string | null;

  public referrer!: string | null;

  public source!: ValidTrackerSource;

  public type!: ValidTrackerType;

  public version!: string;

  public visitedAt!: Date;

  public static async createView({
    token,
    domain,
    referrer,
    version: queryParamVersion,
  }: CreateViewArgs): Promise<View> {
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

    const {
      version: tokenVersion,
      canonical,
      source,
      type,
    } = tokenPayload as TrackerTokenPayload;

    if (queryParamVersion !== tokenVersion) {
      throw new TrackerIntegrityError({ message: 'Versions do not match' });
    }

    const view = await View.create({
      canonical,
      domain,
      referrer,
      source,
      type,
      version: tokenVersion,
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
    referrer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM(...Object.values(ValidTrackerSource)),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ValidTrackerType)),
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING(8),
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
