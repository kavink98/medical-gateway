const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Create an Express app
const app = express();
app.use(cors(), express.json());

// Configure the connection profile and network
const connectionProfilePath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');

// Configure the file system wallet
const walletPath = (org) => {
    return path.resolve(__dirname, `${org}-wallet`);
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
        const org = req.header('org')
        const wallet = await Wallets.newFileSystemWallet(walletPath(org));
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
        const response = await contract.submitTransaction('initLedger');
        res.status(200).json({ message: 'Ledger initialized successfully.', response: response.toString() });

    } catch (error) {
        handleError(res, error);
    }
});

app.get('/api/medicaldata', async (req, res) => {
    try {
      const org = req.header('org');
      const wallet = await Wallets.newFileSystemWallet(walletPath(org));
      const gateway = new Gateway();
      await gateway.connect(
        JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')),
        {
          wallet: wallet,
          identity: 'admin',
          discovery: { enabled: true, asLocalhost: true },
        }
      );
  
      // Access the network
      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(contractName);
  
      // Invoke the getMedicalRecordsByProvider function
      const providerID = req.params.providerID;
      const result = await contract.evaluateTransaction(
        'getAllMedicalData',
      );
  
      // Disconnect from the gateway
      await gateway.disconnect();
  
      res.status(200).json(JSON.parse(result.toString()));
    } catch (error) {
      handleError(res, error);
    }
  });

app.delete('/api/medicaldata/:id', async (req, res) => {
    try {
        const org = req.header('org')
        const wallet = await Wallets.newFileSystemWallet(walletPath(org));
        const gateway = new Gateway();
        await gateway.connect(JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')), {
            wallet: wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(contractName);

        const id = req.params.id;
        const result = await contract.submitTransaction('deletePublicData', id);

        // Disconnect from the gateway

        res.status(200).json({message: "Date removed from public ledger"});
    } catch (error) {
        handleError(res, error);
    }
});

app.get('/api/medicaldata/:id', async (req, res) => {
    try {
        const org = req.header('org')
        const wallet = await Wallets.newFileSystemWallet(walletPath(org));
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
        const org = req.header('org')
        const wallet = await Wallets.newFileSystemWallet(walletPath(org));
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
        const org = req.header('org')
        const wallet = await Wallets.newFileSystemWallet(walletPath(org));
        const gateway = new Gateway();
        await gateway.connect(JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')), {
            wallet: wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });

        // Access the network
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(contractName);

        // Invoke the createMedicalData function
        const { id, patientID, patientName, diagnosis, medications } = req.body;
        await contract.submitTransaction('createMedicalData', id, patientID, patientName, diagnosis, medications);

        res.status(200).json({ message: 'Medical data created successfully.' });
    } catch (error) {
        handleError(res, error);
    }
});

app.get('/api/medicaldata/:id/transfer', async (req, res) => {
    try {
      const org = req.header('org');
      const wallet = await Wallets.newFileSystemWallet(walletPath(org));
      const gateway = new Gateway();
      await gateway.connect(
        JSON.parse(fs.readFileSync(connectionProfilePath, 'utf-8')),
        {
          wallet: wallet,
          identity: 'admin',
          discovery: { enabled: true, asLocalhost: true },
        }
      );
  
      // Access the network
      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(contractName);
  
      // Invoke the transferMedicalData function
      const id = req.params.id;
      const response = await contract.submitTransaction('transferMedicalData', id);
  
      res.status(200).json({ message: 'Medical data transferred successfully.', response: response.toString() });
    } catch (error) {
      handleError(res, error);
    }
  });

// Start the Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
