# Products-Service API

The product service API is a dedicated server to deliver product information, pictures, style options, and other metadata attributed with a specific product id from a Postres backend. 

## ETL - Extract, Transform, Load

The ETL folder contains the contents of a node.js based transform utility script, which pipes a CSV file as a readable stream, applies a customized transformation, and generates a writable stream to a CSV file. Node's stream transform class is extended to create targeted data cleaning that is customized based on the contents of an input CSV. Each customized CVS transform class is imported to the trasform utility and ran to generate a clean CSV data file. 
