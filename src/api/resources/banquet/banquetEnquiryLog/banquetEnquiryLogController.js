import * as EnquiryLogService from './banquetEnquiryLogService';

export const createEnquiryLog = async (req, res) => {
    try {
        const logData = req.body;
        const newLog = await EnquiryLogService.createEnquiryLog(logData);
        return res.status(201).send({success: true, message: 'created succesfully', data: newLog})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnquiryLogsByBanquetEnquiry = async (req, res) => {
    try {
        const { propertyId, banquetEnquiryId } = req.query;
        const logs = await EnquiryLogService.getEnquiryLogsByBanquetEnquiry(propertyId, banquetEnquiryId);
        return res.status(200).send({success: true, message: 'enuiry logs fetched successfully', data: logs})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
