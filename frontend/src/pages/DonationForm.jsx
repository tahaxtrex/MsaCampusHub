import { useState } from "react";


function DonationForm() {
  let available_amounts = [10, 20, 50, 100];
  let [amount, setAmount] = useState("");
  return (
    <form className="rounded-xl">
      <div>
        {/*for the amount selection */}
        <label>Select the amount</label>
        <div>
          {available_amounts.map((val) => {(
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              className="px-4 py-2 rounded-lg border"
            >
              €{val}
            </button>);
          })}
        </div>

        <input type="number"
        placeholder="Custom amount"
        value={amount}
        onChange={(m) => setAmount(m.target.value)} />

      </div>

      <div>
        <label>In the name of</label>
        <input type="text" placeholder="Ali Mohammed" required/>
      </div>

      <div>
        <label > The email</label>
        <input type="text" placeholder="ali@example.com" required/>
      </div>

      {/*Submit*/}

      <button type="submit" className="bg-green-700 text-white font-bold py-3 rounded-l">
          Donate Now!
      </button>
    </form>
  );
}
