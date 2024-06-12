# Fabric Application Setup Guide

This guide will walk you through the steps to set up and run a Fabric application. Follow the instructions below to clone the repository, set up the network, deploy the chaincode, and run the application.

## Prerequisites

- Ensure you have the necessary dependencies installed, including Node.js, npm, Docker, and Docker Compose.

## Steps to Set Up the Fabric Application

1. **Navigate to the Fabric Samples Folder**

    ```sh
    cd fabric-samples
    ```

2. **Clone the Repository**

    ```sh
    git clone <repository-url>
    ```

3. **Change Directory to the Fabric Application**

    ```sh
    cd fabric-app
    ```

4. **Folder Structure**

    In the `fabric-app` directory, you will find two folders:
    1. `chaincode`
    2. `application`

5. **Set Up Chaincode**

    Change directory to the chaincode folder:

    ```sh
    cd chaincode
    ```

    Run the following commands to set environment variables:

    ```sh
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_LOCALMSPID="Org1MSP"
    ```

6. **Open a New Terminal Session**

    In the new terminal session, navigate to the test network directory:

    ```sh
    cd fabric-samples/test-network
    ```

7. **Shut Down Any Running Network**

    ```sh
    sudo ./network.sh down
    ```

8. **Create a New Channel**

    ```sh
    ./network.sh up createChannel -c mychannel -ca
    ```

9. **Deploy the Chaincode**

    ```sh
    ./network.sh deployCC -ccn basic -ccp ../fabric-app/chaincode/ -ccl javascript
    ```

10. **Return to the Previous Terminal Session**

    Navigate to the application folder:

    ```sh
    cd application
    ```

11. **Install Node Modules**

    ```sh
    npm install
    ```

12. **Run the Application**

    ```sh
    node app.js
    ```

Your Fabric application should now be up and running. Follow the steps carefully, and ensure all dependencies are installed before starting the setup process. If you encounter any issues, refer to the Fabric documentation or seek help from the community.