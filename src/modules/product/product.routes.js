const express = require('express');
const productService = require('./product.service');
const userService = require('../user/user.service');

const router = express.Router();

// Crear un nuevo producto
router.post('/productos', async (req, res) => {
  try {
    // Verificar que req.body tiene todos los campos requeridos
    const { nombre, precio, email } = req.body; // Asegúrate de que 'email' está presente
    if (!nombre || !precio || !email) {
      return res.status(400).send({ error: 'Faltan datos requeridos' });
    }

    // Encontrar el usuario por email
    const user = await userService.findOne(email);
    if (!user) {
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }

    // Crear el producto solo si no existe uno con el mismo nombre
    const producto = await productService.createIfNotExists(req.body, user._id);
    res.status(201).send(producto);
  } catch (error) {
    console.error("Error en la creación de producto:", error); // Log para depuración
    res.status(400).send(error);
  }
});


// Obtener todos los productos
router.get('/productos', async (req, res) => {
  try {
    const productos = await productService.paginated(req.query);
    res.send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un producto por ID
router.get('/productos/:id', async (req, res) => {
  try {
    const producto = await productService.findOneById(req.params.id);
    if (!producto) {
      return res.status(404).send();
    }
    res.send(producto);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/productos/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nombre', 'precio', 'descripcion', 'categoria', 'stock', 'usuario'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Actualización inválida!' });
  }

  try {
    // Si se proporciona el campo `usuario`, verificar que exista en la base de datos
    let updatedData = { ...req.body };
    if (req.body.usuario) {
      const user = await userService.findOneById(req.body.usuario); // Buscar por ID en lugar de email
      if (!user) {
        return res.status(404).send({ error: 'Usuario no encontrado' });
      }
      updatedData.usuario = user; // Asignar todo el objeto usuario al producto
    }

    // Actualizar el producto con los datos proporcionados
    const producto = await productService.update(req.params.id, updatedData);
    if (!producto) {
      return res.status(404).send({ error: 'Producto no encontrado' });
    }
    res.status(200).send('Producto actualizado correctamente.');
  } catch (error) {
    console.error("Error actualizando producto:", error);
    res.status(400).send(error);
  }
});




// Eliminar un producto por ID
router.delete('/productos/:id', async (req, res) => {
  try {
    const producto = await productService.remove(req.params.id);
    if (!producto) {
      console.log(`Producto con ID ${req.params.id} no encontrado`);
      return res.status(404).send({ error: `Producto con ID ${req.params.id} no encontrado` }); // Enviar mensaje en la respuesta 404
    }
    return res.status(200).send(producto);  // Enviar respuesta 200 si se encuentra y elimina el producto
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${req.params.id}:`, error);
    return res.status(500).send({ error: `Error al eliminar producto con ID ${req.params.id}` });  // Enviar mensaje en la respuesta 500
  }
});



module.exports = router;