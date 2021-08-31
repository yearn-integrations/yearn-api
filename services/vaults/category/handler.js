"use strict"

const db = require('../../../models/vault-category.model');

const findAllVaultCategory = async() => {
    try {
        let result = await db.findAll();
        if (result.length > 0) {
            result.forEach((v) => delete v._id)
        }
        return result;
    } catch(err) {
        console.log(err);
    }
}

module.exports.getVaultCategory = async (req, res) => {
    const result = await findAllVaultCategory();
    res.status(200).json({
        message: "",
        body: result,
    });
}

module.exports.findAllVaultCategory = findAllVaultCategory;
