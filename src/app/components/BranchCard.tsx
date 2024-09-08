export const BranchCard: React.FC<{
  title: string;
  address: string;
  phone: string;
  location: string;
}> = ({ title, address, phone, location }) => {
  return (
    <div className="flex flex-col items-center py-12">
      <h1 className="text-[21px] font-normal text-[#454545] mb-[15px]">
        {title}
      </h1>
      <h2 className="text-[14px] font-normal text-[#9D9D9D] mb-[15px]">
        {address}
      </h2>
      <p className="text-[14px] font-normal text-[#454545]">
        Tel:{" "}
        <a href={`Tel:${phone}`} className="underline hover:text-[#454545]">
          {phone}
        </a>
      </p>
      <a
        href="#"
        className="underline text-wrap text-[#454545] hover:text-[#454545]"
      >
        {location}
      </a>
    </div>
  );
};
