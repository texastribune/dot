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

import { PING_JWT_SECRET } from '../../config'; // name?
import sequelize from '../db';
import {
  ValidTrackerSource,
  ValidTrackerType,
  CreateViewArgs,
  TrackerTokenPayload,
} from '../types';

interface ViewsListArgs {
  startDate: string;
  endDate: string;
  canonicalFilter?: string;
  domainFilter?: string;
  summarizeByCanonical?: boolean;
  summarizeByDomain?: boolean;
}

interface TopReprintersHash {
  [key: string]: number;
}

interface TopReprintersItem {
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
  }: CreateViewArgs): Promise<View> {
    // ERROR HANDLING NEEDED
    const tokenPayload = await new Promise((resolve) => {
      jwt.verify(
        token,
        PING_JWT_SECRET as string, // name?
        {
          algorithms: ['HS256'],
          ignoreExpiration: true,
        },
        (error, payload) => {
          resolve(payload);
        }
      );
    });

    const {
      version,
      canonical,
      source,
      type,
    } = tokenPayload as TrackerTokenPayload;

    const view = await View.create({
      canonical,
      domain,
      referrer,
      source,
      type,
      version,
    });

    return view.save();
  }

  public static async getTopReprinters(): Promise<any> {
    const results = await View.findAll({
      attributes: [
        [Sequelize.literal('DISTINCT domain'), 'domain'],
        [Sequelize.literal('canonical'), 'canonical'],
      ],
      group: ['domain', 'canonical'],
    });
    const itemsHash: TopReprintersHash = {};
    const unsortedItems: TopReprintersItem[] = [];

    results.forEach(({ domain }) => {
      if (itemsHash[domain] !== undefined) {
        itemsHash[domain] += 1;
      } else {
        itemsHash[domain] = 1;
      }
    });

    Object.entries(itemsHash).forEach(([domain, reprints]) => {
      unsortedItems.push({ domain, reprints });
    });

    const items = unsortedItems.sort(
      ({ reprints: firstReprints }, { reprints: secondReprints }) => {
        if (firstReprints > secondReprints) return -1;
        if (firstReprints < secondReprints) return 1;
        return 0;
      }
    );
    return { items };
  }

  public static async getViewsList({
    startDate,
    endDate,
    canonicalFilter,
    domainFilter,
    summarizeByCanonical,
    summarizeByDomain,
  }: ViewsListArgs): Promise<any> {
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

    const countQuery = View.count({ where });
    const resultsQuery = View.findAll({
      attributes,
      group,
      order: [[Sequelize.col('views'), 'DESC']],
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
  { sequelize, timestamps: false, underscored: true }
);

export default View;
