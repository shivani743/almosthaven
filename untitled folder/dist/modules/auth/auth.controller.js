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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_user_auth_guard_1 = require("./jwt-user-auth.guard");
const local_user_auth_guard_1 = require("./local-user-auth.guard");
const passport_1 = require("@nestjs/passport");
const passport = require('passport');
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async loginUser(req, res) {
        const user = await this.authService.loginUser(req.user);
        return res.status(200).send(user);
    }
    async linlogin(req, res, link) {
        const user = await this.authService.linLogin(link);
        return res.status(200).send(user);
    }
    async loginLinkedin(req, link) {
        return await this.authService.linkedinAuth(link);
    }
    async logoutUser(req, headers, res) {
        const user = await this.authService.logoutUser(req.user, headers);
        return res.status(200).send(user);
    }
    async logoutUserAll(req, res) {
        const user = await this.authService.logoutUserAll(req.user);
        return res.status(200).send(user);
    }
    async googleAuth(req) { }
    async fb(req, res) {
        const user = await this.authService.loginFacebook(req['body']);
        return res.status(200).send(user);
    }
    googleAuthRedirect(req) {
        return this.authService.googleLogin(req);
    }
    async googleLogin(req, res) {
    }
    async linkedinAuth(req) { }
    linkedinAuthRedirect(req) {
        passport.authenticate('linkedin', {
            successRedirect: 'http://localhost:8100/login',
            failureRedirect: '/login',
        });
        return this.authService.linkedinLogin(req);
    }
    async logoutEnterprise(req, headers, res) {
        const enterprise = await this.authService.logoutEnterprise(req.user, headers);
        return res.status(200).send(enterprise);
    }
    async logoutEnterpriseAll(req, res) {
        const enterprise = await this.authService.logoutEnterpriseAll(req.user);
        return res.status(200).send(enterprise);
    }
};
__decorate([
    common_1.UseGuards(local_user_auth_guard_1.LocalUserAuthGuard),
    common_1.Post('user/login'),
    __param(0, common_1.Request()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    common_1.Post('user/loginlinkedin'),
    __param(0, common_1.Request()), __param(1, common_1.Res()), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linlogin", null);
__decorate([
    common_1.Post('user/linkedin'),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginLinkedin", null);
__decorate([
    common_1.UseGuards(jwt_user_auth_guard_1.JwtUserAuthGuard),
    common_1.Post('user/logout'),
    __param(0, common_1.Request()),
    __param(1, common_1.Headers()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutUser", null);
__decorate([
    common_1.UseGuards(jwt_user_auth_guard_1.JwtUserAuthGuard),
    common_1.Post('user/logoutAll'),
    __param(0, common_1.Request()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutUserAll", null);
__decorate([
    common_1.Get('google'),
    common_1.UseGuards(passport_1.AuthGuard('google')),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    common_1.Post('user/facebook'),
    __param(0, common_1.Request()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fb", null);
__decorate([
    common_1.Get('google/callback'),
    common_1.UseGuards(passport_1.AuthGuard('google')),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    common_1.Get('googleLogin'),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    common_1.Get('linkedin'),
    common_1.UseGuards(passport_1.AuthGuard('linkedin')),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkedinAuth", null);
__decorate([
    common_1.Get('linkedin/callback'),
    common_1.UseGuards(passport_1.AuthGuard('linkedin')),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "linkedinAuthRedirect", null);
__decorate([
    common_1.Post('enterprise/logout'),
    __param(0, common_1.Request()),
    __param(1, common_1.Headers()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutEnterprise", null);
__decorate([
    common_1.Post('enterprise/logoutAll'),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutEnterpriseAll", null);
AuthController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map