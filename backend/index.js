// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// require('dotenv').config();

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  currency: { type: String, default: 'USD' },
  monthlyBudget: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET || 'your_fallback_secret_key_here',
    { expiresIn: '7d' }
  );
};

const User = mongoose.model('User', userSchema);

// Expense Schema
const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, default: 'Other' },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['income', 'expense'], default: 'expense' },
  paymentMethod: { type: String, default: 'Cash' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

// Trip Schema
const tripSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  currency: { type: String, default: 'USD' },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

// Trip Expense Schema
const tripExpenseSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, default: 'Other' },
  date: { type: Date, default: Date.now },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitBetween: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    share: { type: Number, required: true }, // Actual amount for this user
    percentage: { type: Number, default: 0 } // Percentage of total
  }]
}, { timestamps: true });

const TripExpense = mongoose.model('TripExpense', tripExpenseSchema);

// Group Schema
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

// Group Expense Schema
const groupExpenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, default: 'Other' },
  date: { type: Date, default: Date.now },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitBetween: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    share: { type: Number, required: true },
    percentage: { type: Number, default: 0 }
  }]
}, { timestamps: true });

const GroupExpense = mongoose.model('GroupExpense', groupExpenseSchema);

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret_key_here');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// ==================== AUTHENTICATION ROUTES ====================

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }
    const user = new User({ name, email, password });
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, currency: user.currency, monthlyBudget: user.monthlyBudget }, token }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    const token = user.generateAuthToken();
    res.json({
      success: true,
      message: 'Login successful',
      data: { user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, currency: user.currency, monthlyBudget: user.monthlyBudget }, token }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: { user: { id: req.user._id, name: req.user.name, email: req.user.email, avatar: req.user.avatar, currency: req.user.currency, monthlyBudget: req.user.monthlyBudget } }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching profile' });
  }
});

// Update User Profile
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { name, currency, monthlyBudget } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(currency && { currency }), ...(monthlyBudget !== undefined && { monthlyBudget }) },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, avatar: updatedUser.avatar, currency: updatedUser.currency, monthlyBudget: updatedUser.monthlyBudget } }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
});

// ==================== EXPENSE CRUD ROUTES ====================

// Create Expense
app.post('/api/expenses', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date, type, paymentMethod } = req.body;
    if (!amount || !description) {
      return res.status(400).json({ success: false, message: 'Amount and description are required' });
    }
    const expense = new Expense({
      amount, description, category: category || 'Other', date: date || new Date(),
      type: type || 'expense', paymentMethod: paymentMethod || 'Cash', userId: req.user._id
    });
    await expense.save();
    const populatedExpense = await Expense.findById(expense._id);
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating expense' });
  }
});

// Get All Expenses with Pagination & Filtering
app.get('/api/expenses', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
    let query = { userId: req.user._id };
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const expenses = await Expense.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Expense.countDocuments(query);
    res.json({
      success: true,
      data: { expenses, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching expenses' });
  }
});

// Get Single Expense
app.get('/api/expenses/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: { expense } });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching expense' });
  }
});

// Update Expense
app.put('/api/expenses/:id', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date, type, paymentMethod } = req.body;
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { amount, description, category, date, type, paymentMethod },
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense: updatedExpense }
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating expense' });
  }
});

// Delete Expense
app.delete('/api/expenses/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting expense' });
  }
});

// ==================== TRIP CRUD ROUTES ====================

// Create Trip
app.post('/api/trips', authMiddleware, async (req, res) => {
  try {
    const { name, description, startDate, endDate, currency, members } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Name, start date, and end date are required' });
    }
    const trip = new Trip({
      name, description, startDate, endDate, currency: currency || 'USD',
      members: [...(members || []), { userId: req.user._id, role: 'admin' }],
      createdBy: req.user._id
    });
    await trip.save();
    const populatedTrip = await Trip.findById(trip._id).populate('members.userId', 'name email avatar');
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: { trip: populatedTrip }
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating trip' });
  }
});

// Get All Trips for User
app.get('/api/trips', authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ 
      'members.userId': req.user._id,
      isActive: true 
    }).populate('members.userId', 'name email avatar').sort({ createdAt: -1 });
    res.json({ success: true, data: { trips } });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching trips' });
  }
});

// Get Single Trip
app.get('/api/trips/:id', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      'members.userId': req.user._id 
    }).populate('members.userId', 'name email avatar');
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, data: { trip } });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching trip' });
  }
});

