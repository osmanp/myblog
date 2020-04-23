---
id: '2'
date: '2020-04-17T12:13:56+00:00'
title: 'Introduction to Knex.js Part I'
template: post
thumbnail: '../thumbnails/typescript.png'
slug: introduction-to-knexjs-postgresql-part-I
readtime: '12 min'
categories:  
  - NodeJS
  - SQL
  - Typescript
tags:
  - NodeJs
  - Typescript
  - KnexJS
  - PostgreSQL
---


There are not so many alternatives for handling SQL issues in NodeJS. All the ORM's available are not mature enough like other systems (.NET,Java). But there is a good solution in NodeJS world, that is [Knex.js](http://knexjs.org). Knex is a query builder that can work with many variety of databases from PostgreSQL to Oracle to Amazon Redshift. It provides enough features for having a great data access codes and if you stick rules, you can write once and use it everywhere. I will explain the rules.

In this article, i will show you some beautiful sides of Knex and introduce you how to use it with postgresql in your implementations.

## Getting Started

Starting is easy, just install knex and pg client api at first. For different type of client api's please check the website. Type definitions exist for knexjs.

```bash
npm install knex

npm install @types/knex

npm install pg
```

### Making a connection

Lets connect to our database. Version means client api version (i.e 'pg') not belongs to KnexJs version. I will explain migrations and show some advanced methods in the future.  

In this code, i create a promise, that tries to connect target database, and after connection you see there is a timeout which calls another function. KnexJS doesnt have a connection status event or something similar for that. So I run a raw query, *SELECT 1 + 1 *, which is legal in SQL and if it succesfully runs that means it is connected, if there is an error, your connection is not successful yet. You can use this promise in your applications main course. 

```typescript
import { logger } from './app.log';

export namespace Database {

    export class DbManager {
        private knex: knex;
        constructor() {

        }

        private async checkConnectionStatus(resolve, reject, knex: knex, dbName: string) {
            let tableQuery = `SELECT 1 + 1`
            try {
                let result = await knex.raw(tableQuery);
                logger.log('database connection is successful')
                return resolve();
            } catch (error) {
                logger.log('Oppss database connection is not ready')
                reject(error);
            }
        }

        public async init() {
            return new Promise((resolve, reject) => {
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
                    useNullAsDefault: true
                };

                Knex = knex(config);

                setTimeout(() => {
                    this.checkConnectionStatus(resolve,reject, Knex, appConfig.dbConfig().database);
                },100)                
            })
```

## Data Operations

### Basic data operations
Basic operations like insert,delete,update and select are  SQL-like syntax and they are straigtforward for many users. I added toQuery() method for showing SQL syntax. Normally you should not add this method. All data operations return promises. Select returns empty array in case of no data, but first returns null. Here are some examples:

```typescript
        let selectQuery = await knex.withSchema('public')
            .table('books')
            .where('title','ilike','%' +matchString+ '%')
            .select(['id','title']);

            //Result 
            //query : select "id", "title" from "public"."books" where "title" ilike '%harry%'

        let selectFirstQuery = await knex.withSchema('public')
            .table('books')
            .where('id',2)
            .first();
            //Result 
            //query : select * from "public"."books" where "id" = 2 limit 1

        let deleteQuery = await knex.withSchema('public')
            .table('books')
            .where('title','ilike','%' +matchString+ '%')
            .delete()
            .returning('id');            
            //Result 
            //query : delete from "public"."books" where "title" ilike '%harry%' returning "id"

        let updateQuery = await knex.withSchema('public')
            .table('books')
            .where('year','<=', 2018)
            .delete()
            .returning('id')
            //Result 
            //query : update "public"."books" set "year" = 2020 where "year" <= 2018 returning "id"
```

You can use Promise results as JSON objects directly. Important point is first returns null if no results found, however select returns an empty array. Using select is a better approach for preventing future errors or you should check every result. Examples are:

```typescript
            let books: {
                id: number,
                title: string,
                year: number
            }[] = await Knex.withSchema('public')
                .table('books')
                .where('title', 'ilike', '%' + matchString + '%')
                .select(['id', 'title', 'year']);

            let aBook:{
                id: number,
                title: string,
                year: number
            } = await Knex.withSchema('public')
            .table('books')
            .where('title', 'ilike', '%' + matchString + '%')
            .first(['id', 'title', 'year']);
```

You can use JSON objects for update and insert directly.

```typescript
            let aBook:{
                id: number,
                title: string,
                year: number
            } = {
                id:2,
                title:"No Mans Land",
                year:2023
            };
            
            await knex.withSchema('public')
            .table('books')            
            .insert(aBook);

            aBook.year = 2024;

            await knex.withSchema('public')
            .table('books')            
            .where('id',aBook.id)
            .update(aBook);


```

## Aggregate functions

Aggregate functions are also similar to SQL syntax. You can directly use max,min,avg statistical operators like SQL style.

