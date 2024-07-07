const home = (req, res) => {
    res.render('api/home',{
        title: 'Home'
    });
}

const notFound = (req, res) => {
    res.render('api/notFound', {
        title: 'Not Found'
    })
}

const formLogin = (req, res) => {
    res.render('auth/login', {
        title: 'Login'
    })
}

const formRegister = (req, res) => {
    res.render('auth/register', {
        title: 'Register'
    })
}

const formContact = (req, res) => {
    res.render('api/contact', {
        title: 'Contact'
    })
}

const about = (req, res) => {
    res.render('api/about', {
        title: 'About'
    })
}

export const controller = {
    home,
    notFound,
    formLogin,
    formRegister,
    formContact,
    about
}