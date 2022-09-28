const ABIS = {
	MoonMoonz: [
		"function claim(uint256) payable",
		"function claimFree(bytes32[],uint256) payable",
		"function claimPremint(bytes32[],uint256) payable",
		"function totalSupply() view returns(uint256)",
	],
};

const ADDRESSES = {
	MoonMoonz: "0xB3774b8e9ebec2403b0F0eaCB70fa2566E16Ba37",
};

const MAX_MINT = 3;

const MAX_SUPPLY = 5555;

const PRICE = ethers.utils.parseEther("0.0088");
