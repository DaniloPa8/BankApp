//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//@dev A standard ERC20 token

contract ATT is Context, ERC20 {
    constructor() ERC20("ATRAC TEST TOKEN", "ATT") {
        _mint(msg.sender, 10000 * 10 ** 18);         //adjust the first number to adjust totalSupply
    }

}

//@author Danilo Pavicevic
//@title TokenBank contract

contract Bank is Ownable {
    
    //@dev setting up needed variables for the contract
    //IERC20 _token represents the token that the Bank contract will accept

    IERC20 private _token;
    uint256 public decimals = 10 ** 18;
    uint256 public pledgeAmount;
    uint256 public rewardTime;
    uint256 public deploymentTime;


    uint256 private reward1;
    uint256 private reward2;
    uint256 private reward3;
    uint256 private totalStakePool;
    uint256 private totalStakers;
    uint256 public savingsStartTime;   
    bool public rewardDeposited = false ;

    

    //@dev struct for keeping track of user deposits,
    //@and if they are currently active

    struct depositStruct {
        uint256 value;
        bool isValue;
    }
    
    
    mapping (address => depositStruct) deposits;

    //@dev defining events to be emitted upon succesful interaction

    event savingsStarted (uint256 pledgeAmount, uint256 savingsStart);
    event depositSuccesful (address staker, uint256 value);
    event stakeWithdrawn (address withdrawAddress, uint256 totalPayout);

    //@dev a modifer to ensure proper enforcment of staking cycles
    //if this modifier check fails there is no active staking cycle

    modifier operational {
        require (rewardDeposited == true);
        _;
    }
    
    // @dev constructor sets token that can be received,
    // the expect argument is token contract address

    //@param token - expects a token contract address
    //@param _pledgeAmount - the amount bank owner pledges to deposit to the reward pool ex(1200 tokens)
    //@param _rewardTime - a time period used for calculating rewards, input in seconds

    //@dev This contract is compatable with any token
    //@dev all that is needed is the token address
     
    constructor (IERC20 token, uint256 _pledgeAmount, uint256 _rewardTime)  {
        _token = token;
        pledgeAmount = _pledgeAmount * decimals;
        rewardTime = _rewardTime;
        deploymentTime = block.timestamp;
    }

    //@dev a function that only the deployer of the contract can execute
    // owner needs to input the amount pledged to be deposited
    // after the reward is deposited the staking cycle starts
    // and reward pools are calculated

    function savingsStart (uint256 _value) public onlyOwner {
        require(rewardDeposited == false);
        require(_value  == pledgeAmount);
        _token.transferFrom(msg.sender,address(this), pledgeAmount);
        rewardDeposited = true;
        reward1 = pledgeAmount / 100 * 20 ;
        reward2  = pledgeAmount / 100 * 30;
        reward3 = pledgeAmount / 100 * 50;
        savingsStartTime = block.timestamp;

        emit savingsStarted(pledgeAmount, savingsStartTime);

    }

    //@dev a function for stakers to deposit their tokens
    // this fn handles all user data with usage of struct and
    // mappings, also handles token transfer

    function depositTokens(uint256 _depositAmount) public operational {
        require(rewardDeposited && block.timestamp < (savingsStartTime + rewardTime));
        uint256 depositAmount = _depositAmount;
        depositAmount = depositAmount * decimals;
        _token.transferFrom(msg.sender, address(this), depositAmount);
        totalStakePool = totalStakePool + depositAmount;
        depositStruct storage d = deposits[msg.sender];
        d.value = depositAmount;
        d.isValue = true;
        totalStakers += 1;

        emit depositSuccesful(msg.sender, depositAmount);
    }

    //@dev a function handling all token withdrawals,
    // depending on the time passed and caller 
    // it calls the responding withdrawal function

    function withdrawTokens () public operational payable{
        if (block.timestamp < savingsStartTime + 2 * rewardTime) revert();
        if(block.timestamp > savingsStartTime + 2*rewardTime  && block.timestamp < savingsStartTime + 3*rewardTime ) firstWithdrawal();
        if(block.timestamp > savingsStartTime + 3*rewardTime  && block.timestamp < savingsStartTime + 4*rewardTime ) secondWithdrawal();
        if(msg.sender == owner() && block.timestamp > savingsStartTime + (4 * rewardTime) && totalStakers == 0 ) bankWithdrawal();
        if(msg.sender != owner() && block.timestamp > savingsStartTime + 4*rewardTime) thirdWithdrawal();
        
    }

    //@dev the first withdrawal function for stakers

    function firstWithdrawal() private operational  {
            address staker = msg.sender;
            depositStruct storage d = deposits[staker];
            uint256 depositedValue = d.value;
            uint256 awardProportions = depositedValue / (totalStakePool  / 100 ) ;
            uint256 totalAward = (reward1 / 100) * awardProportions;
            uint256 payoutValue = totalAward + depositedValue;
            _token.approve(staker, payoutValue);
            _token.transfer(staker, payoutValue);
            d.isValue = false;
            totalStakers -= 1;
            totalStakePool = totalStakePool - depositedValue;
            reward1 = reward1 - totalAward;

            emit stakeWithdrawn(staker, payoutValue);
         } 

    //@dev the second withdrawal function for stakers

    function secondWithdrawal() private operational  {
        address staker = msg.sender;
        depositStruct storage d = deposits[staker];
        uint256 depositedValue = d.value;
        uint256 awardProportions =depositedValue /  (totalStakePool / 100) ;
        uint256 totalAward = ((reward1 + reward2) / 100) * awardProportions;
        uint256 payoutValue = totalAward + depositedValue;
        _token.approve(staker, payoutValue);
        _token.transfer(staker, payoutValue);
        d.isValue = false;
        totalStakers -= 1;

        totalStakePool = totalStakePool - depositedValue;
        if (totalAward <= reward1) { //8
            reward1 = reward1 - totalAward;
        }
        if (totalAward > reward1) {  
            reward2 = reward2 - (totalAward - reward1);   //22 - (12-8)
            reward1 = 0;
        }
        
        emit stakeWithdrawn(staker, payoutValue);
    
    }
    
    //@dev the third withdrawal function for stakers

    function thirdWithdrawal() private operational  {
        address staker = msg.sender;
        depositStruct storage d = deposits[staker];
        uint256 depositedValue = d.value;
        uint256 awardProportions =depositedValue / (totalStakePool / 100);
        uint256 totalAward = ((reward1 + reward2 + reward3) / 100) * awardProportions;
        uint256 payoutValue = totalAward + depositedValue;

        _token.approve(staker, payoutValue);
        _token.transfer(staker, payoutValue);

        d.isValue = false;
        totalStakers -= 1;

        totalStakePool = totalStakePool - depositedValue;
        if (totalAward < reward1) {
            reward1 = reward1 - totalAward;
        }
        if (totalAward > reward1 && totalAward < reward2 + reward1) {
            reward2 = reward2 - (totalAward - reward1);
            reward1 = 0;
        }
        if (totalAward > reward1 + reward2) {
            reward3 = reward3 - (totalAward - (reward1 + reward2));
            reward1 = 0;
            reward2 = 0;
        }
    
        emit stakeWithdrawn(staker, payoutValue);

    }

    //@dev the bank/owner withdrawal function for claiming remaining tokens
    // owner is able to call this function only when there are no more stakers
    // and more then 4*T has passed

    function bankWithdrawal () private operational onlyOwner  {
        uint256 payout = _token.balanceOf(address(this));
        _token.approve(owner(), payout );
        _token.transfer(owner(), payout );
        rewardDeposited = false;
        savingsStartTime=0;
        reward1 = 0;
        reward2 = 0;
        reward3 = 0;
        rewardDeposited = false;

        emit stakeWithdrawn(owner(), payout);
    
    }

    //@dev custom getter functions for use by the front-end

    function getTotalStake () public view returns (uint256 totalStake) {
            totalStake = totalStakePool / decimals;
    }
    function getRewards () public view returns (uint256 R1, uint256 R2, uint256 R3) {
             R1 = reward1 / (decimals);
             R2 = reward2 / (decimals);
             R3 = reward3 / (decimals);
    }
    function checkIfStaker (address staker) public view returns (bool) {
        depositStruct storage d = deposits[staker];
        return d.isValue;
    }
}
