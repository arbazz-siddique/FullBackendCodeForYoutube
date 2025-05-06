import mongoose from "mongoose";

import GroupModel from "../Models/GroupModel.js";

export const creategroup = async (req, res) => {
    const groupData = req.body;
    const newGroup = new GroupModel(groupData);
    try {
        await newGroup.save();
        res.status(200).json({ message: "Group Created Successfully!", group: newGroup });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getallgroups = async (req, res) => {
    try {
        const groups = await GroupModel.find().populate("members", "username email");
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const joingroup = async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid Group ID." });
    }

    try {
        const group = await GroupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }

        res.status(200).json({ message: "Joined group successfully!", group });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const leavegroup = async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Group ID." });
    }

    try {
        const group = await GroupModel.findById(id);
        if (!group) return res.status(404).json({ message: "Group not found" });

        group.members = group.members.filter(member => member.toString() !== userId);
        await group.save();

        res.status(200).json({ message: "Left the group successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


export const deletegroup = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Group ID." });
    }

    try {
        const deletedGroup = await GroupModel.findByIdAndDelete(id);
        if (!deletedGroup) {
            return res.status(404).json({ message: "Group not found!" });
        }

        res.status(200).json({ message: "Group deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const searchGroups = async (req, res) => {
    const { query } = req.query;

    try {
        const groups = await GroupModel.find({ name: { $regex: query, $options: "i" } });
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const sendMessage = async (req, res) => {
    const { groupId } = req.params;
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ message: "User ID and message are required" });
    }

    try {
        const group = await GroupModel.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        group.messages.push({ userId, text: message });
        await group.save();

        res.status(200).json({ message: "Message sent successfully", messages: group.messages });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const getMessages = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await GroupModel.findById(groupId).populate("messages.userId", "username email");
        if (!group) return res.status(404).json({ message: "Group not found" });

        res.status(200).json({ messages: group.messages });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
