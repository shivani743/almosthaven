"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActivationToken = void 0;
const crypto_1 = require("crypto");
function generateActivationToken() {
    return crypto_1.randomBytes(20).toString('hex');
}
exports.generateActivationToken = generateActivationToken;
//# sourceMappingURL=activation.util.js.map