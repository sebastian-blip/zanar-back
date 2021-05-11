'use strict';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';


const basename = path.basename(__filename);
const db = {};

function initializeModels(sequelize) {
    fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            const modelPath = path.join(__dirname, file);
            const importModelFunction = require(modelPath).default;
            if (typeof importModelFunction === 'function' && importModelFunction.name == "_default") {
                const model = importModelFunction(sequelize, Sequelize.DataTypes);
                db[model.name] = model;
            }

        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName]?.associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
}

export { initializeModels };
