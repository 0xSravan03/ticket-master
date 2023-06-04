# Ticket Master

## About

This project demonstrates how to implement ticket master system using ethereum smart contract and NFTs.
This project allow users to buy tickets for their favorite events using ethereum.
The main motive to build this project is to bring decentality in the ticket space

## Features
1. Developer / Owner of this contract can add new events details including price, total seats, date and location.
2. User will be able to mint NFT for their seat.
3. Developer / Owner can withdraw ETH form the contract.

## Installation
1. Clone the Repository

    ```bash
    git clone https://github.com/0xSravan03/ticket-master.git
    cd ticket-master
    ```
2. Install dependencies

    ```bash
    yarn install
    ```

## Run & Test locally
1. Compile the contract

    ```bash
    yarn hardhat compile
    ```
    
2. deploy to hardhat network
      
    ```bash
    yarn hardhat run scripts/deploy.ts
    ```
  
3. Execute test

    ```bash
    yarn hardhat test
    ```
    
## Deploy to Live network

1. Rename `.env.example` to `.env` and get rpc url and account private key
2. Deploy to  `Sepolia` network

    ```bash
    yarn hardhat run scripts/deploy.ts --network sepolia
    ```


