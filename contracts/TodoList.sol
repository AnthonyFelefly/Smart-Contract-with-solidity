// SPDX-License-Identifier: Unidentified
pragma solidity >=0.4.22 <0.9.0;

contract TodoList
{
    uint public taskCount = 0;//state variable that is actually written to the blockchain
    struct Task {
        uint  id;
        string content;
        bool completed;
    }
    mapping(uint => Task) public tasks;
    //create an event to publish
    event TaskCreated (
        uint id,
        string content,
        bool completed 
    );
    
    
    //the constructor is run one time upon deployement
    constructor() public{
        createTask("check out my instagram");   
    }
    function createTask(string memory _content) public {
       taskCount++;
       tasks[taskCount]=Task(taskCount,_content,false);
       // we want to publish an event to let exterbnal consumers know if the event happened or not, solidity lets us do this
       emit TaskCreated(taskCount,_content,false);

    }
    
}
