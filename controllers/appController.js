import { models } from "../models/propertyQueries.js";

const home = async (req, res) => {
  const category = await models.findAllCategory();
  const price = await models.findAllPrice();
  const casas = await models.allPropertyByFilter(3);
  const departamentos = await models.allPropertyByFilter(1);
  const user = req.user?.id || 0; //verifica si esta logueado para el menu
  

  res.render("api/home", {
    title: "Home",
    category,
    price,
    casas,
    departamentos,
    user
  });
};

const notFound = (req, res) => {
  res.render("api/notFound", {
    title: "Not Found",
  });
};

const formLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
  });
};

const formRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register",
  });
};

const formContact = (req, res) => {
  res.render("api/contact", {
    title: "Contact",
    user: req.user?.id || 0,
  });
};

const about = (req, res) => {
  res.render("api/about", {
    title: "About",
    user: req.user?.id || 0,
  });
};

const search = async(req, res) => {
  const { termino } = req.body;

  if (!termino.trim()) {
    return res.redirect("back");
  }
const properties = await models.allPropertyBySearch(termino)
res.render('property/search',{
  title: 'Resultado de la Búsqueda',
  properties,
  user: req.user.id
  
})

};

export const controller = {
  home,
  notFound,
  formLogin,
  formRegister,
  formContact,
  about,
  search,
};
