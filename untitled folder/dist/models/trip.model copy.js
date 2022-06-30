"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripSchema = void 0;
const mongoose_1 = require("mongoose");
exports.tripSchema = new mongoose_1.Schema({
    "unique_id": {
        type: String,
    },
    "trips": [{
            type: String,
        }]
});
//# sourceMappingURL=trip.model copy.js.map