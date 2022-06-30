"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUserStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
let JwtUserStrategy = class JwtUserStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy, 'jwt-user') {
    constructor(authService, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'z2xFDNUUmK0UwrQg4GtN',
            passReqToCallback: true,
        });
        this.authService = authService;
        this.configService = configService;
    }
    async validate(req, payload) {
        const authToken = req.headers.authorization.replace('Bearer ', '');
        const verifiedUser = await this.authService.findUserByCredentials(payload.sub, authToken);
        if (!verifiedUser)
            throw new common_1.UnauthorizedException('Invalid User Credentials');
        if (!verifiedUser.active)
            throw new common_1.ForbiddenException('User Credentials Not Verified');
        return {
            id: payload.sub,
            email: payload.email,
            role: verifiedUser.role,
        };
    }
};
JwtUserStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], JwtUserStrategy);
exports.JwtUserStrategy = JwtUserStrategy;
//# sourceMappingURL=jwt-user.strategy.js.map