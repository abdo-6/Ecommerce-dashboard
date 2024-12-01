import { NextFunction, Request, Response } from "express";

//  middleware pour gérer les routes non trouvées
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route introuvable - ${req.originalUrl}`);
  res.status(404);
  //  passer l'erreur au middleware suivant pour qu'elle soit gérée
  next(error);
};

//  middleware pour gérer les erreurs générales
const errorHandler = (
    err: Error,                 //  l'objet erreur capturé
    req: Request,               //  l'objet de la requête
    res: Response,              //  l'objet de la réponse
    next: NextFunction          //  fonction suivante (non utilisée ici mais nécessaire pour respecter la signature)
  ) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    //  retourner une réponse JSON contenant les détails de l'erreur
    message: err.message,
    //  affiche la pile d'erreurs uniquement en mode dev
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };