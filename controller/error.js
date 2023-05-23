const errorController = {
    get500: (error, req, res, next) => {
        res.status(500).render
    }
}