"use strict"

const db = require('../../../models/vault-category.model');

module.exports.getVaultCategory = async (req, res) => {
    let result = await db.findAll();
    if (result.length > 0) {
        result.forEach((v) => delete v._id)
    }

    res.status(200).json({
        message: "",
        body: result,
    });
}
