## Assessment

### Approach 
1. This app uses no dummy data.
2. On the first visit hacker news api is called and all the data is stored in IndexedDB.
3. Subsequent mounts will fetch data from browser itself, no API calls will be made.
4. State of upvotes and hide functionality is synchronized with IndexedDB itself.
5. For making paginated pages bookmarkable, Routing has been implemented
6. The data per page is by default set to 10
7. Graph uses real time data and updates. (Sorry for the high amount of votes, API gets that)

### Tech Stack
1. React
2. Express
3. CSS
3. Webpack
4. Babel

### Install Dependencies

yarn install or npm install

### Options
#### Start React Server
```
yarn start or npm start
```
#### Start Express/Webpack server
```
yarn run dev or npm run dev
```
