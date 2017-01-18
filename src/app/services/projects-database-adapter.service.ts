import {Injectable} from '@angular/core'
import * as lf from 'lovefield'

import {LovefieldProviderService} from './lovefield-provider.service'
import {DatabaseAdapterService} from './database-adapter.service'
import {Project} from '../domain/project/project'
import {unixtime} from '../utils/unixtime'

const PROJECT = 'Project'

const schema = (db: lf.Database): lf.schema.Table => {
  return db.getSchema().table(PROJECT)
}

@Injectable()
export class ProjectsDatabaseAdapterService {

  private lf: typeof lf

  constructor(private db: DatabaseAdapterService,
              lovefieldProvider: LovefieldProviderService) {
    this.lf = lovefieldProvider.get()
    this.initSchema()
  }

  addRow(item: Project): Promise<Object[]> {
    return this.db.connection.then((db) => {
      const row = schema(db)
        .createRow(item)
      return db
        .insertOrReplace()
        .into(schema(db))
        .values([row])
        .exec()
    })
  }

  deleteRow(primaryKey: string): Promise<Object[]> {
    return this.db.connection.then((db) => {
      const project = schema(db)
      return db
        .delete()
        .from(project)
        .where(project['uuid'].eq(primaryKey))
        .exec()
    })
  }

  update(item: Project) {
    return this.db.connection.then((db) => {
      const project = schema(db)
      return db
        .update(project)
        .set(project['latentVariables'], item.latentVariables)
        .set(project['model'], item.model)
        .set(project['modified'], unixtime())
        .where(project['uuid'].eq(item.uuid))
        .exec()
    })
  }

  getAll(): Promise<Object[]> {
    return this.db.connection.then((db) => {
      const project = schema(db)
      return db
        .select()
        .from(project)
        .exec()
    })
  }

  getSingle(primaryKey: string): Promise<Object[]> {
    return this.db.connection.then((db) => {
      const project = schema(db)
      return db
        .select()
        .from(project)
        .where(project['uuid'].eq(primaryKey))
        .exec()
    })
  }

  private initSchema() {
    this.db.builder.createTable(PROJECT).
    addColumn('uuid',              this.lf.Type.STRING).
    addColumn('created',           this.lf.Type.NUMBER).
    addColumn('modified',          this.lf.Type.NUMBER).
    addColumn('model',             this.lf.Type.OBJECT).
    addColumn('name',              this.lf.Type.STRING).
    addColumn('observedVariables', this.lf.Type.OBJECT).
    addColumn('latentVariables',   this.lf.Type.OBJECT).
    addPrimaryKey(['uuid'])
  }

}