// Update Trip
app.put('/api/trips/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, startDate, endDate, currency } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { name, description, startDate, endDate, currency },
      { new: true, runValidators: true }
    ).populate('members.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: { trip: updatedTrip }
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating trip' });
  }
});

// Delete Trip (Soft Delete)
app.delete('/api/trips/:id', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    await Trip.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting trip' });
  }
});

// Add Member to Trip
app.post('/api/trips/:id/members', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const userExists = trip.members.some(member => member.userId.toString() === userId);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already in trip' });
    }
    trip.members.push({ userId, role: 'member' });
    await trip.save();
    const updatedTrip = await Trip.findById(trip._id).populate('members.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Member added successfully',
      data: { trip: updatedTrip }
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ success: false, message: 'Server error while adding member' });
  }
});

// ==================== TRIP EXPENSE CRUD ROUTES ====================

// Create Trip Expense
app.post('/api/trips/:id/expenses', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date, paidBy, splitBetween } = req.body;
    if (!amount || !description || !paidBy || !splitBetween) {
      return res.status(400).json({ success: false, message: 'Amount, description, paidBy, and splitBetween are required' });
    }
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const tripExpense = new TripExpense({
      tripId: req.params.id, amount, description, category: category || 'Other',
      date: date || new Date(), paidBy, splitBetween
    });
    await tripExpense.save();
    const populatedExpense = await TripExpense.findById(tripExpense._id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar');
    res.status(201).json({
      success: true,
      message: 'Trip expense created successfully',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    console.error('Create trip expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating trip expense' });
  }
});

// Get All Trip Expenses
app.get('/api/trips/:id/expenses', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const expenses = await TripExpense.find({ tripId: req.params.id })
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar')
      .sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: { expenses } });
  } catch (error) {
    console.error('Get trip expenses error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching trip expenses' });
  }
});

// Update Trip Expense
app.put('/api/trips/:id/expenses/:expenseId', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date, paidBy, splitBetween } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const updatedExpense = await TripExpense.findByIdAndUpdate(
      req.params.expenseId,
      { amount, description, category, date, paidBy, splitBetween },
      { new: true, runValidators: true }
    ).populate('paidBy', 'name email avatar')
     .populate('splitBetween.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Trip expense updated successfully',
      data: { expense: updatedExpense }
    });
  } catch (error) {
    console.error('Update trip expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating trip expense' });
  }
});

// Delete Trip Expense
app.delete('/api/trips/:id/expenses/:expenseId', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    await TripExpense.findByIdAndDelete(req.params.expenseId);
    res.json({ success: true, message: 'Trip expense deleted successfully' });
  } catch (error) {
    console.error('Delete trip expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting trip expense' });
  }
});

// ==================== GROUP CRUD ROUTES ====================

// Create Group
app.post('/api/groups', authMiddleware, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Group name is required' });
    }
    const group = new Group({
      name, description,
      members: [...(members || []), { userId: req.user._id, role: 'admin' }],
      createdBy: req.user._id
    });
    await group.save();
    const populatedGroup = await Group.findById(group._id).populate('members.userId', 'name email avatar');
    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: { group: populatedGroup }
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating group' });
  }
});

// Get All Groups for User
app.get('/api/groups', authMiddleware, async (req, res) => {
  try {
    const groups = await Group.find({ 
      'members.userId': req.user._id,
      isActive: true 
    }).populate('members.userId', 'name email avatar').sort({ createdAt: -1 });
    res.json({ success: true, data: { groups } });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching groups' });
  }
});

// Get Single Group
app.get('/api/groups/:id', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ 
      _id: req.params.id, 
      'members.userId': req.user._id 
    }).populate('members.userId', 'name email avatar');
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    res.json({ success: true, data: { group } });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching group' });
  }
});

// Update Group
app.put('/api/groups/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    ).populate('members.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Group updated successfully',
      data: { group: updatedGroup }
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating group' });
  }
});

// Delete Group (Soft Delete)
app.delete('/api/groups/:id', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    await Group.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting group' });
  }
});

// Add Member to Group
app.post('/api/groups/:id/members', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    const userExists = group.members.some(member => member.userId.toString() === userId);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already in group' });
    }
    group.members.push({ userId, role: 'member' });
    await group.save();
    const updatedGroup = await Group.findById(group._id).populate('members.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Member added successfully',
      data: { group: updatedGroup }
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ success: false, message: 'Server error while adding member' });
  }
});

