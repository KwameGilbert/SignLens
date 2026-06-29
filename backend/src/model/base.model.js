import db from '../config/db.js';

export default class BaseModel {
  constructor(tableName, columns = null) {
    this.tableName = tableName;
    this.db = db;
    this.columns = columns; // Array of all table column names
    
    // By default, select all columns except sensitive ones like passwordHash
    this.selectColumns = columns 
      ? columns.filter(col => col !== 'passwordHash') 
      : '*';
  }

  // Filter input data to only include valid columns
  _filterData(data) {
    if (!this.columns || !data) return data;
    const filtered = {};
    for (const key of Object.keys(data)) {
      if (this.columns.includes(key)) {
        filtered[key] = data[key];
      }
    }
    return filtered;
  }

  // Find all records
  async findAll(options = {}) {
    const { limit, offset, orderBy = 'createdAt', orderDir = 'desc' } = options;
    let query = this.db(this.tableName).select(this.selectColumns);

    if (orderBy && (this.columns ? this.columns.includes(orderBy) : true)) {
      query = query.orderBy(orderBy, orderDir);
    }
    if (limit !== undefined) {
      query = query.limit(limit);
    }
    if (offset !== undefined) {
      query = query.offset(offset);
    }

    return query;
  }

  // Find by primary key (id)
  async findById(id) {
    return this.db(this.tableName)
      .select(this.selectColumns)
      .where({ id })
      .first();
  }

  // Find one by criteria
  async findOne(criteria) {
    const filteredCriteria = this._filterData(criteria);
    return this.db(this.tableName)
      .select(this.selectColumns)
      .where(filteredCriteria)
      .first();
  }

  // Find all matching criteria
  async find(criteria, options = {}) {
    const { limit, offset, orderBy = 'createdAt', orderDir = 'desc' } = options;
    const filteredCriteria = this._filterData(criteria);
    let query = this.db(this.tableName)
      .select(this.selectColumns)
      .where(filteredCriteria);

    if (orderBy && (this.columns ? this.columns.includes(orderBy) : true)) {
      query = query.orderBy(orderBy, orderDir);
    }
    if (limit !== undefined) {
      query = query.limit(limit);
    }
    if (offset !== undefined) {
      query = query.offset(offset);
    }

    return query;
  }

  // Create a record
  async create(data) {
    const filteredData = this._filterData(data);
    const [inserted] = await this.db(this.tableName)
      .insert(filteredData)
      .returning(this.selectColumns);
    return inserted;
  }

  // Update a record by ID
  async update(id, data) {
    const filteredData = this._filterData(data);
    const [updated] = await this.db(this.tableName)
      .where({ id })
      .update(filteredData)
      .returning(this.selectColumns);
    return updated;
  }

  // Delete a record by ID
  async delete(id) {
    return this.db(this.tableName).where({ id }).del();
  }
}
