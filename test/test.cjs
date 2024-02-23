// Import necessary modules from Hardhat
// const { ethers } = require("hardhat");
// const { expect } = require("chai");
import {ethers} from '@nomiclabs/hardhat-ethers'
import { expect } from 'chai';
describe("DKRCoin Contract", function () {
    let DKRCoin;
    let dkRCoin;
  
    beforeEach(async function () {
      // Deploy the contract before each test
      DKRCoin = await ethers.getContractFactory("DKRCoin");
      dkRCoin = await DKRCoin.deploy();
      console.log("lol")
      await dkRCoin.deployed();
    });
  
    it("Should set the correct base token URI", async function () {
      const newBaseTokenUri = "https://example.com/token/";
      await dkRCoin.setBaseTokenUri(newBaseTokenUri);
      expect(await dkRCoin.baseTokenUri()).to.equal(newBaseTokenUri);
    });
  
    it("Should mint tokens", async function () {
      await dkRCoin.mint(1, { value: ethers.utils.parseEther("0.005") });
      expect(await dkRCoin.balanceOf(await ethers.provider.getSigner(0).getAddress())).to.equal(1);
    });
  
    it("Should not mint tokens if public mint is closed", async function () {
      await dkRCoin.editMint(false);
      await expect(dkRCoin.mint(1, { value: ethers.utils.parseEther("0.005") })).to.be.revertedWith("Public Mint Closed");
    });
  
    it("Should not mint more than maximum allowed tokens", async function () {
      await expect(dkRCoin.mint(101, { value: ethers.utils.parseEther("0.005") })).to.be.revertedWith("SOLD OUT");
    });
  
    it("Should not mint without enough ether", async function () {
      await expect(dkRCoin.mint(1, { value: ethers.utils.parseEther("0.002") })).to.be.revertedWith("not enough ether");
    });
  
    // Add more tests for other functions and edge cases
});
