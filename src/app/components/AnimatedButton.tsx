import { cn } from "../../helpers/mergeFunction";

export const AnimatedButton: React.FC<{
  title: string;
  width: string;
  variant: "dark" | "lite";
  type?: "submit";
  onClick?: () => void;
}> = ({ title, width, variant, type, onClick }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={cn(
        `relative bg-transparent w-full h-[50px] border-[1px] border-solid text-xs text-center content-center uppercase tracking-[2px] z-[1] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:-z-[1] before:origin-left before:transition-transform before:duration-500 before:ease-out before:scale-x-100 hover:before:origin-right hover:before:scale-x-0 hover:before:transition-transform hover:before:duration-500 hover:before:ease-out ${width}`,
        {
          "border-[#000000] hover:text-[#000000] before:bg-[#000000] text-white":
            variant == "dark",
          "border-white hover:text-white before:bg-white text-[#000000]":
            variant == "lite",
        }
      )}
    >
      {title}
    </button>
  );
};
