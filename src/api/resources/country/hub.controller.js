import { db } from '../../../models';
export default {
    async create(req, res) {
        try {
            const { hubname, state_id } = req.body;
            const newHub = await db.Hub.create({ hubname, state_id });
            return res.status(200).json({ data: newHub, status: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create hub', details: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { hubname, state_id } = req.body;
            const hub = await db.Hub.findByPk(id);
            if (!hub) {
                return res.status(404).json({ error: 'Hub not found' });
            }
            await hub.update(req.body);
            return res.status(200).json({ data: hub, status: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update hub', details: error.message });
        }
    },

    async getHubsByStateId(req, res) {
        try {
            const { state_id } = req.params;
            const state = await db.states.findOne({
                where: { id: state_id },
                attributes: ['id', 'name'],
                include: {
                    model: db.Hub,
                    attributes: ['id', 'hubname'],
                },
            });
            if (!state) {
                return res.status(404).json({ error: 'State not found' });
            }
            return res.status(200).json({ data: state, status: true });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to fetch state with hubs',
                details: error.message,
            });
        }
    },

    async getAllZone(req, res) {
        try {
            const zone = await db.Zone.findAll();
            if (!zone) {
                return res.status(404).json({ error: 'zone not found' });
            }
            return res.status(200).json({ data: zone, status: true });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to fetch zone',
                details: error.message,
            });
        }
    },

async getCitiesByHubId(req, res) {
        try {
            const { hub_id } = req.params;
            const city = await db.cities.findAll({
                where: { hub_id },
                attributes: ['id', 'name', 'state_id', 'state_code', 'country_id'],
            });
            if (!city) {
                return res.status(404).json({ error: 'city not found' });
            }
            return res.status(200).json({ data: city, status: true });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to fetch city with hubs',
                details: error.message,
            });
        }
    },

	async getStateByZoneId(req, res) {
        try {
            const { zone_id } = req.params;

            if (!zone_id) {
                return res.status(400).json({ error: 'zone id is required' });
            }

            const states = await db.states.findAll({
                where: { zone_id }, // Assuming 'zone_id' is the foreign key in the 'State' model
                attributes:['id','name','iso2','country_id']
            });

            if (!states || states.length === 0) {
                return res.status(404).json({ error: 'No states found for this zone' });
            }

            return res.status(200).json({ data: states, status: true });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to fetch states by zone id',
                details: error.message,
            });
        }
    },
};