// ==================== GROUP EXPENSE CRUD ROUTES ====================

// Create Group Expense
app.post('/api/groups/:id/expenses', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date, paidBy, splitBetween } = req.body;
    if (!amount || !description || !paidBy || !splitBetween) {
      return res.status(400).json({ success: false, message: 'Amount, description, paidBy, and splitBetween are required' });
    }
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    const groupExpense = new GroupExpense({
      groupId: req.params.id, amount, description, category: category || 'Other',
      date: date || new Date(), paidBy, splitBetween
    });
    await groupExpense.save();
    const populatedExpense = await GroupExpense.findById(groupExpense._id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar');
    res.status(201).json({
      success: true,
      message: 'Group expense created successfully',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    console.error('Create group expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating group expense' });
  }
});

// Get All Group Expenses
app.get('/api/groups/:id/expenses', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    const expenses = await GroupExpense.find({ groupId: req.params.id })
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar')
      .sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: { expenses } });
  } catch (error) {
    console.error('Get group expenses error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching group expenses' });
  }
});

// Update Group Expense
app.put('/api/groups/:id/expenses/:expenseId', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date, paidBy, splitBetween } = req.body;
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    const updatedExpense = await GroupExpense.findByIdAndUpdate(
      req.params.expenseId,
      { amount, description, category, date, paidBy, splitBetween },
      { new: true, runValidators: true }
    ).populate('paidBy', 'name email avatar')
     .populate('splitBetween.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Group expense updated successfully',
      data: { expense: updatedExpense }
    });
  } catch (error) {
    console.error('Update group expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating group expense' });
  }
});

// Delete Group Expense
app.delete('/api/groups/:id/expenses/:expenseId', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    await GroupExpense.findByIdAndDelete(req.params.expenseId);
    res.json({ success: true, message: 'Group expense deleted successfully' });
  } catch (error) {
    console.error('Delete group expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting group expense' });
  }
});

// ==================== USER SEARCH & MEMBER MANAGEMENT ====================

// Search users by email (for adding members)
app.get('/api/users/search', authMiddleware, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for search' });
    }
    const users = await User.find({ 
      email: { $regex: email, $options: 'i' } 
    }).select('name email avatar');
    res.json({ success: true, data: { users } });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ success: false, message: 'Server error while searching users' });
  }
});

// Add member to trip by email
app.post('/api/trips/:id/members/email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Check if user is admin/creator
    const userMember = trip.members.find(member => member.userId.toString() === req.user._id.toString());
    if (userMember.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only trip admin can add members' });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Check if user already in trip
    const userExists = trip.members.some(member => member.userId.toString() === userToAdd._id.toString());
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already in trip' });
    }

    // Add user to trip
    trip.members.push({ userId: userToAdd._id, role: 'member' });
    await trip.save();
    
    const updatedTrip = await Trip.findById(trip._id).populate('members.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Member added successfully',
      data: { trip: updatedTrip }
    });
  } catch (error) {
    console.error('Add member by email error:', error);
    res.status(500).json({ success: false, message: 'Server error while adding member' });
  }
});

// Remove member from trip
app.delete('/api/trips/:id/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Check if user is admin/creator
    const userMember = trip.members.find(member => member.userId.toString() === req.user._id.toString());
    if (userMember.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only trip admin can remove members' });
    }

    // Prevent removing yourself
    if (req.params.memberId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself from trip' });
    }

    // Remove member
    trip.members = trip.members.filter(member => member.userId.toString() !== req.params.memberId);
    await trip.save();
    
    const updatedTrip = await Trip.findById(trip._id).populate('members.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Member removed successfully',
      data: { trip: updatedTrip }
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ success: false, message: 'Server error while removing member' });
  }
});

// Similar routes for groups...
app.post('/api/groups/:id/members/email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is admin/creator
    const userMember = group.members.find(member => member.userId.toString() === req.user._id.toString());
    if (userMember.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only group admin can add members' });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Check if user already in group
    const userExists = group.members.some(member => member.userId.toString() === userToAdd._id.toString());
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already in group' });
    }

    // Add user to group
    group.members.push({ userId: userToAdd._id, role: 'member' });
    await group.save();
    
    const updatedGroup = await Group.findById(group._id).populate('members.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Member added successfully',
      data: { group: updatedGroup }
    });
  } catch (error) {
    console.error('Add member to group error:', error);
    res.status(500).json({ success: false, message: 'Server error while adding member' });
  }
});

