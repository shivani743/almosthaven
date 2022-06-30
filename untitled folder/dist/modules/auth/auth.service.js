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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const hashing_util_1 = require("../../utils/hash/hashing.util");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validate({ email, password }, type) {
        switch (type) {
            case 'User':
                const user = await this.userService.findByEmail(email);
                if (!user)
                    return null;
                const isValidUser = await hashing_util_1.comparePassword(user, password);
                if (!isValidUser)
                    return null;
                user.password = undefined;
                return user;
            default:
                throw new common_1.BadRequestException('Not a valid customer type');
        }
    }
    async findByCredentials({ id, authToken }, type) {
        switch (type) {
            case 'User':
                return await this.userService.findByAuthCredentials(id, authToken);
            default:
                throw new common_1.BadRequestException('Not a valid customer type');
        }
    }
    async login(data, type) {
        switch (type) {
            case 'User':
                const user = data;
                const userPayload = { email: user.email, sub: user._id };
                user.status = 'online';
                user.isDeactivated = 'false';
                return await this.userService.grantAccess(user._id, this.jwtService.sign(userPayload));
            default:
                throw new common_1.BadRequestException('Not a valid customer type');
        }
    }
    async googleAuth(data, type) {
        const user = data;
        user.status = 'online';
        const userPayload = { email: user.email, sub: user._id };
        return await this.userService.grantAccess(user._id, this.jwtService.sign(userPayload));
    }
    async facebookAuth(data, type) {
        const user = data;
        user.status = 'online';
        const userPayload = { email: user.email, sub: user._id };
        return await this.userService.grantAccess(user._id, this.jwtService.sign(userPayload));
    }
    async linkedinAuth(link) {
        const axios = require('axios');
        const linkedInToken = link;
        axios
            .post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${linkedInToken.link}&redirect_uri=http://localhost:8100/login/linkedInLogin&client_id=8630dxhif4fa0b&client_secret=uEXrigai0o35iCVz`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then(f => {
            const tok = f.data.access_token;
            const url = `https://api.linkedin.com/v2/me`;
            axios
                .get(url, {
                headers: {
                    Authorization: 'Bearer ' + tok,
                },
            })
                .then(d => {
                const id = d.data.id;
                const fName = d.data.localizedFirstName;
                const lName = d.data.localizedLastName;
                const url2 = ` https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`;
                axios
                    .get(url2, {
                    headers: {
                        Authorization: 'Bearer ' + tok,
                    },
                })
                    .then(result => {
                    const email = result.data.elements[0]['handle~'].emailAddress;
                    const url3 = `https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams))`;
                    axios
                        .get(url3, {
                        headers: {
                            Authorization: 'Bearer ' + tok,
                        },
                    }).then(p => {
                        const imgpath = p.data.profilePicture['displayImage~'].elements[3].identifiers[0].identifier;
                        const user = {
                            email: email,
                            password: id,
                            imgpath: imgpath,
                            fName: fName,
                            lName: lName
                        };
                    });
                });
            });
        });
    }
    async linLogin(link) {
        const axios = require('axios');
        const linkedInToken = link;
        axios
            .post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${linkedInToken.link}&redirect_uri=http://localhost:8100/login/linkedInLogin&client_id=8630dxhif4fa0b&client_secret=uEXrigai0o35iCVz`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then(f => {
            const tok = f.data.access_token;
            const url = `https://api.linkedin.com/v2/me`;
            axios
                .get(url, {
                headers: {
                    Authorization: 'Bearer ' + tok,
                },
            })
                .then(d => {
                const id = d.data.id;
                const url2 = ` https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`;
                axios
                    .get(url2, {
                    headers: {
                        Authorization: 'Bearer ' + tok,
                    },
                })
                    .then(result => {
                    const email = result.data.elements[0]['handle~'].emailAddress;
                    const user = {
                        email: email,
                        password: id
                    };
                    this.login(user, 'User');
                });
            });
        });
    }
    async googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        const user = req.user;
        return await user;
    }
    async linkedinLogin(req) {
        if (!req.user) {
            return 'No user from Linkedin';
        }
        return {
            message: 'User information from Linkedin',
            user: req,
        };
    }
    async logout(data, headers, type) {
        switch (type) {
            case 'User':
                const user = data;
                const userAuthToken = headers.authorization.replace('Bearer ', '');
                return await this.userService.revokeAccess(user.id, userAuthToken);
            default:
                throw new common_1.BadRequestException('Not a valid customer type');
        }
    }
    async logoutAll(id, type) {
        switch (type) {
            case 'User':
                return await this.userService.revokeAccessAll(id);
        }
    }
    async validateUser(email, password) {
        return await this.validate({ email, password }, 'User');
    }
    async validateEnterprise(email, password) {
        return await this.validate({ email, password }, 'Enterprise');
    }
    async findUserByCredentials(uid, authToken) {
        return await this.findByCredentials({ id: uid, authToken }, 'User');
    }
    async findEnterpriseByCredentials(eid, authToken) {
        return await this.findByCredentials({ id: eid, authToken }, 'Enterprise');
    }
    async loginUser(user) {
        return await this.login(user, 'User');
    }
    async loginFacebook(body) {
        return await this.facebookAuth(body, 'User');
    }
    async loginGoogleUser(user) {
        return await this.googleAuth(user, 'User');
    }
    async loginEnterprise(enterprise) {
        return await this.login(enterprise, 'Enterprise');
    }
    async logoutUser(user, headers) {
        return await this.logout(user, headers, 'User');
    }
    async logoutEnterprise(enterprise, headers) {
        return await this.logout(enterprise, headers, 'Enterprise');
    }
    async logoutUserAll(user) {
        return await this.logoutAll(user.id, 'User');
    }
    async logoutEnterpriseAll(enterprise) {
        return await this.logoutAll(enterprise.id, 'Enterprise');
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map