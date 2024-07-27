import express from "express";
import { propiedadesController } from "../controllers/propertyController.js";
import { protectedRoutes } from "../middlewares/protectedRoutes.js";
import identifyUser from "../middlewares/identifyUser.js"; 

const router = express.Router();

router.get("/index", protectedRoutes, propiedadesController.admin);

router.get("/api", propiedadesController.getAllProperties);

router.get("/create", identifyUser, protectedRoutes, propiedadesController.createForm);

router.post("/create", identifyUser, protectedRoutes, propiedadesController.saveForm);

router.get("/edit/:id",identifyUser, protectedRoutes, propiedadesController.editForm);

router.put("/edit/:id",identifyUser,  protectedRoutes, propiedadesController.editProperty);

router.post(
  "/delete/:id",
  protectedRoutes,
  identifyUser,
  propiedadesController.deleteProperty
);

router.get('/published/:id',identifyUser, protectedRoutes, propiedadesController.published)

router.get('/messages/:id', identifyUser, protectedRoutes, propiedadesController.readMessage)

//Propiedades Públicas

router.get("/:id", identifyUser, propiedadesController.getPropertiesById);

router.get("/category/:id", identifyUser, propiedadesController.allPropertyByCategoryId);

router.post("/:id", identifyUser, propiedadesController.sentMessage);

export default router;
