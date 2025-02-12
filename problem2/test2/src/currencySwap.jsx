import { useState, useEffect } from "react";
import logo from "../src/assets/logo.webp";
import "./style.css";
const tokenImagesBaseURL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";
const exchangeRateUSDToVND = 24000;
const API_URL = "https://interview.switcheo.com/prices.json";
const CurrencySwap = () => {
  const [tokens, setTokens] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("VND");


  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  useEffect(() => {
    if (tokens.length > 0) {
      convertCurrency(amount, fromCurrency, toCurrency, tokens);
    }
  }, [tokens]);
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setTokens(data);
      })
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  const convertCurrency = (
    value,
    fromCurrency,
    toCurrency,
    tokenData = tokens
  ) => {
    const token = tokenData.find((t) => t.currency === fromCurrency);
    if (token) {
      let result = 0;
      if (toCurrency === "VND") {
        result =
          fromCurrency === "USD"
            ? value * exchangeRateUSDToVND
            : value * token.price * exchangeRateUSDToVND;
      } else {
        result = fromCurrency === "USD" ? value : value * token.price;
      }
      setConvertedAmount(result);
    }
  };

  return (
    <div className="currency-swap-container">
      <div>
        <img src={logo} alt="Logo" />
      </div>
      <h2 className="currency-swap-title">Currency Swap</h2>
      <div className="content">
        <div className="input-group">
          <label htmlFor="amount">Input the amount</label>
          <input
            type="number"
            id="amount"
            className="amount-input"
            value={amount}
            onChange={(e) => {
              let newAmount = e.target.value;
              if (
                newAmount === "" ||
                isNaN(newAmount) ||
                Number(newAmount) < 0
              ) {
                return;
              }
              if (newAmount.includes(".")) {
                const [ intergerPart,decimalPart] = newAmount.split(".");
                console.log("Integer Part:", intergerPart);
                if (decimalPart.length > 2) {
                  return;
                }
              }
              setAmount(newAmount);
              convertCurrency(newAmount, fromCurrency, toCurrency, tokens);
            }}
          />
         
        </div>

        <div className="input-group">
          <label htmlFor="coin">Choose cryptocurrency</label>

          <div className="input-content">
            <span>
              <img
                src={`${tokenImagesBaseURL}/${fromCurrency}.svg`}
                onError={(e) =>
                  (e.target.src = `${tokenImagesBaseURL}/wKAS.svg`)
                }
                alt={fromCurrency}
                className="w-8 h-8"
              />
            </span>
            <select
              id="coin"
              className="coin-select"
              value={fromCurrency}
              onChange={(e) => {
                const newFromCurrency = e.target.value;
                setFromCurrency(newFromCurrency);
                convertCurrency(amount, newFromCurrency, toCurrency, tokens);
              }}
            >
              {tokens.map((token) => (
                <option key={token.currency} value={token.currency}>
                  {token.currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="currency">Choose currency</label>

          <select
            id="currency"
            className="currency-select"
            value={toCurrency}
            onChange={(e) => {
              const newToCurrency = e.target.value;
              setToCurrency(newToCurrency);
              convertCurrency(amount, fromCurrency, newToCurrency, tokens);
            }}
          >
            <option value="VND">VND</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="result">
        {amount.toLocaleString()} {fromCurrency} ={" "}
        {toCurrency === "VND"
          ? convertedAmount.toLocaleString() + " VND"
          : convertedAmount.toLocaleString() + " USD"}
      </div>
    </div>
  );
};

export default CurrencySwap;
