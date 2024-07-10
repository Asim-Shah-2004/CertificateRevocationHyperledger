import { getChaincode} from "../services/index.js";
import {connectToHyperledger} from '../services/index.js'
import { Gateway, Wallets } from 'fabric-network'
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import FabricCAServices from 'fabric-ca-client'


const getCCP = async (org) => {
    if (org == "Org1") {
        console.log(process.cwd());
        const ccpPath = path.resolve(
            process.cwd(),
            "..",
            "..",
            "test-network",
            "organizations",
            "peerOrganizations",
            "org1.example.com",
            "connection-org1.json"
          );
          const fileExists = fs.existsSync(ccpPath);
          if (!fileExists) {
            throw new Error(`no such file or directory: ${ccpPath}`);
          }
          const contents = fs.readFileSync(ccpPath, "utf8");
          const ccp = JSON.parse(contents);
        
          console.log(`Loaded the network configuration located at ${ccpPath}`);
          return ccp;

    } else if (org == "Org2") {
        const ccpPath = path.resolve(
            process.cwd(),
            "..",
            "..",
            "..",
            "test-network",
            "organizations",
            "peerOrganizations",
            "org2.example.com",
            "connection-org2.json"
          );
          const fileExists = fs.existsSync(ccpPath);
          if (!fileExists) {
            throw new Error(`no such file or directory: ${ccpPath}`);
          }
          const contents = fs.readFileSync(ccpPath, "utf8");
          const ccp = JSON.parse(contents);
        
          console.log(`Loaded the network configuration located at ${ccpPath}`);
          return ccp;
    } 
}

const getCaUrl = async (org, ccp) => {
    let caURL;
    if (org == "Org1") {
        caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;

    } else if (org == "Org2") {
        caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
    } else
        return null
    return caURL

}

const getWalletPath = async (org) => {
    let walletPath;
    if (org == "Org1") {
        walletPath = path.join(process.cwd(), 'wallet1');

    } else if (org == "Org2") {
        walletPath = path.join(process.cwd(), 'wallet2');
    } else
        return null
    return walletPath

}


const getAffiliation = async (org) => {
    return org == "Org1" ? 'org1.department1' : 'org2.department1'
}

//ca client wallet msp

const getCaInfo = async (org, ccp) => {
    let caInfo
    if (org == "Org1") {
        caInfo = ccp.certificateAuthorities['ca.org1.example.com'];

    } else if (org == "Org2") {
        caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
    } else
        return null
    return caInfo

}


const enrollAdmin = async (org, ccp) => {

    console.log('calling enroll Admin method')

    try {

        const caInfo = await getCaInfo(org, ccp) //ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = await getWalletPath(org) //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        let x509Identity;
        if (org == "Org1") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
        } else if (org == "Org2") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org2MSP',
                type: 'X.509',
            };
        }

        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        return
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
    }
}


const test = async (req, res) => {
    let userOrg = "Org1"
    let username = "nigga"
    const ccp = await getCCP(userOrg)
    const caURL = await getCaUrl(userOrg, ccp)
    const walletPath = await getWalletPath(userOrg)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const userIdentity = await wallet.get(username);
    const caInfo = await getCaInfo(userOrg, ccp)
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    if (userIdentity) {
        console.log(`An identity for the user ${username} already exists in the wallet`);
        var response = {
            success: true,
            message: username + ' enrolled Successfully',
        };
        return response
    }
    let adminIdentity = await wallet.get('admin');
    console.log(adminIdentity);
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        await enrollAdmin(userOrg, ccp);
        adminIdentity = await wallet.get('admin');
        console.log("Admin Enrolled Successfully")
    }
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    console.log(adminUser,"in1");
    let secret;
    let affiliation = await getAffiliation(userOrg)
    secret = await ca.register(
        {
          affiliation: affiliation,
          enrollmentID: username,
          role: "client",
        },
        adminUser
      );
      console.log(secret);
    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
    // const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret, attr_reqs: [{ name: 'role', optional: false }] });
    console.log(enrollment,"in2");
    let x509Identity;
    if (userOrg == "Org1") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
    } else if (userOrg == "Org2") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
    }

    await wallet.put(username, x509Identity);
    console.log(`Successfully registered and enrolled admin user ${username} and imported it into the wallet`);

    response = {
        success: true,
        message: username + ' enrolled Successfully',
        secret:secret
    };
    return response
};

export { test };