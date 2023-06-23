const { Wallets } = require("fabric-network");
const path = require('path');
const fs = require('fs');

const walletPath = './wallet'

async function addToWallet() {
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identityLabel = 'user1';
    const certificatePath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'); // Path to the user's certificate file
    const privateKeyPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp', 'keystore', 'f7d2c5bc1f7e91d3c8578a2c8c37dab7a91017ee71f1693a45269765aa73e5a9_sk'); // Path to the user's private key file

    const certificate = await fs.promises.readFile(certificatePath, 'utf8');
    const privateKey = await fs.promises.readFile(privateKeyPath, 'utf8');

    const identity = {
        credentials: {
            certificate,
            privateKey,
        },
        mspId: 'Org1MSP', // MSP ID of the organization
        type: 'X.509',
    };

    await wallet.put(identityLabel, identity);
    console.log('Identity added to wallet.');
}

addToWallet();