// Remove member from group
app.delete('/api/groups/:id/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is admin/creator
    const userMember = group.members.find(member => member.userId.toString() === req.user._id.toString());
    if (userMember.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only group admin can remove members' });
    }

    // Prevent removing yourself
    if (req.params.memberId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself from group' });
    }

    // Remove member
    group.members = group.members.filter(member => member.userId.toString() !== req.params.memberId);
    await group.save();
    
    const updatedGroup = await Group.findById(group._id).populate('members.userId', 'name email avatar');
    res.json({
      success: true,
      message: 'Member removed successfully',
      data: { group: updatedGroup }
    });
  } catch (error) {
    console.error('Remove member from group error:', error);
    res.status(500).json({ success: false, message: 'Server error while removing member' });
  }
});

// ==================== ENHANCED EXPENSE CREATION WITH AUTO-SPLITTING ====================

// Enhanced Trip Expense Creation with Auto Equal Split
app.post('/api/trips/:id/expenses/auto-split', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date, paidBy } = req.body;
    
    if (!amount || !description || !paidBy) {
      return res.status(400).json({ success: false, message: 'Amount, description, and paidBy are required' });
    }

    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Auto-calculate equal splits
    const memberCount = trip.members.length;
    const sharePerPerson = amount / memberCount;
    const percentagePerPerson = (1 / memberCount) * 100;

    const splitBetween = trip.members.map(member => ({
      userId: member.userId,
      share: sharePerPerson,
      percentage: percentagePerPerson
    }));

    const tripExpense = new TripExpense({
      tripId: req.params.id,
      amount,
      description,
      category: category || 'Other',
      date: date || new Date(),
      paidBy,
      splitBetween
    });

    await tripExpense.save();
    
    const populatedExpense = await TripExpense.findById(tripExpense._id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Trip expense created with equal split',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    console.error('Create auto-split trip expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating expense' });
  }
});

// Enhanced Group Expense Creation with Auto Equal Split
app.post('/api/groups/:id/expenses/auto-split', authMiddleware, async (req, res) => {
  try {
    const { amount, description, category, date, paidBy } = req.body;
    
    if (!amount || !description || !paidBy) {
      return res.status(400).json({ success: false, message: 'Amount, description, and paidBy are required' });
    }

    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Auto-calculate equal splits
    const memberCount = group.members.length;
    const sharePerPerson = amount / memberCount;
    const percentagePerPerson = (1 / memberCount) * 100;

    const splitBetween = group.members.map(member => ({
      userId: member.userId,
      share: sharePerPerson,
      percentage: percentagePerPerson
    }));

    const groupExpense = new GroupExpense({
      groupId: req.params.id,
      amount,
      description,
      category: category || 'Other',
      date: date || new Date(),
      paidBy,
      splitBetween
    });

    await groupExpense.save();
    
    const populatedExpense = await GroupExpense.findById(groupExpense._id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Group expense created with equal split',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    console.error('Create auto-split group expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating expense' });
  }
});

// ==================== SETTLEMENT CALCULATIONS ====================

// Get trip settlements (who owes whom)
app.get('/api/trips/:id/settlements', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const expenses = await TripExpense.find({ tripId: req.params.id })
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar');

    // Calculate balances for each member
    const balances = {};
    trip.members.forEach(member => {
      balances[member.userId.toString()] = {
        user: member.userId,
        balance: 0,
        totalPaid: 0,
        totalOwed: 0
      };
    });

    // Calculate net balances
    expenses.forEach(expense => {
      const paidBy = expense.paidBy._id.toString();
      
      // Person who paid gets positive balance
      balances[paidBy].balance += expense.amount;
      balances[paidBy].totalPaid += expense.amount;
      
      // People who owe get negative balance
      expense.splitBetween.forEach(split => {
        const userId = split.userId._id.toString();
        balances[userId].balance -= split.share;
        balances[userId].totalOwed += split.share;
      });
    });

    // Calculate settlements (simplify debts)
    const settlements = [];
    const creditors = Object.values(balances)
      .filter(b => b.balance > 0.01)
      .sort((a, b) => b.balance - a.balance);
    
    const debtors = Object.values(balances)
      .filter(b => b.balance < -0.01)
      .sort((a, b) => a.balance - b.balance);

    creditors.forEach(creditor => {
      debtors.forEach(debtor => {
        if (Math.abs(debtor.balance) > 0.01 && creditor.balance > 0.01) {
          const amount = Math.min(creditor.balance, Math.abs(debtor.balance));
          
          settlements.push({
            from: { 
              id: debtor.user._id, 
              name: debtor.user.name, 
              email: debtor.user.email 
            },
            to: { 
              id: creditor.user._id, 
              name: creditor.user.name, 
              email: creditor.user.email 
            },
            amount: parseFloat(amount.toFixed(2)),
            currency: trip.currency
          });
          
          creditor.balance -= amount;
          debtor.balance += amount;
        }
      });
    });

    // Prepare balance summary for frontend
    const balanceSummary = Object.values(balances).map(balance => ({
      user: {
        id: balance.user._id,
        name: balance.user.name,
        email: balance.user.email,
        avatar: balance.user.avatar
      },
      balance: parseFloat(balance.balance.toFixed(2)),
      totalPaid: parseFloat(balance.totalPaid.toFixed(2)),
      totalOwed: parseFloat(balance.totalOwed.toFixed(2))
    }));

    res.json({
      success: true,
      data: {
        settlements,
        balanceSummary,
        totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        currency: trip.currency
      }
    });
  } catch (error) {
    console.error('Get trip settlements error:', error);
    res.status(500).json({ success: false, message: 'Server error while calculating settlements' });
  }
});

