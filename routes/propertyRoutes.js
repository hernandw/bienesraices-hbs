import express from "express";
import { propiedadesController } from "../controllers/propertyController.js";
import { protectedRoutes } from "../middlewares/protectedRoutes.js";
const router = express.Router();

router.get("/index", protectedRoutes, propiedadesController.admin);

router.get("/api",  propiedadesController.getAllProperties);

router.get("/create", protectedRoutes, propiedadesController.createForm);

router.post("/create", protectedRoutes, propiedadesController.saveForm);

router.get("/edit/:id", protectedRoutes, propiedadesController.editForm);

router.put("/edit/:id", protectedRoutes, propiedadesController.editProperty);

router.post(
  "/delete/:id",
  protectedRoutes,
  propiedadesController.deleteProperty
);

//Propiedades Públicas

router.get("/:id", propiedadesController.getPropertiesById);

export default router;
