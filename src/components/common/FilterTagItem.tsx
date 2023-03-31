import { Dispatch, SetStateAction } from 'react';

type propTypes = {
  name: string;
  className: string;
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
};

export const FilterTagItem = ({
  name,
  className,
  active,
  setActive,
}: propTypes) => {
  let customClassName =
    active === name
      ? ' bg-green-light border-green-dark text-green-dark'
      : ' bg-grey-200 text-grey-500';

  return (
    <span
      className={className + customClassName}
      onClick={() => setActive(name)}
    >
      {name}
    </span>
  );
};
