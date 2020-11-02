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
import { VALID_TRACKER_SOURCE, IS_PROD } from '../config';

class View extends Model {
  public id!: number;

  public canonical!: string;

  public domain!: string | null;

  public source!: VALID_TRACKER_SOURCE;

  public visitedAt!: Date;

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
          [Sequelize.fn('count', Sequelize.col('canonical')), 'views'],
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
          [Sequelize.fn('count', Sequelize.col('*')), 'views'],
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isRightType: (value: any): void => {
          if (typeof value !== 'string' && value != null) {
            throw new Error('Domain is not a string or nullish value');
          }
        },
        notDev: (value: string | null | undefined): void => {
          if (
            IS_PROD &&
            value &&
            (value.includes('local.') || value.includes('localhost'))
          ) {
            throw new Error(`Domain ${value} includes "local"`);
          }
        },
        notTrib: (value: string | null | undefined): void => {
          if (IS_PROD && value && value.includes('texastribune')) {
            throw new Error(`Domain ${value} includes "texastribune"`);
          }
        },
        notCodePen: (value: string | null | undefined): void => {
          if (
            IS_PROD &&
            value &&
            (value.includes('codepen') || value.includes('cdpn'))
          ) {
            throw new Error(`Domain ${value} includes "codepen"`);
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
    hooks: {
      beforeSave: (instance): void => {
        if (
          // to account for the scenario where domain is an empty string
          !instance.domain ||
          // a strange pattern that often comes from RSS
          /[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}/.test(
            instance.domain
          )
        ) {
          // eslint-disable-next-line no-param-reassign
          instance.domain = null;
        }
      },
    },
    // TODO: After v6 Sequelize upgrade, add validationFailed hook that turns all
    // validation failures into instances of an error that inherits from AppError.
    // This will allow for giving meaningful feedback back to user.
  }
);

export default View;
