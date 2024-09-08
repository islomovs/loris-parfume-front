import { BiMinus, BiPlus } from "react-icons/bi";

export function QuantitySelector({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (value: number) => void;
}) {
  return (
    <div className="flex flex-row mb-6 border-solid border border-[#e3e3e3] w-[140px] h-[45px]">
      <button
        className="my-auto flex-1 py-[10px] px-[20px] text-black hover:text-[#9D9D9D]"
        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
      >
        <BiMinus />
      </button>
      <input
        className="text-black w-9 text-center focus:outline-none text-xs"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        type="number"
        min="1"
      />
      <button
        className="my-auto flex-1 py-[10px] px-[20px] text-black hover:text-[#9D9D9D]"
        onClick={() => setQuantity(quantity + 1)}
      >
        <BiPlus />
      </button>
    </div>
  );
}
