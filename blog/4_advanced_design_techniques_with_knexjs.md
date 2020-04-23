---
id: '4'
date: '2020-04-16T04:13:56+00:00'
title: 'Advanced recipes with Knex.js'
template: post
thumbnail: '../thumbnails/typescript.png'
slug: advanced-knexjs
readtime: '10 min'
categories:  
  - NodeJS
  - SQL
tags:
  - Algorithms
  - NodeJs
  - Typescript
  - KnexJS
  - PostgreSQL
---


Hi there, before this article i added 2 introduction posts about KnexJS. They cover connections, basic data operations, schema building, migrations and transaction.I suggest if you are new user for KnexJS, please read those 2 articles. In this post, i will give some advanced recipes and show you a few design tips. 

## Global Events of KnexJS

### Global error catching

While accessing database, you will add try/catch or promise.catch to your access functions for error handling. Beside this per function based error handling, with knex you can register a global error catcher by registering this event, you can filter all errors and redirect them to a spesific logging folder. 

```typescript
        this._knex.on('query-error',(queryError)=>{
        // Handle and inspect every error of your database queries
      })
```

You can put a simple database logger, but it is not useful. Because knex also provides a logging interceptor like this. Instead of logging this query-error event, please use logger interceptors.

```typescript
                let config = {
                    client: 'pg',
                    version: '7.2',
                    connection: {
                        host: appConfig.dbConfig().host,
                        user: appConfig.dbConfig().username,
                        password: appConfig.dbConfig().password,
                        database: appConfig.dbConfig().database
                    },
                    migrations: {
                        tableName: "migrations",
                        directory: "../migrations"
                    },
                    acquireConnectionTimeout: 20000,
                    useNullAsDefault: true,
                    log:{
                        warn(message) {
                            //Put your logger method
                        },
                        error(message) {
                            //Put your logger method
                        },
                        deprecate(message) {
                            //Put your logger method
                        },
                        debug(message) {
                            //Put your logger method
                        }                    
                    }
                };

                this._knex = knex(config);
```

Do not expect much from query errors for generalizing them. They are database client spesific errors. So, an example of an error will be like this for a missing table. However you can use some pattern matching or filtering texts for catching spesific errors. Actually, for postgresql errors like 'Max connection pool reached' means your system is overloaded you can send a notification to your system admin. And deadlock errors are another pain for developers, they may be nondeterministic so you can check for deadlock issues at global error interceptor.    

```bash
dataType:undefined
detail:undefined
file:"parse_relation.c"
hint:undefined
internalPosition:undefined
internalQuery:undefined
length:111
line:"1159"
message:"select "id", "title" from "public"."users" where "title" ilike $1 - relation "public.users" does not exist"
name:"error"
position:"27"
routine:"parserOpenTable"
schema:undefined
severity:"ERROR"
stack:"error: select "id", "title" from "public"."users" where "title" ilike $1 - relation "public.users" does not exist
    at Connection.parseE *******\node_modules\pg\lib\connection.js:600:48)
    at Connection.parseMessage *******\node_modules\pg\lib\connection.js:399:19)
    at Socket.<anonymous> *******\node_modules\pg\lib\connection.js:115:22)
    at Socket.emit (events.js:311:20)
    at addChunk (_stream_readable.js:294:12)
    at readableAddChunk (_stream_readable.js:275:11)
    at Socket.push (_stream_readable.js:209:10)
    at TCP.onStreamRead (internal/stream_base_commons.js:186:23)"
table:undefined
where:undefined
__proto__:Object {constructor: , name: 
```

### Intercepting queries for further analysis

You have 2 more events, one is fired before a query is executed the other is after execution completed with success
- query
- query-response

These events contain all necessary information for measuring or inspecting queries.One of the crucial member is '__knexQueryUid', it is a unique identifier for each query assigned by knex query engine. 

Lets make an example about measuring query durations.
```typescript

                this._knex.on('query',(query)=>{
                    this._queryList.push({uid:query.__knexQueryUid, time:new Date()})                  
                })

                this._knex.on('query-response',(response, obj, builder)=>{
                    let targetQuery = this._queryList.find(x => x.uid == obj.__knexQueryUid);
                    if(targetQuery){
                        logger.log("Query " + obj.sql);
                        logger.log("time elapsed for query : " + moment().diff(targetQuery.time,'millisecond').toString() + " ms");
                    }
                })

```
and result is here 

```bash
Query select "id", "title" from "public"."books" where "title" ilike $1
time elapsed for query : 16 ms
```

Another example is inspecting for certain keywords
```typescript
               this._knex.on('query',(query)=>{
                    if(query.sql.includes('ilike')){
                        logger.log("Please do not use wildcard");
                    }
                })
```

