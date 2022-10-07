const ADDRESSES = {
	MoonMoonz: "0xE416db68b7Eff40e7A4a6F2aeF60567FE11E2722",
	MoonMoonzRewarder: "0xF1FA2373dC5a865E023df2d0e7e8E1091f9CB17A",
};

const ABIS = {
	MoonMoonz: [
		"function totalSupply() view returns(uint256)",
		"function saleState() view returns(uint256)",
		"function claimVIP(bytes32[])",
		"function claimWL(bytes32[]) payable",
		"function claimWaitlist(bytes32[]) payable",
		"function claim(uint256) payable",
	],
	MoonMoonzRewarder: [
		"function deposit(uint256[]) external",
		"function withdraw(uint256[]) external",
		"function claim() external",
		"function earned(address) external view returns(uint256[])",
		"function depositsOf(address) external view returns(uint256[])",
	],
};

const PRICE = ethers.utils.parseEther("0.0088");

const API = "https://moonmoonz-api.up.railway.app";
