// controllers/menuItemController.js
import { db } from '../../../models';

// Category
export const createExpCate = async (req, res) => {
    const { categoryName } = req.body;
    try {
        const newCategory = await db.ExpenceCategory.create({ categoryName });
        return res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        console.error("Error creating Expense Category:", error);
        return res.status(500).json({ success: false, message: "Unable to create Expense Category" });
    }
};

export const getAllExpenceCat = async (req, res) => {
    try {
        const selection = {
            order: [['createdAt', 'ASC']],
            where: { status: 0 },
            attributes: ['id', 'categoryName', 'status'],
            include: [{
                model: db.ExpenceSubCategory,
                attributes: ['id', 'subCategoryName', 'status']
            }]
        };
        const categories = await db.ExpenceCategory.findAll(selection);
        return res.status(200).send({ success: true, message: 'Category list fetched successfully', data: categories })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getExpCatById = async (req, res) => {
    const { id } = req.params;
    try {
        const categoryById = await db.ExpenceCategory.findByPk(id, {
            attributes: ['id', 'categoryName', 'status'], include: [{
                model: db.ExpenceSubCategory,
                attributes: ['id', 'subCategoryName', 'status'] // Select relevant fields
            }]
        });
        if (!categoryById) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Category details fetched successfully",
            data: categoryById
        });
    } catch (error) {
        console.error("Error fetching Expense Category:", error);
        return res.status(500).json({ success: false, message: "Unable to fetch Expense Category" });
    }
};

export const updateExpCatById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log("updates - ", req.body);
        const category = await db.ExpenceCategory.findByPk(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        const updateCat = await db.ExpenceCategory.update(req.body, { where: { id } });
        return res.status(200).json({
            success: true,
            message: "Updated successfully",
            daya: updateCat
        });
    } catch (error) {
        console.error("Error updating Expense Category:", error);
        return res.status(500).json({ success: false, message: "Unable to update Expense Category" });
    }
};

// Sub-Category
export const createExpSubCate = async (req, res) => {
    const { expenceCatId, subCategoryName } = req.body;
    try {
        const newCategory = await db.ExpenceSubCategory.create({ expenceCatId, subCategoryName });
        return res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        console.error("Error creating Expense Sub Category:", error);
        return res.status(500).json({ success: false, message: "Unable to create Expense Sub Category" });
    }
};

export const getAllExpenceSubCat = async (req, res) => {
    try {
        const selection = {
            order: [['createdAt', 'ASC']],
            where: { status: 0 },
            attributes: ['id', 'expenceCatId', 'subCategoryName', 'status'],
            include: [{
                model: db.ExpenceCategory,
                attributes: ['id', 'categoryName']
            }]
        };
        const categories = await db.ExpenceSubCategory.findAll(selection);
        return res.status(200).send({ success: true, message: 'Sub Category list fetched successfully', data: categories })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getExpSubCatById = async (req, res) => {
    const { id } = req.params;
    try {
        const categoryById = await db.ExpenceSubCategory.findByPk(id, {
            attributes: ['id', 'expenceCatId', 'subCategoryName', 'status'],
            include: [{
                model: db.ExpenceCategory,
                attributes: ['id', 'categoryName']
            }]
        });
        if (!categoryById) {
            return res.status(404).json({ success: false, message: "sub Category not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Sub Category details fetched successfully",
            data: categoryById
        });
    } catch (error) {
        console.error("Error fetching Expense sub Category:", error);
        return res.status(500).json({ success: false, message: "Unable to fetch Expense sub Category" });
    }
};

export const updateExpSubCatById = async (req, res) => {
    const { id } = req.params;
    try {
        const subcategory = await db.ExpenceSubCategory.findByPk(id);
        if (!subcategory) {
            return res.status(404).json({ success: false, message: "Sub Category not found" });
        }
        const updateSubCat = await db.ExpenceSubCategory.update(req.body, { where: { id } });
        return res.status(200).json({
            success: true,
            message: "Updated successfully",
            daya: updateSubCat
        });
    } catch (error) {
        console.error("Error updating Expense Sub Category:", error);
        return res.status(500).json({ success: false, message: "Unable to update Expense Sub Category" });
    }
};
