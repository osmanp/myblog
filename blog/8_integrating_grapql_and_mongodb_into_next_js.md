---
id: '8'
date: '2020-05-30T04:13:56+00:00'
title: 'Integrating GraphQL and MongoDB into NextJs'
template: post
thumbnail: '../thumbnails/graphql.png'
slug: next_js_with_graphql
popularity: '9'
readtime: '5 min'
categories:  
  - GraphQL  
  - MongoDB
tags:
  - NextJs
  - Javascript
  - React
  - Graphql
---


For fast starting a react project [Next.JS](https://nextjs.org/) is a fairly good option. It provides static content generation or SSR, handles routing and many more advantages like automatic code splitting and serverless functions. Even this blog is developed on NextJs. Like other frameworks, it has many plugins for your web application. In this article, i will show how you can integrate your NextJs app with graphql. 

## Understanding architecture

You will need, a graphql server and client for using in your NextJs application. Luckily, apollo client and apollo server can be integrated into your application easily. 

NextJs uses file system based routing so you can put your api backend codes under your pages folder.  

![](../images/next_js_files.jpg)

Here, create graphql.js file and we will serve our apollo api from this file.

```javascript

import { ApolloServer } from 'apollo-server-micro';
import mongoose from 'mongoose';
import {schema} from '../../lib/apollo/schema';
import models from '../../models/models';

const localUri = 'mongodb://localhost:27017/app';
mongoose.connect(localUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true  ,  
});

const applyDB = async () => {  
  if (!mongoose.connection.readyState != 1) {
    await mongoose.connect(localUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true  
    });
    
  };
  return {db : models};
};

const apolloServer = new ApolloServer({ schema, context: applyDB });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });

```

I will use mongoose for resolving our graphql queries.

## GraphQL client

Now, lets put a lin folder on the root. I am using lib folder, for graphQL client, redux and some other frameworks. So created an apollo folder under lib.

![](../images/next_js_apollo_client.jpg)

Under your apollo folder, you can use just one file, or seperate your resolvers,schema and client code to make it more readable.

Here is your GraphQL client code.  

```javascript
import React from 'react';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from "apollo-link-error";
import {schema} from './schema';

let globalApolloClient = null;

//this HOC function will be used on your pages for providing apollo api access
export function withApollo(PageComponent, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient || initApolloClient(apolloState);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };


  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const { AppTree } = ctx;

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = (ctx.apolloClient = initApolloClient());

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await require('@apollo/react-ssr');
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
      };
    };
  }

  return WithApollo;
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
function initApolloClient(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState);
  }

  return globalApolloClient;
}

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}) {
  const ssrMode = typeof window === 'undefined';
  const cache = new InMemoryCache().restore(initialState);

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    ssrMode,
    link: ApolloLink.from([errorLink,createIsomorphLink()]),
    cache,    
  });
}
function createIsomorphLink() {
  if (typeof window === 'undefined') {
    const { SchemaLink } = require('apollo-link-schema');    
    return new SchemaLink({ schema });
  } else {
    const { HttpLink } = require('apollo-link-http');
    return new HttpLink({
      uri: 'http://localhost:3000/api/graphql',
      credentials: 'same-origin',            
    });
  }
}

```
Most of the code is taken from NextJS examples. I just added Error debugging feature. GraphQl works with links, with adding error link library, you can view errors on console. It will be much more easier with error outputs while debugging your code.

This are the error debugging parts. First creates and *errorLink*, then with *ApolloLink.From* inject it into client. I just added a console logger. You can improve this function according to your needs.

```javascript
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}) {
  const ssrMode = typeof window === 'undefined';
  const cache = new InMemoryCache().restore(initialState);

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    ssrMode,
    link: ApolloLink.from([errorLink,createIsomorphLink()]),
    cache,    
  });
```

## Schema

Apollo provides a greate tool for our schema, *makeExecutableSchema*. With this function, you can combine your typedefs and resolvers.

```javascript
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from './type-defs';
import { resolvers } from './resolvers';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

```

## Typedefs

For declaring your GraphQl data, we will use domain language, *gql*. It is a declarative and powerful language you can easily define greate data architectures.

```javascript
import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!,
    name: String,
    surname: String!,
    password:String,
    surveys:[ID]
  }

  type Question{
    id:ID!
    type: String,
    title: String
    body: String
  }

  input QuestionInput{
    id:ID!
    type: String,
    title: String
    body: String
  }
....
....
  type Survey{    
    id:ID,
    attributes:SurveyAttributes,
    title:SurveyTitle,
    body:SurveyBody,
    options:SurveyOptions
  }

  type Query {
    questions: [Question],
    surveys:[Survey]
  }

  type Mutation {
    saveUser(username:String,password:String):User,
    saveSurvey(options:SurveyOptionsInput,attributes:SurveyAttributesInput,title:SurveyTitleInput,body:SurveyBodyInput):Survey
  }
`;

```

I cut some of the code for easy view. You may notice, there is a *Question* type and *QuestionInput* input type. That is because, if you want to pass *Question* into a function, you also declare an input type. It is one of the boring things in GraphQL. 

## Resolving Queries


Resolvers are just glue code between your database and graphql operations, that is query and mutations. You can implement caching, timeout checks and many more missing features in here. If you want to change your database, also just update your code in resolvers.

```javascript
import _ from 'lodash';

const saveUser = async(_parent,{username,password},_context,_info) => {  
  
  var newUser = new _context.db.User({
    username:username,
    password:password
  });
  newUser.save();
  return {username,password};
};

export const resolvers = {
  Query: {
    questions: async (_parent, _args, _context, _info) => {
      var question = await _context.db.Question.findOne({ type: 'free-text' });
      return  [{type: question.type} ];
    },
  },
  Mutation:{
    saveUser:saveUser
  }
};

```

In GraphQL api code, we provided *applyDB* function, which passes a db property. This property will be our main database client for our queries. 


## Using GraphQL in your Pages

In your page, what you need is our *withApollo* HOC defined under lib/client. With these higher order function, now your pages can query your GraphQL api.

```javascript

import { useMutation } from '@apollo/react-hooks';
import { Container } from "@material-ui/core";
import gql from 'graphql-tag';
import { withApollo } from '../lib/apollo/client';
import Layout from '../components/Layout';
import SurveyBuilder from "../components/SurveyBuilder/SurveyBuilder";

const Save_Survey = gql`
  mutation SaveSurvey($options:SurveyOptionsInput,$attributes:SurveyAttributesInput,$title:SurveyTitleInput,$body:SurveyBodyInput){
    saveSurvey(options:$options,attributes:$attributes,body:$body,title:$title){id}
  }
`;

const  CreateSurveyPage = () => {
  const [saveSurvey,{data}] = useMutation(Save_Survey);
  const pageHandler = {
    onActionClick: async (action,survey) => {
      //console.log(survey);
      var result = await saveSurvey({variables: {options:{}, title:{},body:{questions:[]},attributes:{} }});
      console.log(result);
      console.log(data);
    }
  };
  return (
    <Layout>
        <Container style={{minHeight:'1200px'}}>
        <SurveyBuilder pageHandler={pageHandler}></SurveyBuilder>   
      </Container>        
    </Layout>
     
  );
};


export default withApollo(CreateSurveyPage);
```

## Conclusion 

By applying, this codes into your projects. You can easily setup a apollo client and server into your React application. 