// Get group settlements (similar logic)
app.get('/api/groups/:id/settlements', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const expenses = await GroupExpense.find({ groupId: req.params.id })
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar');

    // Similar settlement calculation logic as above...
    const balances = {};
    group.members.forEach(member => {
      balances[member.userId.toString()] = {
        user: member.userId,
        balance: 0,
        totalPaid: 0,
        totalOwed: 0
      };
    });

    expenses.forEach(expense => {
      const paidBy = expense.paidBy._id.toString();
      balances[paidBy].balance += expense.amount;
      balances[paidBy].totalPaid += expense.amount;
      
      expense.splitBetween.forEach(split => {
        const userId = split.userId._id.toString();
        balances[userId].balance -= split.share;
        balances[userId].totalOwed += split.share;
      });
    });

    const settlements = [];
    const creditors = Object.values(balances)
      .filter(b => b.balance > 0.01)
      .sort((a, b) => b.balance - a.balance);
    
    const debtors = Object.values(balances)
      .filter(b => b.balance < -0.01)
      .sort((a, b) => a.balance - b.balance);

    creditors.forEach(creditor => {
      debtors.forEach(debtor => {
        if (Math.abs(debtor.balance) > 0.01 && creditor.balance > 0.01) {
          const amount = Math.min(creditor.balance, Math.abs(debtor.balance));
          
          settlements.push({
            from: { 
              id: debtor.user._id, 
              name: debtor.user.name, 
              email: debtor.user.email 
            },
            to: { 
              id: creditor.user._id, 
              name: creditor.user.name, 
              email: creditor.user.email 
            },
            amount: parseFloat(amount.toFixed(2))
          });
          
          creditor.balance -= amount;
          debtor.balance += amount;
        }
      });
    });

    const balanceSummary = Object.values(balances).map(balance => ({
      user: {
        id: balance.user._id,
        name: balance.user.name,
        email: balance.user.email,
        avatar: balance.user.avatar
      },
      balance: parseFloat(balance.balance.toFixed(2)),
      totalPaid: parseFloat(balance.totalPaid.toFixed(2)),
      totalOwed: parseFloat(balance.totalOwed.toFixed(2))
    }));

    res.json({
      success: true,
      data: {
        settlements,
        balanceSummary,
        totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0)
      }
    });
  } catch (error) {
    console.error('Get group settlements error:', error);
    res.status(500).json({ success: false, message: 'Server error while calculating settlements' });
  }
});

// ==================== ENHANCED MEMBER MANAGEMENT ROUTES ====================

// Search users by email (for adding members)
app.get('/api/users/search', authMiddleware, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for search' });
    }
    
    const users = await User.find({ 
      email: { $regex: email, $options: 'i' } 
    }).select('name email avatar _id');
    
    res.json({ success: true, data: { users } });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ success: false, message: 'Server error while searching users' });
  }
});

