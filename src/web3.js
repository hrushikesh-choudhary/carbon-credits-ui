import Web3 from "web3";

const web3 = new Web3(window.web3.currentProvider);
// const web3 = new Web3(new Web3.providers.HttpProvider(`http://127.0.0.1:7545`));

export default web3;