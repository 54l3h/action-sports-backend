import {
  DeleteResult,
  FilterQuery,
  Model,
  PopulateOptions,
  ProjectionType,
  UpdateQuery,
} from 'mongoose';

interface IFoundOneOptions<TDocument> {
  filters: FilterQuery<TDocument>;
  select?: ProjectionType<TDocument>;
  populateArray?: PopulateOptions[];
  sort?: string | {};
}

interface IFoundManyOptions<TDocument> {
  filters?: FilterQuery<TDocument>;
  select?: ProjectionType<TDocument>;
  populateArray?: PopulateOptions[];
}

export abstract class BaseRepository<TDocument> {
  constructor(private readonly model: Model<TDocument>) {}

  async create(document: Partial<TDocument>): Promise<TDocument> {
    return await this.model.create(document);
  }

  async findOne({
    filters,
    select = '',
    populateArray = [],
    sort = {},
  }: IFoundOneOptions<TDocument>): Promise<TDocument | null> {
    return await this.model
      .findOne(filters, select)
      .populate(populateArray)
      .sort(sort);
  }

  async find({
    filters = {},
    select = '',
    populateArray = [],
  }: IFoundManyOptions<TDocument>): Promise<TDocument[] | null> {
    return await this.model.find(filters, select).populate(populateArray);
  }

  async save(document: TDocument) {
    // Fixed: This was calling itself recursively!
    return (document as any).save();
  }

  async deleteOne(filters: FilterQuery<TDocument>) {
    if (filters._id) {
      return await this.model.findByIdAndDelete(filters._id);
    }
    return await this.model.findOneAndDelete(filters);
  }

  async deleteMany(filters: FilterQuery<TDocument>): Promise<DeleteResult> {
    return await this.model.deleteMany(filters);
  }

  async updateOne(
    filters: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    if (filters._id) {
      return await this.model.findByIdAndUpdate(filters._id, update, { new: true });
    }
    // Fixed: This was calling findOneAndDelete instead of findOneAndUpdate!
    return await this.model.findOneAndUpdate(filters, update, { new: true });
  }
}