// Get trip members with full user details
app.get('/api/trips/:id/members', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      'members.userId': req.user._id 
    }).populate('members.userId', 'name email avatar _id');
    
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ 
      success: true, 
      data: { 
        members: trip.members,
        currentUserRole: trip.members.find(m => m.userId._id.toString() === req.user._id.toString())?.role
      } 
    });
  } catch (error) {
    console.error('Get trip members error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching members' });
  }
});

// Add member to trip by email
app.post('/api/trips/:id/members', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Check if current user is admin
    const currentUserMember = trip.members.find(member => 
      member.userId.toString() === req.user._id.toString()
    );
    
    if (currentUserMember?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only trip admin can add members' });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Check if user already in trip
    const userExists = trip.members.some(member => 
      member.userId.toString() === userToAdd._id.toString()
    );
    
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already in trip' });
    }

    // Add user to trip
    trip.members.push({ 
      userId: userToAdd._id, 
      role: 'member',
      joinedAt: new Date()
    });
    
    await trip.save();
    
    // Return updated members with populated user data
    const updatedTrip = await Trip.findById(trip._id)
      .populate('members.userId', 'name email avatar _id');
    
    res.json({
      success: true,
      message: 'Member added successfully',
      data: { members: updatedTrip.members }
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ success: false, message: 'Server error while adding member' });
  }
});

// Remove member from trip
app.delete('/api/trips/:id/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Check if current user is admin
    const currentUserMember = trip.members.find(member => 
      member.userId.toString() === req.user._id.toString()
    );
    
    if (currentUserMember?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only trip admin can remove members' });
    }

    // Prevent removing yourself
    if (req.params.memberId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself from trip' });
    }

    // Remove member
    trip.members = trip.members.filter(member => 
      member.userId.toString() !== req.params.memberId
    );
    
    await trip.save();
    
    // Return updated members with populated user data
    const updatedTrip = await Trip.findById(trip._id)
      .populate('members.userId', 'name email avatar _id');
    
    res.json({
      success: true,
      message: 'Member removed successfully',
      data: { members: updatedTrip.members }
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ success: false, message: 'Server error while removing member' });
  }
});

// Similar routes for groups...
// app.get('/api/groups/:id/members', authMiddleware, async (req, res) => {
//   try {
//     const group = await Group.findOne({ 
//       _id: req.params.id, 
//       'members.userId': req.user._id 
//     }).populate('members.userId', 'name email avatar _id');
    
//     if (!group) {
//       return res.status(404).json({ success: false, message: 'Group not found' });
//     }

//     res.json({ 
//       success: true, 
//       data: { 
//         members: group.members,
//         currentUserRole: group.members.find(m => m.userId._id.toString() === req.user._id.toString())?.role
//       } 
//     });
//   } catch (error) {
//     console.error('Get group members error:', error);
//     res.status(500).json({ success: false, message: 'Server error while fetching members' });
//   }
// });

// app.post('/api/groups/:id/members', authMiddleware, async (req, res) => {
//   try {
//     const { email } = req.body;
//     const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
//     if (!group) {
//       return res.status(404).json({ success: false, message: 'Group not found' });
//     }

//     // Check if current user is admin
//     const currentUserMember = group.members.find(member => 
//       member.userId.toString() === req.user._id.toString()
//     );
    
//     if (currentUserMember?.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Only group admin can add members' });
//     }

//     // Find user by email
//     const userToAdd = await User.findOne({ email });
//     if (!userToAdd) {
//       return res.status(404).json({ success: false, message: 'User not found with this email' });
//     }

//     // Check if user already in group
//     const userExists = group.members.some(member => 
//       member.userId.toString() === userToAdd._id.toString()
//     );
    
//     if (userExists) {
//       return res.status(400).json({ success: false, message: 'User already in group' });
//     }

//     // Add user to group
//     group.members.push({ 
//       userId: userToAdd._id, 
//       role: 'member',
//       joinedAt: new Date()
//     });
    
//     await group.save();
    
//     const updatedGroup = await Group.findById(group._id)
//       .populate('members.userId', 'name email avatar _id');
    
//     res.json({
//       success: true,
//       message: 'Member added successfully',
//       data: { members: updatedGroup.members }
//     });
//   } catch (error) {
//     console.error('Add member to group error:', error);
//     res.status(500).json({ success: false, message: 'Server error while adding member' });
//   }
// });

