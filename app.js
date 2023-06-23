const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Create an Express app
const app = express();
app.use(express.json());

// Configure the connection profile and network
const connectionProfilePath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');

// Configure the file system wallet
const resolveWallet = (org) => {
    const walletPath = path.resolve(__dirname, 'org1-wallet');
}

// Configuration for the contract and channel
const contractName = 'private';
const channelName = 'mychannel';

// Utility function to handle errors
function handleError(res, error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
}

// Endpoint to invoke the initLedger function
app.get('/api/initLedger', async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        await gateway.connect(JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')), {
            wallet: wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });

        // Access the network
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(contractName);

        // Invoke the initLedger function
        await contract.submitTransaction('initLedger');

        // Disconnect from the gateway
        await gateway.disconnect();

        res.status(200).json({ message: 'Ledger initialized successfully.' });
    } catch (error) {
        handleError(res, error);
    }
});

// Endpoint to invoke the getMedicalData function
app.get('/api/medicaldata/:id', async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        await gateway.connect(JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')), {
            wallet: wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(contractName);

        // Invoke the getMedicalData function
        const id = req.params.id;
        const result = await contract.evaluateTransaction('getMedicalData', id);

        // Disconnect from the gateway
        await gateway.disconnect();

        res.status(200).json(JSON.parse(result.toString()));
    } catch (error) {
        handleError(res, error);
    }
});

// Endpoint to invoke the getMedicalDataByPatientID function
app.get('/api/medicaldata/patient/:patientID', async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        await gateway.connect(JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')), {
            wallet: wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });

        // Access the network
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(contractName);

        // Invoke the getMedicalDataByPatientID function
        const patientID = req.params.patientID;
        const result = await contract.evaluateTransaction('getMedicalDataByPatientID', patientID);

        // Disconnect from the gateway
        await gateway.disconnect();

        res.status(200).json(JSON.parse(result.toString()));
    } catch (error) {
        handleError(res, error);
    }
});

// Endpoint to invoke the createMedicalData function
app.post('/api/medicaldata', async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        await gateway.connect(JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')), {
            wallet: wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });

        // Access the network
        console.log("Here");
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(contractName);

        // Invoke the createMedicalData function
        const { id, patientID, patientName, diagnosis, medications } = req.body;
        await contract.submitTransaction('createMedicalData', id, patientID, patientName, diagnosis, medications);
        await gateway.disconnect();

        res.status(200).json({ message: 'Medical data created successfully.' });
    } catch (error) {
        handleError(res, error);
    }
});

// Endpoint to invoke the transferMedicalData function
app.put('/api/medicaldata/:id', async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        await gateway.connect(JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')), {
            wallet: wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });
        // Access the network
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(contractName);

        // Invoke the transferMedicalData function
        const id = req.params.id;
        const newOwner = req.body.newOwner;
        await contract.submitTransaction('transferMedicalData', id, newOwner);

        // Disconnect from the gateway
        await gateway.disconnect();

        res.status(200).json({ message: 'Medical data transferred successfully.' });
    } catch (error) {
        handleError(res, error);
    }
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
