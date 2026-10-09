/**
 * Represents raw or parameterized SQL expressions.
 */
export interface SQL {
  readonly _: {
    brand: 'SQL'
  }
}

/**
 * Tagged template function for building parameterized SQL queries.
 */
export interface SQLTaggedTemplate {
  (strings: TemplateStringsArray, ...params: any[]): SQL
  /**
   * Injects literal SQL without parameter escaping.
   * Useful for DDL contexts (DEFAULT / CHECK / GENERATED).
   */
  raw(sqlString: string): SQL
  /**
   * Returns an empty SQL fragment.
   */
  empty(): SQL
  /**
   * Joins an array of SQL fragments with an optional separator.
   */
  join(chunks: SQL[], separator?: SQL | string): SQL
}

export declare const sql: SQLTaggedTemplate

/**
 * SQLite column representation.
 */
export interface Column<
  TData = any,
  TNotNull extends boolean = boolean,
  THasDefault extends boolean = boolean,
> {
  readonly _: {
    name: string
    dataType: TData
    notNull: TNotNull
    hasDefault: THasDefault
  }
}

/**
 * Column builder for configuring SQLite column schema.
 */
export interface ColumnBuilder<
  TData = any,
  TNotNull extends boolean = boolean,
  THasDefault extends boolean = boolean,
> {
  /**
   * Designates this column as the primary key.
   */
  primaryKey(opts?: { autoIncrement?: boolean }): ColumnBuilder<TData, true, true>

  /**
   * Marks the column as NOT NULL.
   */
  notNull(): ColumnBuilder<TData, true, THasDefault>

  /**
   * Marks the column with a UNIQUE constraint.
   */
  unique(name?: string): ColumnBuilder<TData, TNotNull, THasDefault>

  /**
   * Sets a default value or SQL expression for this column.
   */
  default(value: TData | SQL): ColumnBuilder<TData, TNotNull, true>

  /**
   * Defines a generated (computed) column.
   */
  generatedAlwaysAs(
    sqlExpr: SQL,
    opts?: { mode?: 'virtual' | 'stored' },
  ): ColumnBuilder<TData, TNotNull, true>

  /**
   * Adds custom column-level DDL constraint.
   */
  constraint(ddl: string): ColumnBuilder<TData, TNotNull, THasDefault>

  /**
   * Marks this column as deprecated (pending drop).
   * Terminal method — do not chain further methods after this.
   */
  deprecated(reason: string): void
}

/**
 * Factory options for columns.
 */
export interface ColumnOptions<TMode extends string = string> {
  mode?: TMode
}

export declare function text<T extends string = string>(
  name?: string,
  opts?: ColumnOptions<'text'>,
): ColumnBuilder<T, false, false>

export declare function integer<T extends number = number>(
  name?: string,
  opts?: ColumnOptions<'number'>,
): ColumnBuilder<T, false, false>

export declare function integer(
  name: string | undefined,
  opts: { mode: 'boolean' },
): ColumnBuilder<boolean, false, false>

export declare function integer(
  name: string | undefined,
  opts: { mode: 'timestamp' | 'timestamp_ms' },
): ColumnBuilder<Date, false, false>

export declare function integer(
  name?: string,
  opts?: ColumnOptions<'boolean' | 'timestamp' | 'timestamp_ms' | 'number'>,
): ColumnBuilder<any, false, false>

export declare function real<T extends number = number>(
  name?: string,
  opts?: ColumnOptions,
): ColumnBuilder<T, false, false>

export declare function float<T extends number = number>(
  name?: string,
  opts?: ColumnOptions,
): ColumnBuilder<T, false, false>

export declare function numeric<T extends number = number>(
  name?: string,
  opts?: ColumnOptions,
): ColumnBuilder<T, false, false>

export declare function blob(
  name?: string,
  opts?: ColumnOptions<'bytes'>,
): ColumnBuilder<Uint8Array, false, false>

export declare function boolean(
  name?: string,
  opts?: ColumnOptions,
): ColumnBuilder<boolean, false, false>

export declare function json<T = any>(
  name?: string,
  opts?: ColumnOptions<'json'>,
): ColumnBuilder<T, false, false>

/**
 * Converts column builders in a schema record to column instances.
 */
export type BuildColumns<TRecord extends Record<string, any>> = {
  [K in keyof TRecord]: TRecord[K] extends ColumnBuilder<
    infer TData,
    infer TNotNull,
    infer THasDefault
  >
    ? Column<TData, TNotNull, THasDefault>
    : TRecord[K]
}

/**
 * Base table interface.
 */
export interface Table<
  TName extends string = string,
  TColumns extends Record<string, Column<any, any, any>> = Record<string, Column<any, any, any>>,
> {
  readonly _: {
    name: TName
    columns: TColumns
  }
  strict(): this
  withoutRowid(): this
  constraint(ddl: string, name?: string): this
  deprecated(reason: string): void
}

