// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TeaTraceability {

    struct IpfsRecord {
        string ipfsCid;
        uint256 timestamp;
        address actor;
    }

    IpfsRecord[] private ipfsRecords;

    event IpfsCidStored(
        string ipfsCid,
        uint256 timestamp,
        address indexed actor
    );

    function storeIpfsCid(string memory ipfsCid) external {
        require(bytes(ipfsCid).length > 0, "CID required");

        ipfsRecords.push(
            IpfsRecord({
                ipfsCid: ipfsCid,
                timestamp: block.timestamp,
                actor: msg.sender
            })
        );

        emit IpfsCidStored(
            ipfsCid,
            block.timestamp,
            msg.sender
        );
    }

    function getIpfsCidCount()
        external
        view
        returns (uint256)
    {
        return ipfsRecords.length;
    }

    function getIpfsCid(uint256 index)
        external
        view
        returns (IpfsRecord memory)
    {
        require(index < ipfsRecords.length, "CID not found");

        return ipfsRecords[index];
    }
}
