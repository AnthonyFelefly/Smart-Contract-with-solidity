const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList',(accounts)=>{
    //we are gonna write the tests inside thiese brackets
    //we are gonna get a copy of the deployed contract with this before, so before each test runs we will have a copy of the deployed contract
    before(async() => {
        this.todoList = await TodoList.deployed() 
    })

    it('deploys successfully', async () => {
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)

    })
    it('lists tasks', async () => {
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        assert.equal(task.content, "check out my instagram")
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(),1)

    })
})