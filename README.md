# ws-auto-trade (Coming soon)
An trading bot development framework for wealthsimple based on [ws-api](https://github.com/ahmedsakr/wstrade-api)

## Disclaimer

* **USE AT YOUR OWN RISK**. Before we get into the thick of it, I must offer a disclaimer. Please don’t take anything in this post (or any other work of mine) as any kind of financial advice. Trading is a very personal endeavor and you need to decide on your own goals and choose the strategy and techniques that are right for you. This app use an unofficial Wealthsimple Trade API Wrapper. This is still an alpha and might change at any time.
*  **DO NOT LEVERAGE THIS IN ATTEMPT TO DISRUPT ORDERLY MARKET FUNCTIONS**. You should understand that you have a responsibility to not engage in illegal trading behaviours that can disrupt orderly market functions.

## Try it out

You need Node.js installed to run this.

Clone or download the repo.

Change to repo's directory and install dependencies:

```bash
cd ws-auto-trade
npm install
```

## Overview

This app includes 2 main JS scripts:

* the **server**:
  * to track a selection of stocks 
  * to compute a defined strategy 
  * to detect buy or sell signals

* the **broker**:
  * this script allows you to auto trade the signals received from the server.
## Authors

* **Marc Eddy Lafontant** - *Owner* - [@mdy405](https://github.com/mdy405)

## License

This project is licensed under the MIT License.