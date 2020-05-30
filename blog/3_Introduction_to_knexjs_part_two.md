---
id: '3'
date: '2020-04-16T04:13:56+00:00'
title: 'Introduction to Knex.js Part II'
template: post
popularity: '3'
thumbnail: '../thumbnails/typescript.png'
slug: introduction-to-knexjs-part-II
readtime: '10 min'
categories:  
  - NodeJS
  - SQL
tags:  
  - NodeJs
  - Typescript
  - KnexJS
  - PostgreSQL
---

I wrote about KnexJS in an earlier [article](http://localhost:3000/introduction-to-knexjs-part-II). That was about connection and data operations, some advanced data queries and batch operations. In this post, i will explain schema operations, transactions and migrations in KnexJS. Lets start with basic schema operations

## Schema Operations

Creating a table is simple, first check if it exists with hasTable() method, then you can use createTable() with second parameter as table builder function. While decorating your table columns you should be careful about your database type and data types it accepts. *KnexJS may have some problems with JSON columns in earlier PostgreSQL versions, you may end with columns with  text datatype.*

```typescript
        if(!this._knex.schema.hasTable('bookOrders')){
                await this._knex.schema.createTable('bookOrders',(table)=>{
                    table.integer('id').primary(),
                    table.float('price').notNullable()
                    table.dateTime('orderDate').notNullable()
                    table.string('orderedBy',256).notNullable()
                    table.json('address').nullable()
                })
            }
            else {
                //Table already exist so drop it :)
                this._knex.schema.dropTableIfExists('bookOrders')
            }            
```

Alter table is also same way. This example drops a column and makes price column nullable.

```typescript
            if(this._knex.schema.hasTable('bookOrders')){
                await this._knex.schema.alterTable('bookOrders',(table)=>{
                    table.dropColumn('address')
                    table.float('price').nullable()                    
                })
            }

```

You can provide foreign keys as shown below. Here  book_id references 'id'  in table 'books' and it will cascade on both update and delete operations.

```typescript
            if(!this._knex.schema.hasTable('bookOrders')){
                await this._knex.schema.createTable('bookOrders',(table)=>{
                    table.integer('id').primary(),
                    table.float('price').notNullable()
                    table.dateTime('orderDate').notNullable()
                    table.string('orderedBy',256).notNullable()
                    table.json('address').nullable()
                    table.integer('book_id').references('id').inTable('books').onDelete('cascade').onUpdate('cascade')
                })
            }
```

It has support for index operations but i suggest raw sql queries for index building. You shoul design your index options with your dedicated database. 

## Migrations

KnexJS supports a migration system, that can work in both directions. It uses a table (given as a configuration parameter) and a directory. Suppose, we gave migrations as tablename and migrations as a folder. If you are working with typescript just remember, KnexJS will use JS files in your transpile directory. 

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
                    useNullAsDefault: true
                };

                this._knex = knex(config);

                await this._knex.migrate.latest();
```

Here is how the KnexJS migration algorithm works

- KnexJS opens a connection to database
- You call 'knex.migrate.latest()' then migration starts, you should wait for migration operation before accessing data
- Looks for migrations table and migrations_lock table (lock table is created  by Knex automatically)
- Compare for files in migrations folder and table entries
- Apply migration files if missing in the table
- Releases transaction after completing the migration

A sample migrations folder can be like these, some people use dates of releases, you can have a mixture dates and some milestones as aliases.

```bash
 - src
    -- migrations
        --- Version19.02.01.js
        --- Version19.02.04.js
        --- Version19.02.06.js
