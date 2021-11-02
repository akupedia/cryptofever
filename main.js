// Using Coingecko API for pricing - free no keys needed
// Using Defi Pulse Data for gas estimation
// Free plan no keys needed
// Clone the repo and enjoy!

//Web3.js functions
let web3;
try {
    web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    console.log("Successfully loaded Web3.js");
}catch (e) {
    console.log("Could not instantiate Web3.js");
}
//Gwei is a unit of measurement in Ethereum.
//1,000,000,000 gwei = 1 Ethereum
function getGasPriceInWei(){
    web3.eth.getGasPrice().then(response=>{
        console.log(response);
    });
}

//CoinGeckoAPI functions
const url = "https://api.coingecko.com/api/v3/";
let coinArray = [];

//Ping
 function pingCoinGeckoAPI(){
    fetch(url + "/ping").then(response => {
        response.json().then(object => {
            console.log(object);
        });
    });
 }

// Load all coins from CG
function loadAllCoinsCG(){
    fetch(url + "/coins/list").then(response => {
        response.json().then(object => {
            console.log(object);
        });
    });
}
function getCoinDataFromId(id){
    fetch(url + "/coins/" + id).then(response => {
        response.json().then(object => {
            console.log(object);
        });
    });
}

// Loads top 100 coins from CG server, then display
function loadTop100CG(){
     //Empty out coin array
     coinArray = [];

     var currency = "vs_currency=usd";
     fetch(url + "/coins/markets?" + currency).then(response => {
         response.json().then(object => {
            object.forEach(coin => {
                //Adds each coin to a global coin array
                coinArray.push(coin);
            });
        }).then(()=>{
            //Sorted by market cap
            console.log("Coins refreshed: ");
            console.log(coinArray);
            refreshFromArray();
        });
    });
}
//Refresh the coin display from saved coin array
function refreshFromArray(){
     $(".coin-list").html("");
    // The coin array will be sorted before passing in
    coinArray.forEach((coin)=>{
        var html = "";
        html +=
            //Build HTML for each coin
            `<button class="btn col-12 mb-1 coin-container">
                <img class="coin-logo" src="${coin.image}" alt="${coin.name} logo">
                <span class="coin-logo-container center">
                    <div class="m-1"></div>
                    ${coin.name}
                    <div class="m-1"></div>
                    <span style="color: darkgray" class="font-weight-light">${coin.symbol.toUpperCase()}</span>               
                </span>
                $${coin.current_price}
                ${percentageFormatter(coin.price_change_percentage_24h)}
            </button>
<!--            <div class="row overview">-->
                <div class="col-12 overview">
                ATH: ${coin.ath}
                ATH Change Percentage: ${coin.ath_change_percentage.toFixed(2)} <br>
                Circulating Supply: ${coin.circulating_supply}
                Total Supply: ${coin.total_supply} <br>
                High 24H: ${coin.high_24h}
                Low 24H: ${coin.low_24h}
<!--                </div>-->
            </div>`;
        $(".coin-list").append(html);
    });
}
//

//Navbar button events for sorting coins
$("#AtoZ").click(()=>{
    //Sort A to Z
    coinArray.sort(function(a, b){
        if(a.id < b.id) { return -1; }
        if(a.id > b.id) { return 1; }
        return 0;
    });
    refreshFromArray();
});
$("#ZtoA").click(()=>{
    //Sort Z to A
    coinArray.sort((a, b)=>{
        if(a.id < b.id) { return -1; }
        if(a.id > b.id) { return 1; }
        return 0;
    });
    coinArray.reverse();
    refreshFromArray();
});
$("#HighestToLowest24h").click(()=>{
    //Sort Highest to Lowest
    coinArray.sort(function(a, b) {
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
    });
    refreshFromArray();
});
$("#LowestToHighest24h").click(()=>{
    //Sort Lowest to Highest
    coinArray.sort(function(a, b) {
        return a.price_change_percentage_24h - b.price_change_percentage_24h;
    });
    refreshFromArray();
});
//Refreshes from last saved array
$(".refresh-button").click(()=> {
    loadTop100CG();
});
$("#Top100").click(()=> {
    loadTop100CG();
});
//Misc functions
//Returns green and red percentage and arrows.
function percentageFormatter(rawPercentage){
    rawPercentage = rawPercentage.toFixed(2).toString();
    var html = "";
    if (rawPercentage.charAt(0) === "-"){
        html += `<span class="red-percentage">
                <img class="triangle" src="img/red-triangle.png" alt="negative red triangle">
                ${rawPercentage}%`;
    } else {
        html += `<span class="green-percentage">
        <img class="triangle" src="img/green-triangle.png" alt="positive green triangle">
        ${rawPercentage}%`;
    }
    html += `</span>`;
    return html;
}
//Events
$(document).on({
    mouseenter: function (e) {
        $(this).next().toggle();
    },
    mouseleave: function (e) {
        $(this).next().toggle();
    }
}, ".coin-container");
//Init
//Sorted by market cap by default
loadTop100CG();
getGasPriceInWei();
// getGasPrice();

// getCoinDataFromId("pancakeswap-token");