## Making Migrations Interesting

In the second part of introduction series, i explained migrations in Knex. It is simple, you setup a directory and put your migration codes with 2 functions up and down. All the migration process is transactional, if an error occurs, migration will rollback. If you have multiple databases like one MongoDB and one PostgreSQL instance and make some migrations on both of them. 

Here i will show you how to use migrations with multiple type of databases.

First, build a directory for multiple type of databases. Also you can add some custom migrations for spesific purposes like for a spesific vendor. Put version_name.migrate.ts or date.migrate.ts files under migrations and put multiple folders for other stuff.  You can use same name of files, i generally add spesific database type name into filename for easy reading
```bash

    - src
        -- migrations
            --- psql
                ---- \version.01.psql.migrate.ts
                ---- \version.02.psql.migrate.ts
            --- mysql
                ---- \version.01.mysql.migrate.ts
                ---- \version.02.mysql.migrate.ts
            --- \version.01.migrate.ts
            --- \version.02.migrate.ts
        --\migrationManager.ts
```

In your upper level files i will add just a reference to my migration manager. This part is controlled by KnexJs, so i will take control of transction and manage it by myself. 
```typescript
    import * as Knex from 'knex';
    import { migrationManager } from '../migrationsManager';

    let fileTokens = __filename.replace('.js','').split('\\');
    let migrationName = fileTokens[fileTokens.length - 1]
    
    export async function up(knex: Knex): Promise<any> {
        await migrationManager.up(knex, migrationName);
    }

    export async function down(knex: Knex): Promise<any> {
        await migrationManager.down(knex, migrationName);
    }
```

And here is our migration manager class. Basic idea is to find target migration file, import js file with require and put your migration logic there. In this example, you can do transactional migration with your both mysql and postgresql databases in the same transaction. This transaction is actually belongs to PostgreSQL. 

```typescript

function getMigrationPath(dbName: string, migrationName: string) {
    if (fs.existsSync(path.resolve(__dirname, 'migrations', dbName, migrationName + '.' + dbName + '.js'))) {
        return require(path.resolve(__dirname, 'migrations', dbName, migrationName + '.' + dbName + '.js'));
    }
    return null;
}

export class MigrationManager {
    private _knex: Knex;
    private _mongoClient: MongoClient;

    public async up(knex: Knex, migrationName: string): Promise<any> {
        try {
            await knex.transaction(async (trx) => {
                let migration = getMigrationPath('psql', migrationName);
                if (migration) {
                    await migration.up(trx);
                }

                let nosqlMigration = getMigrationPath('mysql', migrationName);
                if (nosqlMigration) {
                    await nosqlMigration.up(trx, this._mongoClient);
                }
            })
        } catch (error) {
            logger.log(error);
        }
    }

    public async down(knex: Knex, migrationName: string): Promise<void> {
        try {
            await knex.transaction(async (trx) => {
                let migration = getMigrationPath('psql', migrationName);
                if (migration) {
                    await migration.up(trx);
                }

                let nosqlMigration = getMigrationPath('mysql', migrationName);
                if (nosqlMigration) {
                    await nosqlMigration.up(trx, this._mongoClient);
                }
            });
        } catch (error) {
            logger.log(error);
        }
    }
}
```
*Important notice: mysql doesnt affected with your transaction actually and it will not rollback in case of an error, it is a different database  and one can not use different types of databases in same transaction.(may be MS-DTC but it is also for MS SQL servers).With this approach, i just provide a common schema and version management for both of my databases and in case of an migration error, you can find where the problem occurred easily. To be persistent, you must use "down" methods of your migrations to rollback*


## Advanced Query Building

### Power of generics

Many language and frameworks provides a good ORM for data manipulations, however, in NodeJS world you dont have a good one. Some can say Sequelize ORM, but it is not easy to use and learn. You cant have a comfort of EF or Spring. It is easy to write some basic operations with power of typescript generics and Knexjs

Here is a basic CRUD operations base class for your entities. It is assumed every entity has 'id' as primaryKey. It is for demonstration, no error handling or logging. You can extend with your needs. 

