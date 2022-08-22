App = {
    loading: false,
    contracts: {},
    load: async () => {
        //we load the web3 library in order to connect to the blockchain
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        
    },
    //metamask helps the browser connect to the blockchain and then web3js helps the client side apllication to connect also to the blockchain
    //so the web3js allow us to tal to the ethereum blockchain from our project, it allow to read and write data from and to the blockchain from inside the app
     // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },
  loadAccount: async () => {
    App.account = await ethereum.request({ method: 'eth_accounts' });
    App.account = App.account['0']
    
  },
  loadContract: async() =>
  {
     const todoList = await $.getJSON('TodoList.json')
     // a truffle contract is a javascript representation of a smart contract that allows us to call functions on int and things lik that
     App.contracts.TodoList = TruffleContract(todoList)
     App.contracts.TodoList.setProvider(App.web3Provider)//it os gonna give us a copy of the coontarct andd tell us where it is on the blockchain
     App.todoList = await App.contracts.TodoList.deployed()
     console.log(JSON.stringify(todoList)) 
  } ,
  render: async() => {
      if (App.loading) {
          return
      }
      App.setLoading(true)
      $('#account').html(App.account)
      await App.renderTasks()
      App.setLoading(false)
  },
  renderTasks: async () =>
  {
    taskCount = await App.todoList.taskCount()
    taskCount=taskCount.toNumber();
    console.log(taskCount)
    const $taskTemplate = $('.taskTemplate')
    for (var i = 1 ;i <= taskCount ; ++i){
       const task= await App.todoList.tasks(i);
       const taskId = task[0].toNumber();
       const taskContent = task[1]
       const taskCompleted = task[2]

       const $newTaskTemplate = $taskTemplate.clone()
       $newTaskTemplate.find('.content').html(taskContent)
       $newTaskTemplate.find('input')
                       .prop('name',taskId)
                       .prop('checked',taskCompleted)
                       .on('click',App.toggleCompleted)
        if(taskCompleted){
            $('#completedTaskList').append($newTaskTemplate)

        }else {
            $('#taskList').append($newTaskTemplate)
        }
        $newTaskTemplate.show()
    }
  },
  createTask: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    await App.todoList.createTask(content,{from: App.account})
    window.location.reload()
  },
  toggleCompleted: async (e)=> {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId,{from: App.account})
    window.location.reload()
  },
  setLoading: (boolean)=> {
  App.loading = boolean 
  const loader = $('#loader')
  const content = $('#content')
  if (boolean){
      loader.show()
      content.hide()
  }
  else{
      loader.hide()
      content.show()
  }         
}
}

$(() => {
    $(window).load(()=> {
        App.load()
    })
})