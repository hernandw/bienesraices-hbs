import { pool } from "../config/db.js";
import { querys } from "./createTables.js";

try {
  await pool.query(querys.createTableCategory);
  await pool.query(querys.createTablePrice);
  await pool.query(querys.createTableUsers);
  await pool.query(querys.createTablePropiedades);
  await pool.query(querys.createTableMessages);
  console.log("tables created");
  await pool.query(querys.insertCategory);
  await pool.query(querys.insertPrice);
  console.log("Price inserted");
} catch (error) {
  console.log("Error code: ", error.code, "\nMessage: ", error.message);
}
