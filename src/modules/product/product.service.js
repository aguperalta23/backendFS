const productModel = require("../../models/product");
const pager = require("../../utils/pager");

async function createIfNotExists(data, userId, response) {
    let producto = await findOne(data.nombre);
    if (!producto) {
        producto = {
            nombre: data.nombre,
            precio: data.precio,
            descripcion: data.descripcion,
            categoria: data.categoria,
            stock: data.stock,
            usuario: userId
        };
        await save(producto);
    }
    return producto;
}

async function findOneById(_id) {
    return await productModel.findById(_id).populate('usuario').exec();
}

async function findOne(nombre) {
    return await productModel.findOne({ nombre: nombre }).populate('usuario').exec();
}

async function save(producto) {
    let _producto = new productModel(producto);
    return await _producto.save();
}

async function paginated(params) {
    let perPage = params.perPage ? params.perPage : 10,
        page = Math.max(0, params.page),
        filter = params.filter ? params.filter : {},
        sort = params.sort ? params.sort : {};

    let count = await productModel.countDocuments(filter);
    let data = await productModel.find(filter)
        .limit(perPage)
        .skip(perPage * page)
        .sort(sort)
        .populate('usuario')
        .exec();

    return pager.createPager(page, data, count, perPage);
}

async function update(id, updatedProducto) {
    return await productModel.findByIdAndUpdate(id, updatedProducto, { new: true }).populate('usuario').exec();
}

async function remove(id) {
    return await productModel.findOneAndDelete({ _id: id }).exec();
}

module.exports = { createIfNotExists, findOneById, findOne, save, paginated, update, remove };
