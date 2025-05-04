import express from 'express';
import Journal from './journal.js';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.RAG_MICROSERVICE_BASE_URL

const router = express.Router();


////////////////////////////////////
//ENDPOINTS
///////////////////////////////////

//SEND REQUEST TO RAG MICROSERVICE TO PROCESS JOURNAL DATA
router.post('/api/chatbox/embed_journals', async(req,res) => {
    try {
        const response = await fetch(`${url}/rag/process_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
    res.status(500).json({ error: "Failed to send journals data to RAG Microservice" });
    }
});


//SEND REQUEST TO RAG MICROSERVICE TO RETRIEVE CONTEXT
router.post('/api/chatbox/get_context', async(req,res) => {
    try {
        const response = await fetch(`${url}/rag/get_context`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.json(data.context);
    } catch (err) {
        console.error(err);
    res.status(500).json({ error: "Failed to get context from RAG Microservice" });
    }
});


// GET JOURNAL YEAR RANGE
router.get('/api/get_journal_years', async(req,res) => {
    try {
        const years = await Journal.aggregate([
            {
                $group: {
                    _id: null,
                    minDate: {$min: "$j_date"},
                    maxDate: {$max: "$j_date"}
                }
            },
            {
                $project: {
                    _id: 0,
                    minYear: {$year: "$minDate"},
                    maxYear: {$year: "$maxDate"}
                }
            }
        ]);

        if (years.length === 0) {
            return res.status(200).json({minYear: null, maxYear: null});
        }

        const {minYear, maxYear} = years[0];
        res.status(200).json({minYear, maxYear});

    } catch (err) {
        console.error('Error getting year range:', err);
        res.status(500).json({ message: 'Error fetching year range', error: err.message });
    }
});


//GET LIST OF ALL JOURNALS
router.get('/api/get_all_journals', async(req, res) => {
    try {
        const journals = await Journal.find().sort({j_date: -1});
        res.status(200).json({ status: 200, message: 'success', journals });
    } catch (err) {
        console.error('Error fetching journals:', err);
        res.status(500).json({ status: 500, message: 'Error fetching journals', error: err.message });
    }
});


//GET JOURNALS FROM SELECTED YEAR
router.get('/api/get_journals', async(req, res) => {
    try {
        const year = parseInt(req.query.year);

        let query = {};
        if (!isNaN(year)) {
            const yearStart = new Date(`${year}-01-01`);
            const yearEnd = new Date(`${year + 1}-01-01`);

            query = {j_date: {$gte: yearStart, $lt: yearEnd}};
        }

        const journals = await Journal.find(query).sort({j_date: -1});
        res.status(200).json({ status: 200, message: 'success', journals });
    } catch (err) {
        console.error('Error fetching journals:', err);
        res.status(500).json({ status: 500, message: 'Error fetching journals', error: err.message });
    }
});


//SEARCH JOURNAL BY TAGS
router.post('/api/search_journal', async(req,res) => {
    try {
        const {j_tags} = req.body.journal;

        if (!Array.isArray(j_tags)) {
            return res.status(400).json({ status: 400, message: 'Tags must be an array' });
        }

        const query = { j_tags: {$in: j_tags}};
        const journals = await Journal.find(query).sort({j_date: -1});
        res.status(200).json({ status:200, message: 'success', journals});
    } catch (err) {
        console.error('Error fetching journals by tags:', err);
        res.status(500).json({ status: 500, message: 'Error fetching journals by tags', error: err.message });
    }
});


//CREATE A JOURNAL
router.post('/api/create_journal', async(req,res) => {
    try {
        const response = await Journal.create(req.body.journal)
        res.status(200).json({ status: 200, message: 'successfully added journal' });
    } catch (err) {
        console.error('Error creating journal:', err);
        res.status(500).json({ status: 500, message: 'Error creating journal', error: err.message });
    }
});


//UPDATE A JOURNAL
router.put('/api/update_journal/:id', async(req,res) => {
    try {
        const j_id = req.params.id;
        const updatedJournal = req.body.journal;

        const response = await Journal.findByIdAndUpdate(j_id, updatedJournal, {new: true});

        if (!response) {
            return res.status(404).json({ status: 404, message: 'Journal not found' });
        }
        res.status(200).json({ status: 200, message: 'successfully updated journal' });
    } catch (err) {
        console.error('Error updating journal:', err);
        res.status(500).json({ status: 500, message: 'Error updating journal', error: err.message });
    }
});


//DELETE A JOURNAL
router.delete('/api/delete_journal/:id', async(req,res) => {
    try {
        const j_id = req.params.id;
        const response = await Journal.findByIdAndDelete(j_id);

        if (!response) {
            return res.status(404).json({ status: 404, message: 'Journal not found' });
        }
        res.status(200).json({ status: 200, message: 'successfully deleted journal' });
    } catch (err) {
        console.error('Error deleting journal:', err);
        res.status(500).json({ status: 500, message: 'Error deleting journal', error: err.message });
    }
});


export default router;