// app.delete('/api/groups/:id/members/:memberId', authMiddleware, async (req, res) => {
//   try {
//     const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
//     if (!group) {
//       return res.status(404).json({ success: false, message: 'Group not found' });
//     }

//     // Check if current user is admin
//     const currentUserMember = group.members.find(member => 
//       member.userId.toString() === req.user._id.toString()
//     );
    
//     if (currentUserMember?.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Only group admin can remove members' });
//     }

//     // Prevent removing yourself
//     if (req.params.memberId === req.user._id.toString()) {
//       return res.status(400).json({ success: false, message: 'Cannot remove yourself from group' });
//     }

//     // Remove member
//     group.members = group.members.filter(member => 
//       member.userId.toString() !== req.params.memberId
//     );
    
//     await group.save();
    
//     const updatedGroup = await Group.findById(group._id)
//       .populate('members.userId', 'name email avatar _id');
    
//     res.json({
//       success: true,
//       message: 'Member removed successfully',
//       data: { members: updatedGroup.members }
//     });
//   } catch (error) {
//     console.error('Remove member from group error:', error);
//     res.status(500).json({ success: false, message: 'Server error while removing member' });
//   }
// });

// ==================== ENHANCED GROUP MEMBER MANAGEMENT ROUTES ====================

// Get group members with full user details
app.get('/api/groups/:id/members', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ 
      _id: req.params.id, 
      'members.userId': req.user._id 
    }).populate('members.userId', 'name email avatar _id');
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Find current user's role in the group
    const currentUserMember = group.members.find(member => 
      member.userId._id.toString() === req.user._id.toString()
    );

    res.json({ 
      success: true, 
      data: { 
        members: group.members,
        currentUserRole: currentUserMember?.role || 'member'
      } 
    });
  } catch (error) {
    console.error('Get group members error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching members' });
  }
});

// Add member to group by email (FIXED VERSION)
app.post('/api/groups/:id/members', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body; // ✅ Now expecting email instead of userId
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if current user is admin
    const currentUserMember = group.members.find(member => 
      member.userId.toString() === req.user._id.toString()
    );
    
    if (currentUserMember?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only group admin can add members' });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Check if user already in group
    const userExists = group.members.some(member => 
      member.userId.toString() === userToAdd._id.toString()
    );
    
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already in group' });
    }

    // Add user to group
    group.members.push({ 
      userId: userToAdd._id, 
      role: 'member',
      joinedAt: new Date()
    });
    
    await group.save();
    
    // Return updated members with populated user data
    const updatedGroup = await Group.findById(group._id)
      .populate('members.userId', 'name email avatar _id');
    
    res.json({
      success: true,
      message: 'Member added successfully',
      data: { 
        members: updatedGroup.members,
        group: updatedGroup 
      }
    });
  } catch (error) {
    console.error('Add member to group error:', error);
    
    // More specific error handling
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ success: false, message: 'User already exists in this group' });
    }
    
    res.status(500).json({ success: false, message: 'Server error while adding member' });
  }
});

// Remove member from group (FIXED VERSION)
app.delete('/api/groups/:id/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, 'members.userId': req.user._id });
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if current user is admin
    const currentUserMember = group.members.find(member => 
      member.userId.toString() === req.user._id.toString()
    );
    
    if (currentUserMember?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only group admin can remove members' });
    }

    // Prevent removing yourself
    if (req.params.memberId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself from group' });
    }

    // Check if member exists in group
    const memberToRemove = group.members.find(member => 
      member.userId.toString() === req.params.memberId
    );
    
    if (!memberToRemove) {
      return res.status(404).json({ success: false, message: 'Member not found in group' });
    }

    // Remove member
    group.members = group.members.filter(member => 
      member.userId.toString() !== req.params.memberId
    );
    
    await group.save();
    
    // Return updated members with populated user data
    const updatedGroup = await Group.findById(group._id)
      .populate('members.userId', 'name email avatar _id');
    
    res.json({
      success: true,
      message: 'Member removed successfully',
      data: { 
        members: updatedGroup.members,
        group: updatedGroup 
      }
    });
  } catch (error) {
    console.error('Remove member from group error:', error);
    res.status(500).json({ success: false, message: 'Server error while removing member' });
  }
});


// ==================== DASHBOARD ROUTES ====================