/**
 * Complete table instance, intersecting the Table interface with its columns.
 */
export type TableInstance<
  TName extends string,
  TColumns extends Record<string, Column<any, any, any>>,
> = Table<TName, TColumns> & TColumns

/**
 * Infers the row shape when selecting from a Table.
 */
export type InferSelectModel<TTable extends Table> = {
  [K in keyof TTable['_']['columns']]: TTable['_']['columns'][K] extends Column<
    infer TData,
    infer TNotNull,
    any
  >
    ? TNotNull extends true
      ? TData
      : TData | null
    : never
}

/**
 * Infers the value shape when inserting into a Table.
 */
export type InferInsertModel<TTable extends Table> = {
  [
    K in keyof TTable['_']['columns'] as TTable['_']['columns'][K] extends Column<any, true, false>
      ? K
      : never
  ]: TTable['_']['columns'][K] extends Column<infer TData, any, any> ? TData : never
} & {
  [
    K in keyof TTable['_']['columns'] as TTable['_']['columns'][K] extends Column<any, true, false>
      ? never
      : K
  ]?: TTable['_']['columns'][K] extends Column<infer TData, any, any> ? TData | null : never
}

/**
 * Infers custom projection shape.
 */
export type InferProjection<TProjection extends Record<string, any>> = {
  [K in keyof TProjection]: TProjection[K] extends Column<infer TData, any, any>
    ? TData
    : TProjection[K] extends SQL
      ? any
      : any
}

/**
 * Table-level constraint / index builders.
 */
export interface PrimaryKeyConstraint {
  readonly _: { type: 'pk' }
}
export interface UniqueConstraint {
  readonly _: { type: 'unique' }
}
export interface CheckConstraint {
  readonly _: { type: 'check' }
}
export interface IndexConstraint {
  readonly _: { type: 'index' }
}

export interface IndexBuilder {
  on(...cols: (Column | SQL)[]): this
  where(condition: SQL): this
}

export declare function primaryKey(opts: { columns: Column[] }): PrimaryKeyConstraint
export declare function unique(name: string): {
  on(...cols: Column[]): UniqueConstraint
}
export declare function check(name: string, condition: SQL): CheckConstraint
export declare function index(name: string): IndexBuilder
export declare function uniqueIndex(name: string): IndexBuilder

/**
 * Defines a new database table.
 */
export declare function table<
  TName extends string,
  TColumns extends Record<string, ColumnBuilder<any, any, any>>,
>(
  name: TName,
  columns: TColumns,
  extraFn?: (t: BuildColumns<TColumns>) => Record<string, any>,
): TableInstance<TName, BuildColumns<TColumns>>

/**
 * Database execution result for mutations without RETURNING.
 */
export interface RunResult {
  rowsAffected: number
  lastInsertRowid: number
  rows: any[]
}

/**
 * Query builder for SELECT statements.
 */
export interface SelectQueryBuilder<TRow> extends PromiseLike<TRow[]> {
  where(...conditions: (SQL | boolean | undefined | null)[]): this
  orderBy(...orders: (SQL | Column | string)[]): this
  limit(n: number): this
  offset(n: number): this
  groupBy(...cols: (Column | SQL)[]): this
  having(condition: SQL): this
  distinct(): this
  all(): Promise<TRow[]>
  get(): Promise<TRow | null>
  values(): Promise<any[][]>
}

export interface SelectBuilderInitial {
  from<TTable extends Table>(table: TTable): SelectQueryBuilder<InferSelectModel<TTable>>
}

export interface SelectBuilderWithProjection<TProjection extends Record<string, any>> {
  from<TTable extends Table>(table: TTable): SelectQueryBuilder<InferProjection<TProjection>>
}

/**
 * Query builder for INSERT statements.
 */
export interface InsertQueryBuilder<
  TTable extends Table,
  TResult = RunResult,
> extends PromiseLike<TResult> {
  onConflictDoNothing(opts?: { target?: Column | Column[] }): this
  onConflictDoUpdate(opts: {
    target?: Column | Column[]
    set: Partial<InferInsertModel<TTable>> | Record<string, any>
  }): this
  returning(): InsertQueryBuilder<TTable, InferSelectModel<TTable>[]>
  returning<TProjection extends Record<string, any>>(
    projection: TProjection,
  ): InsertQueryBuilder<TTable, InferProjection<TProjection>[]>
  run(): Promise<TResult>
}

export interface InsertBuilderInitial<TTable extends Table> {
  values(values: InferInsertModel<TTable> | InferInsertModel<TTable>[]): InsertQueryBuilder<TTable>
}

/**
 * Query builder for UPDATE statements.
 */
export interface UpdateQueryBuilder<
  TTable extends Table,
  TResult = RunResult,
