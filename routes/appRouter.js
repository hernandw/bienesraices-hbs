import express from 'express';
import { controller } from '../controllers/appController.js'
const router = express.Router()

router.get('/', controller.home)

router.get('/login', controller.formLogin)

router.get('/register', controller.formRegister)

router.get('/contact', controller.formContact)

router.get('/about', controller.about)

router.get('*', controller.notFound)




export default router