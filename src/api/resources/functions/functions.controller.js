import * as functionsService from './functions.service';

// Create a new function
export const createFunction = async (req, res) => {
    const { propertyId, functionName } = req.body;
    try {
        const newFunction = await functionsService.createFunction({ propertyId, functionName });
        return res.status(201).send({success: true, message: 'function created successfully', data: newFunction})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

// Get all functions
export const getAllFunctions = async (req, res) => {
    try {
        const functions = await functionsService.getAllFunctions();
        return res.status(200).send({success: true, message: 'functions list fetched successfully', data: functions})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

// Get function by ID
export const getFunctionById = async (req, res) => {
    const { id } = req.params;
    try {
        const functionItem = await functionsService.getFunctionById(id);
        return res.status(200).send({success: true, message: 'functions by id fetched successfully', data: functionItem})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

// Update function by ID
export const updateFunctionById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedFunction = await functionsService.updateFunctionById(id, updates);
        return res.status(200).send({success: true, message: 'updated successfully', data: updatedFunction})
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

// Delete function by ID
export const deleteFunctionById = async (req, res) => {
    const { id } = req.params;
    try {
        await functionsService.deleteFunctionById(id);
        return res.status(200).send({success: true, message: 'deleted successfully' })
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

// Get functions by propertyId
export const getFunctionsByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const functions = await functionsService.getFunctionsByPropertyId(propertyId);
        return res.status(200).send({success: true, message: 'functions by propertyId fetched successfully', data: functions })
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};
