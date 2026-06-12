import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
	rid: {
		type: String,
		required: true,
		unique: true,
		default: () => crypto.randomUUID()
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	passwordHash: {
		type: String,
		required: true,
		select: false
	},
	activeTokenHash: {
		type: String,
		default: null,
		select: false
	},
	activeTokenExpiresAt: {
		type: Date,
		default: null,
		select: false
	},
	activeTokenMetadata: {
		userAgent: { type: String, default: null },
		ipAddress: { type: String, default: null },
		issuedAt: { type: Date, default: null }
	},
	createdAt: {
		type: Date,
		default: Date.now,
		select: false
	},
	lastLoginAt: {
		type: Date,
		select: false
	},
	isActive: {
		type: Boolean,
		default: true,
		select: false
	}
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

export const User = mongoose.model('User', userSchema);