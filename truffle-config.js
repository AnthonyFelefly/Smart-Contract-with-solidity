module.exports = {
  networks: {
    developement: {
      host : "127.0.0.1",
      port: 7545,
      network_id: "8"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
