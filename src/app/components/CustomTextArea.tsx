import React, { forwardRef } from "react";
import { cn } from "../../helpers/mergeFunction";

interface ICustomTextAreaProps {
  title: string;
  value?: any;
  borders: "rounded" | "no-rounded";
  onChange?: any;
}

const CustomTextArea = forwardRef<HTMLTextAreaElement, ICustomTextAreaProps>(
  ({ title, borders, value, onChange, ...rest }, ref) => {
    return (
      <label className="form-group relative flex flex-col-reverse">
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            `peer transition-all duration-300 border-none focus:border-none block outline outline-[#e3e3e3] py-[13.5px] px-[11px] focus:outline-2 focus:outline-primary placeholder-transparent pb-0 peer:focus:pb-[4px] peer:not(:placeholder-shown):pb-[4px] min-h-[100px]`,
            {
              "rounded-[5px]": borders === "rounded",
              "rounded-0 w-[400px]": borders === "no-rounded",
            }
          )}
          id={title}
          placeholder=" "
          {...rest}
        ></textarea>
        <span className="absolute left-[11px] text-[#707070] text-xs top-1 transform transition-all duration-300 ease-in peer-placeholder-shown:top-[13.5px] peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-[0px] peer-focus:text-[#707070] peer:not(:placeholder-shown):top-1 peer:not(:placeholder-shown):text-xs peer:not(:placeholder-shown):-translate-y-[0px] peer:not(:placeholder-shown):text-primary">
          {title}
        </span>
      </label>
    );
  }
);

CustomTextArea.displayName = "CustomTextArea";

export default CustomTextArea;
