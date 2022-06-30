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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../../utils/guards/roles.decorator");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(user) {
        return await this.userService.create(user);
    }
    async getE(fbid) {
        return await this.userService.findemailbyfbid(fbid.fbid);
    }
    async createGoogle(user) {
        return await this.userService.createGoogle(user);
    }
    async checkfb(fbid, res) {
        return await this.userService.findByFbid(fbid.fbid);
    }
    async get(req, res) {
        const user = await this.userService.findById(req.user.id.trim());
        return res.status(200).send(user);
    }
    async findbyemail(req, email, res) {
        const user = await this.userService.findByEmail(email.valueOf());
        return res.status(200).send(user);
    }
    async findbyemai(req, email, res) {
        const user = await this.userService.findByEmail(email.email);
        if (user) {
            return res.status(200).send('true');
        }
        else {
            return res.status(200).send('false');
        }
    }
    async findfb(req, fbid, res) {
        const user = await this.userService.findByFbid(fbid.fbid);
        return res.status(200).send(user);
    }
    async activate(req, res) {
        const uid = req.query.id.trim();
        const activationToken = req.query.token.trim();
        await this.userService.activateUser(uid, activationToken);
        res.status(200).send({ status: 'Account Activated Successfully.' });
    }
    async getAll(res) {
        const users = await this.userService.findAll();
        return res.status(200).send(users);
    }
    async update(req, user) {
        return await this.userService.updateById(req.user.id.trim(), user);
    }
    async getUserById(id, res) {
        const user = await this.userService.findUserById(id.trim());
        return res.status(200).send(user);
    }
    async getQueryAuto(query, res) {
        console.log(query);
        const user = await this.userService.queryAutoComplete(query.query);
        return res.status(200).send(user);
    }
    async getPlaceDetails(query, res) {
        const user = await this.userService.getPlaceDetails(query);
        return res.status(200).send(user);
    }
    async getPlan(req, ip, query, res) {
        const user = await this.userService.getPlan(ip, query);
        return res.status(200).send(user);
    }
    async newtrip(req, query, res) {
        const user = await this.userService.newTrip(query);
        return res.status(200).send(user);
    }
    async upd(req, id, query, res) {
        const user = await this.userService.postToTrip(id, query);
        return res.status(200).send(user);
    }
    async photos(query, res) {
        const user = await this.userService.getphotsFromPlaceId(query);
        return res.status(200).send(user);
    }
    async Ipuser(query, res) {
        const user = await this.userService.findByIp(query);
        return res.status(200).send(user);
    }
    async tripbyid(query, res) {
        const user = await this.userService.findTripById(query);
        return res.status(200).send(user);
    }
    async GetText(req, query, res) {
        const user = await this.userService.textSearch(query.text);
        return res.status(200).send(user);
    }
    async getNearby(req, id, res) {
        const user = await this.userService.getNearbyPlaces(id);
        return res.status(200).send(user);
    }
    async remove(req) {
        await this.userService.removeById(req.user.id.trim());
    }
};
__decorate([
    common_1.Post('register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    common_1.Get('getemailfb/:fbid'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getE", null);
__decorate([
    common_1.Post('registerGoogle'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createGoogle", null);
__decorate([
    common_1.Get('checkfb/:fbid'),
    __param(0, common_1.Param()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkfb", null);
__decorate([
    roles_decorator_1.Roles('user', 'enterprise', 'admin'),
    common_1.Get('profile'),
    __param(0, common_1.Request()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
__decorate([
    roles_decorator_1.Roles('user', 'enterprise', 'admin'),
    common_1.Get('findbyemail'),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findbyemail", null);
__decorate([
    roles_decorator_1.Roles('user', 'enterprise', 'admin'),
    common_1.Get('findbyem/:email'),
    __param(0, common_1.Request()), __param(1, common_1.Param()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findbyemai", null);
__decorate([
    common_1.Get('fb/:fbid'),
    __param(0, common_1.Request()), __param(1, common_1.Param()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findfb", null);
__decorate([
    common_1.Get('activate'),
    __param(0, common_1.Request()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activate", null);
__decorate([
    common_1.Get(),
    roles_decorator_1.Roles('user', 'admin'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    roles_decorator_1.Roles('user', 'enterprise', 'admin'),
    common_1.Patch('profile'),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    common_1.Get('find/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    common_1.Get('suggestplace'),
    __param(0, common_1.Query()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getQueryAuto", null);
__decorate([
    common_1.Get('placedetails/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPlaceDetails", null);
__decorate([
    common_1.Post('getplan/:ip'),
    __param(0, common_1.Req()), __param(1, common_1.Param('ip')), __param(2, common_1.Body()), __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPlan", null);
__decorate([
    common_1.Post('newtrip'),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newtrip", null);
__decorate([
    common_1.Post('tripupdate/:id'),
    __param(0, common_1.Req()), __param(1, common_1.Param('id')), __param(2, common_1.Body()), __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "upd", null);
__decorate([
    common_1.Get('photos/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "photos", null);
__decorate([
    common_1.Get('userbyip/:ip'),
    __param(0, common_1.Param('ip')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Ipuser", null);
__decorate([
    common_1.Get('tripbyid/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "tripbyid", null);
__decorate([
    common_1.Post('textsearch'),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "GetText", null);
__decorate([
    common_1.Get('nearbyplaces/:id'),
    __param(0, common_1.Req()), __param(1, common_1.Param('id')), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getNearby", null);
__decorate([
    roles_decorator_1.Roles('user', 'enterprise', 'admin'),
    common_1.Delete('profile'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
UserController = __decorate([
    common_1.Controller('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map