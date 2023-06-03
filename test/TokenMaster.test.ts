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

            const eventDetails = await TokenMaster.getEvent(1);

            expect(eventDetails.id).to.equal(1);
            expect(eventDetails.name).to.equal(Event_Name);
            expect(eventDetails.cost).to.equal(Event_Cost);
            expect(eventDetails.maxTickets).to.equal(Event_MaxTickets);
            expect(eventDetails.date).to.equal(Event_Date);
            expect(eventDetails.time).to.equal(Event_Time);
            expect(eventDetails.location).to.equal(Event_Location);
        })

        it("Only owner should be able to create a new event", async function () {
            const [, , UnknownUser] = await ethers.getSigners();

            const Event_Name: string = "XYZ Music Concert";
            const Event_Cost: BigNumber = ethers.utils.parseEther("0.1");
            const Event_MaxTickets: number = 10000;
            const Event_Date: string = "10-06-2023";
            const Event_Time: string = "10:30 PM, IST";
            const Event_Location: string = "MUMBAI, INDIA";

            await expect(TokenMaster.connect(UnknownUser).listEvent(
                Event_Name,
                Event_Cost,
                Event_MaxTickets,
                Event_Date,
                Event_Time,
                Event_Location
            )).revertedWith("Ownable: caller is not the owner");
        })
    })

    describe("Mint", function () {
        beforeEach(async function () {
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
        })

        it("User should able to purchase tickets", async function () {
            const Event_Id: number = 1;
            const Seat_Number: number = 10;
            const Price: BigNumber = ethers.utils.parseEther("0.1");

            const tx = await TokenMaster.connect(buyer).mint(Event_Id, Seat_Number, 
                { value: Price }
            );
            await tx.wait();

            const eventDetails = await TokenMaster.getEvent(1);
            expect(eventDetails.tickets).to.equal(eventDetails.maxTickets.sub(1));
            expect(await TokenMaster.seatTaken(Event_Id, Seat_Number)).to.equal(buyer.address);
            expect(await TokenMaster.totalSupply()).to.equal(1);
        })

        it("Should revert if not enough eth sent", async function () {
            await expect(TokenMaster.connect(buyer).mint(1, 5)).to.revertedWith("Error: Insufficient Balance");
        })

        it("Should set buying status to true after purchase", async function () {
            const Event_Id: number = 1;
            const Seat_Number: number = 10;
            const Price: BigNumber = ethers.utils.parseEther("0.1");

            const tx = await TokenMaster.connect(buyer).mint(Event_Id, Seat_Number, 
                { value: Price }
            );
            await tx.wait();

            expect(await TokenMaster.connect(buyer).hasBought(1, buyer.address)).to.equal(true);
        })

        it("Should update seatsTaken array", async function () {
            const Event_Id: number = 1;
            const Seat_Number: number = 10;
            const Price: BigNumber = ethers.utils.parseEther("0.1");

            const tx = await TokenMaster.connect(buyer).mint(Event_Id, Seat_Number, 
                { value: Price }
            );
            await tx.wait();

            const seats = await TokenMaster.connect(buyer).getSeatsTaken(Event_Id);
            expect(seats.length).to.equal(1);
            expect(seats[0]).to.equal(Seat_Number);
        })

        it("Should update the contract balance", async function () {
            const Event_Id: number = 1;
            const Seat_Number: number = 10;
            const Price: BigNumber = ethers.utils.parseEther("0.1");

            const tx = await TokenMaster.connect(buyer).mint(Event_Id, Seat_Number, 
                { value: Price }
            );
            await tx.wait();

            const contractBalance = await ethers.provider.getBalance(TokenMaster.address);
            expect(contractBalance).to.equal(Price);
        })

        it("Should not able to purchase ticket for invalid event id", async function () {
            await expect(TokenMaster.connect(buyer)
            .mint(2, 8, {value: ethers.utils.parseEther("0.1")}))
            .to.revertedWith("Error: Invalid Id");
        })

        it("Should not able to purchase invalid seat", async function () {
            await expect(TokenMaster.connect(buyer).
            mint(1, 10001, {value: ethers.utils.parseEther("0.1")}))
            .to.revertedWith("Error: Invalid Seat Number");
        })
    })

    describe("Withdraw", function () {
        beforeEach(async function () {
            const Event_Name: string = "XYZ Music Concert";
            const Event_Cost: BigNumber = ethers.utils.parseEther("1");
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
        })

        it("Owner should able to withdraw the eth from contract", async function () {
            const ownerBalance1 = await deployer.getBalance();
            let contractBalance = await ethers.provider.getBalance(TokenMaster.address);
            expect(contractBalance).to.equal(0);

            const tx = await TokenMaster.connect(buyer).mint(1, 10, 
                { value: ethers.utils.parseEther("1") }
            );
            await tx.wait();
            contractBalance = await ethers.provider.getBalance(TokenMaster.address);

            expect(contractBalance).to.equal(ethers.utils.parseEther("1"))

            const tx1 = await TokenMaster.connect(deployer).withdrawFund();
            const tx1Receipt = await tx1.wait();

            const gasUsed = tx1Receipt.gasUsed;
            const effectiveGasPrice = tx1Receipt.effectiveGasPrice;
            const gasFee = gasUsed.mul(effectiveGasPrice);

            const newOwnerBalance = await deployer.getBalance();

            expect(await ethers.provider.getBalance(TokenMaster.address)).to.equal(0);
            expect(newOwnerBalance).to.equal(ownerBalance1.add(ethers.utils.parseEther("1")).sub(gasFee));
        })
    })
})