import { db } from '../../../models';
const functionModel = db.Function;


// Create a new function
export const createFunction = async ({ propertyId, functionName }) => {
    try {
        return await functionModel.create({ propertyId, functionName });
    } catch (error) {
        throw new Error('Unable to create function');
    }
};

// Get all functions
export const getAllFunctions = async () => {
    try {
        return await functionModel.findAll();
    } catch (error) {
        throw new Error('Unable to fetch functions');
    }
};

// Get function by ID
export const getFunctionById = async (id) => {
    try {
        const functionItem = await functionModel.findByPk(id);
        if (!functionItem) {
            throw new Error('Function not found');
        }
        return functionItem;
    } catch (error) {
        throw new Error('Unable to fetch function');
    }
};

// Update function by ID
export const updateFunctionById = async (id, updates) => {
    try {
        const [updatedRowsCount, updatedRows] = await functionModel.update(updates, {
            where: { id },
            returning: true,
        });
        if (updatedRowsCount === 0) {
            throw new Error('Function not found');
        }
        return updatedRows[0];
    } catch (error) {
        throw new Error('Unable to update function');
    }
};

// Delete function by ID
export const deleteFunctionById = async (id) => {
    try {
        const deletedRowCount = await functionModel.destroy({ where: { id } });
        if (deletedRowCount === 0) {
            throw new Error('Function not found');
        }
    } catch (error) {
        throw new Error('Unable to delete function');
    }
};


// Get functions by propertyId
export const getFunctionsByPropertyId = async (propertyId) => {
    try {
        return await functionModel.findAll({ where: { propertyId } });
    } catch (error) {
        throw new Error('Unable to fetch functions by propertyId');
    }
};

