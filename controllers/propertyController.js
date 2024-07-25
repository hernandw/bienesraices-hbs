import { check, validationResult } from "express-validator";
import { models } from "../models/propertyQueries.js";
import { generateId } from "../helpers/generateId.js";
import { generarArray } from "../helpers/generarArray.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import {  isSeller } from "../helpers/isSeller.js";

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


  res.render("property/index", {
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
  res.render("property/create", {
    title: "Crear Propiedades",
    rooms: ["1", "2", "3", "4"],
    categories: await models.findAllCategory(),
    prices: await models.findAllPrice(),
    barra: true,
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
      return res.render("property/create", {
        errors: errors.array(),
        old: req.body,
        rooms: ["1", "2", "3", "4"],
        categories: await models.findAllCategory(),
        prices: await models.findAllPrice(),
        barra: true,
      });
    }

    //guardamos la imagen en el servidor y en la BBDD como enlace
    if (!req.files) {
      return res.render("property/create", {
        errors: errors.array(),
        old: req.body,
        rooms: ["1", "2", "3", "4"],
        categories: await models.findAllCategory(),
        prices: await models.findAllPrice(),
        errors: [{ msg: "Subir una imagen es obligatorio" }],
        barra: true,
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

    await models.createProperty(propiedad);
    await res.status(201).redirect("/property/index");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editForm = async (req, res) => {
  const { id } = req.params;
  const idUser = req.user;
  //validamos que exista la propiedad
  const prop = await models.findPropertyById(id);

  if (!prop) {
    return res.redirect("/property/index");
  }
  if (prop.user_id !== idUser) {
    return res.redirect("/property/index");
  }

  try {
    res.render(`property/edit`, {
      title: "Editar Propiedades",
      rooms: ["1", "2", "3", "4"],
      categories: await models.findAllCategory(),
      prices: await models.findAllPrice(),
      old: prop,
      barra: true,
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
    res.status(200).redirect("/property/index");
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
    res.redirect("/property/index");
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const getPropertiesById = async (req, res) => {
  const { id } = req.params;

  const prop = await models.findPropertyById(id);

  if (!prop) {
    return res.redirect("/notFound");
  }

  const vendedor = isSeller(req.user?.id, prop.user_id);

  res.render("property/detail", {
    title: "Detalle",
    propiedad: prop,
    barra: true,
    user: req.user,
    vendedor,
  });
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await models.getAllProperties();
    if (!properties) {
      return res.redirect("/notFound");
    }
    res.status(200).json(properties);
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const allPropertyByCategoryId = async (req, res) => {
  try {
    const { id } = req.params;
    const properties = await models.allPropertyByCategoryId(id);

    res.status(200).render("property/category", {
      title: "CATEGORIAS",
      properties,
      category: await models.findAllCategory(),
    });
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const allPropertyByFilter = async (req, res) => {
  const { id } = req.params;
  const properties = await models.allPropertyByFilter(id);
  if (!properties) {
    return res.redirect("/notFound");
  }
  res.status(200).json(properties);
};

const sentMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  await check("message")
    .isLength({ min: 10 })
    .withMessage("El mensaje debe tener al menos 10 caracteres")
    .run(req);

  const prop = await models.readMessage(id);
  const vendedor = isSeller(req.user?.id, prop.user_id);
 

  //validar errores

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("property/detail", {
      propiedad: prop,
      user: req.user,
      vendedor,
      errors: errors.array(),
    });
  }

  if (!prop) {
    return res.redirect(404, "/notFound");
  }

  const objectMessage = {
    property_id: id,
    user_id: req.user.id,
    message,
  };
  await models.sentMessage(objectMessage);

  try {
    return res.render("property/detail", {
      propiedad: prop,
      user: req.user.id,
      vendedor,
      message: "El mensaje se envio correctamente",
    });
    
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const readMessage = async(req, res) => {
  const { id } = req.params;

 const messages = await models.readMessage(id);
 
 
 
 
 res.render("property/messages", { messages })
}

export const propiedadesController = {
  admin,
  createForm,
  saveForm,
  editForm,
  editProperty,
  deleteProperty,
  getPropertiesById,
  getAllProperties,
  allPropertyByCategoryId,
  allPropertyByFilter,
  sentMessage,
  readMessage
};
