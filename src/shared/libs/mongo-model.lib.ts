import dayjs from 'dayjs';
import { ObjectId } from 'bson';
import {
	Document,
	Model,
	PipelineStage,
	ProjectionType,
	QueryOptions,
	RootQuerySelector,
	UpdateQuery,
} from 'mongoose';

export abstract class MongoModel<T extends Document> {
	protected model: Model<T>;
	private baseQuery: RootQuerySelector<T> = { deleted_at: null };
	private baseProjection: ProjectionType<T> = { __v: 0 };
	private defaultOptions: QueryOptions<T> = { sort: { created_at: -1 } };

	constructor(model: Model<T>) {
		this.model = model;
	}

	/**
	 * Collection Save Instance
	 *
	 * @param document
	 * @returns
	 */
	protected async saveInstance(document: Partial<T>): Promise<T> {
		const instance = new this.model(document);
		return instance.save();
	}

	/**
	 * Find
	 *
	 * @param query
	 * @param projection
	 * @param options
	 * @returns
	 */
	public async find(
		query: RootQuerySelector<T>,
		projection?: ProjectionType<T>,
		options: QueryOptions<T> = this.defaultOptions,
	): Promise<T[]> {
		const queryPayload = { ...query, ...this.baseQuery };
		const projectionPayload: ProjectionType<T> =
			projection || this.baseProjection;

		try {
			return await this.model
				.find(queryPayload, projectionPayload, options)
				.exec();
		} catch (error) {
			return [];
		}
	}

	/**
	 * Find One
	 *
	 * @param query
	 * @param projection
	 * @param options
	 * @returns
	 */
	public async findOne(
		query: RootQuerySelector<T>,
		projection?: ProjectionType<T>,
		options: QueryOptions<T> = this.defaultOptions,
	): Promise<T | null> {
		const queryPayload = { ...query, ...this.baseQuery };
		const projectionPayload: ProjectionType<T> =
			projection || this.baseProjection;

		try {
			return await this.model
				.findOne(queryPayload, projectionPayload, options)
				.exec();
		} catch (error) {
			return null;
		}
	}

	/**
	 * Find One by _id
	 *
	 * @param id
	 * @param projection
	 * @returns
	 */
	public async findById(
		id: ObjectId,
		projection?: ProjectionType<T>,
	): Promise<T | null> {
		const query = { _id: id } as RootQuerySelector<T>;
		return await this.findOne(query, projection);
	}

	/**
	 * Get Raw Aggregations
	 *
	 * @param pipeline
	 * @returns
	 */
	public async getRaw(pipeline: PipelineStage[]): Promise<T[]> {
		try {
			return await this.model.aggregate(pipeline).exec();
		} catch (error) {
			return [];
		}
	}

	/**
	 * Find by _id And Update
	 *
	 * @param id
	 * @param updateData
	 * @param options
	 * @returns
	 */
	public async findByIdAndUpdate(
		id: ObjectId,
		updateData: Partial<T>,
		options: QueryOptions<T> = {},
	): Promise<T | null> {
		const { returnUpdated = true, projection = this.baseProjection } =
			options;
		const updateOptions = { new: returnUpdated, projection };
		const payload = { ...updateData, updated_at: dayjs().toDate() };

		try {
			return await this.model
				.findByIdAndUpdate(id, payload as UpdateQuery<T>, updateOptions)
				.exec();
		} catch (error) {
			return null;
		}
	}

	/**
	 * Find One And Update
	 *
	 * @param query
	 * @param updateData
	 * @param options
	 * @returns
	 */
	public async findOneAndUpdate(
		query: RootQuerySelector<T>,
		updateData: Partial<T>,
		options: QueryOptions<T> = {},
	): Promise<T | null> {
		const { returnUpdated = true, projection = this.baseProjection } =
			options;
		const updateOptions = { new: returnUpdated, projection };
		const payload = { ...updateData, updated_at: dayjs().toDate() };

		try {
			return await this.model
				.findOneAndUpdate(
					query,
					payload as UpdateQuery<T>,
					updateOptions,
				)
				.exec();
		} catch (error) {
			return null;
		}
	}

	/**
	 * Find by _id And Delete (soft)
	 *
	 * @param id
	 * @returns
	 */
	public async findByIdAndDelete(id: ObjectId): Promise<T | null> {
		return await this.findByIdAndUpdate(id, {
			deleted_at: dayjs().toDate(),
		} as UpdateQuery<T>);
	}

	/**
	 * Find One And Delete (soft)
	 *
	 * @param id
	 * @returns
	 */
	public async findOneAndDelete(id: ObjectId): Promise<T | null> {
		return await this.findOneAndUpdate(id, {
			deleted_at: dayjs().toDate(),
		} as UpdateQuery<T>);
	}

	/**
	 * Count Documents
	 *
	 * @param query
	 * @returns
	 */
	public async countDocuments(query: RootQuerySelector<T>): Promise<number> {
		const queryPayload = { ...query, ...this.baseQuery };
		try {
			return await this.model.countDocuments(queryPayload).exec();
		} catch (error) {
			return 0;
		}
	}
}
