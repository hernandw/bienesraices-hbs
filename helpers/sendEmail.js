import nodemailer from "nodemailer";
import 'dotenv/config';

const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, FRONTEND_URL, PORT } = process.env

export const sendEmailRegistro = async(name, email, token)=>{
    const transport = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }

        
      });

      
      await transport.sendMail({
        from: "Bienes Raices",
        to: email,
        subject: "Comprueba tu cuenta en Bienes Raices",
        text: "Comprueba tu cuenta en Bienes Raices",
        html: `<p>Hola ${name}, comprueba tu cuenta en Bienes Raices.</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${FRONTEND_URL}:${PORT}/auth/confirmar/${token}">Comprobar cuenta</a></p>   
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
      })
}

export const emailForgetPassword = async(name, email, token)=>{
  const transport = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }

      
    });

    
    await transport.sendMail({
      from: "Bienes Raices",
      to: email,
      subject: "Restablece tu contraseña en Bienes Raices",
      text: "Restablece tu contraseña en Bienes Raices",
      html: `<p>Hola ${name}, has solicitado restablecer tu contraseña en Bienes Raices.</p>
      <p>sigue el siguiente enlace para restablecer tu contraseña:
      <a href="${FRONTEND_URL}:${PORT}/auth/forgetPassword/${token}">Comprobar cuenta</a></p>   
      <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
      `
    })
}