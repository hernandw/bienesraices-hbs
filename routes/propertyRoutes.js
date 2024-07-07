import express from "express";
import { propiedadesController } from "../controllers/propertyController.js";
import { protectedRoutes } from "../middlewares/protectedRoutes.js";
const router = express.Router();

router.get("/", protectedRoutes, propiedadesController.admin);

router.get("/crear",protectedRoutes, propiedadesController.createForm);

router.post("/crear", protectedRoutes, propiedadesController.saveForm);

router.get("/edit/:id", protectedRoutes, propiedadesController.editForm);

router.put("/edit/:id",  protectedRoutes, propiedadesController.editProperty);

router.post("/delete/:id", protectedRoutes, propiedadesController.deleteProperty);

//Propiedades Públicas

router.get("/:id", propiedadesController.getPropertiesById);

export default router;