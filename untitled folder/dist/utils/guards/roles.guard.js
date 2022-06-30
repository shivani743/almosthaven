"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const core_1 = require("@nestjs/core");
const roles_1 = require("./roles");
class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
        this.reflector = new core_1.Reflector();
    }
    canActivate(context) {
        const roles = this.reflector.get('roles', context.getHandler()) || [];
        if (!roles)
            return false;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return roles_1.matchRoles(roles, user.role);
    }
}
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map