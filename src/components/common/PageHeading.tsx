type propTypes = {
  title: string;
  desc: string;
};
export const PageHeading = ({ title, desc }: propTypes) => {
  return (
    <>
      <h2 className='text-2.5xl font-semibold leading-8 text-black-dark'>
        {title}
      </h2>
      {/* <span className="text-base font-normal leading-5 text-black-dark mt-3.5">{desc}</span> */}
    </>
  );
};
