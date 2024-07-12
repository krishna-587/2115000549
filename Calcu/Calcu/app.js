const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


let storedNumbers = [];


const WINDOW_SIZE = 10;

const calculateAverage = (arr) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, num) => acc + num, 0);
    return sum / arr.length;
};


const fetchNumbers = async () => {
    try {
        const response = await axios.get('http://third-party-server-api-url');
        if (response.status === 200) {
            const numbers = response.data.numbers || [];
        
            const uniqueNumbers = Array.from(new Set(numbers.map(Number)));
            return uniqueNumbers.slice(0, WINDOW_SIZE); 
        } else {
            throw new Error('Failed to fetch numbers');
        }
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        return [];
    }
};


app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

  
    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: 'Invalid numberid. Allowed: p, f, e, r' });
    }

    try {
        
        const fetchedNumbers = await fetchNumbers();

        
        const average = calculateAverage(storedNumbers);

        
        storedNumbers = fetchedNumbers;

        
        const response = {
            windowPrevState: [...storedNumbers],
            windowCurrState: [...storedNumbers],
            numbers: fetchedNumbers,
            avg: average.toFixed(2)
        };

        
        res.json(response);
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