// Get Dashboard Summary
app.get('/api/dashboard/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Monthly expenses and income
    const monthlyExpenses = await Expense.aggregate([
      { $match: { userId: userId, type: 'expense', date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyIncome = await Expense.aggregate([
      { $match: { userId: userId, type: 'income', date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Expenses by category
    const expensesByCategory = await Expense.aggregate([
      { $match: { userId: userId, type: 'expense', date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    // Recent transactions
    const recentTransactions = await Expense.find({ userId: userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    // Active trips and groups
    const activeTrips = await Trip.find({ 
      'members.userId': userId, 
      isActive: true,
      endDate: { $gte: new Date() }
    }).populate('members.userId', 'name email avatar').limit(3);

    const activeGroups = await Group.find({ 
      'members.userId': userId, 
      isActive: true 
    }).populate('members.userId', 'name email avatar').limit(3);

    const totalExpenses = monthlyExpenses[0]?.total || 0;
    const totalIncome = monthlyIncome[0]?.total || 0;
    const budget = req.user.monthlyBudget || 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalExpenses, totalIncome, netSavings: totalIncome - totalExpenses,
          budget, budgetRemaining: budget - totalExpenses,
          budgetUsage: budget > 0 ? (totalExpenses / budget) * 100 : 0
        },
        expensesByCategory, recentTransactions, activeTrips, activeGroups
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching dashboard data' });
  }
});


// ==================== ENHANCED DASHBOARD ROUTES ====================

// Get expense trends for charts
app.get('/api/dashboard/trends', authMiddleware, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const userId = req.user._id;
    
    const currentDate = new Date();
    let startDate, groupFormat;

    switch (period) {
      case 'weekly':
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
        groupFormat = '%Y-%U'; // Year-Week
        break;
      case 'monthly':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
        groupFormat = '%Y-%m'; // Year-Month
        break;
      case 'yearly':
        startDate = new Date(currentDate.getFullYear() - 2, 0, 1);
        groupFormat = '%Y'; // Year
        break;
      default:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
        groupFormat = '%Y-%m';
    }

    // Expense trends
    const expenseTrends = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          type: 'expense',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            period: { $dateToString: { format: groupFormat, date: '$date' } },
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.period': 1 } }
    ]);

    // Income trends
    const incomeTrends = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          type: 'income',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            period: { $dateToString: { format: groupFormat, date: '$date' } },
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.period': 1 } }
    ]);

    // Format data for charts
    const periods = [...new Set([
      ...expenseTrends.map(item => item._id.period),
      ...incomeTrends.map(item => item._id.period)
    ])].sort();

    const expenseData = periods.map(period => {
      const expense = expenseTrends.find(item => item._id.period === period);
      return expense ? expense.total : 0;
    });

    const incomeData = periods.map(period => {
      const income = incomeTrends.find(item => item._id.period === period);
      return income ? income.total : 0;
    });

    res.json({
      success: true,
      data: {
        periods,
        expenseData,
        incomeData,
        netSavings: incomeData.map((income, index) => income - expenseData[index])
      }
    });
  } catch (error) {
    console.error('Dashboard trends error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching trends' });
  }
});

// Get category breakdown
app.get('/api/dashboard/categories', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          type: 'expense',
          date: { $gte: firstDayOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalExpenses = categoryBreakdown.reduce((sum, item) => sum + item.total, 0);

    const categoriesWithPercentage = categoryBreakdown.map(item => ({
      category: item._id,
      total: item.total,
      count: item.count,
      average: item.average,
      percentage: totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0
    }));

    res.json({
      success: true,
      data: {
        categories: categoriesWithPercentage,
        totalExpenses
      }
    });
  } catch (error) {
    console.error('Dashboard categories error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching categories' });
  }
});

// Get recent activity with more details
app.get('/api/dashboard/activity', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const recentTransactions = await Expense.find({ userId: userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(10)
      .lean();

    // Get recent trip and group activities
    const recentTrips = await Trip.find({ 
      'members.userId': userId,
      isActive: true 
    })
    .populate('members.userId', 'name email avatar')
    .sort({ updatedAt: -1 })
    .limit(3)
    .lean();

    const recentGroups = await Group.find({ 
      'members.userId': userId,
      isActive: true 
    })
    .populate('members.userId', 'name email avatar')
    .sort({ updatedAt: -1 })
    .limit(3)
    .lean();

    res.json({
      success: true,
      data: {
        recentTransactions,
        recentTrips,
        recentGroups
      }
    });
  } catch (error) {
    console.error('Dashboard activity error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching activity' });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Expense Tracker Backend Ready!`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
});