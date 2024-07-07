const createTableCategory = `CREATE TABLE IF NOT EXISTS category(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
)`;
const createTablePrice = `CREATE TABLE IF NOT EXISTS price(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
    
)`;

const createTableUsers = `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    token VARCHAR(60),
    confirm BOOLEAN
)`;

const createTablePropiedades = `CREATE TABLE IF NOT EXISTS propiedades (
    id VARCHAR(30) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    rooms INTEGER NOT NULL,
    parking INTEGER NOT NULL,
    WC INTEGER NOT NULL,
    street VARCHAR(100) NOT NULL,
    lat VARCHAR(100) NOT NULL,
    lng VARCHAR(100) NOT NULL,
    published BOOLEAN DEFAULT false,
    image VARCHAR(100),
    precio_id INTEGER NOT NULL REFERENCES price(id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE
)`;

const insertCategory = `INSERT INTO category(name) VALUES ('Vivienda'), ('Comercio'), ('Casa'), ('Terreno'), ('Oficina');`;

const insertPrice = `INSERT INTO price(name) VALUES ('0 - $10,000 USD'), ('$10,000 - $30,000 USD'), ('$30,000 - $50,000 USD'), ('$50,000 - $100,000 USD'), ('$100,000 - $200,000 USD'), ('$200,000 - $500,000 USD'), ('$500,000 - $1,000,000 USD'), ('1,000,000 - $2,000,000 USD'), ('2,000,000 - $5,000,000 USD'), ('5,000,000 - $10,000,000 USD');`;

/*  */

export const querys = {
  createTableUsers,
  createTableCategory,
  createTablePropiedades,
  createTablePrice,
  insertCategory,
  insertPrice,
};
