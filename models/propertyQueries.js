import { pool } from "../config/db.js";

const createProperty = async ({
  id,
  title,
  description,
  rooms,
  category_id,
  precio_id,
  parking,
  wc,
  street,
  lat,
  lng,
  user_id,
  image,
}) => {
  try {
    const sql = {
      text: "INSERT INTO propiedades (id, title, description, rooms, category_id, precio_id, parking, wc, street, lat, lng, user_id, image, published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true ) RETURNING *",
      values: [
        id,
        title,
        description,
        rooms,
        category_id,
        precio_id,
        parking,
        wc,
        street,
        lat,
        lng,
        user_id,
        image,
      ],
    };

    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows[0];
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const findAllCategory = async () => {
  try {
    const sql = {
      text: "SELECT * FROM category",
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const findAllPrice = async () => {
  const sql = {
    text: "SELECT * FROM price",
  };
  const response = await pool.query(sql);
  if (response.rowCount > 0) {
    return response.rows;
  } else {
    return false;
  }
};

const findAllPropertyByUser = async (id, limit, offset) => {
  try {
    const sql = {
      text: "SELECT p.id, p.title, price.name AS precio, p.published, p.image, c.name AS categoria FROM propiedades p JOIN price ON p.precio_id = price.id JOIN category c ON p.category_id = c.id WHERE user_id = $1 ORDER BY p.id LIMIT $2 OFFSET $3 ",
      values: [id, limit, offset],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const countPropertyByUser = async (id) => {
  try {
    const sql = {
      text: "SELECT * FROM propiedades WHERE user_id = $1",
      values: [id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const countMessagesByProperty = async (id) => {
  try {
    const sql = {
      text: "SELECT * FROM messages WHERE property_id = $1",
      values: [id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const findPropertyById = async (id) => {
  try {
    const sql = {
      text: "SELECT p.id, p.title, p.description, p.user_id, p.category_id, p.precio_id, price.name AS precio, p.published, p.image, p.wc, p.rooms, p.parking, p.street, p.lat, p.lng, c.name AS categoria FROM propiedades p JOIN price ON p.precio_id = price.id JOIN category c ON p.category_id = c.id WHERE p.id = $1",
      values: [id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows[0];
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const editProperty = async ({
  title,
  description,
  rooms,
  category_id,
  precio_id,
  parking,
  wc,
  street,
  lat,
  lng,
  user_id,
  id,
}) => {
  try {
    const sql = {
      text: "UPDATE propiedades SET title = $1, description = $2, rooms = $3, category_id = $4, precio_id = $5, parking = $6, wc = $7, street = $8, lat = $9, lng = $10, user_id = $11  WHERE id = $12  RETURNING *",
      values: [
        title,
        description,
        rooms,
        category_id,
        precio_id,
        parking,
        wc,
        street,
        lat,
        lng,
        user_id,
        id,
      ],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows[0];
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const deleteProperty = async (id) => {
  try {
    const sql = {
      text: "DELETE FROM propiedades WHERE id = $1",
      values: [id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return true;
    } else {
      return new Error("No se pudo eliminar la propiedad");
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const getAllProperties = async () => {
  try {
    const sql = {
      text: "SELECT p.id, p.title, p.description, p.user_id, p.category_id, p.precio_id, price.name AS precio, p.published, p.image, p.wc, p.rooms, p.parking, p.street, p.lat, p.lng, c.name AS categoria FROM propiedades p JOIN price ON p.precio_id = price.id JOIN category c ON p.category_id = c.id where p.published = true",
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const allPropertyByCategoryId = async (id) => {
  try {
    const sql = {
      text: "SELECT p.id, p.title, p.description, p.user_id, p.category_id, p.precio_id, price.name AS precio, p.published, p.image, p.wc, p.rooms, p.parking, p.street, p.lat, p.lng, c.name AS categoria FROM propiedades p JOIN price ON p.precio_id = price.id JOIN category c ON p.category_id = c.id WHERE category_id = $1 AND p.published = true",
      values: [id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

//mostrar todas las propiedades por categorias con un limite de 3
const allPropertyByFilter = async (id) => {
  try {
    const sql = {
      text: "SELECT p.id, p.title, p.description, p.user_id, p.category_id, p.precio_id, price.name AS precio, p.published, p.image, p.wc, p.rooms, p.parking, p.street, p.lat, p.lng, c.name AS categoria FROM propiedades p JOIN price ON p.precio_id = price.id JOIN category c ON p.category_id = c.id WHERE category_id = $1 AND p.published = true order by created_at desc LIMIT 3",
      values: [id],
    };

    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const allPropertyBySearch = async (termino) => {
  try {
    const sql = {
      text: "SELECT * FROM propiedades WHERE title ILIKE $1",
      values: [`%${termino}%`],
    };

    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const sentMessage = async ({ message, property_id, user_id }) => {
  try {
    const sql = {
      text: "INSERT INTO messages (message, property_id, user_id) VALUES ($1, $2, $3) RETURNING *",
      values: [message, property_id, user_id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const readMessage = async (id) => {
  try {
    const sql = {
      text: "select p.id, p.user_id, p.category_id, u.name, u.email, m.message, m.created_at from propiedades p join users u on p.user_id = u.id join messages m on m.property_id = p.id WHERE property_id = $1",
      values: [id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return response.rows;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

const published = async (id) => {
  try {
    const sql = {
      text: "UPDATE propiedades SET published = CASE WHEN published = true THEN false ELSE true END WHERE id = $1",
      values: [id],
    };
    const response = await pool.query(sql);
    if (response.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error code: ", error.code, "\nMessage: ", error.message);
  }
};

export const models = {
  createProperty,
  findAllCategory,
  findAllPrice,
  findAllPropertyByUser,
  findPropertyById,
  editProperty,
  deleteProperty,
  countPropertyByUser,
  getAllProperties,
  allPropertyByCategoryId,
  allPropertyByFilter,
  allPropertyBySearch,
  sentMessage,
  readMessage,
  countMessagesByProperty,
  published,
};
