# Old Phone Deals
## Prequisites
To run the website the following software will be required
* [NodeJS](https://nodejs.org/en/download)
* [MongoDB](https://www.mongodb.com/try/download/community)

The website requires a `.env` file which can be downloaded from the canvas submission. The file should be in the same directory as `server.js`.

Optional software
* [MongoDB Compass](https://www.mongodb.com/products/compass)

## Database
### Pre-processing
The datasets require pre-proccessing before populating the database. This can be performed by running the following commands in a terminal:

1. `cd dataset`
2. `node processPhoneData.js`
3. `node processUserData.js`

### Populating the database
1. Using MongoDB Compass, connect to the URL `mongodb+srv://lalemany:xZ8YtOEII8Hs0YLI@l05g05.un2muoq.mongodb.net/`
2. Create a database called `oldPhoneDeals`
3. Create a collection inside `oldPhoneDeals` called `phonelisting`
4. Create a collection inside `oldPhoneDeals` called `userlist`
5. Import the `phonelisting_processed.json` and `userlist_processed.json` into the respective collection

## Running the website
Once the database has been populated, you can run the website by first running `npm install` and then `node server.js` in the terminal

