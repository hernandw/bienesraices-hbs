import { check, validationResult } from "express-validator";
import { models } from "../models/propiedadesQueries.js";
import { generateId } from "../helpers/generateId.js";
import { generarArray } from "../helpers/generarArray.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const admin = async (req, res) => {
  const id = req.user;
  const limit = req.query.limit || 4;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const startIndex = offset + 1;
  const endIndex = parseInt(offset) + parseInt(limit);
  const propiedades = await models.findAllPropertyByUser(id, limit, offset);
  const prop = await models.countPropertyByUser(id);
  const total = prop.length || 0;
  const paginas = generarArray(Math.ceil(total / limit));
  const totalPages = Math.ceil(total / limit);

  res.render("propiedades/misPropiedades", {
    title: "Mis Propiedades",
    propiedades,
    total,
    paginas,
    page,
    offset,
    limit,
    startIndex,
    endIndex,
    totalPages,
    barra: true,
  });
};

const createForm = async (req, res) => {
  res.render("propiedades/crear", {
    title: "Crear Propiedades",
    rooms: ["1", "2", "3", "4"],
    categories: await models.findAllCategory(),
    prices: await models.findAllPrice(),
    barra: true
  });
};

const saveForm = async (req, res) => {
  const {
    id: id = generateId(),
    title,
    description,
    rooms,
    category,
    price,
    parking,
    wc,
    street,
    lat,
    lng,
  } = req.body;

  const user_id = req.user;

  try {
    //validamos los campos
    await check("title")
      .notEmpty()
      .withMessage("El título es obligatorio")
      .run(req);

    await check("description")
      .notEmpty()
      .withMessage("La descripción es obligatoria")
      .isLength({ max: 200 })
      .run(req);
    await check("rooms")
      .isNumeric()
      .withMessage("El número de habitaciones es obligatorio")
      .run(req);
    await check("category")
      .isNumeric()
      .withMessage("Seleccione una categoría")
      .run(req);
    await check("price")
      .isNumeric()
      .withMessage("Selecciona un rango de precios")
      .run(req);
    await check("parking")
      .isNumeric()
      .withMessage("El número de estacionamiento es obligatorio")
      .run(req);
    await check("wc")
      .isNumeric()
      .withMessage("El número de baños es obligatorio")
      .run(req);

    await check("street")
      .notEmpty()
      .withMessage("Debes ubicar la calle en el mapa")
      .run(req);

    //validar errores

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("propiedades/crear", {
        errors: errors.array(),
        old: req.body,
        rooms: ["1", "2", "3", "4"],
        categories: await models.findAllCategory(),
        prices: await models.findAllPrice(),
        barra: true
      });
    }

    //guardamos la imagen en el servidor y en la BBDD como enlace
    if (!req.files) {
      return res.render("propiedades/crear", {
        errors: errors.array(),
        old: req.body,
        rooms: ["1", "2", "3", "4"],
        categories: await models.findAllCategory(),
        prices: await models.findAllPrice(),
        errors: [{ msg: "Subir una imagen es obligatorio" }],
        barra: true
      });
    }
    const { image } = req.files;

    const imageName = uuidv4().slice(0, 8);
    const imageUrl = `/uploads/${imageName}.png`;

    image.mv(`./public/uploads/${imageName}.png`);

    const propiedad = {
      id,
      title,
      description,
      rooms,
      category_id: category,
      precio_id: price,
      parking,
      wc,
      street,
      lat,
      lng,
      user_id,
      image: imageUrl,
    };

    const result = await models.createProperty(propiedad);
    await res.status(201).redirect("/propiedades");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editForm = async (req, res) => {
  try {
    const { id } = req.params;
    const idUser = req.user;

    //validamos que exista la propiedad
    const prop = await models.findPropertyById(id);

    if (!prop) {
      return res.redirect("/propiedades");
    }

    if (prop.user_id !== idUser) {
      return res.redirect("/propiedades");
    }

    res.render("propiedades/editar", {
      title: "Editar Propiedades",
      rooms: ["1", "2", "3", "4"],
      categories: await models.findAllCategory(),
      prices: await models.findAllPrice(),
      old: prop,
      barra: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editProperty = async (req, res) => {
  const {
    id,
    title,
    description,
    rooms,
    category,
    price,
    parking,
    wc,
    street,
    lat,
    lng,
  } = req.body;

  const user_id = req.user;

  try {
    const propiedades = {
      title,
      description,
      rooms,
      category_id: category,
      precio_id: price,
      parking,
      wc,
      street,
      lat,
      lng,
      user_id,
      id,
    };

    await models.editProperty(propiedades);
    res.status(200).redirect("/propiedades");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;

  const prop = await models.findPropertyById(id);

  //Eliminar la imagen
  fs.unlinkSync(`./public/${prop.image}`);

  try {
    await models.deleteProperty(id);
    res.redirect("/propiedades");
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const getPropertiesById = async (req, res) => {
  const { id } = req.params;

  const prop = await models.findPropertyById(id);

  res.render("propiedades/detail", {
    title: "Detalle",
    propiedad: prop,
    barra: true
  });
};

export const propiedadesController = {
  admin,
  createForm,
  saveForm,
  editForm,
  editProperty,
  deleteProperty,
  getPropertiesById,
};
