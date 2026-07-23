import { AvatarGroup } from '@/components/avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const avatars = [
  {
    fallback: 'CN',
    name: 'shadcn',
    src: 'https://i.pravatar.cc/150?img=12',
  },
  {
    fallback: 'EN',
    name: 'Ethan Niser',
    src: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    fallback: 'GR',
    name: 'Guillermo Rauch',
    src: 'https://i.pravatar.cc/150?img=45',
  },
  {
    fallback: 'LR',
    name: 'Lee Robinson',
    src: 'https://randomuser.me/api/portraits/men/76.jpg',
  },
  {
    fallback: 'ER',
    name: 'Evil Rabbit',
    src: 'https://i.pravatar.cc/150?img=58',
  },
];

export default function AvatarGroupRtlDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">RTL</h3>
        <AvatarGroup dir="rtl">
          {avatars.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Reverse RTL</h3>
        <AvatarGroup dir="rtl" reverse>
          {avatars.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Vertical RTL</h3>
        <div className="flex justify-center">
          <AvatarGroup dir="rtl" orientation="vertical">
            {avatars.map((avatar, index) => (
              <Avatar key={index}>
                <AvatarImage src={avatar.src} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Vertical reverse RTL</h3>
        <div className="flex justify-center">
          <AvatarGroup dir="rtl" orientation="vertical" reverse>
            {avatars.map((avatar, index) => (
              <Avatar key={index}>
                <AvatarImage src={avatar.src} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </div>
    </div>
  );
}
