import EnquiryService from "./enquiry.service";
import { db } from '../../../models';
import {sendEnquiryForPropertyOnboard} from '../../../config/smpt'

const get = async (req, res, next) => {
    try {
        const { enquiry_id, user_id } = req.query;
        const Enquiry = await EnquiryService.get(
            enquiry_id,
            user_id
        );
        if (Enquiry) {
            return res.status(200).json({
                status: true,
                msg: "Enquiry fetched successfully",
                data: Enquiry
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const create = async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            mobile,
            email,
            property_name,
            address_line_1,
            address_line_2,
            state_id,
            city,
            pincode
        } = req.body;
        const getStateName = await db.states.findOne({ where: { id: state_id } });
        const getCityName = await db.cities.findOne({ where: { id: city } });
        const Enquiry = await EnquiryService.create(
            first_name,
            last_name,
            mobile,
            email,
            property_name,
            address_line_1,
            address_line_2,
            state_id,
            city,
            pincode
        );
        let name = `${first_name} ${last_name}`;
        let address = `${address_line_1} ${address_line_2 ? ", " + address_line_2 : ""}`;
        let state = getStateName?.name || "Unknown State";
        let cityName = getCityName?.name || "Unknown City";
        if (Enquiry) {
            await Promise.allSettled([sendEnquiryForPropertyOnboard(email, name, mobile, property_name,
                address, state, cityName, pincode)])
            return res.status(201).json({
                status: true,
                msg: "Enquiry created successfully",
                data: Enquiry
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            first_name,
            last_name,
            mobile,
            email,
            property_name,
            address_line_1,
            address_line_2,
            state_id,
            city,
            pincode,
            remark
        } = req.body;
        const Enquiry = await EnquiryService.update(
            id,
            first_name,
            last_name,
            mobile,
            email,
            property_name,
            address_line_1,
            address_line_2,
            state_id,
            city,
            pincode,
            remark
        );
        if (Enquiry[0]) {
            return res.status(200).json({
                status: true,
                msg: "Enquiry updated successfully",
                data: []
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const remark = async (req, res, next) => {
    try {
        const { id, assign_to } = req.params;
        const { remark } = req.body;
        const Enquiry = await EnquiryService.remark(
            id,
            assign_to,
            remark
        );
        if (Enquiry[0]) {
            return res.status(200).json({
                status: true,
                msg: "Enquiry remark added successfully",
                data: []
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const assign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { assign_to } = req.body;
        const Enquiry = await EnquiryService.assign(
            id,
            assign_to
        );
        if (Enquiry[0]) {
            return res.status(200).json({
                status: true,
                msg: "Enquiry assigned successfully",
                data: []
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const Enquiry = await EnquiryService.destroy(id);
        if (Enquiry) {
            return res.status(200).json({
                status: true,
                msg: "Enquiry deleted successfully",
                data: []
            });
        }
        return res.status(500).json({
            status: false,
            msg: "Internal server error"
        });
    } catch (error) {
        return res.status(error?.code ? error.code : 500).json({
            status: false,
            msg: error?.message
        });
    }
}

export default { get, create, update, remark, assign, destroy };