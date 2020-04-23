---
id: '1'
date: '2020-04-16T04:13:56+00:00'
title: 'NodeJS clusters and utilizing workers with inter-process messaging'
template: post
thumbnail: '../thumbnails/node.png'
slug: nodejs-clusters-and-messaging
readtime: '4 min'
categories:  
  - NodeJS
tags:
  - Algorithms
  - NodeJs
  - Typescript
  - Cluster
---

If you are working with NodeJS, you probably know it is a single-threaded environment with a great event loop. For utilizing all processing power you have in multi-core environments, you can scale your application with [cluster](https://nodejs.org/api/cluster.html) module. With [cluster.fork()](https://nodejs.org/api/cluster.html#cluster_cluster_fork_env) method, a process with same environment variables is forked from master process. You can also change environment variables with "env" parameter.

NodeJS also provides a way of interprocess communication for both directions, from master-to- child and child-to-master.IPC is fast and reliable enough over alternative methods like socket,redis etc.., so you can use it for performance tuning or some cool tricks

In this article, i will show you an example project where you can idle some workers for heavy processing operations and use rest of the workers for your HTTP API handlers. Master process will not handle requests but it will manage tasks between children process list. 

## Basic forking setup for init 

Lets start with a simple application design.

```typescript
import * as cluster from 'cluster';
import { Http } from './app.http';
import { IPCManager } from './app.ipcmessage';
import { appConfig } from './app.config';
import { logger } from './app.log';

class App {
    constructor() {
        
    }
    public start() {

        try {
            //Master process area
            //No request handler here, just dispatch work to workers
            if (cluster.isMaster) {
                for (let i = 0; i < appConfig.getNumberOfWorkers(); i++) {
                    let worker = cluster.fork();
                    worker.on('message', IPCManager.processMessage);
                }
            }
            //Worker code here
            if (cluster.isWorker) {

                /**
                *  Some shared  code for workers
                */
                process.on('message', IPCManager.processMessage);


                //This group of workers handle requests
                if (~appConfig.getHttpHandlerWorkers().indexOf(cluster.worker.id)) {

                    /**
                     * Special code part for request handler workers
                     */
                    console.log('request handler is starting ' + cluster.worker.id)
                    let httphandler = new Http.HttpHandler();
                    httphandler.listen();
                }
                if (~appConfig.getIdleWorkerList().indexOf(cluster.worker.id)) {
                    /**
                     * Special code part for idle workers
                     */
                    console.log('idle child worker is starting ' + cluster.worker.id)
                }
            }
        } catch (error) {
            logger.log("something went wrong", error);
        }
    }
}

const app = new App();
app.start(); 

```

As you see, there are 2 ways of message events here. [cluster.fork()](https://nodejs.org/api/cluster.html#cluster_cluster_fork_env) returns a worker object reference. 

In these part, you are forking a child and start listening messages from master process. I will mention later but i created a common IPC manager class and registered it for messages. Same class will exist on all process memories.

```typescript
 let worker = cluster.fork();
  worker.on('message', IPCManager.processMessage);
```

In the worker code block,  [process.on()](https://nodejs.org/api/process.html#process_event_message) part is for listening from master process message events. Again
all messages are directed to the same function. It will not be complicated, as you will see, one can easily differentiate code execution on the same function.
```typescript
//Worker code here
 if (cluster.isWorker) {
 /**
 *  Some shared  code for workers
 */
 process.on('message', IPCManager.processMessage);
 //...rest of code
```

## Inter Process Message Interfaces

I will define some messaging interfaces to generalize workload and other request types. There will be 4 types of messages. These definitions are generic enough to wide range of applications.
To explain in simple, all messages has header and payload parts. Header is for defining sender and receiver workers, message type, request type(this is demonstrational),
and you may notice callbackFn, a promise function signature. I will explain it in next part. Every request has a correlationId, a guid, for tracing between process's. Correlation will help us for finding which request is completed and message and clearing out active case count for target worker. So we can optimize by looking active cases on per worker. 

```typescript
export enum Request {
        PROCESS_REPORT_A = 1,
        PROCESS_REPORT_B = 2
    }

    export enum MessageType {
        REQUEST_TO_MASTER = 1,
        REQUEST_FROM_MASTER = 2,
        REPLY_TO_MASTER = 3,
        REPLY_FROM_MASTER = 4
    }

    export interface IPCMessageHeader {
        messageType: MessageType;
        correlationId: string;
        receiver?: number;
        sender: number;
        requestType: Request;
        callbackFn: <T>(value?: T | PromiseLike<T>) => void;
    }

    export interface IPCMessagePayload {
        requestParams?: any;
        result?: any
    }


    export interface IPCMessage {
        header: IPCMessageHeader;
        payload: IPCMessagePayload
```

## Managing Inter Process communication 

This part will exist on master,idle workers and http handler workers. So will use many cluster.isWorker() and cluster.isMaster(). 

Algorithm will be like these
-   A request for a heavy workload received from worker x
-   A message is send with correct parameters from worker x to master
-   Master finds an optimal idle worker and sends message to worker y
-   Worker y completes work and sends a message to master
-   Master process, removes task from queue and send it to original worker
-   original worker completes HTTP request

This method is shared for all type of messages. I will handle different messages with our MessageType property. A process queue and worker status is required for distributing computation over workers. However, children workers will not use _workerStatusList property, it is for master. But all of them need a processQueue.
```typescript
    export class IPCMessageHandler {

        private _processQueue: IPCMessage[];
        private _workerStatusList: {
            workerId: number,
            processCount: number
        }[];
        /**
         *
         */
        constructor() {
            this._processQueue = [];
            this._workerStatusList = appConfig.getIdleWorkerList().map(x => {
                return {
                    workerId: x,
                    processCount: 0
                }
            })
        }
```

 ```typescript
  public processMessage = async (rawMessage: string) => {
           try {
               //Parse message
            let msg: IPCMessage = null;
            try {
                if (rawMessage == null) {
                    return;
                }
                msg = JSON.parse(rawMessage);
            } catch (error) {
                console.error(error);
                return;
            }

            let handlePromise:Promise<void>;
            switch (msg.header.messageType) {
                case MessageType.REQUEST_TO_MASTER:
                    handlePromise = this.handleRequestToMaster(msg);
                    break;
                case MessageType.REQUEST_FROM_MASTER:
                    handlePromise = this.handleRequestFromMaster(msg);
                    break;
                case MessageType.REPLY_TO_MASTER:
                    handlePromise = this.handleReplyToMaster(msg);
                    break;
                case MessageType.REPLY_FROM_MASTER: {
                    handlePromise = this.handleReplyFromMaster(msg);
                    break;
                }
            }
            if(handlePromise){
                await handlePromise.catch(reject => {
                    logger.log('handle is rejected',reject);
                });
            }            

           } catch (error) {
               if(cluster.isMaster){
                logger.log('error at message handler master process',error )   
               }
               if(cluster.isWorker){
                logger.log('error at message handler ',"workerId : " + cluster.worker.id,error)   
               }                
           }            
        }
 ```

### Handling messages to master

In master process what we need to do is, 
-   Find the optimal worker, one which has less crowded queue  
-   (Optionally) You can provide a more powerful scheduling algorithm.
-   Convert message header to master-to-child
-   Set the receiver part
-   Put request into process queue for Master 
-   Send message to worker

```typescript
        private async handleRequestToMaster(msg: IPCMessage) {
            try {
                //Check for master process
                if (cluster.isMaster) {
                    //Find first worker with least job
                    let workerWithMinimumWork = appConfig.getIdleWorkerList()[0];
                    this._workerStatusList.forEach(x => {
                        x.processCount < this._workerStatusList.find(x => x.workerId == workerWithMinimumWork).processCount
                        workerWithMinimumWork = x.workerId;
                    });
                    //Change message type
                    msg.header.messageType = MessageType.REQUEST_FROM_MASTER;
                    //Set receiver
                    msg.header.receiver = workerWithMinimumWork;
                    //Set request into process queue for "Master Process"
                    this._processQueue.push(msg);
                    //Send the message
                    cluster.workers[msg.header.receiver].send(JSON.stringify(msg));
                }
                else {
                    logger.log('Wrong Message type')
                }
            } catch (error) {
                logger.log('Something went wrong', error);
            }
        }
```
### Handling messages from master to idle worker

Idle workers just live for high-cpu operations. They doesnt have an http handling mechanism and listens only master. 
In idle worker process what we need to do is, 
-   Check for message type  
-   Do the work
-   Put results into message payload
-   Send message back to master

```typescript
        /**
         *  This part will work on idle worker          
         */
        private async handleRequestFromMaster(msg: IPCMessage) {
            try {
                //Check for worker id
                if (cluster.isWorker && msg.header.receiver == cluster.worker.id) {
                    let handledWork = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            console.log('doing a heavy work for worker: ' + msg.header.sender + ' on worker: ' + cluster.worker.id)
                            resolve();
                        }, 5000);
                    })
                    await handledWork;
                    msg.header.messageType = MessageType.REPLY_TO_MASTER;
                    msg.payload.result = "resultdata";
                    process.send(JSON.stringify(msg));
                }
                else {
                    logger.log('Wrong Message type')
                }
            } catch (error) {
                logger.log('Something went wrong', error);
            }
        }
```

### Handling response-messages from idle worker to master

For replies from idle worker to master what we need to do is, 
1. Remove task from master process's queue  
2. Convert header for delivering it to original worker
3. Send message back to owner worker

```typescript
        /**
         * This part for master process
         */
        private async handleReplyToMaster(msg: IPCMessage) {
            try {
                //Check for master process
                if (cluster.isMaster) {
                    let processIndex = this._processQueue.findIndex(p => p.header.correlationId == msg.header.correlationId);
                    //Remove request from queue
                    this._processQueue.splice(processIndex, 1);
                    //Change message type
                    msg.header.messageType = MessageType.REPLY_FROM_MASTER;
                    //Send it to request origin
                    cluster.workers[msg.header.sender].send(JSON.stringify(msg));
                }
                else {
                    logger.log('Wrong Message type')
                }
            } catch (error) {
                logger.log('Something went wrong', error);
            }
        }
```

### Handling response-messages from master to original worker

For replies what we need to do is, 
1. Remove task from original worker process's queue  
2. Call your callback function

```typescript
             /**
         * This part for original worker process
         */
        private async handleReplyFromMaster(msg: IPCMessage) {
            try {
                //Check sender
                if (cluster.isWorker && msg.header.sender == cluster.worker.id) {
                    let processIndex = this._processQueue.findIndex(p => p.header.correlationId == msg.header.correlationId);
                    //Remove job from queue
                    let originalProcess = this._processQueue[processIndex];
                    this._processQueue.splice(processIndex, 1);
                    //Finish request promise for worker 
                    originalProcess.header.callbackFn();
                }
                else {
                    logger.log('Wrong Message type')
                }
            } catch (error) {
                logger.log('Something went wrong', error);
            }
        }
```

## Request handling 

For demonstration, I put 2 types of endpoints, one is for a 50ms reply time. Other is creates a message for redirecting request to idle workers. But also, a 10 second timer is added for limiting response or some lockings. 

**As I mentioned before, our callback function is resolve of our promise for asynchronously waiting on the request.**

```typescript
  public listen() {
            this._app.get('/light-request', this.handleLightRequest);
            this._app.get('/heavy-request', this.handleHeavyRequest);
            this._app.listen(3030);
        }

  private async handleLightRequest(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            console.log('A light workload request is handled by worker: ' + cluster.worker.id);
            //Takes 50 ms
            let lightPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 50);
            })
            await lightPromise;
            res.json({ success: true });
        }


        private async handleHeavyRequest(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            console.log('Heavy workload request received by ' + cluster.worker.id);
            let heavyPromise = new Promise((resolve, reject) => {
                let messageForIdleWorker: IPCommunication.IPCMessage = {
                    header: {
                        correlationId: uuid.v4(),
                        messageType: IPCommunication.MessageType.REQUEST_TO_MASTER,
                        requestType: IPCommunication.Request.PROCESS_REPORT_A,
                        sender: cluster.worker.id,
                        callbackFn: resolve,
                        //No need to set receiver, it is master process job
                        receiver: null,
                    },
                    payload: {
                        requestParams: JSON.stringify({ header: 2, datasize: 20, pageCount: 20 }),
                        result: null
                    }
                }
                IPCManager.sendMessageToIdleWorkers(messageForIdleWorker);
                setTimeout(() => {
                    reject()
                }, 10000);
            })
            await heavyPromise;
            console.log('Heavy workload request is completed for ' + cluster.worker.id);
            res.json({ success: true });
        }
    }
```

You will notice a function call *IPCManager.sendMessageToIdleWorkers(messageForIdleWorker);* . This function code is obviously sends message to master, do not confuse with name. Everything is managed by master!

```typescript
  /**
        * This method actually sends message to master process
        */

        public sendMessageToIdleWorkers(messageForIdleWorker: IPCMessage) {

            //Put job in "worker's" process queue
            this._processQueue.push(messageForIdleWorker);

            //Send message to master
            process.send(JSON.stringify(messageForIdleWorker));
        }
```

## Final Results

I added a test client, which calls 8 times for light version API and once highly loaded API endpoint for every second. Basically, every light-request is 50 ms
and heavy ones are 5 seconds, which is bigger than the interval timeout. 

```typescript
class AppClient {
    constructor() {
        console.log('starting client process')
    }
    public start() {
        console.log('client process connecting API endpoints')
        for (let i = 0; i < 8; i++) {
            http.get('http://localhost:3030/light-request', (resp) => {                
                resp.on('end', () => {
                    console.log('a light request is done')
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }

        http.get('http://localhost:3030/heavy-request', (resp) => {           
            resp.on('end', () => {
                console.log('a heavy request is done')
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}


const app = new AppClient();
setInterval(app.start, 1000)
```

And here is some result output. Your http handling utilities can easily cope with light request and send  high cpu operations to idle ones while doing that.


![](../images/1_result.jpg)

## Further Improvements

I implemented an optimal scheduling algorithm based on the count of active requests. There are some alternative scheduling techniques.Like, optimizing based on type of request, or work like a stack where all active cases are stacked on master and master process send next case to the earliest idle worker.  

Thanks for reading.