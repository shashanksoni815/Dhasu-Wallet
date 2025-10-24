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