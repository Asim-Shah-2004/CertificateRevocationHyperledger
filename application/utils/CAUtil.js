"use strict";

import 'dotenv/config'

const adminUserId = process.env.adminUserId;
const adminUserPasswd = process.env.adminUserPasswd;

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
export const buildCAClient = (FabricCAServices, ccp, caHostName) => {
  const caInfo = ccp.certificateAuthorities[caHostName]; 
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

  console.log(`Built a CA Client named ${caInfo.caName}`);
  return caClient;
};

export const enrollAdmin = async (caClient, wallet, orgMspId) => {
  try {
    const identity = await wallet.get(adminUserId);
    if (identity) {
      console.log("An identity for the admin user already exists in the wallet");
      return;
    }

    const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: "X.509",
    };
    await wallet.put(adminUserId, x509Identity);
    console.log("Successfully enrolled admin user and imported it into the wallet");
  } catch (error) {
    console.error(`Failed to enroll admin user : ${error}`);
  }
};

export const registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation) => {
  try {
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(`An identity for the user ${userId} already exists in the wallet`);
      return;
    }

    const adminIdentity = await wallet.get(adminUserId);
    if (!adminIdentity) {
      console.log("An identity for the admin user does not exist in the wallet");
      console.log("Enroll the admin user before retrying");
      return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
    const secret = await caClient.register(
      {
        affiliation: affiliation,
        enrollmentID: userId,
        role: "client",
      },
      adminUser
    );
    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: "X.509",
    };
    await wallet.put(userId, x509Identity);
    console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to register user : ${error}`);
  }
};