```

So what is inside a migration file is simple, you will provide 2 methods in your migration files. Actually, you can have any number of methods but you should provide 'up' and 'down' methods for knex, other than these you can use helpers etc..

A sample migration file shown below. In your 'up' function you can use any schema or query operations. You should provide undo options for 'down' function, however, if you think you will not migrate-down any time in your application just put it empty.

Some important notes is 
- You have to export these functions in your typescript code 
- *order is important*. I mean you can not use a reference for table below the code, first create it then gave a reference or use it in your query.
- All operations are in a single transaction, so even a minor mistake in one of migration files exists, all operations aboard. Nice :)
- As I said all migration is done with single transaction, if your transaction becomes too much, it can be consume so much time and postponse your application start.

```typescript
export async function up(trx: Knex.Transaction): Promise<any> {

    await trx.schema.withSchema('public').createTableIfNotExists('customers', table => {
        table.uuid('id').primary();
        table.string('name').nullable();
        table.integer('ssn').nullable();
        table.json('address').nullable();
    });
    await trx.schema.withSchema('public').createTableIfNotExists('orders', table => {
        table.uuid('id').primary();
        table.uuid('customerId').references('id').inTable('customers').onDelete('cascade').onUpdate('cascade');        
        table.integer('price').notNullable();
        table.datetime('date').notNullable();        
    });
}

export async function down(trx: Knex.Transaction): Promise<any> {
    await trx.schema.withSchema('public').dropTableIfExists('customers');
    await trx.schema.withSchema('public').dropTableIfExists('orders');
}
```


## Transactions

As a developer, one of the core topics about database access codes is transactions. Handling transactions are not so easy with KnexJS, you have to be careful about your design or you will end up with deadlocks. Concept of transaction with promises is a little more complex without them.

You can use trx function as transactionScope object in C#. Yes you can use an async function for transactional block. Promise chaining make your code unreadable.A simple transaction case
```typescript
            await this._knex.transaction(async trx => {
                let firstBooks = await trx.withSchema('public')
                    .table('books')
                    .select('id')
                    .limit(10)
                    .orderBy('year');

                for (var book of firstBooks) {
                    book.price += 10.0;
                    trx.withSchema('public')
                        .table('books')
                        .where('id', book.id)
                        .update(book);
                }
            })

```

You can share transaction object through functions as parameters. Making transaction object as optional parameter  also provides a way reusablity for nontransactional code needs. As you see, you can join into another transaction with transacting() method, however in some versions of KnexJS you should not pass a null or undefined transaction so check for trx first then merge into transaction.

```typescript
        public async anotherSelect(trx?:knex.Transaction){
            let groupedBooksQuery = this._knex.withSchema('public')
                .table('books')
                .where('title', 'ilike', '%aa')
                .select(['id', 'title'])
                .groupBy('id', 'title')                
            
            if(trx){
                groupedBooksQuery = groupedBooksQuery.transacting(trx);
            }

            return groupedBooksQuery;
        }

        public async transactionalCode() {
            await this._knex.transaction(async trx => {

                let firstBooks = await trx.withSchema('public')
                    .table('books')
                    .select('id')
                    .limit(10)
                    .orderBy('year');

                for (var book of firstBooks) {
                    book.price += 10.0;
                    trx.withSchema('public')
                        .table('books')
                        .where('id', book.id)
                        .update(book);
                }
                let groupOfBooks = await this.anotherSelect(trx);
            })           
        }
```

### Transaction provider and manual management

In C# you can have transaction scope which automatically completes your transaction at the end of your scope. Also when you need a complex busines flow, you can use your transactions manually commit or rollback. You can manage your transactions or reuse them  with transaction provider class. 

```typescript
         public async transactionProviderCode() {
            let trxProvider = await this._knex.transactionProvider();

            let myFirstTransaction = await trxProvider();

            await this.editBooks(myFirstTransaction);

            let secondTransaction = await trxProvider();
            await this.editBooks(secondTransaction);

            /**
             * do something meaningful
             */


            secondTransaction.commit();

            if(secondTransaction.isCompleted()){
                myFirstTransaction.commit();
            }            
        }
```

### Further Reading

These article provides second part of my introduction KnexJS series. With this basic knowledge you can start using  KnexJS. I will add some advanced techniques and recipes in the next article. Also provide some useful design techniques for your architecture.