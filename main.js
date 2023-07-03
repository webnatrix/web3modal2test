import { 
  configureChains, 
  createConfig,
  getAccount,
  getNetwork,
  watchAccount,
  watchNetwork,
  getContract,
  writeContract,
  getWalletClient
} from '@wagmi/core';

import { bscTestnet } from '@wagmi/chains';

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/html";

import { createWalletClient, custom } from 'viem';

const projectId = ''

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    bscTestnet
  ],
  [w3mProvider({ projectId, version: 2 })]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ chains, version: 2, projectId }),
  publicClient,
  webSocketPublicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export const web3Modal = new Web3Modal(
  {
    projectId,
    defaultChain: bscTestnet,
    version: 2,
    themeMode: 'dark',
  },
  ethereumClient
);

export const w3wallet = createWalletClient({
  account: getAccount()['address'],
  chain: getNetwork()['chain'],
  transport: custom(window.ethereum)
})

window.getAccount = getAccount();
window.getNetwork = getNetwork();
window.getContract = getContract;
window.writeContract = writeContract;
window.w3wallet = w3wallet


//Проверка подключения кошелька
var statusOld = "";
watchAccount(
  ({status}) => {
    if(statusOld=="connecting" && status=="connected"){
      window.location.reload();
    }
    if(statusOld=="connected" && status=="disconnected"){
      window.location.reload();
    }
    statusOld = status
  }
);

//Проверка смены кошелька
var networkOld = "";
watchNetwork((network) => {
  if (typeof network.chain !== "undefined") {
    if(networkOld!=="" && networkOld!==network.chain.id){
      window.location.reload();
    }
    networkOld = network.chain.id
  }
});

//Провека смены аккаунта
var accountOld = "";
watchAccount((account) => {
  if (typeof account.address !== "undefined") {

    if(accountOld!=="" && accountOld!==account.address){
      window.location.reload();
    }
    accountOld = account.address
  }
})