> extends PromiseLike<TResult> {
  where(...conditions: (SQL | boolean | undefined | null)[]): this
  returning(): UpdateQueryBuilder<TTable, InferSelectModel<TTable>[]>
  returning<TProjection extends Record<string, any>>(
    projection: TProjection,
  ): UpdateQueryBuilder<TTable, InferProjection<TProjection>[]>
  run(): Promise<TResult>
}

export interface UpdateBuilderInitial<TTable extends Table> {
  set(values: Partial<InferInsertModel<TTable>> | Record<string, any>): UpdateQueryBuilder<TTable>
}

/**
 * Query builder for DELETE statements.
 */
export interface DeleteQueryBuilder<
  TTable extends Table,
  TResult = RunResult,
> extends PromiseLike<TResult> {
  where(...conditions: (SQL | boolean | undefined | null)[]): this
  returning(): DeleteQueryBuilder<TTable, InferSelectModel<TTable>[]>
  returning<TProjection extends Record<string, any>>(
    projection: TProjection,
  ): DeleteQueryBuilder<TTable, InferProjection<TProjection>[]>
  run(): Promise<TResult>
}

/**
 * Comparison & logical operators.
 */
export declare function eq(col: Column | SQL, val: any): SQL
export declare function ne(col: Column | SQL, val: any): SQL
export declare function gt(col: Column | SQL, val: any): SQL
export declare function gte(col: Column | SQL, val: any): SQL
export declare function lt(col: Column | SQL, val: any): SQL
export declare function lte(col: Column | SQL, val: any): SQL
export declare function like(col: Column | SQL, pattern: string): SQL
export declare function notLike(col: Column | SQL, pattern: string): SQL
export declare function isNull(col: Column | SQL): SQL
export declare function isNotNull(col: Column | SQL): SQL
export declare function and(...conditions: (SQL | boolean | undefined | null)[]): SQL
export declare function or(...conditions: (SQL | boolean | undefined | null)[]): SQL
export declare function not(condition: SQL): SQL
export declare function between(col: Column | SQL, min: any, max: any): SQL
export declare function notBetween(col: Column | SQL, min: any, max: any): SQL
export declare function inArray(col: Column | SQL, values: any[] | SQL): SQL
export declare function notInArray(col: Column | SQL, values: any[] | SQL): SQL
export declare function count(col?: Column | SQL): SQL
export declare function sum(col: Column | SQL): SQL
export declare function avg(col: Column | SQL): SQL
export declare function min(col: Column | SQL): SQL
export declare function max(col: Column | SQL): SQL
export declare function asc(col: Column | SQL): SQL
export declare function desc(col: Column | SQL): SQL

/**
 * Top-level Database client interface.
 */
export interface Database {
  /**
   * Initiates a SELECT query.
   */
  select(): SelectBuilderInitial
  select<TProjection extends Record<string, any>>(
    projection: TProjection,
  ): SelectBuilderWithProjection<TProjection>

  /**
   * Initiates an INSERT query.
   */
  insert<TTable extends Table>(table: TTable): InsertBuilderInitial<TTable>

  /**
   * Initiates an UPDATE query.
   */
  update<TTable extends Table>(table: TTable): UpdateBuilderInitial<TTable>

  /**
   * Initiates a DELETE query.
   */
  delete<TTable extends Table>(table: TTable): DeleteQueryBuilder<TTable>

  /**
   * Counts rows in a table matching an optional WHERE condition.
   */
  $count(table: Table, where?: SQL): Promise<number>

  /**
   * Executes a write or raw SQL statement.
   */
  run(sqlExpr: SQL | string, params?: Record<string, any> | any[]): Promise<RunResult>

  /**
   * Executes a raw SQL query and returns all matching rows as objects.
   */
  all<T = any>(sqlExpr: SQL | string, params?: Record<string, any> | any[]): Promise<T[]>

  /**
   * Executes a raw SQL query and returns the first matching row, or null.
   */
  get<T = any>(sqlExpr: SQL | string, params?: Record<string, any> | any[]): Promise<T | null>

  /**
   * Executes a raw SQL query and returns rows as arrays of positional values.
   */
  values<T = any[]>(sqlExpr: SQL | string, params?: Record<string, any> | any[]): Promise<T[]>

  /**
   * Low-level raw database access.
   */
  raw: {
    read<T = any>(sqlString: string, params?: Record<string, any>): Promise<T[]>
    write(sqlString: string, params?: Record<string, any>): Promise<RunResult>
  }

  table: typeof table
  text: typeof text
  integer: typeof integer
  real: typeof real
  float: typeof float
  numeric: typeof numeric
  blob: typeof blob
  boolean: typeof boolean
  json: typeof json
  sql: typeof sql
  eq: typeof eq
  ne: typeof ne
  gt: typeof gt
  gte: typeof gte
  lt: typeof lt
  lte: typeof lte
  and: typeof and
  or: typeof or
  not: typeof not
}

export declare const db: Database
export default db
