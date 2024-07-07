import { pool } from "./db.js";

const deletePropiedades = async () => {
  const sql = "DROP TABLE propiedades";
  await pool.query(sql);
};
const deleteCategory = async () => {
  const sql = "DROP TABLE category";
  await pool.query(sql);
};

const deletePrice = async () => {
  const sql = "drop table price";
  await pool.query(sql);
};

const deleteUsers = async () => {
  const sql = "drop table users";
  await pool.query(sql);
};

try {
  await deletePropiedades();
  await deleteCategory();
  await deletePrice();
  await deleteUsers();
  console.log("tables deleted");
} catch (error) {
  console.log("Error code: ", error.code, "\nMessage: ", error.message);
}
