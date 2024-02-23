// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

contract DKRCoin is ERC721A, Ownable{
    uint256 MAX_MINTS=3;
    uint256 MAX_SUPPLY=100;
    uint256 tokensReserved=10;
    uint256 public mintRate=0.005 ether;
    uint public totalTokensMinted;

    string public baseExtenstion = ".json";
    string internal baseTokenUri;

    bool public publicMintOpen = false;
    mapping(address => bool) public whitelist;

    address payable owner;
    constructor() ERC721A ("DKRCoin", "DKR"){
        owner = payable(msg.sender);
    }
    
    function setBaseTokenUri(string calldata baseTokenUri_) external onlyOwner {
       baseTokenUri = baseTokenUri_;
    }
    
    receive () external payable{}

    function _startTokenId() internal view override virtual returns (uint256){
        return 1;
    }
    
    function tokenURI (uint256 tokenId_) public view override returns (string memory){
        require(_exists(tokenId_), "Token does not exist");
        return string (abi.encodePacked(baseTokenUri, Strings.toString(tokenId_), ".json"));
    }

    function editMint (
        bool _publicMintOpen
    ) external onlyOwner {
        publicMintOpen = _publicMintOpen;
    }

    function mintOwner(uint256 quantity) public onlyOwner{
        require(totalSupply()+quantity<=MAX_SUPPLY, "SOLD OUT");
        _safeMint(msg.sender, quantity);
        totalTokensMinted+=quantity;
    }

    function addToWhitelist(address[] calldata toAddAddresses) 
    external onlyOwner
    {
        for (uint i = 0; i < toAddAddresses.length; i++) {
            whitelist[toAddAddresses[i]] = true;
        }
    }

    function removeFromWhitelist(address[] calldata toRemoveAddresses)
    external onlyOwner
    {
        for (uint i = 0; i < toRemoveAddresses.length; i++) {
            delete whitelist[toRemoveAddresses[i]];
        }
    }

    function withdraw (address _addr) external onlyOwner{
        uint256 balance = address(this).balance;
        payable(_addr).transfer(balance);
    }

    function mint (uint256 quantity) public payable{
        require(publicMintOpen, "Public Mint Closed");
        require(quantity + _numberMinted(msg.sender)<=MAX_MINTS, "Invalid quantity");
        require(totalSupply()+quantity<=(MAX_SUPPLY-tokensReserved), "SOLD OUT");
        require(msg.value>=(mintRate*quantity), "not enough ether");
        _safeMint(msg.sender, quantity);
        totalTokensMinted +=quantity;
    }

    function getTotalTokensMinted() public view returns (uint256) {
        return totalTokensMinted;
    }
    
}