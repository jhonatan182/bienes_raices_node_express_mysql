export const generarToken = () => {
    const fecha = Date.now().toString(32);
    const random = Math.random().toString(32).substring(2);

    return fecha + random;
};
