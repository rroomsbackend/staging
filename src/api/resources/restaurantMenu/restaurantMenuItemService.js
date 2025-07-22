import { db } from '../../../models';

const RestaurantMenuItem = db.RestaurantMenuItem;

export const createRestaurantMenuItem = async (items) => {
    
    // items = JSON.parse(items)
    console.log("items in service", items);
        try {
            const dataArray = [];
    
            if (!items || items.length === 0) {
                throw new Error('Incorrect payload');
            }
    
            for (const element of items) {
                const { name, price, quantity, gstType, gstPercent } = element;
                const L = price / (parseFloat(gstPercent) + 100) * 100;
                const TAX_AMOUNT = gstType === "INC" ? price - L : (price * gstPercent) / 100;
                const INCLUSIVE_TAX_AMOUNT = gstType === "INC" ? L + TAX_AMOUNT : price + TAX_AMOUNT;
                const FINAL_PRICE = quantity * INCLUSIVE_TAX_AMOUNT;
                const GST_AMOUNT = TAX_AMOUNT * quantity;
                const AMOUT_BEFOR_TAX = FINAL_PRICE - TAX_AMOUNT;
                const INC_GST_PRICE = AMOUT_BEFOR_TAX + GST_AMOUNT;
                const itemCode = Math.round(Math.random() * (999999 - 9999) + 9999);
    
                dataArray.push({
                    name: name,
                    price: price,
                    itemCode: "FOOD_ITEM" + itemCode?.toString(),
                    gstType: gstType,
                    gstPercent: gstPercent,
                    taxAmount: Number(TAX_AMOUNT?.toFixed(2)),
                    inclusiveTaxAmount: Number(INCLUSIVE_TAX_AMOUNT?.toFixed(2)),
                    finalPrice: Number(Math.round(FINAL_PRICE?.toFixed(2))),
                    gstAmount: Number(GST_AMOUNT?.toFixed(2)),
                    amountBeforeTax: Number(AMOUT_BEFOR_TAX?.toFixed(2)),
                    incGstPrice: Number(INC_GST_PRICE?.toFixed(2)),
                    quantity: quantity
                });
            }
            return await db.RestaurantMenuItem.bulkCreate(dataArray);
            
        } catch (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    };


export const getRestaurantMenuItems = async (search) => {
    try {

        let whereCondition = {
            deletedAt: null,
        };

        if (search) {
            whereCondition.name = { [db.Sequelize.Op.like]: `%${search}%` };
        }

        return await RestaurantMenuItem.findAll({
            order: [
                ['id', 'DESC'],
                ['updatedAt', 'DESC']
            ],
            where: whereCondition,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Could not fetch restaurant menu items');
    }
};

export const getRestaurantMenuItemById = async (id) => {
    try {
        return await RestaurantMenuItem.findByPk(id);
    } catch (error) {
        throw new Error('Could not fetch restaurant menu item');
    }
};



export const updateRestaurantMenuItem = async (itemId, updatedItemData) => {
    try {
        const existingItem = await RestaurantMenuItem.findByPk(itemId);

        if (!existingItem) {
            throw new Error('Item not found');
        }

        const { name, price, quantity, gstType, gstPercent } = updatedItemData;
        const L = price / (parseFloat(gstPercent) + 100) * 100;
        const TAX_AMOUNT = gstType === "INC" ? price - L : (price * gstPercent) / 100;
        const INCLUSIVE_TAX_AMOUNT = gstType === "INC" ? L + TAX_AMOUNT : price + TAX_AMOUNT;
        const FINAL_PRICE = quantity * INCLUSIVE_TAX_AMOUNT;
        const GST_AMOUNT = TAX_AMOUNT * quantity;
        const AMOUT_BEFOR_TAX = FINAL_PRICE - TAX_AMOUNT;
        const INC_GST_PRICE = AMOUT_BEFOR_TAX + GST_AMOUNT;
        const itemCode = Math.round(Math.random() * (999999 - 9999) + 9999);

        const updatedItem = await existingItem.update({
            name: name,
            price: price,
            itemCode: "FOOD_ITEM" + itemCode?.toString(),
            gstType: gstType,
            gstPercent: gstPercent,
            taxAmount: Number(TAX_AMOUNT?.toFixed(2)),
            inclusiveTaxAmount: Number(INCLUSIVE_TAX_AMOUNT?.toFixed(2)),
            finalPrice: Number(Math.round(FINAL_PRICE?.toFixed(2))),
            gstAmount: Number(GST_AMOUNT?.toFixed(2)),
            amountBeforeTax: Number(AMOUT_BEFOR_TAX?.toFixed(2)),
            incGstPrice: Number(INC_GST_PRICE?.toFixed(2)),
            quantity: quantity
        });

        return updatedItem;
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
};

export const deleteRestaurantMenuItem = async (id) => {
    try {
        return await RestaurantMenuItem.destroy({
            where: { id }
        });
    } catch (error) {
        throw new Error(error.message);
    }
};
