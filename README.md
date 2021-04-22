# Products-Service API

The central API is served from three different services. This includes the information for the Product Service API. 

The Product Service API is a dedicated server to deliver product information, pictures, style options, and other metadata attributed with a specific product id from a Postres backend. 

## ETL - Extract, Transform, Load

The ETL folder contains the contents of a node.js based transform utility script, which pipes a CSV file as a readable stream, applies a customized transformation, and generates a writable stream to a CSV file. Node's stream transform class is extended to create targeted data cleaning that is customized based on the contents of an input CSV. Each customized CVS transform class is imported to the transform utility and ran to generate a clean CSV data file. 

To run an ETL on a specific CSV, extend the LineTransform class and configure the _transform function to target each column of the CSV. Import the class into the transformUtility.js, then provide the CSV file path, a new file name for the output CSV, and the imported class transform into the provided dirtyToCleanCSV function.

## db - Postgres Database

Root contains the schema initilization file for a Postgres database. The sql init contains the schemas for the dataset and configuration the indexes to speed up query times.

In the db folder, the connection example file must be configured to create a connection to a postgres db. Once connected, the endpoint of the products service API can create 2 advanced database queries. These queries utilize Postgres' JSON formatting and aggregation to return a correctly formatted data for the request, avoiding making slower, nested queries with javascript aggregation. 

## NGINX - Load Balancer

This service utilizes a load balancer in a least connections configuration to increase throughput. 


## Load Testing

This service was launched with 1 database, 3 central API's, and 3 Product Service API's on each of their own AWS EC2 instances.

In load testing with loader.io, using load balancers in front of the service API's and the central API's, this service reached a throughput of 1850 RPS with less than 1% error rate. 

![Screen Shot 2021-04-21 at 7 31 33 PM](https://user-images.githubusercontent.com/14881563/115647159-30c84900-a2d8-11eb-8591-0c91415a1402.png)
