import { ethers } from "hardhat";
import { expect } from "chai";
import { TokenMaster } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const TokenName: string = "TokenMaster";
const TokenSymbol: string = "TM";

describe("Token Master Testing", function () {
    let TokenMaster: TokenMaster;
    let deployer: SignerWithAddress, buyer: SignerWithAddress;

    beforeEach(async function () {
        [deployer, buyer] = await ethers.getSigners();
        const TokenMasterFactory = await ethers.getContractFactory("TokenMaster", deployer);
        TokenMaster = await TokenMasterFactory.deploy(TokenName, TokenSymbol);
        await TokenMaster.deployed();
    })

    describe("Deployment", function () {
        it("Should deploy the contract and set name and symbol", async function () {
            const name: string = await TokenMaster.name();
            const symbol: string = await TokenMaster.symbol();
            expect(name).to.equal(TokenName);
            expect(symbol).to.equal(TokenSymbol);
        })

        it ("Should set deployer as the owner of the contract", async function () {
            const owner = await TokenMaster.owner();
            expect(owner).to.equal(deployer.address);
        })
    })
})