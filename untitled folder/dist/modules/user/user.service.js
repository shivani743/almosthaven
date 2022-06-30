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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const activation_util_1 = require("../../utils/activation/activation.util");
const sanitation_util_1 = require("../../utils/sanitation/sanitation.util");
const wikijs_1 = require("wikijs");
const axios = require('axios');
const trip_model_1 = require("../../models/trip.model");
let UserService = class UserService {
    constructor(userModel, tripModel, userDuplicateModel) {
        this.userModel = userModel;
        this.tripModel = tripModel;
        this.userDuplicateModel = userDuplicateModel;
        this.mainkeywordarray = ["Best places in "];
        this.nightlifekeywordarray = ["clubs in ", "bars in "];
        this.foodkeywordarray = ["restaurants in ", "food in ", "food places in ", "cafes in ", "coffee in ", "bars in "];
    }
    async findUserById(uid) {
        let user;
        try {
            user = await this.userModel
                .findById(uid)
                .populate(user)
                .exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the specified User');
        }
        return user;
    }
    async findemailbyfbid(id) {
        const mail = await this.findByFbid(id);
        if (mail) {
            const email = mail.email.toString();
            const bod = {
                email: email,
            };
            return bod;
        }
        else {
            return null;
        }
    }
    async create(user) {
        const alreadyPresentUser = await this.findByEmail(user.email);
        if (alreadyPresentUser) {
            throw new common_1.BadRequestException('This email is already in use');
        }
        user.activationToken = activation_util_1.generateActivationToken();
        user.activationExpires = Date.now() + 24 * 3600 * 1000;
        if (user.gender === 'female') {
            user.imgpath =
                'https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png';
        }
        else {
            user.imgpath = 'https://image.flaticon.com/icons/png/512/147/147144.png';
        }
        user.status = 'online';
        const newUser = await new this.userModel(user).save();
        const data = {
            name: newUser.fName,
            link: `http://app.creatospace.com/accountactivated/${newUser._id}/${newUser.activationToken}`,
            email: newUser.email,
        };
        return sanitation_util_1.sanitizeUser(newUser);
    }
    async createUserIp(user) {
        const alreadyPresentUser = await this.findByEmail(user.email);
        if (alreadyPresentUser) {
            throw new common_1.BadRequestException('This email is already in use');
        }
        user.activationToken = activation_util_1.generateActivationToken();
        user.activationExpires = Date.now() + 24 * 3600 * 1000;
        if (user.gender === 'female') {
            user.imgpath =
                'https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png';
        }
        else {
            user.imgpath = 'https://image.flaticon.com/icons/png/512/147/147144.png';
        }
        user.status = 'online';
        const newUser = await new this.userModel(user).save();
        return sanitation_util_1.sanitizeUser(newUser);
    }
    async createGoogle(user) {
        const alreadyPresentUser = await this.findByEmail(user.email);
        if (alreadyPresentUser) {
            throw new common_1.BadRequestException('This email is already in use');
        }
        user.status = 'online';
        user.activationToken = activation_util_1.generateActivationToken();
        user.activationExpires = Date.now() + 24 * 3600 * 1000;
        user.active = 'true';
        const newUser = await new this.userModel(user).save();
        return sanitation_util_1.sanitizeUser(newUser);
    }
    async activateUser(uid, activationToken) {
        const user = await this.userModel.findOne({
            _id: uid,
            activationToken: activationToken,
        });
        if (!user)
            throw new common_1.NotFoundException('Cannot find the specific user with the provided credentials');
        if (user.active)
            throw new common_1.BadRequestException('This user has already been activated');
        if (!(user.activationExpires > Date.now()))
            throw new common_1.ForbiddenException('This user cannot be activated due to security reasons');
        user.active = true;
        const activatedUser = await user.save();
        return sanitation_util_1.sanitizeUser(activatedUser);
    }
    async grantAccess(uid, authToken) {
        if (!uid || !authToken)
            throw new common_1.BadRequestException();
        const user = await this.findUserById(uid);
        user.access_tokens = user.access_tokens.concat({
            token: authToken,
        });
        const verifiedUser = await user.save();
        return {
            user: sanitation_util_1.sanitizeUser(verifiedUser),
            authToken,
        };
    }
    async revokeAccess(uid, authToken) {
        const user = await this.findUserById(uid);
        user.access_tokens = user.access_tokens.filter(token => token.token !== authToken);
        const verifiedUser = await user.save();
        return sanitation_util_1.sanitizeUser(verifiedUser);
    }
    async revokeAccessAll(uid) {
        const user = await this.findUserById(uid);
        user.access_tokens = [];
        const verifiedUser = await user.save();
        return sanitation_util_1.sanitizeUser(verifiedUser);
    }
    async queryAutoComplete(query) {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&language=en&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
        const response = await axios.get(url);
        const newArr = [];
        for (let i = 0; i < response.data.predictions.length; i++) {
            const place = response.data.predictions[i];
            const newObj = {
                description: place.description,
                place_id: place.place_id
            };
            newArr.push(newObj);
        }
        return newArr;
    }
    async textSearch(query) {
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
        const response = await axios.get(url);
        const newArr = [];
        for (let i = 0; i < response.data.results.length; i++) {
            const place = response.data.results[i];
            const newObj = {
                description: place === null || place === void 0 ? void 0 : place.name,
                place_id: place === null || place === void 0 ? void 0 : place.place_id,
                photos: this.photosArray(place.photos),
                coordinates: place === null || place === void 0 ? void 0 : place.geometry.location,
                address: place === null || place === void 0 ? void 0 : place.formatted_address,
                rating: place === null || place === void 0 ? void 0 : place.rating,
                types: place === null || place === void 0 ? void 0 : place.types,
            };
            newArr.push(newObj);
        }
        return newArr;
    }
    async getphotsFromPlaceId(placeId) {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
        const response = await axios.get(url);
        const photos = this.photosArray(response.data.result.photos);
        return photos;
    }
    async getPlaceDetails(place_id) {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
        const response = await axios.get(url);
        if (response.data.result.photos != undefined) {
            const photos = this.photosArray(response.data.result.photos);
            response.data.result['photos'] = photos;
        }
        try {
            const summ = await (await this.getWiki(response.data.result.address_components[0].long_name)).summary();
            response.data.result['summary'] = summ.split('.').slice(0, 2).join('.');
            return response.data.result;
        }
        catch (_a) {
            const summ = response.data.result.address_components[0].long_name + 'is a popular addition to a number of travellers throughout the world';
            response.data.result['summary'] = summ;
            return response.data.result;
        }
    }
    async getNearbyPlaces(queryText) {
        let placesArray = [];
        for (let i = 0; i < this.mainkeywordarray.length; i++) {
            const finalQueryText = this.mainkeywordarray[i] + queryText;
            const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${finalQueryText}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
            const response = await axios.get(url);
            for (let i = 0; i < response.data.results.length; i++) {
                if (response.data.results[i].hasOwnProperty('photos')) {
                    const photos = this.photosArray(response.data.results[i].photos);
                    const newObj = {
                        place_name: response.data.results[i].name,
                        formatted_address: response.data.results[i].formatted_address,
                        location: response.data.results[i].location,
                        opening_hours: response.data.results[i].opening_hours,
                        boundaryRight: response.data.results[i].geometry.viewport.northeast,
                        boundaryLeft: response.data.results[i].geometry.viewport.southwest,
                        photos: photos,
                        place_id: response.data.results[i].place_id,
                        rating: response.data.results[i].rating,
                        types: response.data.results[i].types,
                        url: response.data.results[i].url,
                        user_ratings_total: response.data.results[i].user_ratings_total,
                    };
                    placesArray.push(newObj);
                }
            }
        }
        return placesArray;
    }
    async postToTrip(id, obj) {
        const trip = await this.tripModel.findById(id);
        trip.tripObj = obj;
        return trip.save();
    }
    async getPlan(ip, query) {
        let startDate;
        let endDate;
        let tripName;
        let totalDays;
        let summ;
        let from;
        let to;
        const placesArray = [];
        if (query.hasOwnProperty('startDate') && query.hasOwnProperty('endDate')) {
            startDate = query.startDate;
            endDate = query.endDate;
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            totalDays = (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24);
        }
        const place_idFrom = query.from;
        const place_idTo = query.to;
        const urlFrom = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_idFrom}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
        const urlTo = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_idTo}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
        const responseFrom = await axios.get(urlFrom);
        const responseTo = await axios.get(urlTo);
        console.log(responseFrom.data.result);
        const photosF = this.photosArray(responseFrom.data.result.photos);
        const photosT = this.photosArray(responseTo.data.result.photos);
        try {
            const summ = await (await this.getWiki(responseFrom.data.result.address_components[0].long_name)).summary();
            const res = summ.split('.').slice(0, 2).join('.');
            const bestPlaces = await this.getNearbyPlaces(responseFrom.data.result.address_components[0].long_name);
            const newObj = {
                place_name: responseFrom.data.result.address_components[0].long_name,
                formatted_address: responseFrom.data.result.formatted_address,
                location: responseFrom.data.result.geometry.location,
                boundaryRight: responseFrom.data.result.geometry.viewport.northeast,
                boundaryLeft: responseFrom.data.result.geometry.viewport.southwest,
                photos: photosF,
                place_id: responseFrom.data.result.place_id,
                rating: responseFrom.data.result.rating,
                types: responseFrom.data.result.types,
                url: responseFrom.data.result.url,
                vicinity: responseFrom.data.result.vicinity,
                summary: res.split('.').slice(0, 3).join('.'),
                bestPlaces: bestPlaces,
            };
            placesArray.push(newObj);
        }
        catch (_a) {
            const summ = responseFrom.data.result.address_components[0].long_name + 'is a popular addition to a number of travellers throughout the world';
            const res = summ;
            const bestPlaces = await this.getNearbyPlaces(responseFrom.data.result.address_components[0].long_name);
            const newObj = {
                place_name: responseFrom.data.result.address_components[0].long_name,
                formatted_address: responseFrom.data.result.formatted_address,
                location: responseFrom.data.result.geometry.location,
                boundaryRight: responseFrom.data.result.geometry.viewport.northeast,
                boundaryLeft: responseFrom.data.result.geometry.viewport.southwest,
                photos: photosF,
                place_id: responseFrom.data.result.place_id,
                rating: responseFrom.data.result.rating,
                types: responseFrom.data.result.types,
                url: responseFrom.data.result.url,
                vicinity: responseFrom.data.result.vicinity,
                summary: res.split('.').slice(0, 3).join('.'),
                bestPlaces: bestPlaces,
            };
            placesArray.push(newObj);
        }
        try {
            const summ = await (await this.getWiki(responseTo.data.result.address_components[0].long_name)).summary();
            const res = summ.split('.').slice(0, 2).join('.');
            const bestPlaces = await this.getNearbyPlaces(responseTo.data.result.address_components[0].long_name);
            const newObj = {
                place_name: responseTo.data.result.address_components[0].long_name,
                formatted_address: responseTo.data.result.formatted_address,
                location: responseTo.data.result.geometry.location,
                boundaryRight: responseTo.data.result.geometry.viewport.northeast,
                boundaryLeft: responseTo.data.result.geometry.viewport.southwest,
                photos: photosT,
                place_id: responseTo.data.result.place_id,
                rating: responseTo.data.result.rating,
                types: responseTo.data.result.types,
                url: responseTo.data.result.url,
                vicinity: responseTo.data.result.vicinity,
                summary: res.split('.').slice(0, 3).join('.'),
                bestPlaces: bestPlaces,
            };
            placesArray.push(newObj);
        }
        catch (_b) {
            const summ = responseTo.data.result.address_components[0].long_name + 'is a popular addition to a number of travellers throughout the world';
            const res = summ;
            const bestPlaces = await this.getNearbyPlaces(responseTo.data.result.address_components[0].long_name);
            const newObj = {
                place_name: responseTo.data.result.address_components[0].long_name,
                formatted_address: responseTo.data.result.formatted_address,
                location: responseTo.data.result.geometry.location,
                boundaryRight: responseTo.data.result.geometry.viewport.northeast,
                boundaryLeft: responseTo.data.result.geometry.viewport.southwest,
                photos: photosT,
                place_id: responseTo.data.result.place_id,
                rating: responseTo.data.result.rating,
                types: responseTo.data.result.types,
                url: responseTo.data.result.url,
                vicinity: responseTo.data.result.vicinity,
                summary: res.split('.').slice(0, 3).join('.'),
                bestPlaces: bestPlaces,
            };
            placesArray.push(newObj);
        }
        const finalTripName = 'Trip From ' + placesArray[0].place_name + ' to ' + placesArray[1].place_name;
        const finalObj = {
            tripName: finalTripName,
            numberOfDays: totalDays,
            from: query.from,
            to: query.to,
            placesInfo: placesArray,
            startDate: startDate,
            endDate: endDate,
        };
        const createNewTrip = await this.tripModel.create({
            tripObj: finalObj
        });
        const user = await this.findByIp(ip);
        if (user) {
            await this.userModel.findByIdAndUpdate(user._id, {
                $push: {
                    trips: createNewTrip._id
                }
            });
            user.save();
        }
        else {
            const newUs = await this.createUserIp({
                "fName": ip,
                "lName": ip,
                "email": ip,
                "password": ip,
                "ip": ip
            });
            newUs.trips.push(createNewTrip._id);
            console.log(newUs);
        }
        return createNewTrip;
    }
    async getWiki(name) {
        return wikijs_1.default().page(name);
    }
    photosArray(photoarray) {
        const photosArray = [];
        if (photoarray != undefined || photoarray != null)
            for (let i = 0; i < photoarray.length; i++) {
                const term = photoarray[i].photo_reference;
                const width = photoarray[i].width;
                const height = photoarray[i].height;
                const urlPhoto = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${term}&maxheight=${height}&maxwidth=${width}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
                photosArray.push(urlPhoto);
            }
        return photosArray;
    }
    async nearbyHotels(query) {
        return;
    }
    individualDays(days, places) {
        const final = [];
        if (days / places >= 1) {
            if (days % places === 0) {
                const number = Math.floor(days / places);
                for (let i = 0; i < places; i++) {
                    final.push(number);
                }
            }
            else {
            }
        }
        else if (days / places < 1) {
            return 1;
        }
    }
    divvy(number, parts) {
        var randombit = number - 1 * parts;
        var out = [];
        for (var i = 0; i < parts; i++) {
            out.push(Math.random());
        }
        var mult = randombit / out.reduce(function (a, b) { return a + b; });
        return out.map(function (el) { return Math.round(el * mult + 1); });
    }
    async newTrip(tripObj) {
        return await (await this.tripModel.create({
            tripObj: tripObj
        })).save();
    }
    async findById(uid) {
        let user;
        try {
            user = await this.userModel
                .findById(uid)
                .populate(user)
                .exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the specified User');
        }
        if (!user)
            return null;
        return sanitation_util_1.sanitizeUser(user);
    }
    async checkFb(fbid) {
        let user;
        try {
            user = await this.userModel.findOne({ fbid: fbid });
            if (user != null) {
                return true;
            }
        }
        catch (error) {
            throw new common_1.NotFoundException('User Not found!');
        }
        return user;
    }
    async findByEmail(email) {
        let user;
        try {
            user = await this.userModel
                .findOne({
                email: email,
            })
                .populate(user)
                .exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the specified User');
        }
        return user;
    }
    async findByIp(ip) {
        let user;
        try {
            user = await this.userModel
                .findOne({
                ip: ip,
            })
                .populate(user)
                .exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the specified User');
        }
        return user;
    }
    async findTripById(id) {
        let trip;
        try {
            trip = await this.tripModel
                .findOne({
                _id: id,
            })
                .populate(trip)
                .exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the specified User');
        }
        return trip;
    }
    async findByFbid(fbid) {
        const user = await this.userModel.findOne({
            fbid: fbid,
        });
        if (user) {
            return user;
        }
        else {
            return null;
        }
    }
    async findByEmailObject(email) {
        let user;
        try {
            user = await this.userModel
                .findOne({
                email: email.email,
            })
                .populate(user)
                .exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the specified User');
        }
        return user;
    }
    async findByAuthCredentials(uid, authToken) {
        return await this.userModel.findOne({
            _id: uid,
            'access_tokens.token': authToken,
        });
    }
    async findAll() {
        const users = await this.userModel
            .find({ isDeactivated: { $ne: true } })
            .populate('appliedJobPosts')
            .exec();
        users.forEach(user => sanitation_util_1.sanitizeUser(user));
        return users;
    }
    async updateById(uid, user) {
        let updatedUser;
        const allowedUpdates = ['fName', 'lName', 'email', 'phoneNum'];
        const requestedUpdates = Object.keys(user);
        const isValidUpdate = requestedUpdates.every(update => allowedUpdates.includes(update));
        if (!isValidUpdate)
            throw new common_1.ForbiddenException('Invalid Updates Requested');
        try {
            updatedUser = await this.userModel.findById(uid).exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the specified User');
        }
        requestedUpdates.forEach(update => (updatedUser[update] = user[update]));
        const updatedUserAfterSave = await updatedUser.save();
        return sanitation_util_1.sanitizeUser(updatedUserAfterSave);
    }
    async updateTripById(uid, user) {
        let updatedUser;
        const allowedUpdates = ['fName', 'lName', 'email', 'phoneNum'];
        const requestedUpdates = Object.keys(user);
        const isValidUpdate = requestedUpdates.every(update => allowedUpdates.includes(update));
        if (!isValidUpdate)
            throw new common_1.ForbiddenException('Invalid Updates Requested');
        try {
            updatedUser = await this.userModel.findById(uid).exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the specified User');
        }
        requestedUpdates.forEach(update => (updatedUser[update] = user[update]));
        const updatedUserAfterSave = await updatedUser.save();
        return sanitation_util_1.sanitizeUser(updatedUserAfterSave);
    }
    async removeById(uid) {
        if (!uid)
            throw new common_1.BadRequestException('Not a valid User Id');
        const user = await this.userModel.findById(uid);
        const transfer = await this.userDuplicateModel.insertMany([user]);
        const res = await this.userModel
            .deleteOne({
            _id: uid,
        })
            .exec();
        if (!res.deletedCount)
            throw new common_1.NotFoundException('Could not delete the specified User');
        return transfer;
    }
    async upgradeToEnterprise(uid) {
        if (!uid)
            throw new common_1.BadRequestException('Invalid Id');
        let user;
        user = await this.userModel.findById(uid);
        if (!user)
            throw new common_1.NotFoundException('Could not find the specific user');
        if (user.role === 'enterprise')
            throw new common_1.BadRequestException('Account already upgraded');
        user.role = 'enterprise';
        const upgradedUser = await user.save();
        return sanitation_util_1.sanitizeUser(upgradedUser);
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __param(1, mongoose_1.InjectModel('Trip')),
    __param(2, mongoose_1.InjectModel('UserDuplicate')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map