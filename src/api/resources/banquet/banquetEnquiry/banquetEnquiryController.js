import * as BanquetEnquiryService from './banquetEnquiryService';
import { getPagination, getPagingData } from '../../pagination/index';

export const getAllBanquetEnquiries = async (req, res) => {
    try {
        const { propertyId, enquiryCode, enquiryType, functionType, status, eventDate, page, size } = req.query;
        // const { } = req.query;
        const { limit, offset } = getPagination(page, size);
        const enquiries = await BanquetEnquiryService.getAllBanquetEnquiries(propertyId, enquiryCode, enquiryType, functionType, status, eventDate, limit, offset);
        return res.status(200).send({ success: true, ...getPagingData(enquiries, page, limit), message: 'fetched banquet enquiry succesfully', })

    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
};

export const getBanquetEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;
        const enquiry = await BanquetEnquiryService.getBanquetEnquiryById(id);
        return res.status(200).send({ success: true, message: 'fetch succesfully', data: enquiry })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBanquetEnquiry = async (req, res) => {
    try {
        const enquiryData = req.body;
        const newEnquiry = await BanquetEnquiryService.createBanquetEnquiry(enquiryData);
        return res.status(201).send({success: true, message: 'created banquet enquiry succesfully', data: newEnquiry})
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
};

export const updateBanquetEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const enquiryData = req.body;
        const updatedEnquiry = await BanquetEnquiryService.updateBanquetEnquiry(id, enquiryData);
        return res.status(200).send({ success: true, message: 'fetch succesfully', data: updatedEnquiry })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBanquetEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        await BanquetEnquiryService.deleteBanquetEnquiry(id);
        return res.status(200).send({ success: true, message: 'deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const downloadBanquetEnquiryReport = async (req, res) => {
    try {


        const workbook = await BanquetEnquiryService.downloadBanquetEnquiryReport(req.query);
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=banquet_enquiry_report.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}