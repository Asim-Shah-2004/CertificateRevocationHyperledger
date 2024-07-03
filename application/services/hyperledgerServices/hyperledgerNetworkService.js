"use strict";

import { Gateway, Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import path from "path";

import { buildCAClient, registerAndEnrollUser, enrollAdmin } from "../../utils/CAUtil.js";
import { buildCCPOrg1, buildCCPOrg2, buildWallet } from "../../utils/AppUtil.js";

const channelName = process.env.CHANNEL_NAME || "mychannel";
const mspOrg1 = "Org1MSP";
const mspOrg2 = "Org2MSP";
const walletPath1 = path.join(path.resolve(), "wallet1");
const walletPath2 = path.join(path.resolve(), "wallet2");
const org1UserId = "org1User";
const org2UserId = "org2User";
let gateway1 = null;
let gateway2 = null;

const connectToHyperledger = async () => {
  if (gateway1 && gateway1.getIdentity() && gateway2 && gateway2.getIdentity()) {
    console.log("Using existing gateway connections");
    const network1 = await gateway1.getNetwork(channelName);
    const network2 = await gateway2.getNetwork(channelName);
    return { network1, network2 };
  }

  try {
    // Connect Org1
    const ccp1 = buildCCPOrg1();
    const caClient1 = buildCAClient(FabricCAServices, ccp1, "ca.org1.example.com");
    const wallet1 = await buildWallet(Wallets, walletPath1);
    await enrollAdmin(caClient1, wallet1, mspOrg1);
    await registerAndEnrollUser(caClient1, wallet1, mspOrg1, org1UserId, "org1.department1");

    gateway1 = new Gateway();
    await gateway1.connect(ccp1, {
      wallet: wallet1,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Connect Org2
    const ccp2 = buildCCPOrg2();
    const caClient2 = buildCAClient(FabricCAServices, ccp2, "ca.org2.example.com");
    const wallet2 = await buildWallet(Wallets, walletPath2);
    await enrollAdmin(caClient2, wallet2, mspOrg2);
    await registerAndEnrollUser(caClient2, wallet2, mspOrg2, org2UserId, "org2.department1");

    gateway2 = new Gateway();
    await gateway2.connect(ccp2, {
      wallet: wallet2,
      identity: org2UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    console.log("New gateway connections established");
    const network1 = await gateway1.getNetwork(channelName);
    const network2 = await gateway2.getNetwork(channelName);
    return { network1, network2 };
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
    process.exit(1);
  }
};

export default connectToHyperledger;
