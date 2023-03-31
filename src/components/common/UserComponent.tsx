import Image from 'next/image';
import NoUserIcon from '@/assets/no_user.svg';
import NotificationOn from '@/assets/notification_on.svg';

type propTypes = {
  src?: string | undefined;
  email: string;
};

export const UserComponent = ({ src, email }: propTypes) => {
  return (
    <div className='flex items-center'>
      <Image
        src={NotificationOn}
        alt="notification on"
        width={24}
        height={24}
        className="cursor-pointer"
      />
      <span className='text-black-dark text-base font-medium leading-5 ml-9 cursor-pointer'>
        {email}
      </span>
      <Image
        src={src ? src : NoUserIcon}
        alt='user_avatar'
        width={72}
        height={72}
        className='ml-3 cursor-pointer'
      />
    </div>
  );
};
