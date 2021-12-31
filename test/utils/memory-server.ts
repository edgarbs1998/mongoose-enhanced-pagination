import { connect, disconnect } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

export async function openMongodConnection() {
  // This will create an new instance of "MongoMemoryServer" and automatically start it
  mongod = await MongoMemoryServer.create({ binary: { version: "4.0.27" } });

  connect(mongod.getUri());
}

export async function closeMongodConnection() {
  await disconnect();
  await mongod?.stop();
}
