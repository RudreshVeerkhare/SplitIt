// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract SplitIt {
    struct AccInfo {
        mapping(address => uint256) debtMoney; // debt to pay, account wise
        mapping(address => uint256) lendedMoney; // money to get from given address
        uint256 totalDebtMoney;
        uint256 totalLendedMoney;
        string name; // must be less than 32 bytes
        uint256 bal; // balance of the account in "wei"
    }

    uint256 public accCount; // count of total users
    mapping(address => AccInfo) profiles; // profile mappings
    mapping(address => bool) public isUser; // to keep track of users
    address admin; // admin of the system

    address[] accounts; // list of all registered users
    mapping(string => address) public nameAddr; // to get address from name
    mapping(address => string) public addrName; // to check if address is registered

    constructor() {
        admin = msg.sender; // creator of the contract would be the admin
    }

    // receive ether function
    receive() external payable {
        // check if user exists
        require(isUser[msg.sender] == true, "User doesn't exist!");

        // update user balance
        profiles[msg.sender].bal += msg.value;
    }

    // Event when debt is paid by someone
    event DebtPaid(
        uint256 date,
        uint256 debtAmount,
        address paidBy,
        address paidTo
    );

    modifier exists(address _addr) {
        require(isUser[_addr], "Account Doesn't Exist!");
        _;
    }

    // to register accout on the network
    // this is a payable function i.e user can deposite money while registering
    function register(string memory _name) external payable {
        // check if user is already registered
        require(isUser[msg.sender] == false, "Account Exists!");

        // add user to the mapping
        isUser[msg.sender] = true;

        profiles[msg.sender].name = _name;
        nameAddr[_name] = msg.sender;
        addrName[msg.sender] = _name;
        // increment balance if ether sent
        if (msg.value > 0) {
            profiles[msg.sender].bal += msg.value;
        }
        // adding to all acc list
        accounts.push(msg.sender);
        accCount++;
    }

    // get balance
    function getBalance() external view exists(msg.sender) returns (uint256) {
        return profiles[msg.sender].bal;
    }

    // get totalDebt
    function getTotalDebtMoney()
        external
        view
        exists(msg.sender)
        returns (uint256)
    {
        return profiles[msg.sender].totalDebtMoney;
    }

    // get totalLendedMoney
    function getTotalLendedMoney()
        external
        view
        exists(msg.sender)
        returns (uint256)
    {
        return profiles[msg.sender].totalLendedMoney;
    }

    function getDebtByAcc(address _sender, address _recipitant)
        external
        view
        exists(_sender)
        exists(_recipitant)
        returns (uint256)
    {
        return profiles[_sender].debtMoney[_recipitant];
    }

    function getLendedMoneyByAcc(address _sender, address _recipitant)
        external
        view
        exists(_sender)
        exists(_recipitant)
        returns (uint256)
    {
        return profiles[_sender].lendedMoney[_recipitant];
    }

    //get all accounts
    function getAccounts() external view returns (address[] memory) {
        address[] memory _accounts = accounts;
        return _accounts;
    }

    // add lended money amount
    function addSplit(address recipitant, uint256 amount)
        external
        exists(msg.sender)
        exists(recipitant)
    {
        // add in lended money
        profiles[msg.sender].lendedMoney[recipitant] += amount;
        profiles[msg.sender].totalLendedMoney += amount;

        // add to debt of recipitant
        profiles[recipitant].debtMoney[msg.sender] += amount;
        profiles[recipitant].totalDebtMoney += amount;
    }

    // collects lended money and adds to the balance
    function payDebt(address recipitant)
        external
        exists(msg.sender)
        exists(recipitant)
    {
        // calulate debt or not
        AccInfo storage sender = profiles[msg.sender];

        require(
            sender.debtMoney[recipitant] > sender.lendedMoney[recipitant],
            "No debt found!"
        );
        // i.e sender is in debt of recipitant
        // so transfer debt

        uint256 debt =
            sender.debtMoney[recipitant] - sender.lendedMoney[recipitant];

        // check balance is there to clear debt
        require(debt <= sender.bal, "Insufficient Funds!");

        // transfer balance
        sender.bal -= debt;
        profiles[recipitant].bal += debt;

        // update recipitants Account
        profiles[recipitant].lendedMoney[msg.sender] -= sender.debtMoney[
            recipitant
        ];
        profiles[recipitant].totalLendedMoney -= sender.debtMoney[recipitant];

        profiles[recipitant].debtMoney[msg.sender] -= sender.lendedMoney[
            recipitant
        ];
        profiles[recipitant].totalDebtMoney -= sender.lendedMoney[recipitant];

        // update sender profile
        sender.totalDebtMoney -= sender.debtMoney[recipitant];
        sender.totalLendedMoney -= sender.lendedMoney[recipitant];
        sender.debtMoney[recipitant] = 0;
        sender.lendedMoney[recipitant] = 0;

        // emit event for debt paid success full
        emit DebtPaid(block.timestamp, debt, msg.sender, recipitant);
    }

    // withdraw money from account
    // amount is in wei
    function withdrawMoney(uint256 amount) external exists(msg.sender) {
        // check if sufficient balance or not
        require(amount <= profiles[msg.sender].bal, "Insufficient Balance");

        // transfer required amount
        msg.sender.transfer(amount);
        profiles[msg.sender].bal -= amount;
    }

    // to deposite money
    function depositeMoney() external payable exists(msg.sender) {
        require(msg.value > 0, "No Money sent!");

        profiles[msg.sender].bal += msg.value;
    }
}
