// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenMaster is ERC721, Ownable {
    uint256 public totalEvents;
    uint256 public totalSupply; /// Keep track of total NFTs.

    struct Event {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    /// Used to keep track of all events
    mapping(uint256 => Event) private events;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) private seatsTaken;
    mapping(uint256 => mapping(address => bool)) public hasBought;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    /// Events
    event CreatedEvent(uint256 indexed eventId, string indexed eventName);
    event PurchaseTicket(
        uint256 indexed eventId,
        uint256 indexed seatNumber,
        address buyer
    );

    /**
     * @notice Allow owner of the contract to add new events.
     * @param _name Name of the Event
     * @param _cost Cost to buy ticket
     * @param _maxTickets Maximum allowed tickets to purchase
     * @param _date Date of the event
     * @param _time Time of the Event
     * @param _location Location of the event
     */
    function listEvent(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) external onlyOwner {
        totalEvents++;

        /// Creating Events based on provided data.
        Event memory newEvent = Event({
            id: totalEvents,
            name: _name,
            cost: _cost,
            tickets: _maxTickets,
            maxTickets: _maxTickets,
            date: _date,
            time: _time,
            location: _location
        });

        /// Adding new event to the mapping
        events[totalEvents] = newEvent;

        emit CreatedEvent(totalEvents, _name);
    }

    /**
     * @notice This function used to retrieve event details from mapping using id
     * @param _id  Event id
     * @return events Event data stored in the events mapping at _id
     */
    function getEvent(uint256 _id) public view returns (Event memory) {
        return events[_id];
    }

    function mint(uint256 _id, uint256 _seat) public payable {
        require(_id != 0 && _id <= totalEvents, "Error: Invalid Id");
        require(
            _seat > 0 && _seat <= events[_id].maxTickets,
            "Error: Invalid Seat Number"
        );
        require(msg.value >= events[_id].cost, "Error: Insufficient Balance");
        require(events[_id].tickets > 0, "Error: Tickets Sold Out");
        require(
            seatTaken[_id][_seat] == address(0),
            "Error: Seat has already taken"
        );

        /// user can buy only one NFT.
        require(
            hasBought[_id][msg.sender] == false,
            "Error: You have already bought"
        );

        events[_id].tickets--; /// reducing total available ticket count

        hasBought[_id][msg.sender] = true;

        /// Allocating Seat to buyer.
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat);

        totalSupply++;
        _safeMint(msg.sender, totalSupply);

        emit PurchaseTicket(_id, _seat, msg.sender);
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    /**
     * @notice Allow owner of the contract to withdraw eth.
     */
    function withdrawFund() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(success, "Error: Transaction Failed");
    }
}
