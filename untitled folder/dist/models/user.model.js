"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const hashing_util_1 = require("../utils/hash/hashing.util");
const validator_1 = require("validator");
exports.userSchema = new mongoose_1.Schema({
    fName: {
        type: String,
        required: true,
        trim: true,
    },
    lName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: false,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    username: {
        type: String,
        trim: true,
    },
    intro: {
        type: String,
        trim: true,
    },
    phoneNum: {
        type: String,
        required: false,
        validate(value) {
            if (!validator_1.default.isMobilePhone(value, ['en-US', 'en-AU', 'en-IN', 'uk-UA']))
                throw new Error('Phone number is not a valid one');
            return true;
        },
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'enterprise', 'admin'],
        default: 'user',
    },
    fbid: { type: String, default: '1234' },
    fbToken: {
        type: String,
    },
    active: { type: Boolean, default: true, required: true },
    activationToken: { type: String },
    activationExpires: { type: Number },
    imgpath: { type: String },
    gender: { type: String },
    instaId: { type: String },
    linkedInId: { type: String },
    twitterId: { type: String },
    personalWebsite: { type: String },
    trips: [{
            type: String
        }],
    status: { type: String, default: 'offline' },
    feedback: [{ type: String }],
    ip: { type: String },
    isDeactivated: { type: Boolean, default: false },
    dob: { type: Date },
    accessToken: { type: String },
    likesRecieved: [{ type: String }],
    access_tokens: [
        {
            token: {
                type: String,
            },
        },
    ],
}, { timestamps: true });
exports.userSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await hashing_util_1.hashPassword(this.password);
    next();
});
//# sourceMappingURL=user.model.js.map