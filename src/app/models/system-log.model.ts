import dayjs from 'dayjs';
import { Document, Model, Schema } from 'mongoose';

import { MongoModel } from '@/shared/libs/mongo-model.lib';
import { Mongo } from '@/shared/utils';

export interface S_SystemLog extends S_SystemLogBase, Document {}

export interface S_SystemLogBase {
	app_name?: string;
	class_name?: string;
	function_name?: string;
	request_id?: string;
	slug?: string | null;
	status?: 'success' | 'failed';
	data?: Object | unknown;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}

class SystemLogSchema {
	public static getSchema() {
		return new Schema<S_SystemLogBase>({
			app_name: {
				type: String,
				required: true,
			},
			class_name: {
				type: String,
				required: true,
			},
			function_name: {
				type: String,
				required: true,
			},
			request_id: {
				type: String,
				default: '',
			},
			slug: {
				type: String,
				default: null,
			},
			status: {
				type: String,
				required: true,
			},
			data: {
				type: Object,
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

export class SystemLog extends MongoModel<S_SystemLog> {
	public payload: S_SystemLogBase = {} as S_SystemLogBase;

	constructor() {
		super(
			Mongo.getUtilityDbConnection().models.system_log ||
				(Mongo.getUtilityDbConnection().model<S_SystemLog>(
					'system_log',
					SystemLogSchema.getSchema(),
				) as Model<S_SystemLog>),
		);
	}

	public async save(): Promise<S_SystemLog> {
		return await this.saveInstance(this.payload);
	}
}
