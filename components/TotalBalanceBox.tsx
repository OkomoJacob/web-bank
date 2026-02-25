import AnimatedCounter from "./AnimatedCounter";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotlaBalanceBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">{/* DoughnutChart */}</div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Bank Accounts: {totalBanks}</h2>
        <div className="flex flex-col gapp-2">
          <div className="total-balance-label">
            <p>Total Current Balance:</p>
            <p className="total-balance-amount flex-center gape-2">
              <AnimatedCounter amount={totalCurrentBalance} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
