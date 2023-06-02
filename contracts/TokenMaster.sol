// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenMaster is ERC721, Ownable {
    uint256 private totalEvents;

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
    mapping(uint256 => Event) public events;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    /// Events
    event CreatedEvent(uint256 indexed _id, string indexed _name);

    function listEvent(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) external {
        totalEvents++;

        /// Creating Events based on provided data.
        Event memory newEvent = Event({
            id: totalEvents,
            name: _name,
            cost: _cost,
            tickets: 0,
            maxTickets: _maxTickets,
            date: _date,
            time: _time,
            location: _location
        });

        /// Adding new event to the mapping
        events[totalEvents] = newEvent;

        emit CreatedEvent(totalEvents, _name);
    }
}
