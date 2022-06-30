"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUser = void 0;
function sanitizeUser(user) {
    if (!user)
        return null;
    user.password = undefined;
    return user;
}
exports.sanitizeUser = sanitizeUser;
//# sourceMappingURL=sanitation.util.js.map