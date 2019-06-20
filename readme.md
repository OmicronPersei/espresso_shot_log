# Espresso shot logging app
This is a simple app that records espresso shots, including their parameters that all factor into that perfect balance of a full bodied and repeatable shot.  The app allows the tracking of:
* Roaster and bean type
* Grinter setting
* Dose amount
* Brew amount
* Brew time
* Personal perception of bitterness/sourness (indicated with + and - values)
* Any issues that occured during the extraction process

## System Requirements
* [Node.js](https://nodejs.org/) (at least version 16.8.6)

## Building
* Only the React front end needs to be installed.  To do this, run:
    ```
    cd react_app
    npm install
    ```
    * Please be advised that this is both time consuming and can download a lot of data.

## Running
1. In a terminal, run:
    ```
    cd node_server
    node server.js
    ```
2. In a second terminal, run:
    ```
    cd react_app
    npm start
    ```
2. Access the app at [http://localhost:3000](http://localhost:3000).

## Note
Currently the server is only configured to accept traffic from `localhost`, so you can only access the app on the same machine as the server.