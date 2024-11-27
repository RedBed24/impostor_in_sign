# About

Package to connect to a database and execute queries.

## Environment variables

| Variable                   | Description                 |
| :------------------------- | :-------------------------- |
| MONGO_DB_URL               | URL that connects to the db |
| MONGO_INITDB_ROOT_USERNAME | Root username of db         |
| MONGO_INITDB_ROOT_PASSWORD | Root password of db         |

## MongoDBConnector

Provides a Singleton class, `db_connector.MongoDBConnector`.
You can get the instance of the class by calling `db_connector.MongoDBConnector.get_instance()`.

Connection is established when the class is instantiated.

Connection can be closed by calling `db_connector.MongoDBConnector.close_connection()`.

## Database

The db is "impostor_sign".

The collections are:

### raw_images

| Field       | Type     | Description    |
| :---------- | :------- | :------------- |
| _id         | ObjectId | Image md5      |
| image.bytes | Binary   | Raw JPEG Image |
| label       | Int      | ASCII of [A-Z] |
