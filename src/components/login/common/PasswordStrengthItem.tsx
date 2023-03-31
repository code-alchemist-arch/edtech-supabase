import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { IPasswordStrengthItemPropType } from "@/global";

const PasswordStrengthItem: React.FC<IPasswordStrengthItemPropType> = ({
  title,
  passed = false,
}): JSX.Element => (
  <li className="grid grid-cols-[1rem_minmax(0,_1fr)] gap-1.5">
    {passed ? (
      <FontAwesomeIcon
        icon={faCheck}
        className="text-green-500 w-3 h-3 self-center"
      />
    ) : (
      <div className="h-[0.875rem] flex items-center translate-y-[25%]">
        <div className="w-2 h-2 bg-gray-600  rounded-full" />
      </div>
    )}
    <span className="text-sm">{title}</span>
  </li>
);

export default PasswordStrengthItem;
