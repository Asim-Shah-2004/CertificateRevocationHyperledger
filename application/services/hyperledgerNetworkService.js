"use strict";

import { Gateway, Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import path from "path";

import { buildCAClient, registerAndEnrollUser, enrollAdmin } from "../../../test-application/javascript/CAUtil.js";
import { buildCCPOrg1, buildWallet } from "../../../test-application/javascript/AppUtil.js";

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chaincodeName = process.env.CHAINCODE_NAME || "basic";
const mspOrg1 = "Org1MSP";
const walletPath = path.join(path.resolve(), "wallet");
const org1UserId = "javascriptAppUser";

let gateway = null;

// Function to connect to the Hyperledger network
const connectToHyperledger = async () => {
  if (gateway && gateway.getIdentity()) {
    console.log("Using existing gateway connection");
    const network = await gateway.getNetwork(channelName);
    return network;
  }

  try {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
    const wallet = await buildWallet(Wallets, walletPath);
    await enrollAdmin(caClient, wallet, mspOrg1);
    await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, "org1.department1");

    gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    console.log("New gateway connection established");
    const network = await gateway.getNetwork(channelName);
    return network;
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
    process.exit(1);
  }
};

export default connectToHyperledger;