```typescript
        interface Book{
            id:number;
            title:string;
            year:number;
            author:string;
        }

        public async exampleQueries(){

            let bookRepo = new EntityRepo<Book>(this._knex, 'books');

            await bookRepo.addEntity({id:101,title:'The Lords of The Ring',year:1955,author:'Tolkien'});
            await bookRepo.addEntity({id:102,title:'The Hobbit',year:1937,author:'Tolkien'});
            await bookRepo.addEntity({id:103,title:'The Little Prince',year:1943,author:'Antoine de Saint-Exupery'});
            await bookRepo.addEntity({id:103,title:'Animal Farm',year:1945,author:'George Orwell'});

            let aBook =  await bookRepo.getEntity(102);            

            let someBooks =  await bookRepo.listEntities({
                year:'1955'
            },['id','title'],0,10)
            
            let newBookInfo = await bookRepo.updateEntity(102,_lodash.merge(aBook,{title:'THE LOTR'}));

            console.log(newBookInfo);

            let deletedBookInfo = await bookRepo.deleteEntity(102);

            console.log(deletedBookInfo);
        }


    class EntityRepo<T>{
        private _knex:knex;
        private _tableName:string;
        constructor(knex:Knex,tableName:string){
            this._tableName = tableName;
            this._knex = knex;
        }

        public async addEntity(entity:T): Promise<void>{
            return this._knex.withSchema('public')
            .from(this._tableName)
            .insert(entity)            
        }

        public async getEntity(id:number): Promise<T>{
            return this._knex.withSchema('public')
            .from(this._tableName)
            .where('id',id)
            .first();
        }

        public async deleteEntity(id:number): Promise<T>{            
            let deletedRecord = await this._knex.withSchema('public')
            .from(this._tableName)
            .where('id',id)
            .delete().returning('*')

            return deletedRecord[0];
        }

        public async updateEntity(id:number, updateInfo:T): Promise<T>{                        
            //Dont change primary id's
            delete updateInfo['id'];

            let newRecord = await this._knex.withSchema('public')
            .from(this._tableName)
            .where('id',id)
            .update(updateInfo)
            .returning('*');
            
            return newRecord[0];
        }

        public async listEntities<C extends Object,R extends keyof T>(listCriteria:C, queryResult:R[], offset?:number, limit?:number): Promise<R[]>{
            let qb = this._knex.withSchema('public')
            .from(this._tableName)
            
            Object.keys(listCriteria).forEach(column => {
                qb = qb.where(column, listCriteria[column])
            })

            if(limit){
                qb = qb.limit(limit);
            }

            if(offset){
                qb = qb.offset(offset);
            }
           

            let selectColumns = [];
            if(queryResult.length > 0){
                selectColumns.push(...queryResult);                    
            }
            else {
                selectColumns.push('*');
            }            
            return qb.select(selectColumns);;
        }        
```


### Power of customization

Suppose you have a form in your application and its input data is connected to a table. Sure generics are powerful, however in this type of cases customization with common interfaces is a better option. Variety of datatypes can be handled more properly.

```typescript
        enum FieldType {
            text = 1,
            integer = 2,
            datetime = 3        
        }

        enum Operator {
            equal = '=',
            notEqual = '!=',
            lessThan = '<',
            moreThan = '>',
            like = 'like'
        }

        interface FormField{
            type: FieldType;
            name:string;
            searchValue: any;
            operator:Operator;
        }

        async function buildFormQuery(tableName:string, fields:FormField[], selectColumns:string[]){
            let qb = this._knex.withSchema('public')
            .from(tableName)
            
            for(let i = 0; i < fields.length ; i++){
                qb = qb.where(fields[i].name,fields[i].operator,fields[i].searchValue)
            }

            return qb.first(selectColumns);
        }

            let fields:FormField[] = [{
                type:FieldType.integer,
                name:'year',
                searchValue:1930,
                operator:Operator.moreThan
            },{
                type:FieldType.integer,
                name:'year',
                searchValue:1950,
                operator:Operator.lessThan
            }] 

            await this.buildFormQuery('books',fields,['id','title']);
```


### Subqueries

Having a builded query in variables is also accepted in KnexJS. Complex queries can be builded and more readable with seperate subqueries

```typescript
                let subQuery = this._knex.withSchema('public').table('books').where('year', '<', 1950).select('id');

                let qb = this._knex.withSchema('public')
                    .table('orders')
                    .where('bookId', 'in', subQuery)
                    .select('*');
                //Result
                // select * from "public"."orders" where "bookId" in (select "id" from "public"."books" where "year" < 1950)

```

Here, with power of callbacks, complex where clauses example

```typescript
                let qb = this._knex.withSchema('public')
                    .table('orders')
                    .where(where => {
                        where.andWhere('price','<','22.0')
                        .whereWrapped(wrapp => {
                            wrapp.orWhere('discount','<','5')
                            .orWhere('discount','>','2')
                        })
                    })
                    .select('*');

                //Result
                //select * from "public"."orders" where ("price" < '22.0' and ("discount" < '5' or "discount" > '2'))
```