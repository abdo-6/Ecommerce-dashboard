import mongoose from "mongoose";

//  établir une connexion à MongoDB
export const connectMongoDB = async () => {
  const uri = process.env.MONGO_DB_URI!;

  

  try {
    await mongoose.connect(uri);
    console.log("Connexion à MongoDB établie avec succès");
    //  définir une promesse globale pour Mongoose
    mongoose.Promise = global.Promise;
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB ", error);
  }
};
