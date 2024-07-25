 const  isSeller = (id, user_id)=>{
    return id === user_id

}

const formatearFechas = (date) => {
    const fecha = new Date(date).toLocaleDateString();
    return fecha;
};

export {
    isSeller,
    formatearFechas
}