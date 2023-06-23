const {Wallets} = require("fabric-network");

const walletPath = './wallet'; // Specify the path where you want to create the wallet

async function createWallet() {
  try {

    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log('Wallet created successfully.');
  } catch (error) {
    console.error('Failed to create wallet:', error);
  }
}

createWallet();