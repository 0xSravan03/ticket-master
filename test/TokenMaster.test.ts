import { ethers } from "hardhat";
import { assert, expect } from "chai";
import { TokenMaster } from "../typechain-types";

describe("Token Master Testing", function () {
    let TokenMaster: TokenMaster;
    const TokenName: string = "Token Master";
    const TokenSymbol: string = "TM";

    beforeEach(async function () {
        const TokenMasterFactory = await ethers.getContractFactory("TokenMaster");
        TokenMaster = await TokenMasterFactory.deploy(TokenName, TokenSymbol);
        await TokenMaster.deployed();
    })

    it("should deploy the contract and set name and symbol", async function () {
        const name: string = await TokenMaster.name();
        const symbol: string = await TokenMaster.symbol();
        expect(name).to.be.equal(TokenName);
        expect(symbol).to.be.equal(TokenSymbol);
    })
})