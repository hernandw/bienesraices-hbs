import express from 'express';
import { controller } from '../controllers/appController.js'
import  identifyUser  from '../middlewares/identifyUser.js'
const router = express.Router()

router.get('/', identifyUser, controller.home)

router.get('/login', identifyUser, controller.formLogin)

router.get('/register', identifyUser, controller.formRegister)

router.get('/contact', identifyUser, controller.formContact)

router.get('/about',identifyUser, controller.about)

router.post('/search',identifyUser, controller.search)

router.get('*', controller.notFound)




export default router