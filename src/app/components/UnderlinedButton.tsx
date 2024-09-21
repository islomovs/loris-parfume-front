export const UnderlinedButton: React.FC<{
  title: string;
  onClick?: () => void;
}> = ({ title, onClick }) => {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="group relative uppercase text-[9px] font-medium tracking-[.2em] text-[#454545] no-underline hover:text-[#454545]"
      >
        {title}
        <span className="absolute left-0 -bottom-[2px] w-full h-[1px] bg-[#454545] transform scale-x-100 transition-transform duration-300 ease-out origin-left group-hover:scale-x-0"></span>
      </button>
    </div>
  );
};
