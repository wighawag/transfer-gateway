module.exports = {
  istanbulReporter: ['html', 'lcov', 'text', 'json', 'json-summary'],
  // does not work properly:
  // skipFiles: [
  //   'solc_0.5.12/',
  //   'solc_0.7/Test/',
  //   'solc_0.7/Interfaces/',
  //   'solc_0.7/BaseERC20TransferRecipient.sol',
  // ],
};
