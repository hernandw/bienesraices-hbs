import express from "express";
import { engine } from "express-handlebars";
import 'dotenv/config'
import appRoutes from "./routes/appRouter.js";
import userRoutes from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
const PORT = process.env.PORT || 3000;

//configuracion de handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      eq: (a, b) => {
        return a == b;
      },
      sum: (a, b) => {
        return a + b;
      },
      compare: (a, b) => {
        if (a < b ) {
          return a;
        } else {
          return b ;
        }
      },
      rest: (a, b) => {
        return a - b;
      }
      
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

//middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "El archivo es demasiado grande",
  })
);

//carpeta public
app.use(express.static("public"));

//routes
app.use("/api", appRoutes);
app.use("/auth", userRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/api`);
});