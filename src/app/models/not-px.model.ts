import dayjs from 'dayjs';
import { Document, Model, Schema } from 'mongoose';

import { MongoModel } from '@/shared/libs/mongo-model.lib';
import { Mongo } from '@/shared/utils';

export interface S_NotPx extends S_NotPxBase, Document {}

export interface S_NotPxBase {
	tier?: string;
	min_balance?: number;
	total_balance?: number;
	total_repaint?: number;
	total_user?: number;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}

class NotPxSchema {
	public static getSchema() {
		return new Schema<S_NotPxBase>({
			tier: {
				type: String,
				required: true,
			},
			min_balance: {
				type: Number,
				required: true,
			},
			total_balance: {
				type: Number,
				required: true,
			},
			total_repaint: {
				type: Number,
				required: true,
			},
			total_user: {
				type: Number,
				required: true,
			},
			created_at: {
				type: Date,
				required: true,
				default: dayjs().toDate(),
			},
			updated_at: {
				type: Date,
				required: true,
				default: dayjs().toDate(),
			},
			deleted_at: {
				type: Date,
				default: null,
			},
		});
	}
}

export class NotPx extends MongoModel<S_NotPx> {
	public payload: S_NotPxBase = {} as S_NotPxBase;

	constructor() {
		super(
			Mongo.getUtilityDbConnection().models.not_px ||
				(Mongo.getUtilityDbConnection().model<S_NotPx>(
					'not_px',
					NotPxSchema.getSchema(),
				) as Model<S_NotPx>),
		);
	}

	public async save(): Promise<S_NotPx> {
		return await this.saveInstance(this.payload);
	}
}
