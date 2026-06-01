const express = require('express');
const app = express();

// Middleware to automatically parse incoming JSON payloads
app.use(express.json());

/**
 * Core function to group the incoming JSON data by accountName
 * and extract unique attribute values.
 */
function reArrangeData(jsonArray) {
    const groupedData = {};

    jsonArray.forEach(item => {
        const email = item.accountName;
        const value = item.attributeValue;

        // Skip invalid data
        if (!email || !value) return;

        // Initialize array for the email if it doesn't exist
        if (!groupedData[email]) {
            groupedData[email] = [];
        }

        // Keep only unique values per email
        if (!groupedData[email].includes(value)) {
            groupedData[email].push(value);
        }
    });

    // Convert the grouped object into the final array format
    return Object.keys(groupedData).map(email => ({
        accountName: email,
        attributeValues: groupedData[email]
    }));
}

// POST Endpoint that accepts the array and returns the grouped result
app.post('/api/re-arrange', (req, res) => {
    try {
        const inputData = req.body;

        // Validation: Ensure the request body is actually an array
        if (!Array.isArray(inputData)) {
            return res.status(400).json({ 
                error: "Invalid input. Expected a JSON array." 
            });
        }

        // Process the data
        const processedOutput = reArrangeData(inputData);

        // Send back the pure JSON response
        return res.json(processedOutput);

    } catch (error) {
        return res.status(500).json({ 
            error: "An internal server error occurred.", 
            details: error.message 
        });
    }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Web service is running on http://localhost:${PORT}`);
});