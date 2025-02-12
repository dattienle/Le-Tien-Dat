
# I. Errors and Performance issues
1️⃣ Error: Variable lhsPriority does not exist

🛑 Error: Using lhsPriority without declaring it.
✅ Fix: Use balancePriority instead.

2️⃣ Using switch-case is not optimal in getPriority

🛑 Error: switch-case is verbose and hard to extend.
✅ Fix: Replace it with a Mapped Object Type for faster lookup.

3️⃣ useMemo has unnecessary dependencies

🛑 Error: useMemo includes prices, but prices does not affect filtering & sorting.
✅ Fix: Only include [balances] in the dependencies.

4️⃣ Unnecessary double iteration over sortedBalances

🛑 Error: Calling .map() twice separately wastes performance.
✅ Fix: Merge the .map() calls into a single iteration

5️⃣ Incorrect usage of .toFixed()

🛑 Error: .toFixed() returns a string, but amount should remain a number.
✅ Fix: Only format when displaying (toFixed(2)).

6️⃣ Using index as key causes re-render issues

🛑 Error: key={index} may cause incorrect rendering when data changes.
✅ Fix: Use key={balance.currency} instead.

# II. Code fix

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
          key={balance.currency} 
          amount={balance.amount}
          usdValue={prices[balance.currency] * balance.amount}
          formattedAmount={balance.amount.toFixed(2)} 
        />
      ))}
    </div>
  );
};

