import { AvatarGroup } from 'kombase';
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
  {
    fallback: 'TN',
    name: 'Tim Neutkens',
    src: 'https://randomuser.me/api/portraits/men/14.jpg',
  },
  {
    fallback: 'DO',
    name: 'Delba de Oliveira',
    src: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    fallback: 'SD',
    name: 'Shu Ding',
    src: 'https://i.pravatar.cc/150?img=23',
  },
];

export default function AvatarGroupCustomOverflowDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Default Overflow</h3>
        <AvatarGroup max={4}>
          {avatars.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Custom Overflow with Badge</h3>
        <AvatarGroup
          max={4}
          renderOverflow={(count) => (
            <div className="flex size-full items-center justify-center rounded-full border-2 border-primary border-dashed bg-primary/10 font-semibold text-primary text-xs">
              {count}+
            </div>
          )}
        >
          {avatars.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Custom Overflow with Gradient</h3>
        <AvatarGroup
          max={3}
          renderOverflow={(count) => (
            <div className="flex size-full items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 font-bold text-white text-xs">
              +{count}
            </div>
          )}
        >
          {avatars.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
}