```typescript
        let groupByQuery = knex.withSchema('public')
            .table('books')
            .where('title','ilike','%aa')
            .select(['id','title'])
            .groupBy('id','title')

          //Result 
          //query : select "id", "title" from "public"."books" where "title" ilike '%aa' group by "id", "title"
        let maxQuery = Knex.withSchema('public')
            .table('books')
            .where('title','ilike','%aa')
            .max('year')
            .groupBy('year')                       

          //Result 
          //query : select max("year"), "year" from "public"."books" where "title" ilike '%aa' group by "year"
```



### Raw cases 

All the basic data operations have xxxRaw like method. You can use this methods for injecting SQL code directly into query. Also you can use .raw() method which accepts a SQL query in string form directly. Parameter binding is done with '?' wildcard, you should pass an array of parameter bindings as second argument for 'raw' based methods. I will not suggest an extensive usage of raw SQL, because you will have lost database independency in your application.

```typescript
          let selectQuery = Knex.withSchema('public')
            .table('books')            
            .select('id')
            .whereRaw('title ilike %asd%')
            .groupByRaw('id')

          //Result 
          //query : select "id" from "public"."books" where title ilike %asd% group by id

          let rawQuery = Knex.raw(`select "id", ? from "public"."books" where "title" ilike '%aa' group by "id", "title"`,['title'])

          //Result 
          //query : select "id", "title" from "public"."books" where "title" ilike '%aa' group by "id", "title"
```

Some basic features of Postgresql requires raw queries. You can use switch cases for different type of databases. Some non standart functions may reduce your development time, so yes, raw queries are needed, but they will require many switch cases.Also you can have interfaces implemented for different database types and instantiate correct interface with a factory method. This will reduce runtime processing cost.

```typescript
            let qb = this._knex.withSchema('public')
                .table('books');


            let rawSearchQuery = '';
            switch (appConfig.dbType()) {
                case Config.DBType.PostgreSQL: {
                    rawSearchQuery = ` title ilike '%UPPER(UNACCENT(?))%' `
                }
                    break;
                case Config.DBType.Oracle: {
                    /**
                     * Oracle spesific Code
                     */
                }
                    break;
                case Config.DBType.MySQL: {
                    /**
                     * MySQL spesific Code
                     */
                }
                    break;
                default:
                    break;
            }
            qb = qb.whereRaw(rawSearchQuery,'turkish');
            qb = qb.select('id');

            let result = qb.toQuery();

            logger.log("update query : " + result);
```

There is a mistake in the code above. You cannot use a string value for binding inside a function in PostgreSQL, you should use template matching. Query above will result

```SQL
update query : select "id" from "public"."books" where  title ilike '%UPPER(UNACCENT('turkish'))%'
```

```typescript
        //Correct usage for ' problem
            let qb = this._knex.withSchema('public')
                .table('books');

            let searchValue = "Turkish Char"
            let rawSearchQuery = '';
            switch (appConfig.dbType()) {
                case Config.DBType.PostgreSQL: {
                    rawSearchQuery = ` title ilike '%UPPER(UNACCENT(${searchValue}))%'`
                }
        //Rest of code        
        ....
        
        //Now, no binding        
        qb = qb.whereRaw(rawSearchQuery);
        
        ....
```
If you use a template matching approach, result query will be like this and will run perfectly.

```SQL
update query : select "id" from "public"."books" where  title ilike '%UPPER(UNACCENT(Turkish Char))%'
```

### Complex data queries

You can play with power of typescript and generate many different queries. Let me give you some examples.  With help of generics in typescript you can create a CRUD base for each of your entity easily. That will help our implementations. You can even create a custom Entity Framework or LINQ alike for typescript. 

```typescript
    interface Book{
        id:number;
        title:string;
        year:number;
        author:string;
    }

    class EntityRepo<T>{
        private _knex:knex;
        private _tableName:string;
        constructor(knex:Knex,tableName:string){
            this._tableName = tableName;
            this._knex = knex;
        }

        public async getEntity(id:number): Promise<T>{
            return this._knex.withSchema('public')
            .from(this._tableName)
            .where('id',id)
            .first();
        }

        public async listEntities<C extends Object>(listCriteria:C): Promise<T[]>{
            let qb = this._knex.withSchema('public')
            .from(this._tableName)
            
            Object.keys(listCriteria).forEach(item => {
                qb = qb.where(item, listCriteria[item])
            })
            return  qb.select();            
        }        
    }

        let bookRepo = new EntityRepo<Book>(this._knex, 'books');

        let aBook:Book =  await bookRepo.getEntity(2);            

        let someBooks:Book[] = await  bookRepo.listEntities({
                title:'JK Rowling'
            })
```

I will add more advanced queries and techniques in the upcoming articles. You can find cool design tips and tricks in there.

### Batch operations

KnexJS has some limitations about parameter bindings and object insertins. You can not insert 100K objects directly. About huge insertions you have an option from Knex but update or other issues, you should implement your own pagination algorithm. Optimal size depends on your system or target audience. I suggest dividing operations into from 500 - to 5000 units. It also depend on your data size.

```typescript

            let books:Book[] = [];

            //Load books array with 50000 book objects

            //First parameter is tablename
            //Second is your object array
            //Third is chunksize
            await this._knex.batchInsert('books',books,500);
```

## Further Reading

I will continue writing about KnexJS with schema operations, migrations, advanced techniques. Wait for the next parts.



