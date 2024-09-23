import {
  type ComponentPropsWithoutRef,
  useState,
  RefObject,
  forwardRef,
} from "react";
import { Input, InputProps } from "./input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const ShowInput = forwardRef<
  HTMLInputElement,
  InputProps & { show?: boolean }
>((props, ref) => {
  const [showed, setShowed] = useState(false);
  return (
    <div className="relative w-full">
      <Input {...props} ref={ref} type={showed ? "text" : props.type} />
      {props.show && (
        <button
          onClick={() => setShowed((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          type="button"
        >
          {showed ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}
    </div>
  );
});
