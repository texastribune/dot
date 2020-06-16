import {
  Model,
  DataTypes,
  Sequelize,
  Op as Operation,
  Filterable,
  Projectable,
  FindOptions,
} from 'sequelize';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { TRACKER_JWT_SECRET } from '../../config';
import { AccessTokenPayload } from '../../shared-types';
import { userPermissions } from '../utils/decorators';
import sequelize from '../db';
import { TrackerIntegrityError } from '../errors';
import {
  ValidTrackerSource,
  ValidTrackerType,
  CreateViewArgs,
  TrackerTokenPayload,
  UserPermissions,
} from '../types';

type ConditionalUser = AccessTokenPayload | undefined;

interface ViewsListArgs {
  startDate: string;
  endDate: string;
  canonicalFilter?: string;
  domainFilter?: string;
  summarizeByCanonical?: boolean;
  summarizeByDomain?: boolean;
}

interface ReprintersItem {
  id: string;
  domain: string;
  reprints: number;
}

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
    user: ConditionalUser
  ): Promise<ReprintersItem[]> {
    const results = await View.findAll({
      attributes: [
        [Sequelize.literal('DISTINCT domain'), 'domain'],
        [Sequelize.literal('canonical'), 'canonical'],
      ],
      group: ['domain', 'canonical'],
    });
    const itemsHash: { [key: string]: number } = {};
    const unsortedItems: ReprintersItem[] = [];

    results.forEach(({ domain }) => {
      if (itemsHash[domain] !== undefined) {
        itemsHash[domain] += 1;
      } else {
        itemsHash[domain] = 1;
      }
    });

    Object.entries(itemsHash).forEach(([domain, reprints]) => {
      unsortedItems.push({ id: uuidv4(), domain, reprints });
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
  public static async getViewsList(
    user: ConditionalUser,
    {
      startDate,
      endDate,
      canonicalFilter,
      domainFilter,
      summarizeByCanonical,
      summarizeByDomain,
    }: ViewsListArgs
  ): Promise<any> {
    const where: Filterable['where'] = {
      visitedAt: {
        [Operation.between]: [startDate, endDate],
      },
    };
    const attributes: Projectable['attributes'] = [
      [Sequelize.literal('COUNT(canonical)::integer'), 'views'],
    ];
    let group: FindOptions['group'];

    if (domainFilter) {
      where.domain = { [Operation.like]: domainFilter };
      attributes.push('canonical');
      group = 'canonical';
    } else if (canonicalFilter) {
      where.canonical = { [Operation.like]: canonicalFilter };
      attributes.push('domain');
      group = 'domain';
    } else if (summarizeByDomain) {
      attributes.push('domain');
      group = 'domain';
    } else if (summarizeByCanonical) {
      attributes.push('canonical');
      group = 'canonical';
    }

    const [totalViews, items] = await Promise.all([
      View.count({ where }),
      View.findAll({
        attributes,
        group,
        order: [[Sequelize.col('views'), 'DESC']],
        where,
      }),
    ]);

    return {
      totalViews,
      items: items.map((item) => ({
        ...item.get({ plain: true }),
        id: uuidv4(),
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
