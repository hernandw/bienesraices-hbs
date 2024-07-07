import { models } from "../models/userQueries.js";
import { check, validationResult } from "express-validator";

import bcrypt from "bcrypt";
import {
  sendEmailRegistro,
  emailForgetPassword,
} from "../helpers/sendEmail.js";
import { generateId } from "../helpers/generateId.js";

import { generateToken } from "../helpers/generateToken.js";
process.loadEnvFile();

const registerForm = (req, res) => {
  res.render("auth/register", {
    title: "Register",
  });
};

const loginForm = (req, res) => {
  res.render("auth/login", {
    title: "Login",
  });
};

const forget = (req, res) => {
  res.render("auth/forget", {
    title: "Reestablece tu contraseña",
  });
};

/* const resetPassword = (req, res) => {
  res.render("resetPassword", {
    title: "Restablece tu contraseña",
  });
}; */

const register = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  try {
    //Validaciones de campos
    await check("name", "Name is required").notEmpty().run(req);
    await check("email", "Email is required").notEmpty().run(req);
    await check("password", "Password is minimum 6 characters")
      .isLength({ min: 6 })
      .run(req);
    await check("password2", "Passwords do not match")
      .equals(password)
      .run(req);

    //Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("auth/register", {
        errors: errors.array(),
        old: req.body,
      });
    }
    //Encriptar contraseña
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //creamos el token
    const token = generateId();

    //verificamos si el usuario ya existe
    const user = await models.findOneByEmail(email);
    if (user) {
      return res.render("auth/register", {
        title: "Register",
        errors: [{ msg: "El correo ya se encuentra registrado" }],
      });
    }

    //enviamos el correo de confirmación

    sendEmailRegistro(name, email, token);
    //Registrar usuario
    await models.register(name, email, passwordHash, token);
    res.status(201).render("auth/message", {
      title: "Gracias por registrarte",
      message: "Hemos enviado un mensaje de confirmación a tu correo",
      confirmed: false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await models.checkToken(token);
    if (user) {
      return res.render("auth/message", {
        title: "Gracias por confirmar tu cuenta",
        message: "Hemos confirmado tu cuenta, ya puedes iniciar sesión",
        confirmed: true,
      });
    } else {
      return res.render("auth/message", {
        title: "Error al confirmar tu cuenta",
        message: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await check("email", "Email is required").notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("auth/forget", {
        errors: errors.array(),
        old: req.body,
      });
    }
    //generamos un nuevo token
    const token = generateId();

    //agregamos el token a la cuenta de usuario
    await models.addToken(token, email);
    const user = await models.findOneByEmail(email);
    if (user) {
      emailForgetPassword(user.name, user.email, user.token);
      return res.render("auth/message", {
        title: "Reestablece tu contraseña",
        message: "Hemos enviado un correo para reestablecer tu contraseña",
      });
    } else {
      return res.render("auth/forget", {
        title: "Reestablece tu contraseña",
        errors: [{ msg: "El correo no existe" }],
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkTokenReset = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await models.findOneByToken(token);

    if (user) {
      return res.render("auth/resetPassword", {
        title: "Restablecer Contraseña",
        token,
      });
    } else {
      return res.render("auth/message", {
        title: "Error al Restablecer tu contraseña",
        message: "Hubo un error al restablecer tu contraseña, intenta de nuevo",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const passwordReset = async (req, res) => {
  const { token } = req.params;
  const { password, password2 } = req.body;
  try {
    await check("password", "Password is minimum 6 characters")
      .isLength({ min: 6 })
      .run(req);
    await check("password2", "Passwords do not match")
      .equals(password)
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("resetPassword", {
        errors: errors.array(),
        token,
      });
    }

    const user = await models.findOneByToken(token);
    if (user) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      await models.changePassword(passwordHash, token);
      return res.render("auth/message", {
        title: "Contraseña reestablecida",
        message: "Tu contraseña se ha reestablecido, ya puedes iniciar sesión",
      });
    } else {
      return res.render("auth/forget", {
        title: "Reestablece tu contraseña",
        errors: [{ msg: "El token no existe" }],
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await check("email", "Email is required").notEmpty().run(req);
    await check("password", "Password is required").notEmpty().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).render("auth/login", {
        errors: errors.array(), //para mostrar todos los errores
        old: req.body,
      });
    }

    const user = await models.findOneByEmail(email);

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = generateToken(user.id, user.email);

        res.cookie("tokenJWT", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          expiresIn: 4000000,
        });

        return res.redirect("/property");
      } else {
        return res.render("auth/login", {
          title: "Iniciar Sesion",
          errors: [{ msg: "Correo o contraseña incorrecta" }],
          old: req.body,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const controller = {
  register,
  registerForm,
  loginForm,
  forget,
  checkToken,
  forgetPassword,
  checkTokenReset,
  passwordReset,

  login,
};
