interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
  }
  
  interface Props extends BoxProps {}
  
  const priorityMap: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20
  };
  
  const getPriority = (blockchain: string): number => priorityMap[blockchain] ?? -99;
  
  const WalletPage: React.FC<Props> = (props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();
  
    const sortedBalances = useMemo(() => {
      return balances
        .filter(balance => getPriority(balance.blockchain) > -99 && balance.amount <= 0)
        .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
    }, [balances]);
  
    return (
      <div {...rest}>
        {sortedBalances.map((balance) => (
          <WalletRow
            className={classes.row}
            key={balance.currency} // Sửa key tránh re-render sai
            amount={balance.amount}
            usdValue={prices[balance.currency] * balance.amount}
            formattedAmount={balance.amount.toFixed(2)} // Chỉ format khi hiển thị
          />
        ))}
      </div>
    );
  };
  