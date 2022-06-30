"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
async function hashPassword(password) {
    const SALT_FACTOR = 10;
    return await bcrypt_1.hash(password, SALT_FACTOR);
}
exports.hashPassword = hashPassword;
function comparePassword(customer, password) {
    return new Promise((resolve, reject) => {
        bcrypt_1.compare(password, customer.password, (err, res) => {
            if (err) {
                return reject(err);
            }
            resolve(res === true);
        });
    });
}
exports.comparePassword = comparePassword;
//# sourceMappingURL=hashing.util.js.map