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
  ReprinterItem,
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

  public domain!: string;

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
  public static async getTopReprinters(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user: AccessTokenPayload
  ): Promise<ReprinterItem[]> {
    const results = await View.findAll({
      attributes: [
        [Sequelize.literal('DISTINCT domain'), 'domain'],
        [Sequelize.literal('canonical'), 'canonical'],
      ],
      group: ['domain', 'canonical'],
    });
    const itemsHash: { [key: string]: number } = {};
    const unsortedItems: ReprinterItem[] = [];

    results.forEach(({ domain }) => {
      if (itemsHash[domain] !== undefined) {
        itemsHash[domain] += 1;
      } else {
        itemsHash[domain] = 1;
      }
    });

    return unsortedItems.sort(
      ({ reprints: firstReprints }, { reprints: secondReprints }) => {
        if (firstReprints > secondReprints) {
          return -1;
        }
        if (firstReprints < secondReprints) {
          return 1;
        }
        return 0;
      }
    );
  }

  @userPermissions([UserPermissions.ReadViews])
  public static async getViewsListByCanonical(
    user: AccessTokenPayload,
    { startDate, endDate, domain }: ViewsListByCanonicalArgs
  ): Promise<ViewsList> {
    const where: Filterable['where'] = {
      visitedAt: {
        [Operation.between]: [startDate, endDate],
      },
    };

    if (domain) {
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
  ): Promise<ViewsList> {
    const where: Filterable['where'] = {
      visitedAt: {
        [Operation.between]: [startDate, endDate],
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
