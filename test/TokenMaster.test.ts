import { ethers } from "hardhat";
import { expect } from "chai";
import { TokenMaster } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

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

    describe("ListEvent", function () {
        it("Should create a new event and update event count", async function () {
            const beforeEventCount = await TokenMaster.totalEvents();
            expect(beforeEventCount).to.equal(0);

            const Event_Name: string = "XYZ Music Concert";
            const Event_Cost: BigNumber = ethers.utils.parseEther("0.1");
            const Event_MaxTickets: number = 10000;
            const Event_Date: string = "10-06-2023";
            const Event_Time: string = "10:30 PM, IST";
            const Event_Location: string = "MUMBAI, INDIA";

            const tx = await TokenMaster.listEvent(
                Event_Name,
                Event_Cost,
                Event_MaxTickets,
                Event_Date,
                Event_Time,
                Event_Location
            )
            await tx.wait();

            const afterEventCount = await TokenMaster.totalEvents();
            expect(afterEventCount).to.equal(1);

            const eventDetails = await TokenMaster.events(1);

            expect(eventDetails.id).to.equal(1);
            expect(eventDetails.name).to.equal(Event_Name);
            expect(eventDetails.cost).to.equal(Event_Cost);
            expect(eventDetails.maxTickets).to.equal(Event_MaxTickets);
            expect(eventDetails.date).to.equal(Event_Date);
            expect(eventDetails.time).to.equal(Event_Time);
            expect(eventDetails.location).to.equal(Event_Location);
        })
    })
})