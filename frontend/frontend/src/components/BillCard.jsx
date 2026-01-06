import billService from "../services/billService";

const BillCard = ({ bill, refresh }) => {
  const mark = async () => {
    await billService.markPaid(bill.id);
    refresh();
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h4 className="font-bold text-lg">{bill.name}</h4>
      <p className="text-gray-600">Amount: ₹{bill.amount}</p>
      <p className="text-gray-600">Due: {bill.due_date}</p>
      <p className={`font-semibold ${bill.paid ? "text-green-600" : "text-red-600"}`}>
        {bill.paid ? "Paid" : "Unpaid"}
      </p>

      {!bill.paid && (
        <button
          onClick={mark}
          className="mt-3 px-3 py-1 bg-green-600 text-white rounded"
        >
          Mark Paid
        </button>
      )}
    </div>
  );
};

export default BillCard;
